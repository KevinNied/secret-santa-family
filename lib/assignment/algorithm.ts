export interface Participant {
  id: string
  name: string
  email: string
}

export interface Exclusion {
  participant1Id: string
  participant2Id: string
}

export interface Assignment {
  giverId: string
  receiverId: string
}

/**
 * Generate Secret Santa assignments
 * Uses Fisher-Yates shuffle with validation and retry logic
 * Ensures no one gives to themselves (derangement)
 */
export function generateAssignments(
  participants: Participant[],
  exclusions: Exclusion[] = []
): Assignment[] {
  if (participants.length < 2) {
    throw new Error('Se necesitan al menos 2 participantes para el sorteo')
  }

  // Si solo hay 2 participantes, no se puede hacer (se tendrían el uno al otro)
  if (participants.length === 2) {
    throw new Error('Se necesitan al menos 3 participantes para un sorteo válido')
  }

  const participantIds = participants.map(p => p.id)
  const maxAttempts = 100

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Crear una copia de los IDs para shuffle
    const receivers = [...participantIds]
    
    // Fisher-Yates shuffle
    for (let i = receivers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [receivers[i], receivers[j]] = [receivers[j], receivers[i]]
    }

    // Crear asignaciones
    const assignments: Assignment[] = participantIds.map((giverId, index) => ({
      giverId,
      receiverId: receivers[index],
    }))

    // Validar asignaciones
    if (validateAssignments(assignments, participants, exclusions)) {
      return assignments
    }
  }

  throw new Error('No se pudo generar un sorteo válido después de 100 intentos. Verifica las exclusiones.')
}

/**
 * Validate if a set of assignments is valid
 */
function validateAssignments(
  assignments: Assignment[],
  participants: Participant[],
  exclusions: Exclusion[]
): boolean {
  // Check each person gives exactly once
  const givers = new Set(assignments.map(a => a.giverId))
  if (givers.size !== participants.length) return false

  // Check each person receives exactly once
  const receivers = new Set(assignments.map(a => a.receiverId))
  if (receivers.size !== participants.length) return false

  // Check no one gives to themselves (derangement requirement)
  if (assignments.some(a => a.giverId === a.receiverId)) return false

  // Check exclusion rules (if any)
  for (const exclusion of exclusions) {
    const hasViolation = assignments.some(
      a =>
        (a.giverId === exclusion.participant1Id && a.receiverId === exclusion.participant2Id) ||
        (a.giverId === exclusion.participant2Id && a.receiverId === exclusion.participant1Id)
    )
    if (hasViolation) return false
  }

  return true
}

