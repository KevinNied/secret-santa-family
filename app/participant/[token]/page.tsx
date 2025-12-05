'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getParticipantData, getAssignment, markAssignmentViewed } from '@/actions/participant/queries'
import { updateWishlist, getTargetWishlist } from '@/actions/participant/wishlist'
import { sendHint, getReceivedHints, markHintAsViewed } from '@/actions/participant/hints'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Gift, MessageSquare, DollarSign, Loader2, Sparkles, Save, CheckCircle2, Send, Clock } from 'lucide-react'

export default function ParticipantPage() {
  const params = useParams()
  const token = params.token as string

  const [participantData, setParticipantData] = useState<any>(null)
  const [assignment, setAssignment] = useState<any>(null)
  const [targetWishlist, setTargetWishlist] = useState<{ receiverName: string; wishlist: string | null } | null>(null)
  const [myWishlist, setMyWishlist] = useState('')
  const [isSavingWishlist, setIsSavingWishlist] = useState(false)
  const [wishlistSaved, setWishlistSaved] = useState(false)
  const [hintMessage, setHintMessage] = useState('')
  const [isSendingHint, setIsSendingHint] = useState(false)
  const [hintSent, setHintSent] = useState(false)
  const [receivedHints, setReceivedHints] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasViewed, setHasViewed] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      // Cargar datos del participante
      const dataResult = await getParticipantData(token)
      if (!dataResult.success || !dataResult.data) {
        setError(dataResult.error || 'Error al cargar datos')
        setIsLoading(false)
        return
      }

      setParticipantData(dataResult.data)

      // Si el sorteo está completo, cargar asignación y wishlist
      if (dataResult.data.draw.isComplete) {
        const assignmentResult = await getAssignment(token)
        if (assignmentResult.success && assignmentResult.data) {
          setAssignment(assignmentResult.data)
          
          // Marcar como vista si no estaba vista
          if (!dataResult.data.viewedAssignment) {
            await markAssignmentViewed(token)
            setHasViewed(true)
          }

          // Cargar wishlist del asignado
          const wishlistResult = await getTargetWishlist(token)
          if (wishlistResult.success && wishlistResult.data) {
            setTargetWishlist(wishlistResult.data)
          }

          // Cargar pistas recibidas
          const hintsResult = await getReceivedHints(token)
          if (hintsResult.success && hintsResult.data) {
            setReceivedHints(hintsResult.data)
            
            // Marcar pistas no vistas como vistas
            for (const hint of hintsResult.data) {
              if (!hint.viewedByReceiver) {
                await markHintAsViewed(hint.id, token)
              }
            }
          }
        } else {
          setError(assignmentResult.error || 'Error al cargar asignación')
        }
      }

      // Cargar wishlist propia del participante
      if (dataResult.data.wishlist) {
        setMyWishlist(dataResult.data.wishlist)
      }

      setIsLoading(false)
    }

    loadData()
  }, [token])

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

  if (error || !participantData) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
        <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />
        
        <Card className="bg-white/10 backdrop-blur-[10px] border-white/20 relative z-20">
          <CardContent className="p-8 text-center">
            <p className="text-white mb-4">{error || 'Participante no encontrado'}</p>
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

  const isComplete = participantData.draw.isComplete

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo navideño */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
      <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-20 px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-work-sans)' }}
            >
              Hola, {participantData.name}
            </h1>
            <p className="text-white/80 text-lg">
              {participantData.draw.name}
            </p>
          </div>

          {!isComplete ? (
            <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
              <CardContent className="p-8 text-center">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
                <p className="text-white/80">
                  El sorteo aún no ha sido ejecutado. Vuelve más tarde.
                </p>
              </CardContent>
            </Card>
          ) : assignment ? (
            <div className="space-y-6">
              {/* Asignación destacada */}
              <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10 backdrop-blur-[10px] border-2 border-[#D4AF37]/30">
                <CardContent className="p-8 text-center">
                  <div className="mb-4">
                    <Sparkles className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                  </div>
                  <p className="text-white/80 text-lg mb-2">Tu amigo invisible es:</p>
                  <h2 
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                    style={{ fontFamily: 'var(--font-work-sans)' }}
                  >
                    {assignment.receiver.name}
                  </h2>
                  {hasViewed && (
                    <p className="text-[#D4AF37] text-sm mt-4">
                      ✨ Primera vez que ves tu asignación
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Info del sorteo */}
              {(assignment.draw.budget || assignment.draw.customMessage) && (
                <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Información del Sorteo</h3>
                    <div className="space-y-4">
                      {assignment.draw.budget && (
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                          <div>
                            <p className="font-medium text-white mb-1">Presupuesto</p>
                            <p className="text-white/80 text-sm">{assignment.draw.budget}</p>
                          </div>
                        </div>
                      )}
                      {assignment.draw.customMessage && (
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                          <div>
                            <p className="font-medium text-white mb-1">Mensaje del Organizador</p>
                            <p className="text-white/80 text-sm whitespace-pre-wrap">{assignment.draw.customMessage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Wishlist del asignado */}
              {targetWishlist && (
                <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="w-5 h-5 text-[#D4AF37]" />
                      <h3 className="text-lg font-semibold text-white">
                        Lista de Deseos de {targetWishlist.receiverName}
                      </h3>
                    </div>
                    {targetWishlist.wishlist ? (
                      <p className="text-white/90 text-sm whitespace-pre-wrap">{targetWishlist.wishlist}</p>
                    ) : (
                      <p className="text-white/60 text-sm italic">
                        {targetWishlist.receiverName} aún no ha cargado su lista de deseos.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Mi Wishlist */}
              <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="text-lg font-semibold text-white">Tu Lista de Deseos</h3>
                  </div>
                  <Textarea
                    value={myWishlist}
                    onChange={(e) => {
                      setMyWishlist(e.target.value)
                      setWishlistSaved(false)
                    }}
                    placeholder="Escribe aquí tus gustos, tallas, colores, hobbies, links de productos que te gustan, etc..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#D4AF37] min-h-[120px] mb-4"
                    rows={6}
                  />
                  <Button
                    onClick={async () => {
                      setIsSavingWishlist(true)
                      const result = await updateWishlist(token, myWishlist)
                      setIsSavingWishlist(false)
                      if (result.success) {
                        setWishlistSaved(true)
                        setTimeout(() => setWishlistSaved(false), 3000)
                      }
                    }}
                    disabled={isSavingWishlist}
                    className="bg-[#D4AF37] hover:bg-[#E8C55B] text-white"
                  >
                    {isSavingWishlist ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : wishlistSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Guardado
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Lista
                      </>
                    )}
                  </Button>
                  <p className="text-white/60 text-xs mt-2">
                    Esta lista será visible para quien te tenga como amigo invisible.
                  </p>
                </CardContent>
              </Card>

              {/* Enviar Pista Anónima */}
              {assignment && (
                <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                      <h3 className="text-lg font-semibold text-white">Enviar Pista Anónima</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      Envía un mensaje secreto a {assignment.receiver.name}. El mensaje será anónimo.
                    </p>
                    <Textarea
                      value={hintMessage}
                      onChange={(e) => {
                        setHintMessage(e.target.value)
                        setHintSent(false)
                      }}
                      placeholder="Escribe una pista inspiradora... Ej: 'Me encanta leer libros de ciencia ficción' o 'Mi talla es M'"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#D4AF37] min-h-[100px] mb-4"
                      rows={4}
                    />
                    <Button
                      onClick={async () => {
                        if (!hintMessage.trim()) return
                        setIsSendingHint(true)
                        const result = await sendHint(token, hintMessage)
                        setIsSendingHint(false)
                        if (result.success) {
                          setHintMessage('')
                          setHintSent(true)
                          setTimeout(() => setHintSent(false), 3000)
                          // Recargar pistas recibidas
                          const hintsResult = await getReceivedHints(token)
                          if (hintsResult.success && hintsResult.data) {
                            setReceivedHints(hintsResult.data)
                          }
                        }
                      }}
                      disabled={isSendingHint || !hintMessage.trim()}
                      className="bg-[#D4AF37] hover:bg-[#E8C55B] text-white"
                    >
                      {isSendingHint ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : hintSent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Pista Enviada
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Pista
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Pistas Recibidas */}
              {receivedHints.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                      <h3 className="text-lg font-semibold text-white">Pistas Recibidas</h3>
                    </div>
                    <div className="space-y-4">
                      {receivedHints.map((hint) => (
                        <div
                          key={hint.id}
                          className="bg-white/5 rounded-lg p-4 border border-white/10"
                        >
                          <p className="text-white/90 text-sm whitespace-pre-wrap mb-2">
                            {hint.message}
                          </p>
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(hint.createdAt).toLocaleDateString('es-AR', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
              <CardContent className="p-8 text-center">
                <p className="text-white/80">
                  No se pudo cargar tu asignación. Contacta al organizador.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

