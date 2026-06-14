'use client'

import { FileText, MoreHorizontal, Download, Trash2, FileUp, Eye, PencilIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/shared/badge'
import type { Document } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface DocumentCardProps {
  document: Document
  className?: string
  onDelete?: () => void
}

export function DocumentCard({ document, className, onDelete }: DocumentCardProps) {
  const statusConfig = {
    indexed: { variant: 'indexed' as const, label: 'Indexed' },
    processing: { variant: 'processing' as const, label: 'Processing' },
    error: { variant: 'error' as const, label: 'Error' },
  }

  const config = statusConfig[document.status]

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md',
        className
      )}
    >
      {/* Header with icon and menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="truncate font-semibold text-foreground">{document.filename}</h4>
            <p className="text-xs text-muted-foreground">{document.size}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium transition-opacity opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground" aria-label="Document actions">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <FileUp className="h-4 w-4 mr-2" />
              <span>Open Document</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <PencilIcon className="h-4 w-4 mr-2" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              <span>Download Original</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="h-4 w-4 mr-2" />
              <span>View Metadata</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span>Delete Document</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status and date */}
      <div className="flex items-center justify-between">
        <Badge variant={config.variant}>{config.label}</Badge>
        <span className="text-xs text-muted-foreground">
          {document.uploadDate.toLocaleDateString()}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-muted px-2 py-1">
          <span className="text-muted-foreground">Pages:</span>
          <span className="ml-1 font-medium text-foreground">{document.pages}</span>
        </div>
        <div className="rounded bg-muted px-2 py-1">
          <span className="text-muted-foreground">Chunks:</span>
          <span className="ml-1 font-medium text-foreground">{document.chunks}</span>
        </div>
      </div>

      {/* Preview */}
      {document.preview && (
        <p className="line-clamp-2 text-xs text-muted-foreground">{document.preview}</p>
      )}
    </div>
  )
}
