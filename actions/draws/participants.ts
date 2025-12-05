'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'
import { z } from 'zod'

const isDev = process.env.NODE_ENV === 'development'

// Schema de validación
const AddParticipantSchema = z.object({
  drawId: z.string().uuid('ID de sorteo inválido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es demasiado largo'),
  email: z.string().email('Email inválido'),
})

/**
 * Agrega un participante a un sorteo
 * @param drawId - ID del sorteo
 * @param name - Nombre del participante
 * @param email - Email del participante
 * @returns Participante creado
 */
export async function addParticipant(drawId: string, name: string, email: string) {
  try {
    if (isDev) {
      console.log('👤 [ADD PARTICIPANT] Agregando participante...')
      console.log('   - Draw ID:', drawId)
      console.log('   - Nombre:', name)
      console.log('   - Email:', email)
    }

    // Validar input
    const validatedFields = AddParticipantSchema.safeParse({
      drawId,
      name,
      email,
    })

    if (!validatedFields.success) {
      if (isDev) {
        console.error('❌ [ADD PARTICIPANT] Validación fallida:', validatedFields.error.flatten().fieldErrors)
      }
      return {
        success: false,
        error: 'Datos inválidos',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Verificar que el sorteo existe
    const draw = await prisma.draw.findUnique({
      where: { id: drawId },
    })

    if (!draw) {
      if (isDev) {
        console.error('❌ [ADD PARTICIPANT] Sorteo no encontrado:', drawId)
      }
      return {
        success: false,
        error: 'Sorteo no encontrado',
      }
    }

    // Verificar que el email no esté duplicado en este sorteo
    const existingParticipant = await prisma.participant.findUnique({
      where: {
        drawId_email: {
          drawId,
          email: validatedFields.data.email,
        },
      },
    })

    if (existingParticipant) {
      if (isDev) {
        console.error('❌ [ADD PARTICIPANT] Email ya existe en este sorteo:', email)
      }
      return {
        success: false,
        error: 'Este email ya está registrado en el sorteo',
      }
    }

    // Crear participante con token único
    const token = randomUUID()
    const participant = await prisma.participant.create({
      data: {
        drawId: validatedFields.data.drawId,
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        token,
      },
    })

    if (isDev) {
      console.log('✅ [ADD PARTICIPANT] Participante agregado exitosamente')
      console.log('   - Participant ID:', participant.id)
      console.log('   - Token generado:', participant.token.substring(0, 8) + '...')
      console.log('   - Total participantes en sorteo:', await prisma.participant.count({ where: { drawId } }))
    }

    revalidatePath(`/create/${drawId}`)
    
    return { 
      success: true, 
      data: participant 
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [ADD PARTICIPANT] Error al agregar participante:', error)
    }
    return { 
      success: false, 
      error: 'No se pudo agregar el participante. Intenta nuevamente.' 
    }
  }
}

/**
 * Elimina un participante de un sorteo
 * @param participantId - ID del participante
 * @param drawId - ID del sorteo (para validación)
 * @returns Resultado de la operación
 */
export async function removeParticipant(participantId: string, drawId: string) {
  try {
    if (isDev) {
      console.log('🗑️  [REMOVE PARTICIPANT] Eliminando participante...')
      console.log('   - Participant ID:', participantId)
      console.log('   - Draw ID:', drawId)
    }

    // Verificar que el participante pertenece al sorteo
    const participant = await prisma.participant.findFirst({
      where: {
        id: participantId,
        drawId,
      },
    })

    if (!participant) {
      if (isDev) {
        console.error('❌ [REMOVE PARTICIPANT] Participante no encontrado o no pertenece al sorteo')
      }
      return {
        success: false,
        error: 'Participante no encontrado',
      }
    }

    await prisma.participant.delete({
      where: { id: participantId },
    })

    if (isDev) {
      console.log('✅ [REMOVE PARTICIPANT] Participante eliminado exitosamente')
      console.log('   - Nombre eliminado:', participant.name)
      console.log('   - Total participantes restantes:', await prisma.participant.count({ where: { drawId } }))
    }

    revalidatePath(`/create/${drawId}`)
    
    return { 
      success: true 
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [REMOVE PARTICIPANT] Error al eliminar participante:', error)
    }
    return { 
      success: false, 
      error: 'No se pudo eliminar el participante. Intenta nuevamente.' 
    }
  }
}

/**
 * Agrega múltiples participantes a un sorteo de una vez
 * @param drawId - ID del sorteo
 * @param participants - Array de objetos {name, email}
 * @returns Resultado de la operación
 */
export async function addParticipantsBatch(drawId: string, participants: Array<{ name: string; email: string }>) {
  try {
    if (isDev) {
      console.log('👥 [ADD PARTICIPANTS BATCH] Agregando múltiples participantes...')
      console.log('   - Draw ID:', drawId)
      console.log('   - Cantidad:', participants.length)
    }

    // Validar que el sorteo existe
    const draw = await prisma.draw.findUnique({
      where: { id: drawId },
    })

    if (!draw) {
      if (isDev) {
        console.error('❌ [ADD PARTICIPANTS BATCH] Sorteo no encontrado:', drawId)
      }
      return {
        success: false,
        error: 'Sorteo no encontrado',
      }
    }

    // Validar todos los participantes
    const validatedParticipants = participants.map((p, index) => {
      const result = AddParticipantSchema.safeParse({
        drawId,
        name: p.name,
        email: p.email,
      })
      if (!result.success) {
        throw new Error(`Participante ${index + 1} inválido: ${result.error.message}`)
      }
      return result.data
    })

    // Verificar emails duplicados en el batch
    const emails = validatedParticipants.map(p => p.email.toLowerCase())
    const uniqueEmails = new Set(emails)
    if (emails.length !== uniqueEmails.size) {
      if (isDev) {
        console.error('❌ [ADD PARTICIPANTS BATCH] Emails duplicados en el batch')
      }
      return {
        success: false,
        error: 'Hay emails duplicados en la lista',
      }
    }

    // Verificar que no existan en la DB
    const existingParticipants = await prisma.participant.findMany({
      where: {
        drawId,
        email: { in: emails },
      },
    })

    if (existingParticipants.length > 0) {
      const existingEmails = existingParticipants.map((p: { email: string }) => p.email).join(', ')
      if (isDev) {
        console.error('❌ [ADD PARTICIPANTS BATCH] Algunos emails ya existen:', existingEmails)
      }
      return {
        success: false,
        error: `Los siguientes emails ya están registrados: ${existingEmails}`,
      }
    }

    // Crear todos los participantes
    const created = await prisma.participant.createMany({
      data: validatedParticipants.map(p => ({
        drawId: p.drawId,
        name: p.name,
        email: p.email.toLowerCase(),
        token: randomUUID(),
      })),
    })

    if (isDev) {
      console.log('✅ [ADD PARTICIPANTS BATCH] Participantes agregados exitosamente:', created.count)
      console.log('   - Total participantes en sorteo:', await prisma.participant.count({ where: { drawId } }))
    }

    revalidatePath(`/create/${drawId}`)
    
    return { 
      success: true,
      count: created.count
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [ADD PARTICIPANTS BATCH] Error al agregar participantes:', error)
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'No se pudieron agregar los participantes.' 
    }
  }
}

/**
 * Obtiene todos los participantes de un sorteo
 * @param drawId - ID del sorteo
 * @returns Lista de participantes
 */
export async function getParticipants(drawId: string) {
  try {
    if (isDev) {
      console.log('📋 [GET PARTICIPANTS] Obteniendo participantes...')
      console.log('   - Draw ID:', drawId)
    }

    const participants = await prisma.participant.findMany({
      where: { drawId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        // No exponer el token en la lista general
      },
    })

    if (isDev) {
      console.log('✅ [GET PARTICIPANTS] Participantes obtenidos:', participants.length)
      participants.forEach((p: { name: string; email: string }, i: number) => {
        console.log(`   ${i + 1}. ${p.name} (${p.email})`)
      })
    }

    return { 
      success: true, 
      data: participants 
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [GET PARTICIPANTS] Error al obtener participantes:', error)
    }
    return { 
      success: false, 
      error: 'No se pudieron obtener los participantes.' 
    }
  }
}

