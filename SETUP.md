# Setup Guide

## Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Supabase account
- A Resend account (optional for emails)

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Setup Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → Database
3. Copy your connection strings

### Get your Database URLs

You need TWO connection strings:

**1. Connection Pooling URL** (for app queries):
- Go to: Settings → Database → Connection string → Connection pooling
- Copy the URI (Transaction mode)
- Format: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- Use as: `DATABASE_URL`

**2. Direct Connection URL** (for migrations):
- Go to: Settings → Database → Connection string → Direct connection
- Copy the URI
- Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`
- Use as: `DIRECT_URL`

### Configure `.env.local`

```bash
cp env.template .env.local
```

Edit `.env.local` and add both URLs:
```env
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
```

### Run Prisma Migrations

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (creates tables)
pnpm db:push

# Or run migrations (recommended for production)
pnpm db:migrate

# Optional: Seed demo data
pnpm db:seed
```

### Open Prisma Studio (Visual Database Editor)

```bash
pnpm db:studio
```

This opens a visual interface at `http://localhost:5555` where you can view/edit your data.

## Step 3: Setup Resend (Optional)

1. Create account at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`
4. Verify your domain or use their test domain

## Step 4: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Deploy to Vercel

```bash
npx vercel
```

Add environment variables in Vercel dashboard.

## Next Steps

1. ✅ **Schema está listo** - Las tablas se crean con Prisma
2. 🔨 **Implementar el algoritmo de asignación** en `lib/assignment/algorithm.ts`
3. 🔐 **Agregar autenticación** (Supabase Auth, NextAuth, o Clerk)
4. 📝 **Crear formularios** para grupos y participantes
5. ✉️ **Configurar Resend** y plantillas de email
6. 🧪 **Tests** para el algoritmo

## Useful Commands

```bash
# Development
pnpm dev                 # Run dev server

# Database
pnpm db:generate         # Generate Prisma Client
pnpm db:push            # Push schema changes to DB
pnpm db:migrate         # Create and run migrations
pnpm db:studio          # Open Prisma Studio (visual DB)
pnpm db:seed            # Seed demo data

# Build
pnpm build              # Build for production
pnpm start              # Start production server
```

## Troubleshooting

- **Auth not working**: Check Supabase URL and keys in `.env.local`
- **Types errors**: Run the generate types command from Supabase
- **Emails not sending**: Verify Resend API key and domain

