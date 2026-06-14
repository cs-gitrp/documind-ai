'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SettingsCard } from '@/components/settings/settings-card'
import { ThemeSelector } from '@/components/settings/theme-selector'

export default function SettingsPage() {
  const [temperature, setTemperature] = useState(0.7)
  const [chunkSize, setChunkSize] = useState(1024)
  const [chunkOverlap, setChunkOverlap] = useState(128)
  const [responseMode, setResponseMode] = useState('detailed')

  return (
    <div className="space-y-8 px-4 py-8 md:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure DocuMind AI behavior and preferences</p>
      </div>

      {/* Appearance */}
      <SettingsCard
        title="Appearance"
        description="Customize how DocuMind AI looks on your device"
      >
        <ThemeSelector />
      </SettingsCard>

      {/* RAG Configuration */}
      <SettingsCard
        title="Retrieval & Augmented Generation"
        description="Fine-tune document retrieval and response generation parameters"
      >
        <div className="space-y-6">
          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Response Temperature</label>
              <span className="text-sm font-semibold text-primary">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Lower values (0.3-0.7) produce more deterministic responses. Higher values
              (1.0-2.0) produce more creative results.
            </p>
          </div>

          {/* Chunk Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Chunk Size</label>
              <span className="text-sm font-semibold text-primary">{chunkSize} tokens</span>
            </div>
            <input
              type="range"
              min="256"
              max="2048"
              step="128"
              value={chunkSize}
              onChange={(e) => setChunkSize(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Size of text chunks for retrieval. Larger chunks provide more context but may be
              less precise.
            </p>
          </div>

          {/* Chunk Overlap */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Chunk Overlap</label>
              <span className="text-sm font-semibold text-primary">{chunkOverlap} tokens</span>
            </div>
            <input
              type="range"
              min="0"
              max="512"
              step="32"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Overlap between consecutive chunks to maintain context continuity.
            </p>
          </div>

          {/* Response Mode */}
          <div>
            <label className="text-sm font-medium text-foreground">Response Mode</label>
            <select
              value={responseMode}
              onChange={(e) => setResponseMode(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="concise">Concise - Short, direct answers</option>
              <option value="detailed">Detailed - Comprehensive responses</option>
              <option value="bullet">Bullet Points - Structured format</option>
            </select>
            <p className="mt-2 text-xs text-muted-foreground">
              Choose how detailed the AI responses should be.
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* Storage & Cache */}
      <SettingsCard
        title="Storage & Cache Management"
        description="Manage your document storage and cache settings"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Total Storage Used</span>
              <span className="font-semibold text-foreground">27.9 MB / 100 MB</span>
            </div>
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full" style={{ width: '27.9%' }} />
            </div>
          </div>

          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 text-sm">
            <div className="rounded bg-background p-3">
              <p className="text-muted-foreground">Documents</p>
              <p className="mt-1 font-semibold text-foreground">20.1 MB</p>
            </div>
            <div className="rounded bg-background p-3">
              <p className="text-muted-foreground">Cache</p>
              <p className="mt-1 font-semibold text-foreground">5.2 MB</p>
            </div>
            <div className="rounded bg-background p-3">
              <p className="text-muted-foreground">Embeddings</p>
              <p className="mt-1 font-semibold text-foreground">2.6 MB</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
          >
            Clear Cache
          </Button>
        </div>
      </SettingsCard>
    </div>
  )
}
