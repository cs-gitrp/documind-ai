'use client'

import { useState } from 'react'
import { X, FileText, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Source } from '@/lib/mock-data'

interface SourceCitationsProps {
  sources: Source[]
  onClose?: () => void
  open?: boolean
}

export function SourceCitations({ sources, onClose, open = true }: SourceCitationsProps) {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)

  if (!open || sources.length === 0) {
    return null
  }

  return (
    <div className="border-t border-border bg-card">
      <div className="px-4 py-4 md:px-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Sources ({sources.length})</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close sources"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sources list */}
        <div className="space-y-3">
          {sources.map((source, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedSource(source)}
              className="flex gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 dark:bg-blue-900">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {source.filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  Page {source.page} • {(source.confidence * 100).toFixed(0)}% match
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {source.preview}
                </p>
              </div>

              <div className="flex-shrink-0">
                <Zap className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full text chunk inspection modal overlay */}
      {selectedSource && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"       
          onClick={() => setSelectedSource(null)}
        >
          <div 
            className="max-w-lg w-full rounded-lg border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150"         
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground truncate max-w-[85%]">{selectedSource.filename}</h4>
              <button 
                onClick={() => setSelectedSource(null)}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close preview"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Page {selectedSource.page} • {(selectedSource.confidence * 100).toFixed(0)}% match
            </p>
            <div className="rounded-md bg-muted p-4 text-sm text-foreground leading-relaxed max-h-80 overflow-y-auto custom-scrollbar">
              {selectedSource.preview}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}