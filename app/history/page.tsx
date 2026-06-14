'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { HistoryTimeline } from '@/components/history/history-timeline'
import { EmptyState } from '@/components/shared/empty-state'
import { mockChatSessions } from '@/lib/mock-data'
import { MessageSquare } from 'lucide-react'

export default function HistoryPage() {
  const [sessions, setSessions] = useState(mockChatSessions)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id))
  }

  const handleOpen = (session: any) => {
    console.log('Opening session:', session.id)
  }

  return (
    <div className="space-y-8 px-4 py-8 md:px-6 lg:px-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Conversation History</h1>
        <p className="text-muted-foreground">
          View and manage all your previous conversations with documents
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Conversations</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{sessions.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {sessions.reduce((sum, s) => sum + s.messageCount, 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* History or empty state */}
      {filteredSessions.length === 0 && sessions.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-12 w-12" />}
          title="No conversations yet"
          description="Start a new chat with your documents to begin building conversation history"
        />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="No conversations found"
          description={`No conversations match "${searchTerm}". Try a different search term.`}
        />
      ) : (
        <HistoryTimeline
          sessions={filteredSessions}
          onOpen={handleOpen}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
