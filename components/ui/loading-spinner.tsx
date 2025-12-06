'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2
        className={cn('text-[#D4AF37] animate-spin', sizeClasses[size])}
        aria-label="Cargando"
      />
      {text && <p className="text-white/80 text-sm">{text}</p>}
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
}

export function LoadingOverlay({ isLoading, text }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-lg p-8">
        <LoadingSpinner size="lg" text={text || 'Cargando...'} />
      </div>
    </div>
  )
}

