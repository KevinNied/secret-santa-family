'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo navideño */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
      <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-20 px-5 md:px-10 py-8 md:py-12 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-work-sans)' }}
            >
              Algo salió mal
            </h1>
            <p className="text-white/80 text-lg mb-2">
              Ocurrió un error inesperado.
            </p>
            {error.message && (
              <p className="text-white/60 text-sm mt-4 font-mono bg-white/5 p-3 rounded">
                {error.message}
              </p>
            )}
          </div>

          <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={reset}
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#E8C55B] text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Intentar de nuevo
                </Button>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Volver al inicio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

