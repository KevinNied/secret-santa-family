'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getDrawByAdminToken, getParticipantsStatus } from '@/actions/admin/queries'
import { resendAllEmails, resendSingleEmail } from '@/actions/admin/resend'
import { redoAssignments } from '@/actions/admin/redo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Mail, Eye, Shield, AlertTriangle, CheckCircle2, XCircle, RefreshCw, Send, Loader2 } from 'lucide-react'

interface ParticipantStatus {
  id: string
  name: string
  email: string
  emailSent: boolean
  emailSentAt: Date | null
  viewedAssignment: boolean
  viewedAt: Date | null
}

export default function AdminPage() {
  const params = useParams()
  const adminToken = params.adminToken as string

  const [draw, setDraw] = useState<any>(null)
  const [participants, setParticipants] = useState<ParticipantStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isResendingAll, setIsResendingAll] = useState(false)
  const [isRedoing, setIsRedoing] = useState(false)
  const [resendingParticipantId, setResendingParticipantId] = useState<string | null>(null)
  const [showRedoConfirm, setShowRedoConfirm] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      const drawResult = await getDrawByAdminToken(adminToken)
      if (!drawResult.success || !drawResult.data) {
        setError(drawResult.error || 'Error al cargar el sorteo')
        setIsLoading(false)
        return
      }

      setDraw(drawResult.data)

      const statusResult = await getParticipantsStatus(drawResult.data.id)
      if (statusResult.success && statusResult.data) {
        setParticipants(statusResult.data)
      }

      setIsLoading(false)
    }

    loadData()
  }, [adminToken])

  const handleResendAll = async () => {
    setIsResendingAll(true)
    setError(null)
    
    const result = await resendAllEmails(adminToken)
    
    if (result.success) {
      // Recargar datos
      const statusResult = await getParticipantsStatus(draw?.id || '')
      if (statusResult.success && statusResult.data) {
        setParticipants(statusResult.data)
      }
    } else {
      setError(result.error || 'Error al reenviar emails')
    }
    
    setIsResendingAll(false)
  }

  const handleResendSingle = async (participantId: string) => {
    setResendingParticipantId(participantId)
    setError(null)
    
    const result = await resendSingleEmail(adminToken, participantId)
    
    if (result.success) {
      // Recargar datos
      const statusResult = await getParticipantsStatus(draw?.id || '')
      if (statusResult.success && statusResult.data) {
        setParticipants(statusResult.data)
      }
    } else {
      setError(result.error || 'Error al reenviar email')
    }
    
    setResendingParticipantId(null)
  }

  const handleRedo = async () => {
    setIsRedoing(true)
    setError(null)
    setShowRedoConfirm(false)
    
    const result = await redoAssignments(adminToken)
    
    if (result.success) {
      // Recargar datos
      const drawResult = await getDrawByAdminToken(adminToken)
      if (drawResult.success && drawResult.data) {
        setDraw(drawResult.data)
      }
      
      const statusResult = await getParticipantsStatus(draw?.id || '')
      if (statusResult.success && statusResult.data) {
        setParticipants(statusResult.data)
      }
    } else {
      setError(result.error || 'Error al rehacer el sorteo')
    }
    
    setIsRedoing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
        <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />
        
        <div className="relative z-20 text-center">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error || !draw) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
        <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />
        
        <Card className="bg-white/10 backdrop-blur-[10px] border-white/20 relative z-20">
          <CardContent className="p-8 text-center">
            <p className="text-white mb-4">{error || 'Sorteo no encontrado'}</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-[#D4AF37] hover:bg-[#E8C55B] text-white"
            >
              Volver al inicio
            </Button>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 mb-4">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-semibold text-[#D4AF37]">Admin</span>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-work-sans)' }}
            >
              {draw.name}
            </h1>
            <p className="text-white/80 text-lg">
              Panel de administración del sorteo
            </p>
          </div>

          {/* Warning sobre secretos */}
          <Card className="bg-yellow-500/20 backdrop-blur-sm border-yellow-500/30 mb-8">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-200 font-medium mb-1">Las asignaciones son secretas</p>
                  <p className="text-yellow-200/80 text-sm">
                    Como administrador, no puedes ver quién tiene a quién. Solo puedes ver el estado de los participantes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado del sorteo */}
          <Card className="bg-white/10 backdrop-blur-[10px] border-white/20 mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-white/60 text-sm mb-1">Participantes</p>
                  <p className="text-2xl font-bold text-white">{participants.length}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Sorteo</p>
                  <p className="text-2xl font-bold text-white">
                    {draw.isComplete ? (
                      <span className="text-[#D4AF37]">Completo</span>
                    ) : (
                      <span className="text-white/60">Pendiente</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Asignaciones</p>
                  <p className="text-2xl font-bold text-white">{draw._count?.assignments || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de participantes */}
          <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-semibold text-white">Participantes</h2>
              </div>

              {participants.length === 0 ? (
                <p className="text-white/60 text-center py-8">No hay participantes aún</p>
              ) : (
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white">{participant.name}</p>
                        <p className="text-sm text-white/60">{participant.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {participant.emailSent ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-white/40" />
                          )}
                          <span className="text-xs text-white/60">Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {participant.viewedAssignment ? (
                            <Eye className="w-4 h-4 text-[#D4AF37]" />
                          ) : (
                            <Eye className="w-4 h-4 text-white/40" />
                          )}
                          <span className="text-xs text-white/60">Visto</span>
                        </div>
                        <Button
                          onClick={() => handleResendSingle(participant.id)}
                          disabled={resendingParticipantId === participant.id}
                          size="sm"
                          variant="ghost"
                          className="text-white/70 hover:text-white hover:bg-white/10"
                        >
                          {resendingParticipantId === participant.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sección de acciones */}
          {draw?.isComplete && (
            <Card className="bg-white/10 backdrop-blur-[10px] border-white/20 mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>
                <div className="space-y-4">
                  {/* Reenviar emails a todos */}
                  <div>
                    <Button
                      onClick={handleResendAll}
                      disabled={isResendingAll}
                      className="w-full bg-[#D4AF37] hover:bg-[#E8C55B] text-white"
                    >
                      {isResendingAll ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Reenviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Reenviar Emails a Todos
                        </>
                      )}
                    </Button>
                    <p className="text-white/60 text-xs mt-2">
                      Reenvía el email de asignación a todos los participantes que aún no lo recibieron.
                    </p>
                  </div>

                  {/* Rehacer sorteo */}
                  <div>
                    {!showRedoConfirm ? (
                      <Button
                        onClick={() => setShowRedoConfirm(true)}
                        disabled={isRedoing}
                        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Rehacer Sorteo Completo
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Card className="bg-red-500/20 border-red-500/30">
                          <CardContent className="p-4">
                            <p className="text-red-200 text-sm font-medium mb-2">
                              ⚠️ ¿Estás seguro?
                            </p>
                            <p className="text-red-200/80 text-xs mb-4">
                              Esto eliminará todas las asignaciones actuales, generará nuevas y enviará emails a todos los participantes.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={handleRedo}
                                disabled={isRedoing}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                              >
                                {isRedoing ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Rehaciendo...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Sí, Rehacer
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={() => setShowRedoConfirm(false)}
                                disabled={isRedoing}
                                variant="outline"
                                className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    <p className="text-white/60 text-xs mt-2">
                      Genera nuevas asignaciones y envía emails. Las asignaciones anteriores se eliminarán.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card className="bg-red-500/20 backdrop-blur-sm border-red-500/30 mt-6">
              <CardContent className="p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

