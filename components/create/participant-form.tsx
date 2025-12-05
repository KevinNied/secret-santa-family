'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UserPlus, X, Users, Info } from 'lucide-react'

interface Participant {
  id?: string
  name: string
  email: string
  exclusions?: string[] // Array de nombres de participantes a excluir
}

interface ParticipantFormProps {
  drawId?: string | null
  onParticipantsChange?: (participants: Participant[]) => void
  onExclusionsChange?: (exclusions: Array<{ participant1Name: string; participant2Name: string; reason?: string }>) => void
}

export function ParticipantForm({ drawId, onParticipantsChange, onExclusionsChange }: ParticipantFormProps) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [exclusionValidationError, setExclusionValidationError] = useState<string | null>(null)

  // Cargar participantes desde sessionStorage si existen
  useEffect(() => {
    if (drawId) {
      const saved = sessionStorage.getItem(`draw_${drawId}_participants`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Asegurar que todos tengan exclusions
          const withExclusions = parsed.map((p: Participant) => ({
            ...p,
            exclusions: p.exclusions || [],
          }))
          setParticipants(withExclusions)
        } catch (e) {
          console.error('Error parsing participants:', e)
        }
      }
    }
  }, [drawId])

  // Guardar participantes en sessionStorage cuando cambien (excepto en el primer render)
  useEffect(() => {
    if (drawId && participants.length > 0) {
      sessionStorage.setItem(`draw_${drawId}_participants`, JSON.stringify(participants))
    }
  }, [participants, drawId])

  // Notificar cambios en los participantes y exclusiones
  useEffect(() => {
    onParticipantsChange?.(participants)
    
    // Validar exclusiones
    setExclusionValidationError(null)
    if (participants.length >= 3) {
      // Verificar que ningún participante tenga exclusiones con todos los demás
      for (const participant of participants) {
        const otherParticipants = participants.filter((p) => p.name !== participant.name)
        const exclusionCount = participant.exclusions?.length || 0
        
        if (exclusionCount >= otherParticipants.length) {
          setExclusionValidationError(
            `${participant.name} tiene exclusiones con todos los demás participantes. El sorteo sería imposible.`
          )
          break
        }
      }
    }
    
    // Generar exclusiones desde los participantes
    const exclusions: Array<{ participant1Name: string; participant2Name: string; reason?: string }> = []
    participants.forEach((p) => {
      if (p.exclusions && p.exclusions.length > 0) {
        p.exclusions.forEach((excludedName) => {
          // Evitar duplicados
          const exists = exclusions.some(
            e =>
              (e.participant1Name === p.name && e.participant2Name === excludedName) ||
              (e.participant1Name === excludedName && e.participant2Name === p.name)
          )
          if (!exists) {
            exclusions.push({
              participant1Name: p.name,
              participant2Name: excludedName,
            })
          }
        })
      }
    })
    onExclusionsChange?.(exclusions)
  }, [participants, onParticipantsChange, onExclusionsChange])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!name.trim() || !email.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Por favor ingresa un email válido')
      return
    }

    // Verificar email duplicado
    const emailLower = email.trim().toLowerCase()
    if (participants.some(p => p.email.toLowerCase() === emailLower)) {
      setError('Este email ya está en la lista')
      return
    }

    // Verificar nombre duplicado
    const nameTrimmed = name.trim()
    if (participants.some(p => p.name.trim() === nameTrimmed)) {
      setError('Este nombre ya está en la lista')
      return
    }

    // Agregar participante localmente
    const newParticipant: Participant = {
      name: nameTrimmed,
      email: emailLower,
      exclusions: [],
    }
    
    setParticipants([...participants, newParticipant])
    setName('')
    setEmail('')
  }

  const handleRemove = (index: number) => {
    const removed = participants[index]
    // Remover exclusiones relacionadas con este participante
    const updated = participants
      .filter((_, i) => i !== index)
      .map((p) => ({
        ...p,
        exclusions: p.exclusions?.filter((ex) => ex !== removed.name) || [],
      }))
    setParticipants(updated)
  }

  const handleToggleExclusion = (participantIndex: number, excludedName: string) => {
    const updated = [...participants]
    const participant = updated[participantIndex]
    
    if (!participant.exclusions) {
      participant.exclusions = []
    }
    
    const exclusionIndex = participant.exclusions.indexOf(excludedName)
    if (exclusionIndex > -1) {
      // Remover exclusión
      participant.exclusions.splice(exclusionIndex, 1)
    } else {
      // Agregar exclusión
      participant.exclusions.push(excludedName)
    }
    
    setParticipants(updated)
  }

  return (
    <div className="space-y-6">
      {/* Formulario de agregar */}
      <Card className="bg-white/10 backdrop-blur-[10px] border-white/20">
        <CardContent className="p-6">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-lg font-semibold text-white">Agregar Participante</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                  Nombre
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#D4AF37]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@example.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#E8C55B] text-white"
            >
              Agregar Participante
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de participantes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-white/80" />
          <h3 className="text-lg font-semibold text-white">
            Participantes ({participants.length})
          </h3>
        </div>

        {participants.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 text-center">
              <p className="text-white/60">Aún no hay participantes. Agrega el primero arriba.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/10 backdrop-blur-[10px] border-white/20 overflow-hidden">
            <CardContent className="p-0">
              {/* Tabla de participantes */}
              <div className="overflow-x-auto">
                <style jsx>{`
                  div::-webkit-scrollbar {
                    height: 6px;
                  }
                  div::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                  }
                `}</style>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left px-4 py-3 text-sm font-semibold text-white/90">ID</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-white/90">Nombre</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-white/90">
                        <div className="flex items-center gap-1">
                          Email
                          <div className="group relative">
                            <Info className="w-4 h-4 text-white/60 cursor-help shrink-0" />
                            <div className="absolute left-0 top-6 w-48 p-2 bg-white/95 text-gray-900 text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              Email del participante
                            </div>
                          </div>
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-white/90">
                        <div className="flex items-center gap-1">
                          Excluir (a uno o más)
                          <div className="group relative">
                            <Info className="w-4 h-4 text-white/60 cursor-help shrink-0" />
                            <div className="absolute left-0 top-6 w-64 p-2 bg-white/95 text-gray-900 text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              Selecciona los participantes que esta persona NO puede tener como amigo invisible
                            </div>
                          </div>
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-white/90">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => {
                      const availableExclusions = participants
                        .filter((p, i) => i !== index)
                        .map((p) => p.name)
                      
                      return (
                        <tr
                          key={index}
                          className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3 text-white/90 font-medium">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-white font-medium truncate">{participant.name}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-white/80 text-sm truncate" title={participant.email}>{participant.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            {availableExclusions.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {availableExclusions.map((excludedName) => {
                                  const isExcluded = participant.exclusions?.includes(excludedName) || false
                                  return (
                                    <button
                                      key={excludedName}
                                      type="button"
                                      onClick={() => handleToggleExclusion(index, excludedName)}
                                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                                        isExcluded
                                          ? 'bg-red-500/30 border border-red-500/50 text-red-200 hover:bg-red-500/40'
                                          : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:border-white/30'
                                      }`}
                                    >
                                      {excludedName}
                                    </button>
                                  )
                                })}
                              </div>
                            ) : (
                              <p className="text-white/50 text-xs italic">Agrega más participantes</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(index)}
                              className="text-white/70 hover:text-white hover:bg-red-500/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error de validación de exclusiones */}
        {exclusionValidationError && (
          <Card className="bg-red-500/20 backdrop-blur-sm border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <X className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-300 text-sm">{exclusionValidationError}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

