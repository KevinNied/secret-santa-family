'use server'

import { prisma } from '@/lib/db'
import { getEmailTransporter, isEmailConfigured } from '@/lib/email/client'
import { getParticipantAssignmentEmailHTML } from '@/lib/email/templates/participant-assignment-html'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Envía el email de asignación a un participante
 * @param participantId - ID del participante
 * @returns Resultado de la operación
 */
export async function sendSingleEmail(participantId: string) {
  try {
    if (isDev) {
      console.log('📧 [SEND SINGLE EMAIL] Enviando email a participante...')
      console.log('   - Participant ID:', participantId)
    }

    if (!isEmailConfigured()) {
      if (isDev) {
        console.warn('⚠️  [SEND SINGLE EMAIL] Email no configurado. Simulando envío...')
      }
      // En desarrollo, si no está configurado, simular éxito
      return {
        success: true,
        simulated: true,
      }
    }

    // Obtener datos del participante y su asignación
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: {
        draw: {
          select: {
            name: true,
            customMessage: true,
            budget: true,
          },
        },
        assignmentsGiven: {
          include: {
            receiver: {
              select: {
                name: true,
              },
            },
          },
          take: 1,
        },
      },
    })

    if (!participant) {
      if (isDev) {
        console.error('❌ [SEND SINGLE EMAIL] Participante no encontrado')
      }
      return {
        success: false,
        error: 'Participante no encontrado',
      }
    }

    if (participant.assignmentsGiven.length === 0) {
      if (isDev) {
        console.error('❌ [SEND SINGLE EMAIL] El participante no tiene asignación')
      }
      return {
        success: false,
        error: 'El participante no tiene asignación',
      }
    }

    const assignment = participant.assignmentsGiven[0]
    const receiverName = assignment.receiver.name
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const participantLink = `${appUrl}/participant/${participant.token}`

    // Enviar email
    const transporter = getEmailTransporter()
    if (!transporter) {
      return {
        success: false,
        error: 'Servicio de email no disponible',
      }
    }

    const fromEmail = process.env.GMAIL_USER || 'noreply@gmail.com'
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Secret Santa Family'

    const htmlContent = getParticipantAssignmentEmailHTML({
      participantName: participant.name,
      receiverName,
      drawName: participant.draw.name,
      participantLink,
      customMessage: participant.draw.customMessage || undefined,
      budget: participant.draw.budget || undefined,
    })

    const info = await transporter.sendMail({
      from: `"${appName}" <${fromEmail}>`,
      to: participant.email,
      subject: `🎁 ${appName} - Tu amigo invisible es ${receiverName}`,
      html: htmlContent,
    })

    if (isDev) {
      console.log('✅ [SEND SINGLE EMAIL] Email enviado exitosamente')
      console.log('   - A:', participant.email)
      console.log('   - Asignación:', receiverName)
      console.log('   - Link:', participantLink)
      console.log('   - Message ID:', info.messageId)
    }

    // Actualizar estado del participante
    await prisma.participant.update({
      where: { id: participantId },
      data: {
        emailSent: true,
        emailSentAt: new Date(),
      },
    })

    return {
      success: true,
      data: { messageId: info.messageId },
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [SEND SINGLE EMAIL] Error:', error)
    }
    return {
      success: false,
      error: 'Error al enviar el email',
    }
  }
}

/**
 * Envía emails de asignación a todos los participantes de un sorteo
 * @param drawId - ID del sorteo
 * @returns Resultado de la operación
 */
export async function sendAssignmentEmails(drawId: string) {
  try {
    if (isDev) {
      console.log('📧 [SEND ASSIGNMENT EMAILS] Enviando emails a todos los participantes...')
      console.log('   - Draw ID:', drawId)
    }

    // Obtener todos los participantes con asignaciones
    const participants = await prisma.participant.findMany({
      where: {
        drawId,
        assignmentsGiven: {
          some: {},
        },
      },
      include: {
        assignmentsGiven: {
          include: {
            receiver: {
              select: {
                name: true,
              },
            },
          },
          take: 1,
        },
      },
    })

    if (participants.length === 0) {
      if (isDev) {
        console.warn('⚠️  [SEND ASSIGNMENT EMAILS] No hay participantes con asignaciones')
      }
      return {
        success: false,
        error: 'No hay participantes con asignaciones',
      }
    }

    if (isDev) {
      console.log('   - Participantes a notificar:', participants.length)
    }

    // Enviar emails a todos
    const results = await Promise.allSettled(
      participants.map((p: { id: string }) => sendSingleEmail(p.id))
    )

    const successful = results.filter((r: PromiseSettledResult<any>) => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful

    // Actualizar estado del sorteo
    await prisma.draw.update({
      where: { id: drawId },
      data: {
        emailsSent: true,
      },
    })

    if (isDev) {
      console.log('✅ [SEND ASSIGNMENT EMAILS] Proceso completado')
      console.log('   - Exitosos:', successful)
      console.log('   - Fallidos:', failed)
    }

    return {
      success: true,
      sent: successful,
      failed,
      total: participants.length,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [SEND ASSIGNMENT EMAILS] Error:', error)
    }
    return {
      success: false,
      error: 'Error al enviar los emails',
    }
  }
}
