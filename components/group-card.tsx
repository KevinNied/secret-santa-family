import type { Group } from '@prisma/client'

interface GroupCardProps {
  group: Group
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <div className="border border-border rounded-lg p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{group.name}</h3>
          <p className="text-sm text-muted-foreground">{group.year}</p>
        </div>
        {group.assignmentDate ? (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Assigned
          </span>
        ) : (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Pending
          </span>
        )}
      </div>
      
      <div className="flex gap-2">
        <a
          href={`/groups/${group.id}`}
          className="flex-1 px-4 py-2 text-center border border-border rounded-lg hover:bg-accent transition"
        >
          View
        </a>
        {!group.assignmentDate && (
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
            Assign
          </button>
        )}
      </div>
    </div>
  )
}

