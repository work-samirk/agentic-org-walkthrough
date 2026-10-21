import { useEffect, useMemo, useRef, useState } from 'react'
import { Component, type ReactNode } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bot, ChevronDown } from 'lucide-react'
import { EMBED_APPROVALS, NAV } from './data'
import { usePlatform } from './state'
import { OnboardingLayer } from './onboarding/Layer'
import { Launcher } from './onboarding/Launcher'
import { useTourTarget } from './onboarding/tour'
import { ThemeSwitch } from './ThemeSwitch'
import { cn } from '@/lib/utils'

const ROLE: Record<string, string> = { admin: 'CEO/Admin' }

function useCollapsed() {
  const [set, setSet] = useState<Set<string>>(new Set())
  const toggle = (k: string) =>
    setSet((p) => {
      const n = new Set(p)
      if (n.has(k)) n.delete(k)
      else n.add(k)
      return n
    })
  return [set, toggle, setSet] as const
}

export function Shell() {
  const { user, s } = usePlatform()
  const loc = useLocation()
  // the landing page shows real screens in a frame: no tour, no checklist, always light
  const embed = new URLSearchParams(loc.search).has('embed')
  useEffect(() => {
    if (embed) document.documentElement.dataset.mode = 'light'
  }, [embed])
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [collapsed, toggle, setCollapsed] = useCollapsed()
  const [bell, setBell] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)
  const target = useTourTarget()
  const pending = embed ? EMBED_APPROVALS.length - s.approvalsDone.length : s.pendingResolved ? 0 : 1

  // Groups open themselves when you navigate into them.
  useEffect(() => {
    const g = NAV.find((x) => x.items.some((i) => loc.pathname === i.to))
    if (g) setCollapsed((p) => (p.has(g.id) ? new Set([...p].filter((k) => k !== g.id)) : p))
  }, [loc.pathname, setCollapsed])

  useEffect(() => {
    setOpen(false)
    setBell(false)
  }, [loc.pathname])

  // on a phone the sidebar is a drawer: open it while the tour points at a menu item
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return
    setOpen(!!target && target.startsWith('nav-'))
  }, [target])

  useEffect(() => {
    if (!bell) return
    const off = (e: MouseEvent) => bellRef.current && !bellRef.current.contains(e.target as Node) && setBell(false)
    document.addEventListener('mousedown', off)
    return () => document.removeEventListener('mousedown', off)
  }, [bell])

  const dashboard = NAV[0].items[0]
  const groups = useMemo(() => NAV.slice(1), [])

  const linkCls = (to: string, end?: boolean) => {
    const active = end ? loc.pathname === to : loc.pathname === to || loc.pathname.startsWith(to + '/')
    return cn(
      'interactive-surface flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150',
      active
        ? 'bg-linear-to-r from-primary via-primary to-accent font-medium text-primary-foreground shadow-sm shadow-primary/25'
        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
    )
  }

  const sidebar = (
    <>
      <div className="mb-5 flex items-center gap-2.5 px-1">
        <div className="animate-pulse-soft flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary via-primary/90 to-accent text-primary-foreground shadow-sm shadow-primary/30">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <span className="block bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-base font-bold tracking-tight text-transparent">AgenticOrg</span>
          <span className="-mt-1 block text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Enterprise Fleet</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        <Link to={dashboard.to} data-tour={`nav-${dashboard.id}`} className={cn(linkCls(dashboard.to, true), 'mb-1')} aria-current={loc.pathname === dashboard.to ? 'page' : undefined}>
          <dashboard.icon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{dashboard.label}</span>
        </Link>
        {groups.map((g, gi) => {
          const isClosed = collapsed.has(g.id)
          return (
            <div key={g.id} className={gi > 0 ? 'mt-3 border-t border-border/60 pt-3' : 'mt-3'}>
              <button
                type="button"
                aria-expanded={!isClosed}
                onClick={() => toggle(g.id)}
                className="interactive-surface flex w-full items-center justify-between px-3 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase hover:text-foreground"
              >
                <span>{g.label}</span>
                <ChevronDown className={cn('h-3 w-3 transition-transform duration-200 ease-out-quart', isClosed && '-rotate-90')} />
              </button>
              <div className={cn('nav-accordion-content', !isClosed && 'expanded')}>
                <div className="nav-accordion-inner">
                  {g.items.map((it) => (
                    <Link key={it.id} to={it.to} data-tour={`nav-${it.id}`} aria-current={loc.pathname === it.to ? 'page' : undefined} className={linkCls(it.to)}>
                      <it.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </nav>
      <div className="mt-3 border-t pt-3">
        <div className="mb-2 px-3 py-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{ROLE.admin} | No domain assigned</span>
        </div>
        <button onClick={() => nav('/login')} className="w-full rounded px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Logout</button>
      </div>
    </>
  )

  return (
    <div className="plat fixed inset-0 flex overflow-hidden">
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className="hidden w-64 flex-shrink-0 flex-col border-r bg-linear-to-b from-muted/60 to-muted/10 p-4 lg:flex">{sidebar}</aside>
      <aside className={cn('fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r bg-background p-4 transition-transform duration-200 ease-in-out lg:hidden', open ? 'translate-x-0' : '-translate-x-full')}>
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 flex-shrink-0 items-center justify-between gap-2 border-b bg-card/85 px-3 shadow-[0_1px_0_0_rgb(15_23_42/0.03)] backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3">
            <button onClick={() => setOpen(true)} className="flex-shrink-0 rounded p-1.5 hover:bg-muted lg:hidden" aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <span className="max-w-[100px] truncate text-sm font-medium text-foreground/80 sm:max-w-[160px]">{user.org}</span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
            <div className="relative min-w-0">
              <svg className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="text" aria-label="Ask anything" placeholder="Ask anything... (⌘K)" className={`h-9 w-28 min-w-0 rounded-lg border pr-3 pl-8 text-sm transition-[width] duration-200 ${embed ? 'border-slate-200 bg-white text-slate-800 shadow-sm placeholder:text-slate-400' : 'border-slate-700 bg-slate-800/50 text-slate-200 placeholder:text-slate-500'} focus:ring-1 focus:ring-primary focus:outline-none sm:w-44 md:w-64 lg:w-96`} />
            </div>
            {!embed && <Launcher />}
            <select aria-label="Select language" defaultValue="en" className="interactive-surface relative z-50 hidden h-8 flex-shrink-0 rounded border bg-background px-1.5 text-sm focus:ring-1 focus:ring-primary focus:outline-none sm:block sm:px-2">
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>
            <ThemeSwitch />
            <div className="relative flex-shrink-0" ref={bellRef}>
              <button onClick={() => setBell((b) => !b)} className="group relative cursor-pointer rounded-lg p-2 transition-colors hover:bg-muted" aria-label={`Notifications${pending ? ` (${pending} pending)` : ''}`} aria-expanded={bell}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:animate-bell-chime"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                {pending > 0 && <span className="animate-pulse-soft absolute -top-0.5 -right-0.5 flex h-4 min-w-[1.125rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-sm shadow-destructive/30">{pending}</span>}
              </button>
              {bell && (
                <div className="animate-fade-slide-up absolute top-full right-0 z-[60] mt-2 w-80 rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-xl">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    {pending > 0 && <span className="text-xs text-muted-foreground">{pending} pending</span>}
                  </div>
                  <div className="border-b px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push Notifications</span>
                      <button className="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full border border-border bg-muted transition-colors" role="switch" aria-checked="false" aria-label="Push notifications">
                        <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-primary-foreground shadow-sm transition-transform" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Enable to get instant approval alerts</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {pending === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">No pending approvals</div>
                    ) : (
                      <Link to="/app" className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/70">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">Refund of ₹4,200 to a customer</p>
                          <p className="text-xs text-muted-foreground">Sample, waiting for you</p>
                        </div>
                      </Link>
                    )}
                  </div>
                  <div className="border-t px-4 py-2.5 text-center"><Link to="/app/approvals" className="text-sm font-medium text-primary hover:underline">View all</Link></div>
                </div>
              )}
            </div>
            {pending > 0 && (
              <button onClick={() => nav('/app')} className="relative hidden animate-pulse items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 sm:inline-flex" aria-label={`${pending} pending approvals`}>
                {pending} pending
              </button>
            )}
          </div>
        </header>
        <main id="main-content" key={loc.pathname} className="animate-page-enter min-h-0 flex-1 overflow-auto p-4 sm:p-6" role="main" tabIndex={-1}>
          <Boundary key={loc.pathname}><Outlet /></Boundary>
        </main>
      </div>
      {!embed && <OnboardingLayer />}
    </div>
  )
}

class Boundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() {
    if (!this.state.err) return this.props.children
    return (
      <div className="p-8 text-sm">
        <p className="font-semibold">This page hit a problem.</p>
        <button className="mt-3 underline" onClick={() => { sessionStorage.removeItem('ao-platform-v2'); location.reload() }}>Reset and reload</button>
      </div>
    )
  }
}
