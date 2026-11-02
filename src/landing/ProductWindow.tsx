import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SCRIPTS, hide, isAbort, show, sleep, type Ctx } from './demo'

// A real screen of the product, shown read-only inside a browser frame. Same code as the demo, scaled to fit.
export function ProductWindow({ path, title, className = '', onReady, frameRef, children }: { path: string; title: string; className?: string; onReady?: () => void; frameRef?: React.RefObject<HTMLIFrameElement | null>; children?: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.6)
  const [show, setShow] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!box.current) return
    const el = box.current
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1440))
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: '1500px' })
    io.observe(el)
    return () => { ro.disconnect(); io.disconnect() }
  }, [])
  return (
    <figure className={`lp-win ${className}`}>
      <div className="lp-win-bar"><i /><i /><i /><span>app.agenticorg.ai{path.split('?')[0].replace('/app', '/dashboard')}</span><Link to={path.split('?')[0]} tabIndex={-1}>Open</Link></div>
      <div className="lp-win-view" ref={box} style={{ ['--s' as string]: scale }}>
        {show && <iframe ref={frameRef} title={title} src={path} loading="lazy" onLoad={() => { setReady(true); onReady?.() }} data-ready={ready ? '' : undefined} tabIndex={-1} aria-hidden="true" />}
        {children}
      </div>
    </figure>
  )
}

const TABS = [
  { id: 'Create agent', path: '/app/agents/new?embed=1' },
  { id: 'Live observatory', path: '/app?embed=1' },
  { id: 'Approvals', path: '/app/approvals?embed=1' },
  { id: 'Agent fleet', path: '/app/agents?embed=1' },
] as const

export function ProductTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0])
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const frames = useRef(TABS.map(() => ({ current: null as HTMLIFrameElement | null })))
  const cursors = useRef(TABS.map(() => ({ current: null as HTMLDivElement | null })))
  const token = useRef(0)
  const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const idx = TABS.findIndex((x) => x.id === tab.id)

  useEffect(() => {
    if (!root.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  // all four screens are loaded ahead of time and stacked; the script for the active one plays once it is loaded and on screen, then moves on
  useEffect(() => {
    const t = ++token.current
    const f = frames.current[idx].current
    const cur = cursors.current[idx].current
    if (!loaded[tab.id] || !visible || !motion || !f || !cur) {
      if (cur) hide({ cursor: cur })
      return
    }
    const doc = f.contentDocument
    const win = f.contentWindow as (Window & typeof globalThis) | null
    if (!doc || !win) return
    const ctx: Ctx = { doc, win, frame: f, cursor: cur, alive: () => token.current === t }
    const next = () => setTab((c) => TABS[(TABS.findIndex((x) => x.id === c.id) + 1) % TABS.length])
    ;(async () => {
      try {
        await sleep(ctx, 150)
        await show(ctx)
        await SCRIPTS[tab.id](ctx)
        await sleep(ctx, 700)
        hide(ctx)
        await sleep(ctx, 400)
        next()
      } catch (e) {
        if (!isAbort(e)) next()
      }
    })()
    return () => {
      token.current++
      hide(ctx)
    }
  }, [tab, loaded, visible, motion, idx])

  return (
    <div ref={root}>
      <div role="tabpanel" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)' }}>
        {TABS.map((t, i) => (
          <div key={t.id} style={{ gridArea: '1 / 1', minWidth: 0, opacity: i === idx ? 1 : 0, visibility: i === idx ? 'visible' : 'hidden', pointerEvents: i === idx ? 'auto' : 'none', transition: 'opacity .25s' }} aria-hidden={i === idx ? undefined : true}>
            <ProductWindow title={t.id} path={t.path} frameRef={frames.current[i]} onReady={() => setLoaded((l) => ({ ...l, [t.id]: true }))}>
              <div className="lp-cur" ref={cursors.current[i]} aria-hidden="true">
                <i />
                <svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 2.5l15.5 9-6.7 1.6-3.3 6.3z" fill="#fff" stroke="#16161a" strokeWidth="1.6" strokeLinejoin="round" /></svg>
              </div>
            </ProductWindow>
          </div>
        ))}
      </div>
      <div className="cl-tabs" role="tablist" aria-label="Product screens">
        {TABS.map((t) => <button key={t.id} type="button" role="tab" aria-selected={tab.id === t.id} className="lp-chip" aria-pressed={tab.id === t.id} onClick={() => setTab(t)}>{t.id}</button>)}
      </div>
    </div>
  )
}
