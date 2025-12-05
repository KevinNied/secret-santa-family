'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Actualiza la wishlist de un participante
 * @param participantToken - Token único del participante
 * @param wishlistText - Texto de la wishlist
 * @returns Resultado de la operación
 */
export async function updateWishlist(participantToken: string, wishlistText: string) {
  try {
    if (isDev) {
      console.log('📝 [UPDATE WISHLIST] Actualizando wishlist...')
      console.log('   - Token:', participantToken.substring(0, 8) + '...')
      console.log('   - Wishlist length:', wishlistText.length)
    }

    const participant = await prisma.participant.findUnique({
      where: { token: participantToken },
    })

    if (!participant) {
      if (isDev) {
        console.error('❌ [UPDATE WISHLIST] Participante no encontrado')
      }
      return {
        success: false,
        error: 'Participante no encontrado',
      }
    }

    await prisma.participant.update({
      where: { token: participantToken },
      data: {
        wishlist: wishlistText.trim() || null,
      },
    })

    if (isDev) {
      console.log('✅ [UPDATE WISHLIST] Wishlist actualizada')
      console.log('   - Participante:', participant.name)
    }

    revalidatePath(`/participant/${participantToken}`)
    
    return {
      success: true,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [UPDATE WISHLIST] Error:', error)
    }
    return {
      success: false,
      error: 'Error al actualizar la wishlist',
    }
  }
}

/**
 * Obtiene la wishlist del participante asignado (a quien le tocó)
 * @param participantToken - Token único del participante
 * @returns Wishlist del participante asignado
 */
export async function getTargetWishlist(participantToken: string) {
  try {
    if (isDev) {
      console.log('📋 [GET TARGET WISHLIST] Obteniendo wishlist del asignado...')
      console.log('   - Token:', participantToken.substring(0, 8) + '...')
    }

    // Obtener el participante y su asignación
    const participant = await prisma.participant.findUnique({
      where: { token: participantToken },
      include: {
        assignmentsGiven: {
          include: {
            receiver: {
              select: {
                name: true,
                wishlist: true,
              },
            },
          },
          take: 1,
        },
      },
    })

    if (!participant) {
      if (isDev) {
        console.error('❌ [GET TARGET WISHLIST] Participante no encontrado')
      }
      return {
        success: false,
        error: 'Participante no encontrado',
      }
    }

    if (participant.assignmentsGiven.length === 0) {
      if (isDev) {
        console.error('❌ [GET TARGET WISHLIST] El participante no tiene asignación')
      }
      return {
        success: false,
        error: 'El participante no tiene asignación',
      }
    }

    const receiver = participant.assignmentsGiven[0].receiver

    if (isDev) {
      console.log('✅ [GET TARGET WISHLIST] Wishlist obtenida')
      console.log('   - De:', receiver.name)
      console.log('   - Tiene wishlist:', !!receiver.wishlist)
    }

    return {
      success: true,
      data: {
        receiverName: receiver.name,
        wishlist: receiver.wishlist,
      },
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [GET TARGET WISHLIST] Error:', error)
    }
    return {
      success: false,
      error: 'Error al obtener la wishlist',
    }
  }
}





