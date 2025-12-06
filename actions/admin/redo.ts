'use server'

import { prisma } from '@/lib/db'
import { generateAssignments } from '@/lib/assignment/algorithm'
import { sendAssignmentEmails } from '@/actions/email/send'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Rehace las asignaciones de un sorteo (elimina las anteriores y genera nuevas)
 * @param adminToken - Token de administración
 * @returns Resultado de la operación
 */
export async function redoAssignments(adminToken: string) {
  try {
    if (isDev) {
      console.log('🔄 [REDO ASSIGNMENTS] Rehaciendo asignaciones...')
      console.log('   - Admin Token:', adminToken.substring(0, 8) + '...')
    }

    // Obtener el sorteo con participantes y exclusiones
    const draw = await prisma.draw.findUnique({
      where: { adminToken },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        exclusions: {
          select: {
            participant1Id: true,
            participant2Id: true,
          },
        },
      },
    })

    if (!draw) {
      if (isDev) {
        console.error('❌ [REDO ASSIGNMENTS] Sorteo no encontrado')
      }
      return {
        success: false,
        error: 'Sorteo no encontrado',
      }
    }

    if (draw.participants.length < 3) {
      if (isDev) {
        console.error('❌ [REDO ASSIGNMENTS] Se necesitan al menos 3 participantes')
      }
      return {
        success: false,
        error: 'Se necesitan al menos 3 participantes',
      }
    }

    if (isDev) {
      console.log('   - Participantes:', draw.participants.length)
      console.log('   - Exclusiones:', draw.exclusions.length)
    }

    // Eliminar asignaciones anteriores
    await prisma.assignment.deleteMany({
      where: { drawId: draw.id },
    })

    if (isDev) {
      console.log('   - Asignaciones anteriores eliminadas')
    }

    // Generar nuevas asignaciones
    const assignments = generateAssignments(
      draw.participants.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
      })),
      draw.exclusions.map((e) => ({
        participant1Id: e.participant1Id,
        participant2Id: e.participant2Id,
      }))
    )

    if (isDev) {
      console.log('   - Nuevas asignaciones generadas:', assignments.length)
    }

    // Guardar las nuevas asignaciones
    await prisma.assignment.createMany({
      data: assignments.map((a) => ({
        drawId: draw.id,
        giverId: a.giverId,
        receiverId: a.receiverId,
      })),
    })

    // Actualizar el sorteo
    await prisma.draw.update({
      where: { id: draw.id },
      data: {
        isComplete: true,
        assignmentDate: new Date(),
      },
    })

    // Resetear estado de emails enviados
    await prisma.participant.updateMany({
      where: { drawId: draw.id },
      data: {
        emailSent: false,
        emailSentAt: null,
      },
    })

    if (isDev) {
      console.log('   - Estado actualizado')
    }

    // Enviar emails con las nuevas asignaciones
    const emailResult = await sendAssignmentEmails(draw.id)

    if (isDev) {
      console.log('✅ [REDO ASSIGNMENTS] Asignaciones rehachas exitosamente')
    }

    return {
      success: true,
      assignments: assignments.length,
      emailsSent: emailResult.success ? emailResult.sent || 0 : 0,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [REDO ASSIGNMENTS] Error:', error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al rehacer las asignaciones',
    }
  }
}
