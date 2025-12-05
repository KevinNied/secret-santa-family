'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const isDev = process.env.NODE_ENV === 'development'

// Schema de validación
const UpdateDrawMessageSchema = z.object({
  drawId: z.string().uuid('ID de sorteo inválido'),
  customMessage: z.string().optional(),
  budget: z.string().optional(),
  exchangeDate: z.string().datetime().optional().or(z.string().length(0)),
  rules: z.string().optional(),
})

/**
 * Actualiza el mensaje y configuración del sorteo
 * @param drawId - ID del sorteo
 * @param customMessage - Mensaje personalizado del organizador
 * @param budget - Presupuesto (texto libre)
 * @param exchangeDate - Fecha de intercambio (ISO string)
 * @param rules - Reglas personalizadas
 * @returns Draw actualizado
 */
export async function updateDrawMessage(
  drawId: string,
  customMessage?: string,
  budget?: string,
  exchangeDate?: string,
  rules?: string
) {
  try {
    if (isDev) {
      console.log('📝 [UPDATE DRAW MESSAGE] Actualizando mensaje del sorteo...')
      console.log('   - Draw ID:', drawId)
      console.log('   - Mensaje personalizado:', customMessage ? `${customMessage.substring(0, 50)}...` : '(vacío)')
      console.log('   - Presupuesto:', budget || '(no especificado)')
      console.log('   - Fecha de intercambio:', exchangeDate || '(no especificada)')
      console.log('   - Reglas:', rules ? `${rules.substring(0, 50)}...` : '(vacías)')
    }

    // Validar input
    const validatedFields = UpdateDrawMessageSchema.safeParse({
      drawId,
      customMessage: customMessage?.trim() || undefined,
      budget: budget?.trim() || undefined,
      exchangeDate: exchangeDate?.trim() || undefined,
      rules: rules?.trim() || undefined,
    })

    if (!validatedFields.success) {
      if (isDev) {
        console.error('❌ [UPDATE DRAW MESSAGE] Validación fallida:', validatedFields.error.flatten().fieldErrors)
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
        console.error('❌ [UPDATE DRAW MESSAGE] Sorteo no encontrado:', drawId)
      }
      return {
        success: false,
        error: 'Sorteo no encontrado',
      }
    }

    // Preparar datos para actualizar
    const updateData: {
      customMessage?: string | null
      budget?: string | null
      exchangeDate?: Date | null
      rules?: string | null
    } = {}

    if (validatedFields.data.customMessage !== undefined) {
      updateData.customMessage = validatedFields.data.customMessage || null
    }
    if (validatedFields.data.budget !== undefined) {
      updateData.budget = validatedFields.data.budget || null
    }
    if (validatedFields.data.exchangeDate !== undefined) {
      updateData.exchangeDate = validatedFields.data.exchangeDate 
        ? new Date(validatedFields.data.exchangeDate)
        : null
    }
    if (validatedFields.data.rules !== undefined) {
      updateData.rules = validatedFields.data.rules || null
    }

    // Actualizar el sorteo
    const updatedDraw = await prisma.draw.update({
      where: { id: drawId },
      data: updateData,
    })

    if (isDev) {
      console.log('✅ [UPDATE DRAW MESSAGE] Sorteo actualizado exitosamente')
      console.log('   - Mensaje guardado:', updatedDraw.customMessage ? 'Sí' : 'No')
      console.log('   - Presupuesto guardado:', updatedDraw.budget || 'No especificado')
      console.log('   - Fecha guardada:', updatedDraw.exchangeDate?.toISOString() || 'No especificada')
    }

    revalidatePath(`/create/${drawId}/message`)
    revalidatePath(`/create/${drawId}`)
    
    return { 
      success: true, 
      data: updatedDraw 
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [UPDATE DRAW MESSAGE] Error al actualizar sorteo:', error)
    }
    return { 
      success: false, 
      error: 'No se pudo actualizar el sorteo. Intenta nuevamente.' 
    }
  }
}

