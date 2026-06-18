'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function DocumentMetadataDialog({
  open,
  onOpenChange,
  document,
}: any) {
  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document Metadata</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p><strong>Filename:</strong> {document.filename}</p>
          <p><strong>Size:</strong> {document.size}</p>
          <p><strong>Pages:</strong> {document.pages}</p>
          <p><strong>Chunks:</strong> {document.chunks}</p>
          <p><strong>Status:</strong> {document.status}</p>
          <p><strong>ID:</strong> {document.id}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}