'use client'

import { Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface ChatInputProps {
  onSend?: (message: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({
  onSend,
  disabled,
  placeholder = 'Ask a question about your documents...',
  className,
}: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend?.(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn('border-t border-border bg-background px-4 py-4 md:px-6', className)}>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-primary focus-within:ring-2 focus-within:ring-primary">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            disabled={disabled}
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Input
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="border-0 bg-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Tip: Use Shift+Enter for a new line. Your message is private and secure.
      </p>
    </div>
  )
}
