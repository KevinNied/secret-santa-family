/**
 * Sistema de Diseño - Paleta de Colores Premium
 * Basado en principios de minimalismo moderno
 */

export const colors = {
  // Colores principales
  forestGreen: '#2D5F5D', // Verde bosque (principal)
  terracotta: '#C75146',  // Rojo teja (acentos importantes)
  gold: '#D4AF37',        // Dorado (solo hover/accents puntuales)
  
  // Fondos
  background: '#FAFAFA',   // Blanco nieve
  backgroundDark: '#1A1D23', // Dark mode
  
  // Texto
  text: '#2A2D34',        // Gris carbón
  textSecondary: '#6B7280', // Gris secundario
  
  // Cards (dark mode)
  card: '#2A2D34',
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
} as const

export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
  md: '0 8px 24px rgba(0, 0, 0, 0.12)',
} as const

export const transitions = {
  fast: '150ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-in-out',
} as const

