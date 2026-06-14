import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        indexed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
        processing: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200',
        error: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'indexed',
    },
  }
)

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  icon?: React.ReactNode
}

export function Badge({ variant, children, icon }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant })}>
      {icon}
      {children}
    </span>
  )
}
