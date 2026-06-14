'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SettingsCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  variant?: 'default' | 'danger'
}

export function SettingsCard({
  title,
  description,
  children,
  className,
  variant = 'default',
}: SettingsCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-6',
        variant === 'danger'
          ? 'border-destructive/20 bg-destructive/5'
          : 'border-border bg-card'
      )}
    >
      <div className="mb-6">
        <h3 className={cn('text-lg font-semibold', variant === 'danger' && 'text-destructive')}>
          {title}
        </h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className={className}>{children}</div>
    </div>
  )
}
