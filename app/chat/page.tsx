'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatMessages } from '@/components/chat/chat-messages'
import { ChatInput } from '@/components/chat/chat-input'
import { SourceCitations } from '@/components/chat/source-citations'
import { mockChatMessages } from '@/lib/mock-data'
import type { Source, ChatMessage } from '@/lib/mock-data'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSources, setSelectedSources] = useState<Source[]>([])
  const [showSources, setShowSources] = useState(false)

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `I understand you\'re asking about "${content}". Based on the documents in your knowledge base, here\'s what I found:\n\nThis is a simulated response. In a production environment, this would be powered by your RAG system to provide accurate, sourced answers from your documents.`,
        timestamp: new Date(),
        sources: [
          {
            filename: 'Neural Networks Fundamentals.pdf',
            page: 45,
            confidence: 0.92,
            preview:
              'Chapter discussing advanced concepts related to your query...',
          },
        ],
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSourcesClick = (sources: Source[]) => {
    setSelectedSources(sources)
    setShowSources(true)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Chat with Documents</h1>
            <p className="text-sm text-muted-foreground">Ask questions about your uploaded files</p>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2" aria-label="Clear chat">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        onSourceClick={handleSourcesClick}
      />

      {/* Source citations */}
      <SourceCitations
        sources={selectedSources}
        open={showSources}
        onClose={() => setShowSources(false)}
      />

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  )
}
