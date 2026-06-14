'use client'

import { DocumentCard } from './document-card'
import type { Document } from '@/lib/mock-data'

interface DocumentGridProps {
  documents: Document[]
  onDelete?: (id: string) => void
  isLoading?: boolean
  newDocumentId?: string
}

export function DocumentGrid({ documents, onDelete, isLoading, newDocumentId }: DocumentGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (documents.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={newDocumentId === doc.id ? 'animate-in fade-in-50 slide-in-from-top-2 duration-300' : ''}
        >
          <DocumentCard key={doc.id} document={doc} onDelete={() => onDelete?.(doc.id)} />
        </div>
      ))}
    </div>
  )
}
