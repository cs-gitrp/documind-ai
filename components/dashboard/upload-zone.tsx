'use client'

import { useState, useRef } from 'react'
import { Upload, Plus, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { uploadDocument } from '@/lib/api'

type UploadState = 'idle' | 'uploading' | 'processing' | 'success'
type ProcessingStep = 'extracting' | 'embeddings' | 'indexing'

interface UploadZoneProps {
  onUpload?: (file: File, generatedDoc: any) => void
  className?: string
}

export function DocumentUploadZone({ onUpload, className }: UploadZoneProps) {
  const [state, setState] = useState<UploadState>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('extracting')
  const [lastUploadedDocId, setLastUploadedDocId] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processingSteps: Record<ProcessingStep, string> = {
    extracting: 'Extracting text...',
    embeddings: 'Generating embeddings...',
    indexing: 'Indexing document...',
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('ring-2', 'ring-primary')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-primary')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('ring-2', 'ring-primary')
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      simulateUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      simulateUpload(files[0])
    }
  }

  const handleChooseFiles = () => {
    fileInputRef.current?.click()
  }

  const simulateUpload = async (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOCX, or TXT file')
      return
    }

    setCurrentFile(file)
    setState('uploading')
    setUploadProgress(0)

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          return 100
        }
        return prev + Math.random() * 40
      })
    }, 100)

    // After 1.5 seconds, transition to processing and perform real upload
    setTimeout(async () => {
      clearInterval(uploadInterval)
      setUploadProgress(100)
      setState('processing')

      const result = await uploadDocument(file)

      let attempts = 0
      let found = null

      while (attempts < 60) {
        const res = await fetch('http://127.0.0.1:8000/api/documents/')
        const documents = await res.json()
        found = Array.isArray(documents)
          ? documents.find((doc: any) => doc?.id === result?.id)
          : null

        if (found && (found.status === 'indexed' || found.status === 'failed')) {
          break
        }

        attempts++
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    
      if (!found || found.status === 'failed') {
        setState('idle')
        setCurrentFile(null)
        setUploadProgress(0)
        if (fileInputRef.current) fileInputRef.current.value = ''
        alert('Document processing failed. Please try again.')
        return
      }

      const mappedDoc = {
        id: found.id,
        filename: found.filename,
        file_type: found.file_type,
        size: found.file_size ? (found.file_size / 1024 / 1024).toFixed(1) + ' MB' : 'N/A',
        status: found.status,
        uploadDate: new Date(found.upload_date),
        pages: found.page_count ?? 0,
        chunks: found.chunk_count ?? 0,
        preview: found.summary ?? '',
      }

      setLastUploadedDocId(found.id)
      setState('success')
      onUpload?.(file, mappedDoc)

      setTimeout(() => {
        setState('idle')
        setCurrentFile(null)
        setUploadProgress(0)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }, 2000)
    }, 1500)
  }

  const simulateProcessing = () => {
    const steps: ProcessingStep[] = ['extracting', 'embeddings', 'indexing']
    let stepIndex = 0

    const nextStep = () => {
      if (stepIndex < steps.length) {
        setProcessingStep(steps[stepIndex])
        stepIndex++
        setTimeout(nextStep, 650)
      } else {
        // Processing complete, show success
        setState('success')

        // Generate mock document
        if (currentFile) {
          const mockDoc = {
            id: Math.random().toString(36).substring(7),
            filename: currentFile.name,
            uploadDate: new Date(),
            pages: Math.floor(Math.random() * 200) + 20,
            chunks: Math.floor(Math.random() * 1500) + 100,
            size: `${(Math.random() * 20 + 1).toFixed(1)} MB`,
            status: 'indexed',
            preview: `Successfully processed ${currentFile.name}`,
          }
          onUpload?.(currentFile, mockDoc)
        }

        // Reset after 2 seconds
        setTimeout(() => {
          setState('idle')
          setCurrentFile(null)
          setUploadProgress(0)
          if (fileInputRef.current) fileInputRef.current.value = ''
        }, 2000)
      }
    }

    nextStep()
  }

  const handleChatWithDocument = () => {
    if (lastUploadedDocId) {
      window.location.href = `/chat?docId=${lastUploadedDocId}`
    }
    setState('idle')
  }
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'group relative flex flex-col items-center justify-center gap-5 rounded-2xl border border-border/50 bg-linear-to-br from-background to-card/50 px-8 py-16 shadow-sm transition-all hover:border-border hover:shadow-md hover:from-background hover:to-primary/5',
        state !== 'idle' && 'hover:border-border/50 hover:shadow-sm hover:from-background hover:to-card/50',
        className
      )}
    >
      {state === 'idle' && (
        <>
          <div className="rounded-full bg-linear-to-br from-primary/15 to-primary/5 p-4 transition-all group-hover:from-primary/25 group-hover:to-primary/10 group-hover:shadow-lg group-hover:shadow-primary/10">
            <Upload className="h-7 w-7 text-primary" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Upload Documents</h3>
            <p className="text-base text-muted-foreground font-light">
              Drag and drop your files here, or click to browse
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleChooseFiles} className="gap-2 rounded-lg font-medium">
              <Plus className="h-4 w-4" />
              Choose Files
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/70 pt-1">
            Supports PDF, DOCX, TXT • Max 50 MB per file
          </p>
        </>
      )}

      {state === 'uploading' && currentFile && (
        <div className="w-full max-w-md space-y-4">
          <div className="rounded-full bg-linear-to-br from-primary/15 to-primary/5 p-4 transition-all">
            <Upload className="h-7 w-7 text-primary" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-foreground truncate">{currentFile.name}</h3>
            <p className="text-sm text-muted-foreground">{(currentFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">{Math.round(uploadProgress)}%</p>
          </div>

          <p className="text-center text-sm font-medium text-foreground">Uploading document...</p>
        </div>
      )}

      {state === 'processing' && (
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-foreground">Processing</h3>
            <p className="text-sm text-muted-foreground">{processingSteps[processingStep]}</p>
          </div>
        </div>
      )}

      {state === 'success' && (
        <div className="w-full max-w-md space-y-4 animate-in fade-in-50 duration-300">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-foreground">Document indexed successfully</h3>
            <p className="text-sm text-muted-foreground">Ready to chat with your document</p>
          </div>

          <Button onClick={handleChatWithDocument} className="w-full gap-2">
            <span>Chat with document</span>
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileSelect}
        accept=".pdf,.docx,.txt"
      />
    </div>
  )
}
