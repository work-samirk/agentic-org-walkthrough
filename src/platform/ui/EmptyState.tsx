import type { ComponentType } from 'react'
import { Button } from './primitives'
import { cn } from '@/lib/utils'

export function EmptyState({ title, description, illustration = 'general', action, className }: { title: string; description?: string; illustration?: 'agents' | 'approvals' | 'search' | 'general'; action?: { label: string; onClick: () => void; icon?: ComponentType<{ className?: string }> }; className?: string }) {
  return (
    <div className={cn('relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-linear-to-b from-card/80 to-card/40 p-8 text-center backdrop-blur-sm sm:p-12', className)}>
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
      <div className="animate-float relative mb-6" aria-hidden="true">
        {illustration === 'agents' && (
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="animate-pulse-soft absolute inset-0 rounded-full border border-primary/20" />
            <svg className="h-16 w-16 text-primary drop-shadow-[0_4px_12px_hsl(var(--primary)/0.25)]" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="10" r="3" fill="currentColor" /><line x1="32" y1="13" x2="32" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="14" y="20" width="36" height="28" rx="8" stroke="currentColor" strokeWidth="2.5" fill="hsl(var(--card))" />
              <rect x="8" y="28" width="6" height="12" rx="3" fill="currentColor" opacity="0.6" /><rect x="50" y="28" width="6" height="12" rx="3" fill="currentColor" opacity="0.6" />
              <circle cx="25" cy="32" r="3.5" fill="currentColor" /><circle cx="39" cy="32" r="3.5" fill="currentColor" />
              <circle cx="26" cy="31" r="1" fill="hsl(var(--card))" /><circle cx="40" cy="31" r="1" fill="hsl(var(--card))" />
              <path d="M24 41C26.5 43 37.5 43 40 41" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M26 48V52H38V48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 58C18 54 24 53 32 53C40 53 46 54 48 58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
        {illustration === 'approvals' && (
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="animate-pulse-soft absolute inset-0 rotate-6 rounded-2xl border border-primary/20" />
            <svg className="h-16 w-16 text-primary drop-shadow-[0_4px_12px_hsl(var(--primary)/0.25)]" viewBox="0 0 64 64" fill="none">
              <rect x="16" y="14" width="32" height="42" rx="6" stroke="currentColor" strokeWidth="2.5" fill="hsl(var(--card))" />
              <rect x="24" y="10" width="16" height="8" rx="3" stroke="currentColor" strokeWidth="2" fill="hsl(var(--muted))" />
              <line x1="24" y1="26" x2="40" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" /><line x1="24" y1="33" x2="36" y2="33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              <circle cx="42" cy="44" r="10" fill="hsl(var(--primary))" /><path d="M38 44L41 47L47 41" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {(illustration === 'general' || illustration === 'search') && (
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="animate-pulse-soft absolute inset-0 rounded-full border border-primary/20" />
            <svg className="h-16 w-16 text-primary drop-shadow-[0_4px_12px_hsl(var(--primary)/0.25)]" viewBox="0 0 64 64" fill="none">
              <path d="M32 8L50 18V38L32 48L14 38V18L32 8Z" stroke="currentColor" strokeWidth="2.5" fill="hsl(var(--card))" /><path d="M32 8V48" stroke="currentColor" strokeWidth="1.5" opacity="0.5" /><path d="M14 18L32 28L50 18" stroke="currentColor" strokeWidth="2" opacity="0.7" /><circle cx="32" cy="28" r="4" fill="hsl(var(--primary))" />
            </svg>
          </div>
        )}
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">{description}</p>}
      {action && (
        <div className="mt-5">
          <Button onClick={action.onClick} size="sm" className="gap-2">{action.icon && <action.icon className="h-4 w-4" />}{action.label}</Button>
        </div>
      )}
    </div>
  )
}
