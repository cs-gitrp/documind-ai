'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Settings,
  ChevronDown,
  Menu,
  Sun,
  Moon,
  FileText,
  MessageSquare,
  MessageCircle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { searchEverything } from '@/lib/api'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>({ documents: [], sessions: [], messages: [] })
  const [showDropdown, setShowDropdown] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [showAbout, setShowAbout] = useState(false)
  const router = useRouter()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleSearchChange = (value: string) => {
    setQuery(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!value.trim()) {
      setResults({ documents: [], sessions: [], messages: [] })
      setShowDropdown(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      const data = await searchEverything(value)
      setResults(data)
      setShowDropdown(true)
    }, 300)
  }

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } else if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleSettingsClick = () => {
    router.push('/settings')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search bar */}
        <div ref={wrapperRef} className="relative flex flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 transition-all">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents, conversations..."
            className="border-0 bg-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => query && setShowDropdown(true)}
          />

          {showDropdown && (results.documents.length > 0 || results.sessions.length > 0 || results.messages.length > 0 || query) && (
            <div className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto rounded-lg border border-border bg-card shadow-lg z-50">
              {results.documents.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-xs font-medium uppercase text-muted-foreground">Documents</p>
                  {results.documents.map((d: any) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        router.push(`/chat?docId=${d.id}`)
                        setShowDropdown(false)
                        setQuery('')
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{d.filename}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.sessions.length > 0 && (
                <div className="border-t border-border p-2">
                  <p className="px-2 py-1 text-xs font-medium uppercase text-muted-foreground">Conversations</p>
                  {results.sessions.map((s: any) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        router.push(`/chat?sessionId=${s.id}&docId=${s.document_id}`)
                        setShowDropdown(false)
                        setQuery('')
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{s.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.messages.length > 0 && (
                <div className="border-t border-border p-2">
                  <p className="px-2 py-1 text-xs font-medium uppercase text-muted-foreground">Messages</p>
                  {results.messages.map((m: any) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        router.push(`/chat?sessionId=${m.session_id}&docId=${m.document_id}`)
                        setShowDropdown(false)
                        setQuery('')
                      }}
                      className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-2">{m.preview}</span>
                    </button>
                  ))}
                </div>
              )}

              {showDropdown && query && results.documents.length === 0 && results.sessions.length === 0 && results.messages.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              {theme === 'light' ? (
                <Sun className="h-5 w-5" />
              ) : theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 opacity-60" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-xs font-semibold uppercase">Theme</div>
              <DropdownMenuSeparator />
              <div className="space-y-1 py-1">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <div
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm hover:bg-accent"
                  >
                    {t === 'light' && <Sun className="h-4 w-4" />}
                    {t === 'dark' && <Moon className="h-4 w-4" />}
                    {t === 'system' && <Sun className="h-4 w-4 opacity-60" />}
                    <span className="capitalize">{t}</span>
                    {theme === t && <span className="ml-auto text-xs font-bold text-primary">✓</span>}
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Avatar/Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 font-semibold text-white">
                DU
              </div>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* User info */}
              <div className="px-2 py-1.5 text-sm">
                <p className="font-medium text-foreground">Demo User</p>
                <p className="text-xs text-muted-foreground">Single-user mode</p>
              </div>
              <DropdownMenuSeparator />

              {/* Menu items */}
              <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAbout(true)} className="cursor-pointer gap-2">
                <span>About DocuMind</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <span>View GitHub Repository</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {showAbout && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowAbout(false)}
        >
          <div 
            className="max-w-xl w-full max-h-[85vh] overflow-y-auto rounded-lg border border-border bg-card p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">DocuMind AI</h2>
                  <p className="text-xs text-muted-foreground">v1.0.0 — Retrieval-augmented document intelligence</p>
                </div>
              </div>
              <button onClick={() => setShowAbout(false)} aria-label="Close">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              DocuMind AI turns any PDF, DOCX, or TXT file into a searchable knowledge 
              base you can talk to. Upload a document, ask a question in plain language, 
              and get an answer grounded in the actual text — with the exact page and 
              passage it came from, every time.
            </p>

            <h3 className="text-base font-medium text-foreground mt-6 mb-2">How a question becomes an answer</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              Every upload runs through a real retrieval pipeline. The document is split 
              into overlapping chunks, each chunk is converted into a vector embedding, 
              and the vectors are stored in a dedicated FAISS index for that document. 
              When a question comes in, it's embedded the same way and matched against 
              those vectors to pull the most relevant passages — which then become the 
              only context the model is allowed to answer from.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground mb-1">Embeddings</p>
                <p className="text-sm font-medium text-foreground">sentence-transformers</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground mb-1">Vector search</p>
                <p className="text-sm font-medium text-foreground">FAISS, per-document</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground mb-1">Generation</p>
                <p className="text-sm font-medium text-foreground">Groq, streamed live</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground mb-1">Storage</p>
                <p className="text-sm font-medium text-foreground">SQLite + FAISS files</p>
              </div>
            </div>

            <h3 className="text-base font-medium text-foreground mt-6 mb-2">Built to be tuned, not just used</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              The Settings page exposes the retrieval parameters most RAG tools hide: 
              chunk size and overlap control how a document is split before embedding, 
              response temperature controls how deterministic the model's answers are, 
              and response mode switches between concise, detailed, or bullet-point styles.
            </p>

            <h3 className="text-base font-medium text-foreground mt-6 mb-2">Answers you can verify</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              Every answer ships with its sources: document name, real page number, and 
              a match score. Clicking a source opens the exact retrieved passage in a 
              preview, so the model's reasoning can be checked instead of trusted 
              blindly. The prompt is restricted to only the retrieved text, which keeps 
              answers grounded instead of invented.
            </p>

            <h3 className="text-base font-medium text-foreground mt-6 mb-2">Conversations that persist</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              Chat sessions are threaded on the backend, not the browser. Ask a 
              follow-up and it remembers the context. Switch pages and the conversation 
              is still there. Refresh entirely, and it restores itself. Every past 
              conversation is searchable and reopenable from History, exactly where 
              you left it.
            </p>

            <h3 className="text-base font-medium text-foreground mt-6 mb-2">Document telemetry, in plain view</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              Each document's metadata panel shows exactly what the pipeline produced 
              for it — page count, chunk count, file size, indexing status, and its 
              internal ID — so the processing isn't a black box.
            </p>

            <h3 className="text-base font-medium text-foreground mt-6 mb-2">One search bar, everything in it</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              Global search queries documents, conversations, and individual messages 
              at once. Every figure shown across the app — document counts, conversation 
              totals, storage used — is read live from the database, never mocked.
            </p>

            <h3 className="text-base font-medium text-foreground mt-6 mb-2">Tech stack</h3>
            <table className="w-full text-sm mb-4">
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 pr-2 text-muted-foreground w-1/3">Frontend</td>
                  <td className="py-2 text-foreground">Next.js, TypeScript, Tailwind CSS, shadcn/ui</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-2 text-muted-foreground">Backend</td>
                  <td className="py-2 text-foreground">FastAPI, SQLAlchemy, SQLite, Uvicorn</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 text-muted-foreground">AI / data</td>
                  <td className="py-2 text-foreground">FAISS, sentence-transformers, Groq, LangChain</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-base font-medium text-foreground mt-6 mb-2">Roadmap</h3>
            <ul className="text-sm leading-relaxed text-muted-foreground list-disc pl-5 mb-4 space-y-1">
              <li>Multi-user authentication</li>
              <li>Cross-document comparative chat</li>
              <li>OCR for scanned documents</li>
              <li>Shared team workspaces</li>
            </ul>

            <div className="border-t border-border mt-6 pt-4">
              <p className="text-sm text-foreground mb-1">
                Built by <span className="font-medium">Chandan Singh</span>
              </p>
              <p className="text-xs text-muted-foreground">
                An end-to-end document intelligence platform combining semantic 
                retrieval, conversational interfaces, and explainable AI in one product.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
