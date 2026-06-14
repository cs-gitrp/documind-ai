'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/badge'

export function ThemeSelector() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

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

  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-3">
        {(['light', 'dark', 'system'] as const).map((t) => (
          <button
            key={t}
            onClick={() => handleThemeChange(t)}
            className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
              theme === t
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {/* Preview */}
            <div className="flex h-12 w-full items-center justify-center rounded bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950">
              <div
                className={`h-6 w-6 rounded-full ${
                  t === 'light'
                    ? 'bg-white'
                    : t === 'dark'
                      ? 'bg-slate-900'
                      : 'bg-gradient-to-b from-white to-slate-900'
                }`}
              />
            </div>
            <span className="text-xs font-medium capitalize text-foreground">{t}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
