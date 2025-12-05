'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createDraw } from '@/actions/draws/create'
import { ParticipantForm } from '@/components/create/participant-form'
import { ProgressBar } from '@/components/create/progress-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Participant {
  name: string
  email: string
}

interface Exclusion {
  participant1Name: string
  participant2Name: string
  reason?: string
}

export default function CreatePage() {
  const router = useRouter()
  const [drawId, setDrawId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [exclusions, setExclusions] = useState<Exclusion[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un drawId en sessionStorage (viene de navegación atrás)
    // Buscar en todas las keys de sessionStorage para encontrar un drawId existente
    const findExistingDrawId = () => {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith('draw_') && key.endsWith('_participants')) {
          // Extraer el drawId del formato: draw_[drawId]_participants
          const drawIdMatch = key.match(/^draw_(.+)_participants$/)
          if (drawIdMatch && drawIdMatch[1]) {
            return drawIdMatch[1]
          }
        }
      }
      return null
    }

    const initializeDraw = async () => {
      setIsLoading(true)
      
      // Primero intentar encontrar un drawId existente
      const existingDrawId = findExistingDrawId()
      
      if (existingDrawId) {
        // Redirigir a la ruta con drawId para mantener la consistencia
        router.push(`/create/${existingDrawId}`)
        return
      }
      
      // No hay drawId existente, crear uno nuevo y redirigir
      const result = await createDraw()
      
      if (result.success && result.data) {
        const newDrawId = result.data.id
        // Guardar adminToken en sessionStorage para la página de éxito
        sessionStorage.setItem(`draw_${newDrawId}_adminToken`, result.data.adminToken)
        // Redirigir a la ruta con drawId
        router.push(`/create/${newDrawId}`)
      } else {
        setIsLoading(false)
      }
    }

    initializeDraw()
  }, [router])

  const handleNext = () => {
    if (!drawId || participants.length < 3) return

    // Guardar temporalmente en sessionStorage (no en DB todavía)
    // Nota: Los participantes ya se guardan automáticamente en ParticipantForm
    sessionStorage.setItem(`draw_${drawId}_exclusions`, JSON.stringify(exclusions))
    
    // Navegar sin guardar en DB (usar la ruta con drawId)
    router.push(`/create/${drawId}/message`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Fondo navideño */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
        <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />
        
        <div className="relative z-20 text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-white/80">Creando sorteo...</p>
        </div>
      </div>
    )
  }

  if (!drawId) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Fondo navideño */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
        <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />
        
        <Card className="bg-white/10 backdrop-blur-[10px] border-white/20 relative z-20">
          <CardContent className="p-8 text-center">
            <p className="text-white mb-4">Error al crear el sorteo</p>
            <Link href="/">
              <Button className="bg-[#D4AF37] hover:bg-[#E8C55B] text-white">
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo navideño */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
      <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-20 px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-work-sans)' }}
            >
              Crear Sorteo
            </h1>
            <p className="text-white/80 text-lg">
              Agrega los participantes de tu intercambio navideño
            </p>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            currentStep={1}
            totalSteps={3}
            stepLabels={['Participantes', 'Mensaje', 'Confirmar']}
          />

          {/* Formulario de participantes */}
          <ParticipantForm 
            drawId={drawId}
            onParticipantsChange={setParticipants}
            onExclusionsChange={setExclusions}
          />

          {/* Botón siguiente */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={participants.length < 3 || isSaving}
              className="bg-[#D4AF37] hover:bg-[#E8C55B] text-white px-8 py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {participants.length < 3 && participants.length > 0 && (
            <p className="text-center text-white/60 mt-4 text-sm">
              Necesitas al menos 3 participantes para continuar
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
