'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo navideño */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
      <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-20 px-5 md:px-10 py-8 md:py-12 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1
              className="text-8xl md:text-9xl font-bold text-white/20 mb-4"
              style={{ fontFamily: 'var(--font-work-sans)' }}
            >
              404
            </h1>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-work-sans)' }}
            >
              Página no encontrada
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#E8C55B] text-white">
                    <Home className="w-4 h-4 mr-2" />
                    Volver al inicio
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="w-full sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Volver atrás
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

