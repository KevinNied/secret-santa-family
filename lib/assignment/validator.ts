import type { Exclusion, Participant } from '@prisma/client'

/**
 * Check if it's theoretically possible to make valid assignments
 * given the participants and exclusions
 */
export function canGenerateValidAssignments(
  participants: Participant[],
  exclusions: Exclusion[]
): { valid: boolean; reason?: string } {
  if (participants.length < 3) {
    return {
      valid: false,
      reason: 'Need at least 3 participants',
    }
  }

  // Check if exclusions make it impossible
  // TODO: Implement graph theory check
  // If a participant has exclusions with everyone else, it's impossible

  return { valid: true }
}

/**
 * Get suggested additional participants if current config is invalid
 */
export function getSuggestions(
  participants: Participant[],
  exclusions: Exclusion[]
): string[] {
  const suggestions: string[] = []

  if (participants.length < 3) {
    suggestions.push('Add at least 3 participants')
  }

  // TODO: Add more smart suggestions based on exclusion conflicts

  return suggestions
}

