'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, Settings, ChevronDown, Menu, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  const [searchFocus, setSearchFocus] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const router = useRouter()

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
        <div
          className={`flex flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 transition-all ${
            searchFocus ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSearchFocus(true)}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents, conversations..."
            className="border-0 bg-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            onBlur={() => setSearchFocus(false)}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notifications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative inline-flex items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-2 py-1.5 text-sm font-semibold">Workspace Activity</div>
              <DropdownMenuSeparator />
              <div className="space-y-1 py-1">
                <div className="px-2 py-3 text-sm">
                  <p className="font-medium text-foreground">Document indexed successfully</p>
                  <p className="text-xs text-muted-foreground">Neural Networks Fundamentals.pdf • 2 mins ago</p>
                </div>
                <div className="px-2 py-3 text-sm border-t border-border">
                  <p className="font-medium text-foreground">Upload completed</p>
                  <p className="text-xs text-muted-foreground">Product Roadmap Q3-Q4 2024.docx • 5 mins ago</p>
                </div>
                <div className="px-2 py-3 text-sm border-t border-border">
                  <p className="font-medium text-destructive">Processing failed</p>
                  <p className="text-xs text-muted-foreground">research-notes.txt • 15 mins ago</p>
                </div>
                <div className="px-2 py-3 text-sm border-t border-border">
                  <p className="font-medium text-foreground">Embeddings generated</p>
                  <p className="text-xs text-muted-foreground">4 documents • 1 hour ago</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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
                <p className="font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">john@documind.ai</p>
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
