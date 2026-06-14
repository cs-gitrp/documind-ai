'use client'

import { X, FileText, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Source } from '@/lib/mock-data'

interface SourceCitationsProps {
  sources: Source[]
  onClose?: () => void
  open?: boolean
}

export function SourceCitations({ sources, onClose, open = true }: SourceCitationsProps) {
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
    </div>
  )
}
