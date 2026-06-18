'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText,
  MessageSquare,
  History,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getDocuments, getChatSessions, getStorageStats } from '@/lib/api'

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: FileText,
    label: 'Documents',
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: MessageSquare,
    label: 'Q&A',
  },
  {
    name: 'History',
    href: '/history',
    icon: History,
    label: 'Conversations',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    label: 'Configuration',
  },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [stats, setStats] = useState({ documents: 0, conversations: 0, storageMb: 0 })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [docs, sessions, storage] = await Promise.all([
          getDocuments(),
          getChatSessions(),
          getStorageStats()
        ])
        setStats({
          documents: Array.isArray(docs) ? docs.length : 0,
          conversations: Array.isArray(sessions) ? sessions.length : 0,
          storageMb: storage?.total_mb || 0
        })
      } catch (e) {
        console.error('Failed to load sidebar stats', e)
      }
    }
    loadStats()
  }, [])

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:relative lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Close button for mobile */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-md p-1 hover:bg-sidebar-accent lg:hidden"
        aria-label="Close sidebar"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Logo */}
      <div className="border-b border-sidebar-border px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="hidden md:inline">DocuMind</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              onClick={onClose}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Stats section - now bottom aligned */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
          Quick Stats
        </p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-sidebar-foreground/70">Documents</span>
            <span className="font-semibold">{stats.documents}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sidebar-foreground/70">Conversations</span>
            <span className="font-semibold">{stats.conversations}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sidebar-foreground/70">Storage Used</span>
            <span className="font-semibold">{stats.storageMb} MB</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
