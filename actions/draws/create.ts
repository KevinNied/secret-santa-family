'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Verifica si un sorteo existe
 * @param id - ID del sorteo
 * @returns true si existe, false si no
 */
export async function drawExists(id: string): Promise<boolean> {
  try {
    const draw = await prisma.draw.findUnique({
      where: { id },
      select: { id: true },
    })
    return !!draw
  } catch (error) {
    if (isDev) {
      console.error('❌ [DRAW EXISTS] Error al verificar sorteo:', error)
    }
    return false
  }
}

/**
 * Crea un nuevo sorteo (Draw)
 * @param name - Nombre del sorteo (opcional, se genera uno por defecto)
 * @param id - ID del sorteo (opcional, se genera uno por defecto)
 * @returns Draw creado con adminToken
 */
export async function createDraw(name?: string, id?: string) {
  try {
    const adminToken = randomUUID()
    const drawName = name || `Sorteo ${new Date().toLocaleDateString('es-AR')}`
    
    if (isDev) {
      console.log('🎲 [CREATE DRAW] Iniciando creación de sorteo...')
      console.log('   - Nombre:', drawName)
      console.log('   - ID:', id || 'generado automáticamente')
      console.log('   - Admin Token generado:', adminToken.substring(0, 8) + '...')
    }

    const draw = await prisma.draw.create({
      data: {
        id: id || undefined, // Si se proporciona un ID, usarlo; si no, Prisma generará uno
        name: drawName,
        adminToken,
      },
    })

    if (isDev) {
      console.log('✅ [CREATE DRAW] Sorteo creado exitosamente')
      console.log('   - Draw ID:', draw.id)
      console.log('   - Admin Token completo:', draw.adminToken)
      console.log('   - Creado en:', draw.createdAt.toISOString())
    }

    revalidatePath('/create')
    
    return { 
      success: true, 
      data: draw 
    }
  } catch (error) {
    if (isDev) {
      console.error('❌ [CREATE DRAW] Error al crear sorteo:', error)
    }
    return { 
      success: false, 
      error: 'No se pudo crear el sorteo. Intenta nuevamente.' 
    }
  }
}

