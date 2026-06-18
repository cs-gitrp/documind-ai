'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/lib/mock-data'

interface ChatMessageProps {
  message: ChatMessage
  showSources?: boolean
  onSourceClick?: () => void
}

export function ChatMessageComponent({ message, showSources, onSourceClick }: ChatMessageProps) {
  const isUser = message.role === 'user'

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return ''
    
    // Ensure string dates from python are interpreted cleanly as UTC
    let dateStr = typeof timestamp === 'string' ? timestamp : timestamp.toISOString()
    if (!dateStr.endsWith('Z') && !dateStr.includes('+')) {
      dateStr += 'Z'
    }
    
    const d = new Date(dateStr)
    const validDate = isNaN(d.getTime()) ? new Date() : d

    return validDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium',
          isUser
            ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
            : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
        )}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Message content */}
      <div className={cn('flex-1 space-y-2', isUser && 'text-right')}>
        <div
          className={cn(
            'inline-block rounded-lg px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-blue-600 dark:bg-blue-50 text-white dark:text-blue-900'
              : 'bg-muted text-muted-foreground border border-border dark:bg-slate-800 dark:text-slate-100'
          )}
        >
          <p className="whitespace-pre-wrap text-left">{message.content}</p>
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && showSources && (
          <div className={cn('space-y-1 text-xs', isUser && 'text-left')}>
            <button
              onClick={onSourceClick}
              className="text-muted-foreground hover:text-primary underline"
            >
              {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
            </button>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-[11px] text-muted-foreground tracking-tight select-none">
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}