'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SettingsCard } from '@/components/settings/settings-card'
import { ThemeSelector } from '@/components/settings/theme-selector'
import { getSettings, updateSettings, clearStorage, getStorageStats } from '@/lib/api'

export default function SettingsPage() {
  const [temperature, setTemperature] = useState(0.7)
  const [chunkSize, setChunkSize] = useState(1024)
  const [chunkOverlap, setChunkOverlap] = useState(128)
  const [responseMode, setResponseMode] = useState('detailed')
  const [saving, setSaving] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [storageStats, setStorageStats] = useState({ 
    documents_mb: 0, index_mb: 0, total_mb: 0, max_mb: 100 
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [data, storage] = await Promise.all([getSettings(), getStorageStats()])
        if (data) {
          if (data.temperature !== undefined) setTemperature(data.temperature)
          if (data.chunk_size !== undefined) setChunkSize(data.chunk_size)
          if (data.chunk_overlap !== undefined) setChunkOverlap(data.chunk_overlap)
          if (data.response_mode) setResponseMode(data.response_mode)
        }
        if (storage) setStorageStats(storage)
      } catch (e) {
        console.error('Failed to load settings', e)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings({
        temperature,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
        response_mode: responseMode,
      })
      alert('Settings saved successfully!')
    } catch (e) {
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleClearStorage = async () => {
    const confirmed = window.confirm(
      'This will permanently delete ALL uploaded documents, ' +
      'their indexes, and chat history. This cannot be undone. ' +
      'Continue?'
    )
    if (!confirmed) return

    setClearing(true)
    try {
      await clearStorage()
      alert('All storage cleared successfully!')
    } catch (e) {
      alert('Failed to clear storage. Please try again.')
    } finally {
      setClearing(false)
    }
  }

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

          <Button onClick={handleSave} disabled={saving} className="w-full mt-2">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </SettingsCard>

      {/* Storage & Cache */}
      <SettingsCard
        title="Storage Management"
        description="Manage your document storage settings"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Total Storage Used</span>
              <span className="font-semibold text-foreground">{storageStats.total_mb} MB / {storageStats.max_mb} MB</span>
            </div>
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div className="bg-linear-to-r from-blue-500 to-blue-600 h-full" style={{ width: `${(storageStats.total_mb / storageStats.max_mb) * 100}%` }} />
            </div>
          </div>

          <div className="grid gap-3 grid-cols-2 text-sm">
            <div className="rounded bg-background p-3">
              <p className="text-muted-foreground">Documents</p>
              <p className="mt-1 font-semibold text-foreground">{storageStats.documents_mb} MB</p>
            </div>
            <div className="rounded bg-background p-3">
              <p className="text-muted-foreground">Index Storage</p>
              <p className="mt-1 font-semibold text-foreground">{storageStats.index_mb} MB</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-red-500/30 bg-red-500/10 text-red-700 hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-800 focus-visible:border-red-500/40 focus-visible:ring-red-500/20 dark:border-red-400/30 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/20 dark:hover:text-red-200"
            disabled={clearing}
            onClick={handleClearStorage}
          >
            {clearing ? 'Clearing...' : 'Clear All Storage'}
          </Button>
        </div>
      </SettingsCard>
    </div>
  )
}
