'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ParticipantForm } from '@/components/create/participant-form'
import { ProgressBar } from '@/components/create/progress-bar'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'

interface Participant {
  name: string
  email: string
}

interface Exclusion {
  participant1Name: string
  participant2Name: string
  reason?: string
}

export default function CreateDrawPage() {
  const router = useRouter()
  const params = useParams()
  const drawId = params.drawId as string

  const [participants, setParticipants] = useState<Participant[]>([])
  const [exclusions, setExclusions] = useState<Exclusion[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar participantes y exclusiones guardados
    const savedParticipants = sessionStorage.getItem(`draw_${drawId}_participants`)
    const savedExclusions = sessionStorage.getItem(`draw_${drawId}_exclusions`)
    
    if (savedParticipants) {
      try {
        setParticipants(JSON.parse(savedParticipants))
      } catch (e) {
        console.error('Error parsing participants:', e)
      }
    }
    
    if (savedExclusions) {
      try {
        setExclusions(JSON.parse(savedExclusions))
      } catch (e) {
        console.error('Error parsing exclusions:', e)
      }
    }
    
    setIsLoading(false)
  }, [drawId])

  const handleNext = () => {
    if (!drawId || participants.length < 3) return

    // Guardar temporalmente en sessionStorage (no en DB todavía)
    // Nota: Los participantes ya se guardan automáticamente en ParticipantForm
    sessionStorage.setItem(`draw_${drawId}_exclusions`, JSON.stringify(exclusions))
    
    // Navegar sin guardar en DB
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
          <p className="text-white/80">Cargando...</p>
        </div>
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




