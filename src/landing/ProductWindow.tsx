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
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: '300px' })
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
  { id: 'Agent fleet', path: '/app/agents?embed=1' },
  { id: 'Create agent', path: '/app/agents/new?embed=1' },
  { id: 'Live observatory', path: '/app?embed=1' },
  { id: 'Approvals', path: '/app/approvals?embed=1' },
] as const

export function ProductTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0])
  const [loaded, setLoaded] = useState(0)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const token = useRef(0)
  const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!root.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  // play the script for this screen once it has loaded and is on screen, then move on to the next one
  useEffect(() => {
    const t = ++token.current
    const f = frame.current
    const cur = cursor.current
    if (!loaded || !visible || !motion || !f || !cur) {
      if (cur) hide({ cursor: cur })
      return
    }
    const doc = f.contentDocument
    const win = f.contentWindow as (Window & typeof globalThis) | null
    if (!doc || !win) return
    const ctx: Ctx = { doc, win, frame: f, cursor: cur, alive: () => token.current === t }
    ;(async () => {
      try {
        await sleep(ctx, 600)
        await show(ctx)
        await SCRIPTS[tab.id](ctx)
        await sleep(ctx, 700)
        hide(ctx)
        await sleep(ctx, 400)
        setTab((c) => TABS[(TABS.findIndex((x) => x.id === c.id) + 1) % TABS.length])
      } catch (e) {
        if (!isAbort(e)) setTab((c) => TABS[(TABS.findIndex((x) => x.id === c.id) + 1) % TABS.length])
      }
    })()
    return () => {
      token.current++
      hide(ctx)
    }
  }, [tab, loaded, visible, motion])

  return (
    <div ref={root}>
      <div className="cl-tabs" role="tablist" aria-label="Product screens">
        {TABS.map((t) => <button key={t.id} type="button" role="tab" aria-selected={tab.id === t.id} className="lp-chip" aria-pressed={tab.id === t.id} onClick={() => { setLoaded(0); setTab(t) }}>{t.id}</button>)}
      </div>
      <div role="tabpanel">
        <ProductWindow key={tab.id} title={tab.id} path={tab.path} frameRef={frame} onReady={() => setLoaded((n) => n + 1)}>
          <div className="lp-cur" ref={cursor} aria-hidden="true">
            <i />
            <svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 2.5l15.5 9-6.7 1.6-3.3 6.3z" fill="#fff" stroke="#16161a" strokeWidth="1.6" strokeLinejoin="round" /></svg>
          </div>
        </ProductWindow>
      </div>
    </div>
  )
}
