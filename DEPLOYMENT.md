# Secret Santa Family - Deployment Guide

## 📋 Pre-Deploy Checklist

### ✅ Configuración Local
- [x] Variables de entorno configuradas en `.env.local`
- [x] Gmail SMTP configurado con App Password
- [x] Base de datos PostgreSQL configurada
- [x] Prisma schema sincronizado

### 🚀 Deploy a Vercel

#### 1. Variables de Entorno en Vercel
Configurar las siguientes variables en el dashboard de Vercel:

```bash
# Base de datos
DATABASE_URL="postgresql://..."

# Gmail SMTP
GMAIL_USER="tuemail@gmail.com"
GMAIL_APP_PASSWORD="tu_app_password_de_16_caracteres"

# Opcional: Logs de Prisma
PRISMA_LOG_QUERIES="false"

# Node Environment
NODE_ENV="production"
```

#### 2. Base de Datos en Producción

**Opción A: Vercel Postgres**
1. Crear base de datos en Vercel
2. Vercel auto-configura `DATABASE_URL`
3. Ejecutar: `npx prisma db push`

**Opción B: Otra base de datos PostgreSQL**
1. Copiar `DATABASE_URL` de tu proveedor
2. Configurar en Vercel
3. Ejecutar: `npx prisma db push` desde tu máquina apuntando a prod

#### 3. Build & Deploy
```bash
# Local: verificar que el build funciona
pnpm build

# Push a GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Vercel deployará automáticamente desde GitHub
```

#### 4. Post-Deploy
- [ ] Verificar que la app carga correctamente
- [ ] Probar crear un sorteo de prueba
- [ ] Verificar que los emails se envían correctamente
- [ ] Revisar logs en Vercel para errores

## 🔧 Comandos Útiles

```bash
# Generar Prisma Client
npx prisma generate

# Push schema a DB (sin migraciones)
npx prisma db push

# Ver datos en Prisma Studio
npx prisma studio

# Build para producción
pnpm build

# Preview build localmente
pnpm start
```

## 🐛 Troubleshooting

### Error: "Gmail SMTP no configurado"
- Verificar que `GMAIL_USER` y `GMAIL_APP_PASSWORD` estén en Vercel
- Verificar que no haya espacios extra en las variables

### Error: "Database connection failed"
- Verificar formato de `DATABASE_URL`
- Verificar que la base de datos permita conexiones externas
- En Vercel Postgres, usar la URL de "External"

### Error: "Module not found" en producción
- Verificar que todas las dependencias estén en `dependencies` (no en `devDependencies`)
- Ejecutar `pnpm install` para regenerar lock file

### Emails no se envían
- Verificar que Gmail App Password es de 16 caracteres sin espacios
- Verificar que la autenticación de 2 factores está activada en Google
- Revisar logs de Vercel para errores específicos

## 📊 Monitoring (Opcional)

### Vercel Analytics
- Ya incluido automáticamente
- Ver métricas en dashboard de Vercel

### Error Tracking (Sentry)
```bash
# Instalar
pnpm add @sentry/nextjs

# Configurar en next.config.js
```

### Database Monitoring
- Vercel Postgres incluye métricas básicas
- Para más detalle, usar Prisma Pulse (pago)

## 🔐 Seguridad

- ✅ Tokens únicos para cada participante y admin
- ✅ Validación de emails
- ✅ Sin autenticación = sin superficie de ataque de login
- ✅ Variables sensibles en env (nunca en código)
- ⚠️ Consider agregar rate limiting en prod (opcional)

## 📱 Testing en Producción

### Test Básico
1. Crear sorteo con 3 participantes reales
2. Verificar que emails llegan
3. Abrir link de participante en mobile
4. Verificar que panel admin funciona

### Test Completo
- [ ] Crear sorteo
- [ ] Agregar 5+ participantes
- [ ] Agregar exclusiones
- [ ] Personalizar mensaje
- [ ] Ejecutar sorteo
- [ ] Verificar emails recibidos
- [ ] Abrir panel participante
- [ ] Agregar wishlist
- [ ] Enviar pista anónima
- [ ] Verificar pista recibida
- [ ] Probar panel admin
- [ ] Reenviar email
- [ ] Verificar responsive en mobile

## 🎉 Go Live

Una vez verificado todo:
1. Compartir URL de producción
2. Monitorear primeros sorteos
3. Estar atento a feedback de usuarios

