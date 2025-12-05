'use server'

import { prisma } from '@/lib/db'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Obtiene los datos de un participante por su token
 * @param participantToken - Token único del participante
 * @returns Datos del participante y su sorteo
 */
export async function getParticipantData(participantToken: string) {
  try {
    if (isDev) {
      console.log('👤 [GET PARTICIPANT DATA] Obteniendo datos del participante...')
      console.log('   - Token:', participantToken.substring(0, 8) + '...')
    }

    const participant = await prisma.participant.findUnique({
      where: { token: participantToken },
      include: {
        draw: {
          select: {
            id: true,
            name: true,
            budget: true,
            exchangeDate: true,
            customMessage: true,
            isComplete: true,
          },
        },
      },
    })

    if (!participant) {
      if (isDev) {
        console.error('❌ [GET PARTICIPANT DATA] Participante no encontrado')
      }
      return {
        success: false,
        error: 'Participante no encontrado',
      }
    }

    if (isDev) {
      console.log('✅ [GET PARTICIPANT DATA] Participante encontrado')
      console.log('   - Nombre:', participant.name)
      console.log('   - Email:', participant.email)
      console.log('   - Sorteo:', participant.draw.name)
      console.log('   - Sorteo completo:', participant.draw.isComplete)
      
      // Log con el link del participante
      const participantLink = typeof window !== 'undefined' 
        ? `${window.location.origin}/participant/${participant.token}`
        : `[URL]/participant/${participant.token}`
      console.log('   - 🔗 Link del participante:', participantLink)
    }

    return {
      success: true,
      data: participant,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [GET PARTICIPANT DATA] Error:', error)
    }
    return {
      success: false,
      error: 'Error al obtener los datos del participante',
    }
  }
}

/**
 * Obtiene la asignación de un participante (a quién le tocó)
 * @param participantToken - Token único del participante
 * @returns Asignación (receiver) del participante
 */
export async function getAssignment(participantToken: string) {
  try {
    if (isDev) {
      console.log('🎯 [GET ASSIGNMENT] Obteniendo asignación...')
      console.log('   - Token:', participantToken.substring(0, 8) + '...')
    }

    // Obtener el participante
    const participant = await prisma.participant.findUnique({
      where: { token: participantToken },
      include: {
        draw: {
          select: {
            isComplete: true,
          },
        },
      },
    })

    if (!participant) {
      if (isDev) {
        console.error('❌ [GET ASSIGNMENT] Participante no encontrado')
      }
      return {
        success: false,
        error: 'Participante no encontrado',
      }
    }

    // Verificar que el sorteo esté completo
    if (!participant.draw.isComplete) {
      if (isDev) {
        console.error('❌ [GET ASSIGNMENT] El sorteo aún no ha sido ejecutado')
      }
      return {
        success: false,
        error: 'El sorteo aún no ha sido ejecutado',
      }
    }

    // Obtener la asignación (quién le tocó a este participante)
    const assignment = await prisma.assignment.findFirst({
      where: {
        giverId: participant.id,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            wishlist: true,
          },
        },
      },
    })

    if (!assignment) {
      if (isDev) {
        console.error('❌ [GET ASSIGNMENT] Asignación no encontrada')
      }
      return {
        success: false,
        error: 'Asignación no encontrada',
      }
    }

    if (isDev) {
      console.log('✅ [GET ASSIGNMENT] Asignación encontrada')
      console.log('   - Participante:', participant.name)
      console.log('   - Le tocó:', assignment.receiver.name)
      
      // Log con el link del participante
      const participantLink = typeof window !== 'undefined' 
        ? `${window.location.origin}/participant/${participant.token}`
        : `[URL]/participant/${participant.token}`
      console.log('   - 🔗 Link del participante:', participantLink)
    }

    return {
      success: true,
      data: {
        receiver: assignment.receiver,
        draw: {
          name: participant.draw.name,
          budget: participant.draw.budget,
          customMessage: participant.draw.customMessage,
        },
      },
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [GET ASSIGNMENT] Error:', error)
    }
    return {
      success: false,
      error: 'Error al obtener la asignación',
    }
  }
}

/**
 * Marca la asignación como vista por el participante
 * @param participantToken - Token único del participante
 * @returns Resultado de la operación
 */
export async function markAssignmentViewed(participantToken: string) {
  try {
    if (isDev) {
      console.log('👁️  [MARK ASSIGNMENT VIEWED] Marcando como vista...')
      console.log('   - Token:', participantToken.substring(0, 8) + '...')
    }

    const participant = await prisma.participant.findUnique({
      where: { token: participantToken },
    })

    if (!participant) {
      if (isDev) {
        console.error('❌ [MARK ASSIGNMENT VIEWED] Participante no encontrado')
      }
      return {
        success: false,
        error: 'Participante no encontrado',
      }
    }

    // Solo marcar si no estaba ya vista
    if (!participant.viewedAssignment) {
      await prisma.participant.update({
        where: { token: participantToken },
        data: {
          viewedAssignment: true,
          viewedAt: new Date(),
        },
      })

      if (isDev) {
        console.log('✅ [MARK ASSIGNMENT VIEWED] Marcado como vista')
      }
    } else {
      if (isDev) {
        console.log('ℹ️  [MARK ASSIGNMENT VIEWED] Ya estaba marcado como vista')
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [MARK ASSIGNMENT VIEWED] Error:', error)
    }
    return {
      success: false,
      error: 'Error al marcar como vista',
    }
  }
}

