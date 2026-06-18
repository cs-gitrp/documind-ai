'use client'

import { MoreHorizontal, MessageSquare, FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ChatSession } from '@/lib/mock-data'

interface HistoryCardProps {
  session: ChatSession
  onOpen?: () => void
  onDelete?: () => void
}

export function HistoryCard({
  session,
  onOpen,
  onDelete,
}: HistoryCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = diff / (1000 * 60 * 60)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${Math.floor(hours)}h ago`
    if (hours < 168) return `${Math.floor(hours / 24)}d ago`
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md">
      <button
        onClick={onOpen}
        className="flex-1 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900 flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="truncate font-semibold text-foreground hover:text-primary">
              {session.title}
            </h4>
            <p className="truncate text-sm text-muted-foreground">
              {session.lastMessage}
            </p>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {session.messageCount} messages
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span className="max-w-40 truncate">{session.documentName || 'Unknown document'}</span>
              </div>
              <span>{formatDate(session.createdAt)}</span>
            </div>
          </div>
        </div>
      </button>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete conversation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
