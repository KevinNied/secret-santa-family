import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Iniciando limpieza de la base de datos...')

  try {
    // Eliminar en orden inverso a las dependencias
    // (primero las tablas que dependen de otras)
    
    console.log('🗑️  Eliminando hints...')
    const hintsDeleted = await prisma.hint.deleteMany()
    console.log(`   ✅ Eliminados ${hintsDeleted.count} hints`)

    console.log('🗑️  Eliminando assignments...')
    const assignmentsDeleted = await prisma.assignment.deleteMany()
    console.log(`   ✅ Eliminados ${assignmentsDeleted.count} assignments`)

    console.log('🗑️  Eliminando exclusions...')
    const exclusionsDeleted = await prisma.exclusion.deleteMany()
    console.log(`   ✅ Eliminados ${exclusionsDeleted.count} exclusions`)

    console.log('🗑️  Eliminando participants...')
    const participantsDeleted = await prisma.participant.deleteMany()
    console.log(`   ✅ Eliminados ${participantsDeleted.count} participants`)

    console.log('🗑️  Eliminando draws...')
    const drawsDeleted = await prisma.draw.deleteMany()
    console.log(`   ✅ Eliminados ${drawsDeleted.count} draws`)

    console.log('\n✨ ¡Limpieza completada! La base de datos está vacía.')
    console.log('💡 Puedes ejecutar `pnpm db:seed` para agregar datos de ejemplo nuevamente.')
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

