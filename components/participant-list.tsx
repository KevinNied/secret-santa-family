import type { Participant } from '@prisma/client'

interface ParticipantListProps {
  participants: Participant[]
  onRemove?: (id: string) => void
}

export function ParticipantList({ participants, onRemove }: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No participants yet. Add someone to get started!
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center justify-between p-4 border border-border rounded-lg"
        >
          <div>
            <p className="font-medium">{participant.name}</p>
            <p className="text-sm text-muted-foreground">{participant.email}</p>
          </div>
          {onRemove && (
            <button
              onClick={() => onRemove(participant.id)}
              className="text-destructive hover:text-destructive/90 text-sm"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

