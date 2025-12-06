'use server'

import { prisma } from '@/lib/db'
import { sendSingleEmail, sendAssignmentEmails } from '@/actions/email/send'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Reenvía el email de asignación a todos los participantes
 * @param adminToken - Token de administración
 * @returns Resultado de la operación
 */
export async function resendAllEmails(adminToken: string) {
  try {
    if (isDev) {
      console.log('📧 [RESEND ALL EMAILS] Reenviando emails a todos...')
      console.log('   - Admin Token:', adminToken.substring(0, 8) + '...')
    }

    // Verificar que el sorteo existe y está completo
    const draw = await prisma.draw.findUnique({
      where: { adminToken },
      select: {
        id: true,
        name: true,
        isComplete: true,
      },
    })

    if (!draw) {
      if (isDev) {
        console.error('❌ [RESEND ALL EMAILS] Sorteo no encontrado')
      }
      return {
        success: false,
        error: 'Sorteo no encontrado',
      }
    }

    if (!draw.isComplete) {
      if (isDev) {
        console.error('❌ [RESEND ALL EMAILS] El sorteo no ha sido ejecutado aún')
      }
      return {
        success: false,
        error: 'El sorteo no ha sido ejecutado aún',
      }
    }

    // Reenviar todos los emails
    const result = await sendAssignmentEmails(draw.id)

    if (isDev) {
      console.log('✅ [RESEND ALL EMAILS] Proceso completado')
    }

    return result
  } catch (error) {
    if (isDev) {
      console.error('❌ [RESEND ALL EMAILS] Error:', error)
    }
    return {
      success: false,
      error: 'Error al reenviar los emails',
    }
  }
}

/**
 * Reenvía el email de asignación a un participante específico
 * @param adminToken - Token de administración
 * @param participantId - ID del participante
 * @returns Resultado de la operación
 */
export async function resendSingleEmail(adminToken: string, participantId: string) {
  try {
    if (isDev) {
      console.log('📧 [RESEND SINGLE EMAIL] Reenviando email individual...')
      console.log('   - Admin Token:', adminToken.substring(0, 8) + '...')
      console.log('   - Participant ID:', participantId)
    }

    // Verificar que el sorteo existe y el participante pertenece a él
    const draw = await prisma.draw.findUnique({
      where: { adminToken },
      select: {
        id: true,
        isComplete: true,
      },
    })

    if (!draw) {
      if (isDev) {
        console.error('❌ [RESEND SINGLE EMAIL] Sorteo no encontrado')
      }
      return {
        success: false,
        error: 'Sorteo no encontrado',
      }
    }

    if (!draw.isComplete) {
      if (isDev) {
        console.error('❌ [RESEND SINGLE EMAIL] El sorteo no ha sido ejecutado aún')
      }
      return {
        success: false,
        error: 'El sorteo no ha sido ejecutado aún',
      }
    }

    // Verificar que el participante pertenece a este sorteo
    const participant = await prisma.participant.findFirst({
      where: {
        id: participantId,
        drawId: draw.id,
      },
    })

    if (!participant) {
      if (isDev) {
        console.error('❌ [RESEND SINGLE EMAIL] Participante no encontrado o no pertenece a este sorteo')
      }
      return {
        success: false,
        error: 'Participante no encontrado',
      }
    }

    // Reenviar el email
    const result = await sendSingleEmail(participantId)

    if (isDev) {
      console.log('✅ [RESEND SINGLE EMAIL] Email reenviado')
    }

    return result
  } catch (error) {
    if (isDev) {
      console.error('❌ [RESEND SINGLE EMAIL] Error:', error)
    }
    return {
      success: false,
      error: 'Error al reenviar el email',
    }
  }
}

