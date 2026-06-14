'use client'

import { useEffect, useRef } from 'react'
import { ChatMessageComponent } from './chat-message'
import type { ChatMessage } from '@/lib/mock-data'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading?: boolean
  onSourceClick?: (sources: any[]) => void
}

export function ChatMessages({ messages, isLoading, onSourceClick }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className="flex-1 space-y-4 overflow-y-auto px-4 py-6 md:px-6"
    >
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Start a conversation</h3>
            <p className="text-sm text-muted-foreground">Ask questions about your documents</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessageComponent
              key={message.id}
              message={message}
              showSources={message.sources && message.sources.length > 0}
              onSourceClick={() => onSourceClick?.(message.sources || [])}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full flex-shrink-0 bg-gradient-to-br from-emerald-400 to-emerald-600" />
              <div className="flex-1 space-y-1 rounded-lg bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

import { MessageCircle } from 'lucide-react'
