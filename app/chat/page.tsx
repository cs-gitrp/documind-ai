'use client'

import { Suspense } from 'react'
import ChatContent from './chat-content'

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full min-h-0 items-center justify-center bg-background text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm">Loading Chat...</p>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  )
}