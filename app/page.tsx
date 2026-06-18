'use client'

import { useEffect, useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DocumentUploadZone } from '@/components/dashboard/upload-zone'
import { DocumentGrid } from '@/components/dashboard/document-grid'
import { EmptyState } from '@/components/shared/empty-state'
import { getDocuments, deleteDocument } from '@/lib/api'
import { FileText, Upload } from 'lucide-react'

export default function DashboardPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'indexed' | 'processing' | 'error'>(
    'all'
  )
  const [newDocumentId, setNewDocumentId] = useState<string | undefined>(undefined)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const fetchDocuments = async () => {
    const docs = await getDocuments()
    const mapped = Array.isArray(docs)
      ? docs.map((doc: any) => ({
          id: doc.id,
          filename: doc.filename,
          file_type: doc.file_type,
          size: doc.file_size ? (doc.file_size / 1024 / 1024).toFixed(1) + ' MB' : 'N/A',
          status: doc.status,
          uploadDate: new Date(doc.upload_date),
          pages: doc.page_count ?? 0,
          chunks: doc.chunk_count ?? 0,
          preview: doc.summary ?? '',
        }))
      : []
    setDocuments(mapped)
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDeleteDocument = async (id: string) => {
    await deleteDocument(id)
    await fetchDocuments()
  }

  const handleUpload = async (file: File, generatedDoc: any) => {
    setNewDocumentId(generatedDoc.id)

    setTimeout(async () => {
      setNewDocumentId(undefined)
      await fetchDocuments()
    }, 3000)
  }

  const stats = {
    total: documents.length,
    indexed: documents.filter((d) => d.status === 'indexed').length,
    processing: documents.filter((d) => d.status === 'processing').length,
    totalSize: documents.reduce((sum, d) => {
      const mb = parseFloat(d.size)
      return sum + (isNaN(mb) ? 0 : mb)
    }, 0),
  }

  return (
    <div className="space-y-8 px-4 py-8 md:px-6 lg:px-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
        <p className="text-muted-foreground">
          Upload and organize your documents for AI-powered analysis and Q&A
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Indexed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.indexed}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Processing</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalSize.toFixed(1)} MB</p>
        </div>
      </div>

      {/* Upload zone */}
      <DocumentUploadZone onUpload={handleUpload} />

      {/* Filters and search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2">
          {(['all', 'indexed', 'processing', 'error'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Documents grid or empty state */}
      {documents.length === 0 ? (
        <EmptyState
          icon={<Upload className="h-12 w-12" />}
          title="No documents yet"
          description="Upload your first document to get started with DocuMind AI"
          action={<Button className="gap-2"><FileText className="h-4 w-4" /> Browse Documents</Button>}
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredDocuments.length} of {documents.length} documents
          </p>
          <DocumentGrid
            documents={filteredDocuments}
            onDelete={handleDeleteDocument}
            newDocumentId={newDocumentId}
          />
        </div>
      )}
    </div>
  )
}
