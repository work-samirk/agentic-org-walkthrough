import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// The same building blocks as the real app (ui/src/components/ui), written for this prototype.

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('relative rounded-lg border border-border/80 bg-card text-card-foreground shadow-[var(--shadow-card)] transition-[box-shadow,transform,border-color] duration-200 ease-out-quart', className)} {...props} />
))
Card.displayName = 'Card'
export const CardHeader = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...p} />
export const CardTitle = ({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={cn('text-lg font-semibold tracking-tight text-foreground', className)} {...p} />
export const CardDescription = ({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={cn('text-xs text-muted-foreground', className)} {...p} />
export const CardContent = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('p-6 pt-0', className)} {...p} />
export const CardFooter = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex items-center p-6 pt-0', className)} {...p} />

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline'
export function Badge({ className, variant = 'default', pulse, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant; pulse?: boolean }) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success-foreground))] border border-[hsl(var(--success)/0.3)]',
    warning: 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning-foreground))] border border-[hsl(var(--warning)/0.3)]',
    destructive: 'bg-destructive/15 text-destructive border border-destructive/25',
    secondary: 'bg-muted text-muted-foreground border border-border',
    outline: 'border border-border text-muted-foreground',
  }
  const dots: Record<BadgeVariant, string> = {
    default: 'bg-primary', success: 'bg-[hsl(var(--success))]', warning: 'bg-[hsl(var(--warning))]', destructive: 'bg-destructive', secondary: 'bg-muted-foreground', outline: 'bg-foreground',
  }
  return (
    <div className={cn('inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150', variants[variant], className)} {...props}>
      {pulse && (
        <span className="relative mr-1.5 flex h-1.5 w-1.5 flex-shrink-0">
          <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', dots[variant])} />
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', dots[variant])} />
        </span>
      )}
      {children}
    </div>
  )
}

type BtnVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary'
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'default' | 'sm' | 'lg' | 'icon' }>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => {
    const variants: Record<BtnVariant, string> = {
      default: 'bg-linear-to-b from-primary via-primary to-[hsl(var(--primary)/0.92)] text-primary-foreground shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button-hover)] hover:brightness-105 active:brightness-95',
      destructive: 'bg-linear-to-b from-destructive via-destructive to-[hsl(var(--destructive)/0.92)] text-destructive-foreground shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button-hover)] hover:brightness-105 active:brightness-95',
      outline: 'border border-border/80 bg-card/80 text-foreground shadow-sm hover:border-primary/30 hover:bg-muted/70 hover:shadow-[var(--shadow-card)]',
      secondary: 'border border-border/50 bg-muted/80 text-foreground shadow-sm hover:bg-muted',
      ghost: 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
    }
    const sizes = { default: 'h-10 px-4 py-2 text-sm', sm: 'h-8 px-3 text-xs', lg: 'h-11 px-8 text-base', icon: 'h-9 w-9 p-0' }
    return (
      <button ref={ref} type={type} className={cn('inline-flex cursor-pointer items-center justify-center rounded-lg font-medium whitespace-nowrap transition-[background-color,border-color,box-shadow,transform,filter] duration-150 ease-out-quart hover:-translate-y-[0.5px] active:translate-y-0 active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none', variants[variant], sizes[size], className)} {...props} />
    )
  },
)
Button.displayName = 'Button'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('flex h-10 w-full rounded-lg border border-input bg-background/80 px-3.5 py-2 text-sm text-foreground shadow-[var(--shadow-input-inset)] transition-[border-color,box-shadow,background-color] duration-200 ease-out-quart placeholder:text-muted-foreground focus-visible:border-primary focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />
))
Input.displayName = 'Input'

export const Label = ({ className, ...p }: React.LabelHTMLAttributes<HTMLLabelElement>) => <label className={cn('text-sm leading-none font-medium', className)} {...p} />

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn('flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />
))
Textarea.displayName = 'Textarea'

// A native select dressed like the app's select trigger.
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <div className="relative w-full">
    <select ref={ref} className={cn('flex h-10 w-full appearance-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}>
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 opacity-50" />
  </div>
))
Select.displayName = 'Select'

export function Checkbox({ checked, onChange, id, label }: { checked: boolean; onChange: (v: boolean) => void; id?: string; label?: string }) {
  return (
    <button id={id} type="button" role="checkbox" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn('peer flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-neutral-50', checked && 'bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900')}>
      {checked && <Check className="h-4 w-4" />}
    </button>
  )
}

export function Stepper({ steps, activeStep, onStepClick, className }: { steps: string[]; activeStep: number; onStepClick?: (i: number) => void; className?: string }) {
  const pct = steps.length > 1 ? Math.min(100, Math.max(0, (activeStep / (steps.length - 1)) * 100)) : 0
  return (
    <nav aria-label="Progress" className={cn('w-full py-2', className)}>
      <div className="relative">
        <div className="absolute top-4 right-6 left-6 z-0 h-0.5 -translate-y-1/2 bg-muted" aria-hidden="true">
          <div className="duration-400 h-full bg-linear-to-r from-primary to-accent transition-all ease-out-quart" style={{ width: `${pct}%` }} />
        </div>
        <ol className="relative z-10 flex items-start justify-between">
          {steps.map((label, i) => {
            const done = i < activeStep
            const cur = i === activeStep
            const clickable = Boolean(onStepClick && i <= activeStep)
            return (
              <li key={label} className="flex flex-1 flex-col items-center text-center">
                <button type="button" disabled={!clickable} onClick={() => onStepClick?.(i)} aria-current={cur ? 'step' : undefined} className={cn('relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out-quart', clickable ? 'cursor-pointer hover:scale-105' : 'cursor-default', done && 'bg-primary text-primary-foreground shadow-sm shadow-primary/20', cur && 'animate-stepper-pop border-2 border-primary bg-background font-bold text-primary shadow-[0_0_12px_hsl(var(--primary)/0.35)] ring-4 ring-primary/20', !done && !cur && 'border border-border bg-card text-muted-foreground')}>
                  {done ? <Check className="h-4 w-4 stroke-[2.5]" /> : <span>{i + 1}</span>}
                </button>
                <div className="mt-2 px-1">
                  <p className={cn('text-xs transition-colors duration-150', cur && 'font-semibold text-primary', done && 'font-medium text-foreground', !done && !cur && 'text-muted-foreground')}>{label}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

export function Toast({ msg }: { msg: string | null }) {
  const [shown, setShown] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!msg) return
    const show = window.setTimeout(() => setShown(msg), 0)
    const hide = window.setTimeout(() => setShown(null), 2600)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [msg])
  return shown ? <div role="status" className="fixed bottom-7 left-1/2 z-[80] -translate-x-1/2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-xl">{shown.replace(/​/g, '')}</div> : null
}

export function useToast() {
  const [msg, setMsg] = React.useState<string | null>(null)
  return { msg, say: (m: string) => setMsg(m + '​'.repeat(Math.floor(Math.random() * 3))) }
}

export const initial = (s: string) => s.trim().charAt(0).toUpperCase()
