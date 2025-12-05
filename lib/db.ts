import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configuración de logs de Prisma
// Controlado por variable de entorno PRISMA_LOG_QUERIES (true/false)
// Por defecto está desactivado
const shouldLogQueries = process.env.PRISMA_LOG_QUERIES === 'true'

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: shouldLogQueries 
      ? ['query', 'error', 'warn'] 
      : process.env.NODE_ENV === 'development' 
        ? ['error', 'warn'] 
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

