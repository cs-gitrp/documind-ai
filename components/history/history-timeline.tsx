'use client'

import { HistoryCard } from './history-card'
import type { ChatSession } from '@/lib/mock-data'

interface HistoryTimelineProps {
  sessions: ChatSession[]
  onOpen?: (session: ChatSession) => void
  onDelete?: (id: string) => void
  onFavorite?: (id: string) => void
}

export function HistoryTimeline({
  sessions,
  onOpen,
  onDelete,
  onFavorite,
}: HistoryTimelineProps) {
  // Group sessions by date
  const groupedSessions = sessions.reduce(
    (acc, session) => {
      const date = session.createdAt.toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(session)
      return acc
    },
    {} as Record<string, ChatSession[]>
  )

  const dateKeys = Object.keys(groupedSessions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="space-y-6">
      {dateKeys.map((date) => (
        <div key={date}>
          {/* Date separator */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase text-muted-foreground">{date}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Sessions for this date */}
          <div className="space-y-2">
            {groupedSessions[date].map((session) => (
              <HistoryCard
                key={session.id}
                session={session}
                onOpen={() => onOpen?.(session)}
                onDelete={() => onDelete?.(session.id)}
                onFavorite={() => onFavorite?.(session.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
