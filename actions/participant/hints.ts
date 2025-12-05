'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getEmailTransporter, isEmailConfigured } from '@/lib/email/client'
import { getHintNotificationEmailHTML } from '@/lib/email/templates/hint-notification-html'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Envía una pista anónima de un participante a su asignado
 * @param senderToken - Token del participante que envía la pista
 * @param message - Mensaje de la pista
 * @returns Resultado de la operación
 */
export async function sendHint(senderToken: string, message: string) {
  try {
    if (isDev) {
      console.log('💬 [SEND HINT] Enviando pista...')
      console.log('   - Sender Token:', senderToken.substring(0, 8) + '...')
      console.log('   - Mensaje length:', message.length)
    }

    // Obtener el participante y su asignación
    const sender = await prisma.participant.findUnique({
      where: { token: senderToken },
      include: {
        draw: {
          select: {
            id: true,
            name: true,
          },
        },
        assignmentsGiven: {
          include: {
            receiver: {
              select: {
                id: true,
                name: true,
                email: true,
                token: true,
              },
            },
          },
          take: 1,
        },
      },
    })

    if (!sender) {
      if (isDev) {
        console.error('❌ [SEND HINT] Participante no encontrado')
      }
      return {
        success: false,
        error: 'Participante no encontrado',
      }
    }

    if (sender.assignmentsGiven.length === 0) {
      if (isDev) {
        console.error('❌ [SEND HINT] El participante no tiene asignación')
      }
      return {
        success: false,
        error: 'El participante no tiene asignación',
      }
    }

    const receiver = sender.assignmentsGiven[0].receiver

    // Crear la pista
    const hint = await prisma.hint.create({
      data: {
        drawId: sender.draw.id,
        senderToken,
        receiverToken: receiver.token,
        message: message.trim(),
      },
    })

    if (isDev) {
      console.log('✅ [SEND HINT] Pista creada')
      console.log('   - De:', sender.name, '(anónimo)')
      console.log('   - Para:', receiver.name)
    }

    // Enviar email de notificación
    if (isEmailConfigured()) {
      const transporter = getEmailTransporter()
      if (transporter) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const participantLink = `${appUrl}/participant/${receiver.token}`
        const fromEmail = process.env.GMAIL_USER || 'noreply@gmail.com'
        const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Secret Santa Family'

        const htmlContent = getHintNotificationEmailHTML({
          receiverName: receiver.name,
          drawName: sender.draw.name,
          participantLink,
        })

        try {
          const info = await transporter.sendMail({
            from: `"${appName}" <${fromEmail}>`,
            to: receiver.email,
            subject: `💬 ${appName} - ¡Tienes una nueva pista!`,
            html: htmlContent,
          })

          await prisma.hint.update({
            where: { id: hint.id },
            data: {
              emailSent: true,
              emailSentAt: new Date(),
            },
          })

          if (isDev) {
            console.log('✅ [SEND HINT] Email de notificación enviado')
            console.log('   - Message ID:', info.messageId)
          }
        } catch (emailErr) {
          if (isDev) {
            console.warn('⚠️  [SEND HINT] Error al enviar email:', emailErr)
          }
        }
      }
    } else if (isDev) {
      console.warn('⚠️  [SEND HINT] Email no configurado. Pista guardada pero no se envió notificación.')
    }

    revalidatePath(`/participant/${senderToken}`)
    
    return {
      success: true,
      data: hint,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [SEND HINT] Error:', error)
    }
    return {
      success: false,
      error: 'Error al enviar la pista',
    }
  }
}

/**
 * Obtiene todas las pistas recibidas por un participante
 * @param participantToken - Token único del participante
 * @returns Lista de pistas recibidas
 */
export async function getReceivedHints(participantToken: string) {
  try {
    if (isDev) {
      console.log('📬 [GET RECEIVED HINTS] Obteniendo pistas recibidas...')
      console.log('   - Token:', participantToken.substring(0, 8) + '...')
    }

    const hints = await prisma.hint.findMany({
      where: { receiverToken: participantToken },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        message: true,
        createdAt: true,
        viewedByReceiver: true,
        viewedAt: true,
      },
    })

    if (isDev) {
      console.log('✅ [GET RECEIVED HINTS] Pistas obtenidas:', hints.length)
    }

    return {
      success: true,
      data: hints,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [GET RECEIVED HINTS] Error:', error)
    }
    return {
      success: false,
      error: 'Error al obtener las pistas',
    }
  }
}

/**
 * Marca una pista como vista por el receptor
 * @param hintId - ID de la pista
 * @param participantToken - Token del participante (para validación)
 * @returns Resultado de la operación
 */
export async function markHintAsViewed(hintId: string, participantToken: string) {
  try {
    if (isDev) {
      console.log('👁️  [MARK HINT AS VIEWED] Marcando pista como vista...')
      console.log('   - Hint ID:', hintId)
    }

    const hint = await prisma.hint.findFirst({
      where: {
        id: hintId,
        receiverToken: participantToken,
      },
    })

    if (!hint) {
      if (isDev) {
        console.error('❌ [MARK HINT AS VIEWED] Pista no encontrada o no pertenece al participante')
      }
      return {
        success: false,
        error: 'Pista no encontrada',
      }
    }

    if (!hint.viewedByReceiver) {
      await prisma.hint.update({
        where: { id: hintId },
        data: {
          viewedByReceiver: true,
          viewedAt: new Date(),
        },
      })

      if (isDev) {
        console.log('✅ [MARK HINT AS VIEWED] Pista marcada como vista')
      }
    }

    revalidatePath(`/participant/${participantToken}`)
    
    return {
      success: true,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [MARK HINT AS VIEWED] Error:', error)
    }
    return {
      success: false,
      error: 'Error al marcar como vista',
    }
  }
}
