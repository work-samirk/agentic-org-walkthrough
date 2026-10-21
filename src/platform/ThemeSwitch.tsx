import { useEffect, useState } from 'react'

// The sun and moon switch from the app header.
export function ThemeSwitch() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.mode === 'dark')

  useEffect(() => {
    const read = () => setDark(document.documentElement.dataset.mode === 'dark')
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] })
    return () => mo.disconnect()
  }, [])

  function toggle() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.mode = next
    try {
      localStorage.setItem('ao-mode', next)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="group relative flex-shrink-0">
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        onClick={toggle}
        className="theme-toggle-motion relative inline-flex h-8 w-[66px] cursor-pointer items-center overflow-hidden rounded-full border border-border/80 p-1 shadow-sm transition-[border-color,box-shadow,transform,scale] hover:border-primary/50 hover:shadow-[var(--shadow-card)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
      >
        <div className={`theme-toggle-motion absolute inset-0 bg-linear-to-r from-background via-card to-accent/25 transition-opacity ${dark ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
        <div className={`theme-toggle-motion absolute inset-0 bg-linear-to-r from-[hsl(var(--info)/0.22)] via-[hsl(var(--primary)/0.12)] to-[hsl(var(--warning)/0.25)] transition-opacity ${!dark ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
        <svg className="theme-toggle-motion pointer-events-none absolute inset-x-0 bottom-0 h-3.5 w-full opacity-40 transition-colors" viewBox="0 0 66 14" fill="none" aria-hidden="true">
          <path d="M0 14V8.5C7 6 15 9.5 24 7C32 4.5 41 8 50 6C57 4 62 7 66 6.5V14H0Z" fill="currentColor" className={dark ? 'text-[hsl(var(--card-foreground)/0.12)]' : 'text-[hsl(var(--primary)/0.15)]'} />
        </svg>
        <div className={`theme-toggle-motion pointer-events-none absolute top-1.5 left-2.5 flex gap-2 transition-[opacity,transform,translate,scale] ${dark ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-1 scale-75 opacity-0'}`} aria-hidden="true">
          <svg className="animate-twinkle h-2.5 w-2.5 text-[hsl(var(--warning))]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
          <svg className="animate-twinkle stagger-2 mt-2 h-1.5 w-1.5 text-[hsl(var(--foreground)/0.8)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
        </div>
        <div className={`theme-toggle-motion pointer-events-none absolute top-1.5 right-1.5 transition-[opacity,transform,translate,scale] ${!dark ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-2 scale-75 opacity-0'}`} aria-hidden="true">
          <svg className="h-3 w-5 text-[hsl(var(--card)/0.85)]" viewBox="0 0 24 14" fill="currentColor"><path d="M18.5 4.5C18.1 4.5 17.7 4.6 17.3 4.7C16.4 2 13.8 0 10.7 0C7.3 0 4.4 2.4 3.7 5.7C1.6 6.3 0 8.3 0 10.7C0 13.5 2.2 15.7 5 15.7H18.5C21 15.7 23 13.7 23 11.2C23 8.7 21 6.7 18.5 6.7" /></svg>
        </div>
        <div className={`theme-toggle-motion relative z-10 flex h-6 w-6 items-center justify-center rounded-full transition-transform ${dark ? 'translate-x-[34px]' : 'translate-x-0'}`}>
          <div className={`theme-toggle-motion absolute inset-0 flex items-center justify-center rounded-full bg-linear-to-br from-[hsl(var(--warning))] to-[hsl(var(--warning)/0.9)] text-[hsl(var(--warning-foreground))] shadow-[0_0_12px_hsl(var(--warning)/0.65)] transition-[opacity,transform,scale,rotate] ${!dark ? 'scale-100 rotate-0 opacity-100' : 'pointer-events-none scale-50 rotate-90 opacity-0'}`}>
            <svg className="animate-spin-slow h-4 w-4 text-[hsl(var(--warning-foreground)/0.9)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.5" fill="currentColor" />
              <line x1="12" y1="1" x2="12" y2="3.5" /><line x1="12" y1="20.5" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.99" y2="5.99" /><line x1="18.01" y1="18.01" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3.5" y2="12" /><line x1="20.5" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.99" y2="18.01" /><line x1="18.01" y1="5.99" x2="19.78" y2="4.22" />
            </svg>
          </div>
          <div className={`theme-toggle-motion absolute inset-0 flex items-center justify-center rounded-full bg-linear-to-br from-[hsl(var(--foreground)/0.95)] via-[hsl(var(--foreground)/0.88)] to-[hsl(var(--foreground)/0.75)] shadow-[0_0_12px_hsl(var(--primary)/0.45)] transition-[opacity,transform,scale,rotate] ${dark ? 'scale-100 rotate-0 opacity-100' : 'pointer-events-none scale-50 -rotate-90 opacity-0'}`}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="currentColor" className="text-[hsl(var(--foreground))]" />
              <circle cx="8" cy="9" r="2.2" fill="hsl(var(--muted-foreground)/0.4)" /><circle cx="15" cy="14" r="1.8" fill="hsl(var(--muted-foreground)/0.4)" /><circle cx="10" cy="16" r="1.2" fill="hsl(var(--muted-foreground)/0.4)" />
            </svg>
          </div>
        </div>
      </button>
      <span role="tooltip" className="pointer-events-none absolute top-full right-0 z-50 mt-2 translate-y-1 scale-95 rounded-md border border-border bg-popover px-2.5 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-all duration-150 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        {dark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </div>
  )
}
