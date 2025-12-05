'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Copy, ExternalLink, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const params = useParams()
  const drawId = params.drawId as string
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Obtener adminToken desde sessionStorage
    const savedToken = sessionStorage.getItem(`draw_${drawId}_adminToken`)
    if (savedToken) {
      setAdminToken(savedToken)
    }
  }, [drawId])

  const adminLink = adminToken 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/admin/${adminToken}`
    : ''

  const handleCopy = async () => {
    if (adminLink) {
      await navigator.clipboard.writeText(adminLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo navideño */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
      <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-20 px-5 md:px-10 py-8 md:py-12 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto w-full text-center">
          {/* Icono de éxito */}
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-[#D4AF37]" />
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-work-sans)' }}
            >
              ¡Sorteo Ejecutado!
            </h1>
            <p className="text-white/80 text-lg">
              El sorteo se ha ejecutado exitosamente y los emails han sido enviados a todos los participantes.
            </p>
          </div>

          {/* Card con link de admin */}
          {adminLink && (
            <Card className="bg-white/10 backdrop-blur-[10px] border-white/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-lg font-semibold text-white">Link de Administración</h3>
                </div>
                <p className="text-white/70 text-sm mb-4">
                  Guarda este link para gestionar el sorteo. No podrás ver las asignaciones, pero podrás ver el estado de los participantes.
                </p>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3 mb-4">
                  <code className="flex-1 text-left text-xs text-white/80 break-all">
                    {adminLink}
                  </code>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    className="bg-[#D4AF37] hover:bg-[#E8C55B] text-white shrink-0"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
                <Link href={adminLink}>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ir al Panel Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Información adicional */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <p className="text-white/70 text-sm">
                Los participantes recibirán un email con su asignación y un link único para acceder a su panel.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

