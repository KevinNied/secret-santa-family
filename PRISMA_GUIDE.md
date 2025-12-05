# Prisma Quick Guide

Esta es una guía rápida de Prisma para este proyecto.

## 📁 Archivos Principales

```
prisma/
  ├── schema.prisma    # Define tu schema (tablas, relaciones)
  └── seed.ts          # Script para poblar datos de prueba

lib/
  ├── db.ts           # Cliente de Prisma (singleton)
  └── db/
      └── queries.ts  # Queries reutilizables
```

## 🚀 Comandos Básicos

```bash
# Generar Prisma Client (después de cambiar schema.prisma)
pnpm db:generate

# Push cambios a la BD (desarrollo rápido)
pnpm db:push

# Crear una migración (recomendado para producción)
pnpm db:migrate

# Abrir Prisma Studio (editor visual de DB)
pnpm db:studio

# Poblar datos de prueba
pnpm db:seed
```

## 📝 Flujo de Trabajo

### 1. Modificar el Schema

Edita `prisma/schema.prisma`:

```prisma
model NewModel {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
}
```

### 2. Aplicar Cambios

```bash
# Opción A: Push directo (desarrollo)
pnpm db:push

# Opción B: Crear migración (producción)
pnpm db:migrate
```

### 3. Usar en tu código

```typescript
import { prisma } from '@/lib/db'

// Crear
const user = await prisma.user.create({
  data: { email: 'test@example.com', name: 'Test' }
})

// Leer
const users = await prisma.user.findMany()
const user = await prisma.user.findUnique({ where: { id: '123' } })

// Actualizar
await prisma.user.update({
  where: { id: '123' },
  data: { name: 'New Name' }
})

// Eliminar
await prisma.user.delete({ where: { id: '123' } })

// Relaciones
const group = await prisma.group.findUnique({
  where: { id: '123' },
  include: {
    participants: true,  // Incluye participantes
    assignments: true,   // Incluye asignaciones
  }
})
```

## 🔍 Queries Comunes en este Proyecto

### Crear un Grupo

```typescript
const group = await prisma.group.create({
  data: {
    name: 'Navidad 2025',
    year: 2025,
    createdBy: userId,
  }
})
```

### Agregar Participante

```typescript
const participant = await prisma.participant.create({
  data: {
    groupId: '123',
    name: 'Juan Pérez',
    email: 'juan@example.com',
  }
})
```

### Obtener Grupo con Todo

```typescript
const group = await prisma.group.findUnique({
  where: { id: groupId },
  include: {
    participants: true,
    assignments: {
      include: {
        giver: true,
        receiver: true,
      }
    },
    exclusions: {
      include: {
        participant1: true,
        participant2: true,
      }
    }
  }
})
```

### Crear Múltiples Asignaciones

```typescript
await prisma.assignment.createMany({
  data: [
    { groupId: '123', giverId: 'p1', receiverId: 'p2' },
    { groupId: '123', giverId: 'p2', receiverId: 'p3' },
    { groupId: '123', giverId: 'p3', receiverId: 'p1' },
  ]
})
```

## 🎯 Tips

### 1. Usar Transactions

Para operaciones que deben ser atómicas:

```typescript
await prisma.$transaction(async (tx) => {
  // Crear asignaciones
  await tx.assignment.createMany({ data: assignments })
  
  // Marcar grupo como asignado
  await tx.group.update({
    where: { id: groupId },
    data: { assignmentDate: new Date() }
  })
})
```

### 2. Manejo de Errores

```typescript
try {
  const user = await prisma.user.create({ data: ... })
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    console.error('Email ya existe')
  }
}
```

### 3. Type Safety

Prisma genera tipos automáticamente:

```typescript
import { Group, Participant } from '@prisma/client'

// Tipos incluyen relaciones
type GroupWithParticipants = Group & {
  participants: Participant[]
}
```

## 🔗 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

