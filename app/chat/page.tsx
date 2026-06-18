'use client'

import { useState, useEffect } from 'react'
import { Trash2, FileText, MessageCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChatMessages } from '@/components/chat/chat-messages'
import { ChatInput } from '@/components/chat/chat-input'
import { SourceCitations } from '@/components/chat/source-citations'
import { getDocuments, sendMessage } from '@/lib/api'
import type { Source, ChatMessage } from '@/lib/mock-data'
import { getChatSession } from '@/lib/api'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSources, setSelectedSources] = useState<Source[]>([])
  const [showSources, setShowSources] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('')
  const [sessionId, setSessionId] = useState<string | null>(null)

  // ── UNIFIED INITIALIZATION HOOK (Runs EXACTLY once on mount to prevent backend loops) ──
  useEffect(() => {
    const initializeChatWorkspace = async () => {
      try {
        // 1. Fetch available documents from backend
        const docs = await getDocuments()
        const mapped = Array.isArray(docs)
          ? docs.map((doc: any) => ({
              id: doc.id,
              filename: doc.filename,
              status: doc.status,
            }))
          : []
        const indexedDocs = mapped.filter((doc: any) => doc.status === 'indexed')
        setDocuments(indexedDocs)

        // 2. Resolve exactly which document ID to target
        const preDocId = searchParams.get('docId')
        const savedDocId = sessionStorage.getItem('documind_doc_id')
        
        let targetDocId = ''
        if (preDocId && indexedDocs.find((d: any) => d.id === preDocId)) {
          targetDocId = preDocId
        } else if (savedDocId && indexedDocs.find((d: any) => d.id === savedDocId)) {
          targetDocId = savedDocId
        } else if (indexedDocs.length > 0) {
          targetDocId = indexedDocs[0].id
        }
        
        if (targetDocId) {
          setSelectedDocumentId(targetDocId)
          sessionStorage.setItem('documind_doc_id', targetDocId)
        }

        // 3. Resolve and restore historical chat logs if session exists
        const preSessionId = searchParams.get('sessionId')
        const savedSessionId = sessionStorage.getItem('documind_session_id')
        const targetSessionId = preSessionId || savedSessionId

        if (targetSessionId) {
          setSessionId(targetSessionId)
          sessionStorage.setItem('documind_session_id', targetSessionId)
          
          const sessionData = await getChatSession(targetSessionId)
          if (Array.isArray(sessionData)) {
            const restored = sessionData.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.created_at),
              sources: Array.isArray(m.sources) 
                ? m.sources.map((s: any) => {
                    const matchedDoc = indexedDocs.find(d => d.id === targetDocId)
                    const scoreValue = typeof s.score === 'number' ? s.score : 0
                    const confidence = Math.max(0, Math.min(1, 1 - scoreValue / 5))
                    return {
                      filename: matchedDoc?.filename || 'Document',
                      page: s.page ?? s.chunk_id ?? 0,
                      confidence: confidence,
                      preview: s.text || '',
                    }
                  })
                : [],
            }))
            setMessages(restored)
          }
        }
      } catch (err) {
        console.error("Workspace initialization failed:", err)
      }
    }

    initializeChatWorkspace()
  }, []) // Empty dependency array shields the backend from recursive lifecycle triggers

  const handleSendMessage = async (content: string) => {
    if (!selectedDocumentId) {
      alert('Please select a document first')
      return
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await sendMessage(content, selectedDocumentId, sessionId ?? undefined)
      
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let parsedSessionId = sessionId
      let parsedSources: any[] = []
      const aiMessageId = `msg-${Date.now() + 1}`

      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          sources: [],
        },
      ])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          
          if (chunk.includes('__SESSION_ID__')) {
            const beforeMeta = chunk.split('\n__SESSION_ID__')[0]
            fullText += beforeMeta
            
            const metaPart = chunk.split('__SESSION_ID__')[1]
            parsedSessionId = metaPart.split('__SOURCES__')[0]
            const sourcesPart = metaPart.split('__SOURCES__')[1]
            if (sourcesPart) {
              try {
                parsedSources = JSON.parse(sourcesPart)
              } catch {
                parsedSources = []
              }
            }
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: fullText.trim() }
                  : msg
              )
            )
            break
          }

          fullText += chunk
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: fullText.trim() }
                : msg
            )
          )
        }
      }

      setSessionId(parsedSessionId)
      if (parsedSessionId) {
        sessionStorage.setItem('documind_session_id', parsedSessionId)
        sessionStorage.setItem('documind_doc_id', selectedDocumentId)
      }

      const mappedSources: Source[] = parsedSources.map((source: any) => {
        const doc = documents.find((d) => d.id === selectedDocumentId)
        const scoreValue = typeof source.score === 'number' ? source.score : 0
        const confidence = Math.max(0, Math.min(1, 1 - scoreValue / 5))
        return {
          filename: doc?.filename || 'Document',
          page: source.page ?? source.chunk_id ?? 0,
          confidence: confidence,
          preview: source.text || '',
        }
      })

      // Check for missing backend vector indices right before final array update
      if (fullText.includes('"detail"') && fullText.includes('Document index not found')) {
        fullText = "This document's index is missing — likely because the cache was cleared. Please re-upload the document to chat with it again."
      }

      setMessages((prev) => {
        const updated = prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: fullText.trim(), sources: mappedSources }
            : msg
        )
        return updated
      })
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId)
  const selectedDocumentName = selectedDocument?.filename ?? ''
  const suggestions = [
    'Summarize this document',
    'What are the key points?',
    'What topics does this cover?',
  ]

  const handleSourcesClick = (sources: Source[]) => {
    setSelectedSources(sources)
    setShowSources(true)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Chat with Documents</h1>
            <p className="text-sm text-muted-foreground">Ask questions about your uploaded files</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              aria-label="Clear chat"
              onClick={() => {
                setMessages([])
                setSessionId(null)
                sessionStorage.removeItem('documind_session_id')
                sessionStorage.removeItem('documind_doc_id')
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {documents.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">
              No indexed documents — upload a file first
            </span>
          ) : (
            documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDocumentId(doc.id)
                  setSessionId(null)
                  setMessages([])
                  sessionStorage.removeItem('documind_session_id')
                  sessionStorage.removeItem('documind_doc_id')
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ease-in-out ${
                  selectedDocumentId === doc.id
                    ? 'border-primary bg-primary text-primary-foreground scale-105 shadow-sm shadow-primary/20'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-accent'
                }`}
              >
                <FileText className="h-3 w-3 shrink-0" />
                <span className="max-w-45 truncate">{doc.filename}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {(!selectedDocumentId || documents.length === 0) && messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card px-6 py-8 text-center shadow-sm shadow-muted/10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/70">
              <FileText className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Select a document to begin</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a document from above to start asking questions
              </p>
            </div>
          </div>
        ) : selectedDocumentId && messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card px-6 py-8 text-center shadow-sm shadow-muted/10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary/60">
              <MessageCircle className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Ask anything about {selectedDocumentName}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your conversation is private and powered by RAG
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-primary hover:text-foreground hover:bg-accent"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            onSourceClick={handleSourcesClick}
          />
        )}
      </div>

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