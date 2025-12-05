# 🗺️ ROADMAP EVOLUTIVO - SECRET SANTA FAMILY

## 📐 PRINCIPIOS DE DISEÑO: ESTILO NAVIDEÑO ELEGANTE

### Filosofía Core
**"Atmosfera navideña oscura y elegante con glassmorphism y animaciones sutiles"**

### Reglas de Oro

1. **Fondo Navideño Oscuro**
   - Gradiente principal: `linear-gradient(135deg, #1e3d59 0%, #2d5f5d 50%, #1e3d59 100%)`
   - Textura de noise sutil (opacity 0.02-0.03) para profundidad
   - Copos de nieve animados con CSS (opcional en páginas principales)
   - Vignette sutil en bordes: `box-shadow: inset 0 0 200px rgba(0,0,0,0.3)`

2. **Tipografía Elegante**
   - **USAR**: Work Sans para títulos principales, Inter como fallback
   - Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold para títulos)
   - Títulos grandes: 48px desktop, 36px mobile
   - Line-height generoso: 1.6 para párrafos, 1.2 para títulos
   - **Todo el texto en blanco/gris claro** para contraste con fondo oscuro

3. **Paleta Navideña Premium**
   - Verde bosque: `#2D5F5D` (principal, usado en fondos)
   - Rojo teja: `#C75146` (acentos)
   - **Dorado brillante: `#D4AF37`** (botones principales, hover: `#E8C55B`)
   - Fondo oscuro: Gradiente azul-verde oscuro
   - Texto: `#FFFFFF` (blanco puro) o `rgba(255,255,255,0.9)` para secundario
   - Iconos coloridos: `#4ECDC4` (verde agua), `#D4AF37` (dorado), `#C75146` (rojo)

4. **Glassmorphism en Cards**
   - Background: `rgba(255, 255, 255, 0.1)` o `rgba(45,95,93,0.2)`
   - Backdrop-filter: `blur(10px)` para efecto vidrio
   - Border: `1px solid rgba(255,255,255,0.2)`
   - Border-radius: `20px` (más generoso)
   - Sombra: `0 8px 32px rgba(0,0,0,0.3)`
   - Hover: `translateY(-4px)` con transición suave

5. **Botones Principales**
   - Color dorado: `#D4AF37` con hover `#E8C55B`
   - Tamaño: `min-width: 240px`, `height: 64px` (56px mobile)
   - Font-size: `18px`, font-weight: `600`
   - Sombra: `0 8px 24px rgba(212,175,55,0.4)`
   - Hover: `translateY(-2px) scale(1.02)` + sombra aumentada
   - Animación de pulso sutil: `pulse 2s ease-in-out infinite`
   - Border-radius: `12px`

6. **Animaciones de Entrada**
   - Título: `fade-in-up` desde arriba (0.6s)
   - Cards: `fade-in-scale` (0.8s con delay 0.2s)
   - Botones: `fade-in-up` desde abajo (1s con delay 0.4s)
   - Todas con `ease-out`
   - Transiciones hover: `0.3s ease`

7. **Iconografía y Emojis**
   - **PERMITIR emojis** en contexto navideño (🎅, 🎄, ✨)
   - Lucide Icons para funcionalidad
   - Iconos con colores variados y fondos circulares semi-transparentes
   - Tamaño iconos: 24-32px en cards

8. **Layout y Espaciado**
   - Páginas principales: `100vh` sin scroll inicial
   - Contenido centrado vertical y horizontalmente
   - Espaciado generoso: `gap: 40px` entre secciones
   - Padding: `40px` desktop, `20px` mobile
   - Max-width contenedores: `max-w-6xl` para más amplitud

9. **Efectos Visuales**
   - Text-shadow en títulos: `0 4px 20px rgba(0,0,0,0.5)`
   - Glow dorado sutil: `0 0 30px rgba(212,175,55,0.3)`
   - Líneas decorativas con estrellas: `─── ✨ ───`
   - Copos de nieve animados (solo en landing/home)

10. **Responsive y Accesibilidad**
    - Mobile-first: ajustar tamaños y espaciados
    - Mantener contraste WCAG AA
    - Touch targets mínimo 44px
    - Cursor pointer en elementos interactivos

### Checklist de Diseño
Antes de agregar cualquier elemento, preguntar:
- [ ] ¿Mantiene la atmosfera navideña oscura?
- [ ] ¿El texto es legible sobre fondo oscuro?
- [ ] ¿Los botones principales usan dorado?
- [ ] ¿Las cards tienen glassmorphism?
- [ ] ¿Las animaciones son sutiles y elegantes?
- [ ] ¿Funciona en mobile sin scroll innecesario?

### Inspiración de Referencia
- **Estilo navideño elegante**: Fondo oscuro con elementos brillantes
- **Glassmorphism moderno**: Transparencias y blur sutiles
- **Animaciones suaves**: Micro-interacciones que no distraen

---

## 📊 Estado Actual del Proyecto

- ✅ Prisma schema definido (excelente estructura)
- ✅ Setup básico de Next.js 15 + TypeScript
- ✅ Sistema de diseño navideño elegante implementado
- ✅ Landing page completa con estilo navideño oscuro
- ✅ Componentes UI base (button, card, input)
- ⚠️ Acciones backend pendientes (crear sorteo, participantes)
- ⚠️ No hay sistema de tokens implementado
- ⚠️ Algoritmo de asignación sin implementar

---

## 🎯 FASE 0: FUNDACIÓN Y LIMPIEZA
**Objetivo**: Limpiar código legacy y establecer base sólida

### PASO 0.1: Limpieza y Setup Inicial
**Backend (Actions)**
- ❌ ELIMINAR: `actions/groups.ts` (schema viejo, no existe `Group` en Prisma)
- ❌ ELIMINAR: `actions/participants.ts` (usa `groupId` que no existe)
- ✅ CREAR: `lib/utils.ts` (utilidades generales)
- ✅ INSTALAR: Dependencias UI necesarias

**Frontend (UI)**
- ❌ ELIMINAR: Referencias a `/auth/login` (no hay auth)
- ❌ ELIMINAR: Páginas en `app/(auth)/*` (no necesitamos auth)
- ✅ LIMPIAR: `app/page.tsx` (landing page minimalista)

**Resultado**: Proyecto limpio, sin código legacy

---

## 🎯 FASE 1: LANDING PAGE MINIMALISTA
**Objetivo**: Primera impresión profesional

### PASO 1.1: Sistema de Diseño Base
**Backend (Actions)**
- ✅ CREAR: `lib/constants/design.ts` (colores, espaciados, etc.)

**Frontend (UI)**
- ✅ INSTALAR: `lucide-react` (iconos)
- ✅ CONFIGURAR: Tailwind con paleta personalizada
- ✅ CREAR: `components/ui/button.tsx` (ya existe, mejorar)
- ✅ CREAR: `components/ui/card.tsx`
- ✅ CREAR: `components/ui/input.tsx`
- ✅ ACTUALIZAR: `app/globals.css` con custom properties

**Resultado**: Sistema de diseño consistente

### PASO 1.2: Landing Page v1
**Backend (Actions)**
- Sin cambios backend

**Frontend (UI)**
- ✅ CREAR: `app/page.tsx` (landing navideña elegante)
  - Fondo oscuro navideño con gradiente azul-verde
  - Copos de nieve animados
  - Título grande con glow dorado: "🎅 Amigo Invisible Mágico"
  - Subtítulo en blanco: "Organiza tu intercambio navideño con un solo link"
  - Card glassmorphism con texto introductorio familiar
  - Botón CTA dorado grande: "Crear Sorteo Ahora"
  - Animaciones de entrada sutiles
  - Layout 100vh centrado

**Resultado**: Landing navideña elegante que redirige a crear sorteo

---

## 🎯 FASE 2: FLUJO DE CREACIÓN - PASO 1 (Participantes)
**Objetivo**: Poder agregar participantes y crear un sorteo básico

### PASO 2.1: Backend - Crear Sorteo Básico
**Backend (Actions)**
- ✅ CREAR: `actions/draws/create.ts`
  - `createDraw()` → Crea Draw con adminToken UUID
- ✅ CREAR: `actions/draws/participants.ts`
  - `addParticipant(drawId, name, email)` → Agrega participante con token UUID
  - `removeParticipant(participantId, drawId)`
  - `getParticipants(drawId)`

**Frontend (UI)**
- Sin cambios UI todavía

**Resultado**: Podemos crear sorteos y agregar participantes via acciones

### PASO 2.2: UI - Formulario de Participantes
**Frontend (UI)**
- ✅ CREAR: `app/create/page.tsx`
  - Form con tabla de participantes
  - Input nombre + email (validación client-side)
  - Botón "Agregar participante"
  - Botón "Eliminar" por fila
  - Progress bar (Paso 1/3)
- ✅ CREAR: `components/create/participant-form.tsx`
- ✅ CREAR: `components/create/progress-bar.tsx`
- ✅ USAR: React Server Actions para agregar/eliminar

**Backend (Actions)**
- Ya tenemos las acciones del paso anterior

**Resultado**: Podemos agregar participantes visualmente

---

## 🎯 FASE 3: FLUJO DE CREACIÓN - PASO 2 (Mensaje)
**Objetivo**: Personalizar el mensaje del sorteo

### PASO 3.1: Backend - Guardar Mensaje
**Backend (Actions)**
- ✅ CREAR: `actions/draws/update.ts`
  - `updateDrawMessage(drawId, customMessage, budget, exchangeDate, rules)`

**Frontend (UI)**
- Sin cambios UI todavía

### PASO 3.2: UI - Formulario de Mensaje
**Frontend (UI)**
- ✅ CREAR: `app/create/[drawId]/message/page.tsx`
  - Textarea para mensaje personalizado
  - Input para presupuesto (texto libre)
  - Date picker para fecha de intercambio
  - Preview del mensaje
  - Botones "Atrás" y "Siguiente"

**Backend (Actions)**
- Ya tenemos la acción del paso anterior

**Resultado**: Mensaje personalizado guardado

---

## 🎯 FASE 4: ALGORITMO DE ASIGNACIÓN
**Objetivo**: Generar asignaciones válidas sin exclusiones todavía

### PASO 4.1: Backend - Algoritmo Básico (SIN Exclusiones)
**Backend (Actions)**
- ✅ IMPLEMENTAR: `lib/assignment/algorithm.ts`
  - `generateAssignments(participants)` → Algoritmo de derangement simple
  - Fisher-Yates shuffle con validación
  - Retry logic (máximo 100 intentos)
- ✅ CREAR: `actions/draws/execute.ts`
  - `executeAssignments(drawId)` → Genera y guarda asignaciones en DB

**Frontend (UI)**
- Sin cambios UI

**Resultado**: Algoritmo funcional para sorteos simples

### PASO 4.2: Backend - Tests del Algoritmo
**Backend (Actions)**
- ✅ CREAR: `lib/assignment/__tests__/algorithm.test.ts`
  - Test: 3 participantes → todos asignados
  - Test: 10 participantes → nadie se tiene a sí mismo
  - Test: Validación correcta

**Frontend (UI)**
- Sin cambios UI

**Resultado**: Algoritmo confiable

---

## 🎯 FASE 5: FLUJO DE CREACIÓN - PASO 3 (Confirmación)
**Objetivo**: Ejecutar sorteo y obtener link de admin

### PASO 5.1: UI - Página de Confirmación
**Frontend (UI)**
- ✅ CREAR: `app/create/[drawId]/confirm/page.tsx`
  - Resumen: X participantes
  - Warning: "No podrás ver las asignaciones"
  - Botón "Ejecutar Sorteo"
  - Loading state
- ✅ CREAR: `app/create/[drawId]/success/page.tsx`
  - Mensaje de éxito
  - Admin link con botón copiar
  - Botón "Ir al Panel Admin"

**Backend (Actions)**
- ✅ USAR: `executeAssignments(drawId)` ya creada

**Resultado**: Flujo de creación completo (sin emails, sin exclusiones)

---

## 🎯 FASE 6: PANEL ADMIN (Sin Ver Asignaciones)
**Objetivo**: Ver participantes, NO ver quién tiene a quién

### PASO 6.1: Backend - Queries Admin
**Backend (Actions)**
- ✅ CREAR: `actions/admin/queries.ts`
  - `getDrawByAdminToken(adminToken)` → Draw + participants
  - `getParticipantsStatus(drawId)` → Lista con estado de emails

**Frontend (UI)**
- Sin cambios UI

### PASO 6.2: UI - Panel Admin
**Frontend (UI)**
- ✅ CREAR: `app/admin/[adminToken]/page.tsx`
  - Badge "Admin" arriba
  - Título del sorteo
  - Lista de participantes con checkmarks (email enviado)
  - Sección "Acciones" (placeholder por ahora)
  - Warning: "Las asignaciones son secretas"

**Backend (Actions)**
- Ya tenemos las queries

**Resultado**: Panel admin funcional (sin acciones todavía)

---

## 🎯 FASE 7: PANEL PARTICIPANTE (Ver Asignación)
**Objetivo**: Cada participante ve a quién le tocó

### PASO 7.1: Backend - Query Participante
**Backend (Actions)**
- ✅ CREAR: `actions/participant/queries.ts`
  - `getParticipantData(participantToken)` → Info del participante
  - `getAssignment(participantToken)` → A quién le tocó (sin revelar quién lo tiene a él)
  - `markAssignmentViewed(participantToken)`

**Frontend (UI)**
- Sin cambios UI

### PASO 7.2: UI - Panel Participante
**Frontend (UI)**
- ✅ CREAR: `app/participant/[token]/page.tsx`
  - Header: "Hola, {nombre}"
  - Card destacado: "Tu amigo invisible es: **{nombre}**"
  - Efecto de reveal suave (fade-in simple, NO blur)
  - Info del sorteo (fecha, presupuesto)

**Backend (Actions)**
- Ya tenemos las queries

**Resultado**: Participante puede ver su asignación

---

## 🎯 FASE 8: SISTEMA DE EXCLUSIONES
**Objetivo**: Configurar "X no puede tener a Y"

### PASO 8.1: Backend - Exclusiones
**Backend (Actions)**
- ✅ CREAR: `actions/draws/exclusions.ts`
  - `addExclusion(drawId, participant1Id, participant2Id, reason)`
  - `removeExclusion(exclusionId)`
  - `getExclusions(drawId)`
  - `validateExclusions(drawId)` → Detectar ciclos imposibles

**Frontend (UI)**
- Sin cambios UI

### PASO 8.2: UI - Interfaz de Exclusiones
**Frontend (UI)**
- ✅ ACTUALIZAR: `app/create/page.tsx`
  - Sección "Exclusiones (opcional)" debajo de participantes
  - Dos dropdowns: Persona A + Persona B
  - Botón "Agregar exclusión"
  - Lista de exclusiones con botón eliminar
  - Tooltip explicativo

**Backend (Actions)**
- Ya tenemos las acciones

### PASO 8.3: Backend - Algoritmo CON Exclusiones
**Backend (Actions)**
- ✅ ACTUALIZAR: `lib/assignment/algorithm.ts`
  - Modificar `generateAssignments()` para respetar exclusiones
  - Validación de exclusiones antes de generar
  - Tests adicionales

**Frontend (UI)**
- Sin cambios UI

**Resultado**: Sorteos con restricciones funcionan

---

## 🎯 FASE 9: SISTEMA DE EMAILS (CRÍTICO)
**Objetivo**: Enviar emails con links únicos

### PASO 9.1: Backend - Integración Resend
**Backend (Actions)**
- ✅ CONFIGURAR: Variables de entorno `RESEND_API_KEY`
- ✅ CREAR: `lib/email/client.ts` (wrapper de Resend)
- ✅ CREAR: `lib/email/templates/participant-assignment.tsx`
  - Template React para email de asignación
  - Incluye link único del participante
  - Mensaje personalizado del organizador

**Frontend (UI)**
- Sin cambios UI

### PASO 9.2: Backend - Envío de Emails
**Backend (Actions)**
- ✅ CREAR: `actions/email/send.ts`
  - `sendAssignmentEmails(drawId)` → Envía a todos
  - `sendSingleEmail(participantId)` → Reenvía a uno
  - Actualiza `emailSent` y `emailSentAt`

**Frontend (UI)**
- Sin cambios UI

### PASO 9.3: UI - Actualizar Flujo de Confirmación
**Frontend (UI)**
- ✅ ACTUALIZAR: `app/create/[drawId]/confirm/page.tsx`
  - Botón ahora dice "Ejecutar Sorteo y Enviar Emails"
  - Loading: "Generando asignaciones y enviando emails..."
- ✅ ACTUALIZAR: `app/create/[drawId]/success/page.tsx`
  - Mensaje: "Emails enviados a todos los participantes"

**Backend (Actions)**
- ✅ ACTUALIZAR: `actions/draws/execute.ts`
  - Después de crear asignaciones, llamar `sendAssignmentEmails()`

**Resultado**: Sistema de emails funcional end-to-end

---

## 🎯 FASE 10: WISHLIST (Lista de Deseos)
**Objetivo**: Participantes crean su lista, otros la ven

### PASO 10.1: Backend - Wishlist CRUD
**Backend (Actions)**
- ✅ CREAR: `actions/participant/wishlist.ts`
  - `updateWishlist(participantToken, wishlistText)`
  - `getTargetWishlist(participantToken)` → Wishlist de quien le tocó

**Frontend (UI)**
- Sin cambios UI

### PASO 10.2: UI - Interfaz Wishlist
**Frontend (UI)**
- ✅ ACTUALIZAR: `app/participant/[token]/page.tsx`
  - Sección: "Su lista de deseos"
    - Si tiene: Mostrar lista
    - Si no: Empty state "Aún no cargó su lista"
  - Separador visual
  - Sección: "Tu lista de deseos"
    - Textarea editable
    - Botón "Guardar"
    - Feedback de guardado

**Backend (Actions)**
- Ya tenemos las acciones

**Resultado**: Sistema de wishlists funcional

---

## 🎯 FASE 11: PISTAS ANÓNIMAS
**Objetivo**: Enviar mensajes secretos

### PASO 11.1: Backend - Sistema de Hints
**Backend (Actions)**
- ✅ CREAR: `actions/participant/hints.ts`
  - `sendHint(senderToken, message)`
  - `getReceivedHints(participantToken)`
  - `markHintAsViewed(hintId)`

**Frontend (UI)**
- Sin cambios UI

### PASO 11.2: Backend - Email de Pista
**Backend (Actions)**
- ✅ CREAR: `lib/email/templates/hint-notification.tsx`
  - Template para notificar nueva pista
- ✅ ACTUALIZAR: `actions/participant/hints.ts`
  - Enviar email al crear hint

**Frontend (UI)**
- Sin cambios UI

### PASO 11.3: UI - Interfaz de Pistas
**Frontend (UI)**
- ✅ ACTUALIZAR: `app/participant/[token]/page.tsx`
  - Sección: "Enviar pista anónima"
    - Textarea con placeholder inspirador
    - Botón "Enviar Pista"
    - Animación de envío (fade + checkmark simple, NO sobre volando)
  - Sección: "Pistas recibidas"
    - Timeline de pistas
    - Timestamp relativo ("hace 2 días")
    - Empty state si no hay

**Backend (Actions)**
- Ya tenemos las acciones

**Resultado**: Sistema de pistas completo

---

## 🎯 FASE 12: ACCIONES DE ADMIN
**Objetivo**: Reenviar emails y rehacer sorteo

### PASO 12.1: Backend - Acciones Admin
**Backend (Actions)**
- ✅ CREAR: `actions/admin/resend.ts`
  - `resendAllEmails(adminToken)` → Mantiene asignaciones, reenvía emails
  - `resendSingleEmail(adminToken, participantId)`
- ✅ CREAR: `actions/admin/redo.ts`
  - `redoAssignments(adminToken)` → ELIMINA asignaciones viejas, genera nuevas, envía emails

**Frontend (UI)**
- Sin cambios UI

### PASO 12.2: UI - Botones de Admin
**Frontend (UI)**
- ✅ ACTUALIZAR: `app/admin/[adminToken]/page.tsx`
  - Sección "Acciones"
  - Botón: "Reenviar Emails a Todos"
    - Confirmación modal
  - Botón: "Rehacer Sorteo Completo"
    - Warning rojo
    - Confirmación con doble check

**Backend (Actions)**
- Ya tenemos las acciones

**Resultado**: Admin puede gestionar el sorteo

---

## 🎯 FASE 13: POLISH Y UX
**Objetivo**: Detalles que hacen la diferencia

### PASO 13.1: Componentes Compartidos
**Frontend (UI)**
- ✅ CREAR: `components/ui/toast.tsx` (notificaciones)
- ✅ CREAR: `components/ui/modal.tsx` (confirmaciones)
- ✅ CREAR: `components/ui/empty-state.tsx`
- ✅ CREAR: `components/ui/loading-spinner.tsx`
- ✅ MEJORAR: Estados de carga en todos los forms

**Backend (Actions)**
- Sin cambios

### PASO 13.2: Validaciones y Errores
**Backend (Actions)**
- ✅ MEJORAR: Mensajes de error descriptivos en todas las acciones
- ✅ AGREGAR: Validación de tokens inválidos
- ✅ AGREGAR: Rate limiting básico (header check)

**Frontend (UI)**
- ✅ MEJORAR: Error boundaries
- ✅ AGREGAR: Páginas 404/500 custom

### PASO 13.3: Micro-interacciones
**Frontend (UI)**
- ✅ AGREGAR: Animaciones sutiles (framer-motion opcional)
- ✅ AGREGAR: Hover states refinados
- ✅ AGREGAR: Focus visible en todos los elementos
- ✅ AGREGAR: Botón "Copiar" con feedback visual (checkmark simple)

**Backend (Actions)**
- Sin cambios

**Resultado**: App pulida y profesional

---

## 🎯 FASE 14: RESPONSIVE Y ACCESIBILIDAD
**Objetivo**: Funciona perfecto en mobile

### PASO 14.1: Mobile Optimization
**Frontend (UI)**
- ✅ REVISAR: Todas las páginas en viewport mobile
- ✅ AJUSTAR: Paddings, font-sizes, touch targets
- ✅ AGREGAR: Navigation drawer si hace falta

**Backend (Actions)**
- Sin cambios

### PASO 14.2: Accesibilidad
**Frontend (UI)**
- ✅ AGREGAR: ARIA labels donde falten
- ✅ REVISAR: Navegación por teclado
- ✅ REVISAR: Contraste de colores (WCAG AA)
- ✅ AGREGAR: Focus trap en modales

**Backend (Actions)**
- Sin cambios

**Resultado**: App accesible y mobile-friendly

---

## 🎯 FASE 15: DEPLOYMENT Y MONITORING
**Objetivo**: App en producción

### PASO 15.1: Preparar para Deploy
**Backend (Actions)**
- ✅ CONFIGURAR: Variables de entorno en Vercel
- ✅ CONFIGURAR: Database en Vercel Postgres
- ✅ EJECUTAR: `prisma db push` en prod

**Frontend (UI)**
- ✅ AGREGAR: Meta tags (OG, Twitter)
- ✅ AGREGAR: Favicon
- ✅ OPTIMIZAR: Imágenes si hay

### PASO 15.2: Deploy
**Backend + Frontend**
- ✅ DEPLOY: A Vercel
- ✅ VERIFICAR: Emails funcionan en prod
- ✅ VERIFICAR: DB queries funcionan

### PASO 15.3: Monitoring
**Backend (Actions)**
- ✅ CONFIGURAR: Error tracking (Sentry opcional)
- ✅ CONFIGURAR: Analytics (Plausible opcional)

**Resultado**: App en producción funcionando

---

## 📊 RESUMEN POR FASES

| Fase | Nombre | Complejidad | Tiempo Est. |
|------|--------|-------------|-------------|
| 0 | Fundación | 🟢 Baja | 30 min |
| 1 | Landing | 🟢 Baja | 1 hora |
| 2 | Crear - Paso 1 | 🟡 Media | 2 horas |
| 3 | Crear - Paso 2 | 🟢 Baja | 1 hora |
| 4 | Algoritmo | 🔴 Alta | 3 horas |
| 5 | Crear - Paso 3 | 🟡 Media | 1.5 horas |
| 6 | Panel Admin | 🟡 Media | 1.5 horas |
| 7 | Panel Participante | 🟡 Media | 1.5 horas |
| 8 | Exclusiones | 🔴 Alta | 2.5 horas |
| 9 | Emails | 🔴 Alta | 3 horas |
| 10 | Wishlist | 🟡 Media | 1.5 horas |
| 11 | Pistas | 🟡 Media | 2 horas |
| 12 | Acciones Admin | 🟢 Baja | 1 hora |
| 13 | Polish | 🟡 Media | 2 horas |
| 14 | Responsive | 🟡 Media | 2 horas |
| 15 | Deploy | 🟢 Baja | 1 hora |

**TOTAL ESTIMADO: ~25 horas de desarrollo**

---

## 🎯 ESTRATEGIA DE ITERACIÓN

### Principios
1. **Una fase a la vez**: No avanzar hasta completar 100%
2. **Backend primero**: Siempre crear acciones antes que UI
3. **Test manual**: Después de cada paso, probar en browser
4. **Commits frecuentes**: Commit por cada paso completado
5. **Progressive enhancement**: Cada fase agrega valor, app siempre funciona

### Flujo de Trabajo
1. Leer la fase completa
2. Implementar backend (actions) primero
3. Testear actions manualmente (console.log o Prisma Studio)
4. Implementar UI
5. Testear flujo completo
6. Commit con mensaje descriptivo
7. Pasar a siguiente fase

### Checklist de Fase Completada
- [ ] Backend actions creadas y funcionando
- [ ] UI implementada siguiendo principios de minimalismo
- [ ] Test manual exitoso
- [ ] Código limpio y sin TODOs
- [ ] Commit realizado
- [ ] Documentación actualizada si necesario

---

## 📝 NOTAS IMPORTANTES

- **NO usar emojis en UI**: Solo en este documento para organización
- **NO usar animaciones complejas**: Solo micro-interacciones sutiles
- **NO sobrecargar pantallas**: Máximo 3-4 secciones visibles
- **Siempre validar**: Backend y frontend
- **Mobile-first**: Diseñar primero para mobile, luego desktop
- **Accesibilidad desde el inicio**: No dejarlo para el final

---

**Última actualización**: Diciembre 2024
**Estado actual**: Fase 1 completada - Listo para Fase 2

