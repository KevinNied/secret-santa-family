'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProgressBar } from '@/components/create/progress-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ArrowRight, Loader2, MessageSquare, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function MessagePage() {
  const router = useRouter()
  const params = useParams()
  const drawId = params.drawId as string

  // Estado local (no se persiste hasta hacer clic en "Siguiente")
  const [customMessage, setCustomMessage] = useState('')
  const [budget, setBudget] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos guardados temporalmente al montar
  useEffect(() => {
    const savedMessage = sessionStorage.getItem(`draw_${drawId}_message`)
    const savedBudget = sessionStorage.getItem(`draw_${drawId}_budget`)
    
    if (savedMessage) setCustomMessage(savedMessage)
    if (savedBudget) setBudget(savedBudget)
  }, [drawId])

  // Guardar en sessionStorage cuando cambien los valores
  useEffect(() => {
    if (drawId) {
      sessionStorage.setItem(`draw_${drawId}_message`, customMessage)
      sessionStorage.setItem(`draw_${drawId}_budget`, budget)
    }
  }, [customMessage, budget, drawId])

  const handleNext = () => {
    // Navegar sin guardar en DB (ya se guarda en useEffect)
    router.push(`/create/${drawId}/confirm`)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo navideño */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
      <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-20 px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-work-sans)' }}
            >
              Personalizar Mensaje
            </h1>
            <p className="text-white/80 text-lg">
              Agrega detalles sobre el intercambio (opcional)
            </p>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            currentStep={2}
            totalSteps={3}
            stepLabels={['Participantes', 'Mensaje', 'Confirmar']}
          />

          {/* Formulario */}
          <div className="space-y-6">
            {/* Mensaje Personalizado */}
            <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                  <label htmlFor="customMessage" className="text-lg font-semibold text-white">
                    Mensaje Personalizado
                  </label>
                </div>
                <Textarea
                  id="customMessage"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Escribe un mensaje especial para los participantes..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#D4AF37] min-h-[100px]"
                  rows={4}
                />
                <p className="text-xs text-white/60 mt-2">
                  Este mensaje se incluirá en el email que recibirán los participantes
                </p>
              </CardContent>
            </Card>

            {/* Presupuesto */}
            <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                  <label htmlFor="budget" className="text-lg font-semibold text-white">
                    Presupuesto
                  </label>
                </div>
                <Input
                  id="budget"
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ej: $20-$50, Máximo $30, etc."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#D4AF37]"
                />
                <p className="text-xs text-white/60 mt-2">
                  Indica el rango o límite de presupuesto para los regalos
                </p>
              </CardContent>
            </Card>

            {/* Error */}
            {error && (
              <Card className="bg-red-500/20 backdrop-blur-sm border-red-500/30">
                <CardContent className="p-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Botones de Navegación */}
            <div className="flex justify-between mt-8">
              <Link href={`/create/${drawId}`}>
                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </Button>
              </Link>
              <Button
                onClick={handleNext}
                disabled={isSaving}
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
                    <ArrowRight className="w-5 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
