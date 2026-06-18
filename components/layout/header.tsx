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

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    if (newTheme === 'system') {
      document.documentElement.classList.remove('dark')
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
                JD
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
              <DropdownMenuItem className="cursor-pointer gap-2">
                <span>About DocuMind</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <span>View GitHub Repository</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
