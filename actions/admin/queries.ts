'use server'

import { prisma } from '@/lib/db'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Obtiene un sorteo por su adminToken
 * @param adminToken - Token de administración
 * @returns Draw con participantes y estado
 */
export async function getDrawByAdminToken(adminToken: string) {
  try {
    if (isDev) {
      console.log('🔍 [GET DRAW BY ADMIN TOKEN] Buscando sorteo...')
      console.log('   - Admin Token:', adminToken.substring(0, 8) + '...')
    }

    const draw = await prisma.draw.findUnique({
      where: { adminToken },
      include: {
        participants: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            name: true,
            email: true,
            emailSent: true,
            emailSentAt: true,
            viewedAssignment: true,
            viewedAt: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            participants: true,
            assignments: true,
          },
        },
      },
    })

    if (!draw) {
      if (isDev) {
        console.error('❌ [GET DRAW BY ADMIN TOKEN] Sorteo no encontrado')
      }
      return {
        success: false,
        error: 'Sorteo no encontrado',
      }
    }

    if (isDev) {
      console.log('✅ [GET DRAW BY ADMIN TOKEN] Sorteo encontrado')
      console.log('   - Nombre:', draw.name)
      console.log('   - Participantes:', draw._count.participants)
      console.log('   - Asignaciones:', draw._count.assignments)
      console.log('   - Completo:', draw.isComplete)
    }

    return {
      success: true,
      data: draw,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [GET DRAW BY ADMIN TOKEN] Error:', error)
    }
    return {
      success: false,
      error: 'Error al obtener el sorteo',
    }
  }
}

/**
 * Obtiene el estado de los participantes de un sorteo
 * @param drawId - ID del sorteo
 * @returns Lista de participantes con estado de emails
 */
export async function getParticipantsStatus(drawId: string) {
  try {
    if (isDev) {
      console.log('📊 [GET PARTICIPANTS STATUS] Obteniendo estado...')
      console.log('   - Draw ID:', drawId)
    }

    const participants = await prisma.participant.findMany({
      where: { drawId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        emailSent: true,
        emailSentAt: true,
        viewedAssignment: true,
        viewedAt: true,
      },
    })

    if (isDev) {
      console.log('✅ [GET PARTICIPANTS STATUS] Estado obtenido')
      participants.forEach((p: { name: string; emailSent: boolean; viewedAssignment: boolean }, i: number) => {
        console.log(`   ${i + 1}. ${p.name}: Email ${p.emailSent ? '✓' : '✗'}, Visto ${p.viewedAssignment ? '✓' : '✗'}`)
      })
    }

    return {
      success: true,
      data: participants,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [GET PARTICIPANTS STATUS] Error:', error)
    }
    return {
      success: false,
      error: 'Error al obtener el estado',
    }
  }
}

