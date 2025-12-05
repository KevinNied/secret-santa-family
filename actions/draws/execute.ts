'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { generateAssignments } from '@/lib/assignment/algorithm'
import { sendAssignmentEmails } from '@/actions/email/send'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Ejecuta el sorteo: genera asignaciones y las guarda en la DB
 * @param drawId - ID del sorteo
 * @returns Resultado de la operación
 */
export async function executeAssignments(drawId: string) {
  try {
    if (isDev) {
      console.log('🎲 [EXECUTE ASSIGNMENTS] Ejecutando sorteo...')
      console.log('   - Draw ID:', drawId)
    }

    // Verificar que el sorteo existe
    const draw = await prisma.draw.findUnique({
      where: { id: drawId },
      include: {
        participants: true,
        exclusions: true,
        assignments: true,
      },
    })

    if (!draw) {
      if (isDev) {
        console.error('❌ [EXECUTE ASSIGNMENTS] Sorteo no encontrado:', drawId)
      }
      return {
        success: false,
        error: 'Sorteo no encontrado',
      }
    }

    // Verificar que no esté ya ejecutado
    if (draw.isComplete) {
      if (isDev) {
        console.error('❌ [EXECUTE ASSIGNMENTS] El sorteo ya fue ejecutado')
      }
      return {
        success: false,
        error: 'Este sorteo ya fue ejecutado',
      }
    }

    // Verificar que haya participantes
    if (draw.participants.length < 3) {
      if (isDev) {
        console.error('❌ [EXECUTE ASSIGNMENTS] No hay suficientes participantes:', draw.participants.length)
      }
      return {
        success: false,
        error: `Se necesitan al menos 3 participantes. Actualmente hay ${draw.participants.length}`,
      }
    }

    // Verificar que no haya asignaciones previas
    if (draw.assignments.length > 0) {
      if (isDev) {
        console.warn('⚠️  [EXECUTE ASSIGNMENTS] Ya existen asignaciones. Eliminándolas...')
      }
      await prisma.assignment.deleteMany({
        where: { drawId },
      })
    }

    // Generar asignaciones
    if (isDev) {
      console.log('   - Generando asignaciones para', draw.participants.length, 'participantes')
      console.log('   - Exclusiones:', draw.exclusions.length)
    }

    // Convertir participantes y exclusiones al formato esperado por el algoritmo
    const participantsForAlgorithm = draw.participants.map((p: { id: string; name: string; email: string }) => ({
      id: p.id,
      name: p.name,
      email: p.email,
    }))

    const exclusionsForAlgorithm = draw.exclusions.map((e: { participant1Id: string; participant2Id: string }) => ({
      participant1Id: e.participant1Id,
      participant2Id: e.participant2Id,
    }))

    const assignments = generateAssignments(participantsForAlgorithm, exclusionsForAlgorithm)

    if (isDev) {
      console.log('   - Asignaciones generadas:', assignments.length)
      assignments.forEach((a, i) => {
        const giver = draw.participants.find((p: { id: string; name: string }) => p.id === a.giverId)
        const receiver = draw.participants.find((p: { id: string; name: string }) => p.id === a.receiverId)
        console.log(`     ${i + 1}. ${giver?.name} → ${receiver?.name}`)
      })
    }

    // Guardar asignaciones en la DB
    await prisma.assignment.createMany({
      data: assignments.map(a => ({
        drawId,
        giverId: a.giverId,
        receiverId: a.receiverId,
      })),
    })

    // Marcar sorteo como completo
    await prisma.draw.update({
      where: { id: drawId },
      data: {
        isComplete: true,
        assignmentDate: new Date(),
      },
    })

    if (isDev) {
      console.log('✅ [EXECUTE ASSIGNMENTS] Sorteo ejecutado exitosamente')
      console.log('   - Asignaciones guardadas:', assignments.length)
      console.log('   - Sorteo marcado como completo')
    }

    // Enviar emails a todos los participantes
    if (isDev) {
      console.log('📧 [EXECUTE ASSIGNMENTS] Enviando emails a participantes...')
    }
    
    const emailResult = await sendAssignmentEmails(drawId)
    
    if (isDev) {
      if (emailResult.success) {
        console.log('✅ [EXECUTE ASSIGNMENTS] Emails enviados')
        console.log('   - Enviados:', emailResult.sent)
        console.log('   - Fallidos:', emailResult.failed)
      } else {
        console.warn('⚠️  [EXECUTE ASSIGNMENTS] Error al enviar emails:', emailResult.error)
      }
    }

    revalidatePath(`/create/${drawId}/confirm`)
    revalidatePath(`/admin/${draw.adminToken}`)
    
    return { 
      success: true,
      assignmentCount: assignments.length,
      emailsSent: emailResult.success ? emailResult.sent : 0,
      emailsFailed: emailResult.success ? emailResult.failed : 0,
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [EXECUTE ASSIGNMENTS] Error al ejecutar sorteo:', error)
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'No se pudo ejecutar el sorteo. Intenta nuevamente.' 
    }
  }
}

