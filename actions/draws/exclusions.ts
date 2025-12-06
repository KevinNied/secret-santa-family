'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Agrega una exclusión al sorteo
 * @param drawId - ID del sorteo
 * @param participant1Id - ID del primer participante
 * @param participant2Id - ID del segundo participante
 * @param reason - Razón de la exclusión (opcional)
 * @returns Resultado de la operación
 */
export async function addExclusion(
  drawId: string,
  participant1Id: string,
  participant2Id: string,
  reason?: string
) {
  try {
    if (isDev) {
      console.log('🚫 [ADD EXCLUSION] Agregando exclusión...')
      console.log('   - Draw ID:', drawId)
      console.log('   - Participante 1:', participant1Id)
      console.log('   - Participante 2:', participant2Id)
      console.log('   - Razón:', reason || 'Sin razón especificada')
    }

    // Verificar que los participantes pertenezcan al sorteo
    const participants = await prisma.participant.findMany({
      where: {
        drawId,
        id: { in: [participant1Id, participant2Id] },
      },
    })

    if (participants.length !== 2) {
      if (isDev) {
        console.error('❌ [ADD EXCLUSION] Participantes no válidos o no pertenecen al sorteo')
      }
      return {
        success: false,
        error: 'Los participantes no son válidos o no pertenecen a este sorteo',
      }
    }

    // Verificar que no exista ya esta exclusión
    const existing = await prisma.exclusion.findFirst({
      where: {
        drawId,
        OR: [
          {
            participant1Id,
            participant2Id,
          },
          {
            participant1Id: participant2Id,
            participant2Id: participant1Id,
          },
        ],
      },
    })

    if (existing) {
      if (isDev) {
        console.warn('⚠️  [ADD EXCLUSION] La exclusión ya existe')
      }
      return {
        success: false,
        error: 'Esta exclusión ya existe',
      }
    }

    // Crear la exclusión
    const exclusion = await prisma.exclusion.create({
      data: {
        drawId,
        participant1Id,
        participant2Id,
        reason: reason || null,
      },
      include: {
        participant1: {
          select: { id: true, name: true },
        },
        participant2: {
          select: { id: true, name: true },
        },
      },
    })

    if (isDev) {
      console.log('✅ [ADD EXCLUSION] Exclusión agregada exitosamente')
      console.log(`   - ${exclusion.participant1.name} no puede tener a ${exclusion.participant2.name}`)
    }

    revalidatePath(`/create/${drawId}`)
    
    return {
      success: true,
      data: exclusion,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [ADD EXCLUSION] Error:', error)
    }
    return {
      success: false,
      error: 'Error al agregar la exclusión',
    }
  }
}

/**
 * Elimina una exclusión
 * @param exclusionId - ID de la exclusión
 * @param drawId - ID del sorteo (para validación)
 * @returns Resultado de la operación
 */
export async function removeExclusion(exclusionId: string, drawId: string) {
  try {
    if (isDev) {
      console.log('🗑️  [REMOVE EXCLUSION] Eliminando exclusión...')
      console.log('   - Exclusion ID:', exclusionId)
      console.log('   - Draw ID:', drawId)
    }

    // Verificar que la exclusión pertenezca al sorteo
    const exclusion = await prisma.exclusion.findFirst({
      where: {
        id: exclusionId,
        drawId,
      },
    })

    if (!exclusion) {
      if (isDev) {
        console.error('❌ [REMOVE EXCLUSION] Exclusión no encontrada')
      }
      return {
        success: false,
        error: 'Exclusión no encontrada',
      }
    }

    await prisma.exclusion.delete({
      where: { id: exclusionId },
    })

    if (isDev) {
      console.log('✅ [REMOVE EXCLUSION] Exclusión eliminada')
    }

    revalidatePath(`/create/${drawId}`)
    
    return {
      success: true,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [REMOVE EXCLUSION] Error:', error)
    }
    return {
      success: false,
      error: 'Error al eliminar la exclusión',
    }
  }
}

/**
 * Obtiene todas las exclusiones de un sorteo
 * @param drawId - ID del sorteo
 * @returns Lista de exclusiones
 */
export async function getExclusions(drawId: string) {
  try {
    if (isDev) {
      console.log('📋 [GET EXCLUSIONS] Obteniendo exclusiones...')
      console.log('   - Draw ID:', drawId)
    }

    const exclusions = await prisma.exclusion.findMany({
      where: { drawId },
      include: {
        participant1: {
          select: { id: true, name: true, email: true },
        },
        participant2: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (isDev) {
      console.log('✅ [GET EXCLUSIONS] Exclusiones obtenidas:', exclusions.length)
      exclusions.forEach((e: { participant1: { name: string }; participant2: { name: string } }, i: number) => {
        console.log(`   ${i + 1}. ${e.participant1.name} ↔ ${e.participant2.name}`)
      })
    }

    return {
      success: true,
      data: exclusions,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [GET EXCLUSIONS] Error:', error)
    }
    return {
      success: false,
      error: 'Error al obtener las exclusiones',
    }
  }
}

/**
 * Valida si las exclusiones hacen imposible el sorteo
 * @param drawId - ID del sorteo
 * @returns Resultado de la validación
 */
export async function validateExclusions(drawId: string) {
  try {
    if (isDev) {
      console.log('🔍 [VALIDATE EXCLUSIONS] Validando exclusiones...')
      console.log('   - Draw ID:', drawId)
    }

    const draw = await prisma.draw.findUnique({
      where: { id: drawId },
      include: {
        participants: true,
        exclusions: true,
      },
    })

    if (!draw) {
      return {
        success: false,
        error: 'Sorteo no encontrado',
      }
    }

    // Validación básica: si un participante tiene exclusiones con todos los demás,
    // es imposible (excepto si mismo)
    const participantExclusionCounts = new Map<string, number>()

    for (const exclusion of draw.exclusions) {
      participantExclusionCounts.set(
        exclusion.participant1Id,
        (participantExclusionCounts.get(exclusion.participant1Id) || 0) + 1
      )
      participantExclusionCounts.set(
        exclusion.participant2Id,
        (participantExclusionCounts.get(exclusion.participant2Id) || 0) + 1
      )
    }

    const totalParticipants = draw.participants.length
    const maxPossibleExclusions = totalParticipants - 1 // No puede tener a sí mismo

    for (const [participantId, count] of participantExclusionCounts.entries()) {
      if (count >= maxPossibleExclusions) {
        const participant = draw.participants.find((p: { id: string; name: string }) => p.id === participantId)
        if (isDev) {
          console.error('❌ [VALIDATE EXCLUSIONS] Imposible:', participant?.name, 'tiene exclusiones con todos')
        }
        return {
          success: false,
          error: `${participant?.name || 'Un participante'} tiene exclusiones con todos los demás participantes. El sorteo es imposible.`,
        }
      }
    }

    if (isDev) {
      console.log('✅ [VALIDATE EXCLUSIONS] Exclusiones válidas')
    }

    return {
      success: true,
      valid: true,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [VALIDATE EXCLUSIONS] Error:', error)
    }
    return {
      success: false,
      error: 'Error al validar las exclusiones',
    }
  }
}

