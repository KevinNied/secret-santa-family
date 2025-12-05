'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createDraw } from '@/actions/draws/create'
import { addParticipantsBatch } from '@/actions/draws/participants'
import { updateDrawMessage } from '@/actions/draws/update'
import { executeAssignments } from '@/actions/draws/execute'
import { addExclusion } from '@/actions/draws/exclusions'
import { drawExists } from '@/actions/draws/create'
import { ProgressBar } from '@/components/create/progress-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Loader2, CheckCircle2, Users, MessageSquare, DollarSign, AlertTriangle, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Participant {
  name: string
  email: string
}

export default function ConfirmPage() {
  const router = useRouter()
  const params = useParams()
  const drawId = params.drawId as string

  const [participants, setParticipants] = useState<Participant[]>([])
  const [exclusions, setExclusions] = useState<any[]>([])
  const [customMessage, setCustomMessage] = useState('')
  const [budget, setBudget] = useState('')
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar datos de sessionStorage al montar
  useEffect(() => {
    const savedParticipants = sessionStorage.getItem(`draw_${drawId}_participants`)
    const savedExclusions = sessionStorage.getItem(`draw_${drawId}_exclusions`)
    const savedMessage = sessionStorage.getItem(`draw_${drawId}_message`)
    const savedBudget = sessionStorage.getItem(`draw_${drawId}_budget`)
    const savedAdminToken = sessionStorage.getItem(`draw_${drawId}_adminToken`)

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

    if (savedMessage) setCustomMessage(savedMessage)
    if (savedBudget) setBudget(savedBudget)
    if (savedAdminToken) setAdminToken(savedAdminToken)

    setIsLoading(false)
  }, [drawId])

  const handleConfirm = async () => {
    if (participants.length < 3) {
      setError('Se necesitan al menos 3 participantes para ejecutar el sorteo')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // Paso 1: Verificar si el sorteo ya existe (fue creado en /create)
      const exists = await drawExists(drawId)
      
      if (!exists) {
        // Si no existe, crearlo (no debería pasar normalmente, pero por seguridad)
        const drawResult = await createDraw(undefined, drawId)
        
        if (!drawResult.success || !drawResult.data) {
          setError(drawResult.error || 'Error al crear el sorteo')
          setIsSaving(false)
          return
        }
        
        // Guardar adminToken en sessionStorage para la página de éxito
        sessionStorage.setItem(`draw_${drawId}_adminToken`, drawResult.data.adminToken)
      } else {
        // El sorteo ya existe, obtener el adminToken desde sessionStorage
        // (ya fue guardado cuando se creó en /create)
        const savedAdminToken = sessionStorage.getItem(`draw_${drawId}_adminToken`)
        if (!savedAdminToken) {
          // Si no está en sessionStorage, necesitamos obtenerlo de la DB
          // Por ahora, continuamos sin él (se puede obtener después)
        }
      }

      // Paso 2: Guardar participantes
      const participantsResult = await addParticipantsBatch(drawId, participants)
      
      if (!participantsResult.success) {
        setError(participantsResult.error || 'Error al guardar participantes')
        setIsSaving(false)
        return
      }

      // Paso 3: Guardar mensaje y presupuesto
      const messageResult = await updateDrawMessage(
        drawId,
        customMessage || undefined,
        budget || undefined,
        undefined,
        undefined
      )

      if (!messageResult.success) {
        setError(messageResult.error || 'Error al guardar el mensaje')
        setIsSaving(false)
        return
      }

      // Paso 4: Guardar exclusiones (si hay)
      if (exclusions.length > 0) {
        // Obtener los participantes guardados para mapear nombres a IDs
        const { getParticipants } = await import('@/actions/draws/participants')
        const participantsResult = await getParticipants(drawId)
        
        if (participantsResult.success && participantsResult.data) {
          // Mapear nombres a IDs
          const nameToId = new Map<string, string>()
          participantsResult.data.forEach((p: { id: string; name: string }) => {
            nameToId.set(p.name, p.id)
          })

          // Guardar exclusiones
          for (const exclusion of exclusions) {
            const id1 = nameToId.get(exclusion.participant1Name)
            const id2 = nameToId.get(exclusion.participant2Name)
            
            if (id1 && id2) {
              await addExclusion(drawId, id1, id2, exclusion.reason)
            }
          }
        }
      }

      // Paso 5: Ejecutar sorteo (generar asignaciones)
      const executeResult = await executeAssignments(drawId)

      if (!executeResult.success) {
        setError(executeResult.error || 'Error al ejecutar el sorteo')
        setIsSaving(false)
        return
      }

      // Limpiar sessionStorage
      sessionStorage.removeItem(`draw_${drawId}_participants`)
      sessionStorage.removeItem(`draw_${drawId}_exclusions`)
      sessionStorage.removeItem(`draw_${drawId}_message`)
      sessionStorage.removeItem(`draw_${drawId}_budget`)

      // Redirigir a página de éxito
      router.push(`/create/${drawId}/success`)
    } catch (err) {
      setError('Error inesperado al guardar')
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-work-sans)' }}
            >
              Confirmar Sorteo
            </h1>
            <p className="text-white/80 text-lg">
              Revisa los detalles antes de continuar
            </p>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            currentStep={3}
            totalSteps={3}
            stepLabels={['Participantes', 'Mensaje', 'Confirmar']}
          />

          {/* Resumen */}
          <div className="space-y-6">
            {/* Participantes */}
            <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-lg font-semibold text-white">
                    Participantes ({participants.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {participants.map((p, index) => (
                    <div key={index} className="text-white/90 text-sm py-2 border-b border-white/10 last:border-0">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-white/60 ml-2">({p.email})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exclusiones */}
            {exclusions.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="text-lg font-semibold text-white">
                      Exclusiones ({exclusions.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {exclusions.map((exclusion, index) => (
                      <div key={index} className="text-white/90 text-sm py-2 border-b border-white/10 last:border-0">
                        <span className="font-medium">{exclusion.participant1Name}</span>
                        {' '}no puede tener a{' '}
                        <span className="font-medium">{exclusion.participant2Name}</span>
                        {exclusion.reason && (
                          <span className="text-white/60 ml-2">({exclusion.reason})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mensaje y Presupuesto */}
            {(customMessage || budget) && (
              <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
                <CardContent className="p-6">
                  {customMessage && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="text-lg font-semibold text-white">Mensaje Personalizado</h3>
                      </div>
                      <p className="text-white/90 text-sm whitespace-pre-wrap">{customMessage}</p>
                    </div>
                  )}
                  {budget && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="text-lg font-semibold text-white">Presupuesto</h3>
                      </div>
                      <p className="text-white/90 text-sm">{budget}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Warning */}
            <Card className="bg-yellow-500/20 backdrop-blur-sm border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-200 font-medium mb-1">Importante</p>
                    <p className="text-yellow-200/80 text-sm">
                      Una vez que confirmes, se ejecutará el sorteo y <strong>no podrás ver las asignaciones</strong>. 
                      Solo los participantes recibirán su asignación por email.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {participants.length < 3 && (
              <Card className="bg-red-500/20 backdrop-blur-sm border-red-500/30">
                <CardContent className="p-4">
                  <p className="text-red-300 text-sm">
                    Se necesitan al menos 3 participantes para ejecutar el sorteo. Actualmente hay {participants.length}.
                  </p>
                </CardContent>
              </Card>
            )}

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
              <Link href={`/create/${drawId}/message`}>
                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </Button>
              </Link>
              <Button
                onClick={handleConfirm}
                disabled={isSaving || participants.length < 3}
                className="bg-[#D4AF37] hover:bg-[#E8C55B] text-white px-8 py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Ejecutando sorteo y enviando emails...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Ejecutar Sorteo y Enviar Emails
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

