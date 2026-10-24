import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react'
import { usePlatform } from '../state'
import { buildTour, TOUR_ITEMS, TOUR_STOPS, type Step } from './tour'

type Box = { x: number; y: number; w: number; h: number }
const PAD = 8
const TIP_W = 330

const overlap = (a: Box, b: Box) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))

// the first element with this tour id that is actually on screen (the sidebar exists twice)
function findEl(id: string): Element | null {
  for (const el of document.querySelectorAll(`[data-tour="${id}"]`)) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 || r.height > 0) return el
  }
  return null
}

function elBox(id: string): Box | null {
  const el = findEl(id)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
}

// Choose where the tip card goes: never on top of the thing the person must click,
// as little as possible on top of the lit area, and near it.
function place(target: Box, clickable: Box, h: number, side: Step['side']): { x: number; y: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const m = 16
  const t = { x: target.x - PAD, y: target.y - PAD, w: target.w + PAD * 2, h: target.h + PAD * 2 }
  const cands: { x: number; y: number; pref: number }[] = [
    { x: t.x + t.w + 14, y: t.y, pref: side === 'right' ? 0 : 2 },
    { x: t.x - TIP_W - 14, y: t.y, pref: 3 },
    { x: t.x, y: t.y + t.h + 14, pref: side === 'bottom' ? 0 : 2 },
    { x: t.x, y: t.y - h - 14, pref: side === 'top' ? 0 : 2 },
    { x: vw - TIP_W - m, y: vh - h - m, pref: side === 'dock' ? 0 : 4 },
    { x: m, y: vh - h - m, pref: 4 },
    { x: vw - TIP_W - m, y: 80, pref: 5 },
    { x: (vw - TIP_W) / 2, y: vh - h - m, pref: 5 },
  ]
  let best = { x: m, y: m }
  let bestScore = Infinity
  for (const c of cands) {
    const x = Math.min(Math.max(c.x, m), vw - TIP_W - m)
    const y = Math.min(Math.max(c.y, m), vh - h - m)
    const box = { x, y, w: TIP_W, h }
    const score = overlap(box, clickable) * 1000 + overlap(box, t) * 4 + c.pref * 500 + Math.hypot(x - t.x, y - t.y) * 0.2
    if (score < bestScore) {
      bestScore = score
      best = { x, y }
    }
  }
  return best
}

const tipStyle = (p: { x: number; y: number }) => ({ left: p.x, top: p.y, width: TIP_W })

export function Spotlight({ step, total, onNext, onSkip, onPause, onSkipStep, countText, skipText, nextText }: { step: Step; index?: number; total: number; onNext: () => void; onSkip: () => void; onPause: () => void; onSkipStep: () => void; countText?: string; skipText?: string; nextText?: string }) {
  const [box, setBox] = useState<Box | null>(null)
  const [click, setClick] = useState<Box | null>(null)
  const [missing, setMissing] = useState(false)
  const [late, setLate] = useState(false)
  const tipRef = useRef<HTMLDivElement>(null)
  const [tipH, setTipH] = useState(190)
  const scrolled = useRef('')
  const firstSeen = useRef(performance.now())

  useEffect(() => {
    firstSeen.current = performance.now()
    scrolled.current = ''
    const reset = window.setTimeout(() => {
      setMissing(false)
      setBox(null)
      setLate(false)
    }, 0)
    const t = window.setTimeout(() => setLate(true), 400)
    return () => {
      window.clearTimeout(reset)
      window.clearTimeout(t)
    }
  }, [step.id])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const b = elBox(step.target)
      if (b) {
        const el = findEl(step.target)
        if (scrolled.current !== step.id && el) {
          scrolled.current = step.id
          if (b.y < 70 || b.y + Math.min(b.h, 200) > window.innerHeight) el.scrollIntoView({ block: 'center' })
        }
        const c = elBox(step.advanceOn ?? step.target) ?? b
        setBox((p) => (p && Math.abs(p.x - b.x) < 0.5 && Math.abs(p.y - b.y) < 0.5 && Math.abs(p.w - b.w) < 0.5 && Math.abs(p.h - b.h) < 0.5 ? p : b))
        setClick((p) => (p && Math.abs(p.x - c.x) < 0.5 && Math.abs(p.y - c.y) < 0.5 && Math.abs(p.w - c.w) < 0.5 ? p : c))
        setMissing(false)
      } else {
        setBox(null)
        if (performance.now() - firstSeen.current > 7000) setMissing(true)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [step.id, step.target, step.advanceOn])

  useLayoutEffect(() => {
    if (tipRef.current) setTipH(tipRef.current.offsetHeight)
  }, [box, step.id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onPause()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onPause])

  const vw = window.innerWidth
  const vh = window.innerHeight

  const tip = (
    <div className="ob-tip" role="dialog" aria-label={step.title} aria-live="polite" ref={tipRef} style={box ? tipStyle(place(box, click ?? box, tipH, step.side)) : { left: '50%', bottom: 24, transform: 'translateX(-50%)', width: TIP_W }}>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
      {missing && <p className="ob-miss">Still waiting for this part of the screen. You can skip this step.</p>}
      <div className="ob-tip-foot">
        <span className="ob-count">{countText ?? `Stop ${step.stop + 1} of ${total}`}</span>
        <button type="button" className="ob-link" onClick={onSkip}>{skipText ?? 'Skip tour'}</button>
        {missing && <button type="button" className="ob-ghost" onClick={onSkipStep}>Skip step</button>}
        {step.advance === 'next' && <button type="button" className="ob-primary" onClick={onNext}>{nextText ?? 'Next'}</button>}
      </div>
    </div>
  )

  if (!box) return <div className="ob-layer">{missing || late ? tip : null}</div>

  const hole = { x: box.x - PAD, y: box.y - PAD, w: box.w + PAD * 2, h: box.h + PAD * 2 }
  return (
    <div className="ob-layer">
      <div className="ob-dim" style={{ left: 0, top: 0, width: vw, height: Math.max(0, hole.y) }} onMouseDown={onPause} />
      <div className="ob-dim" style={{ left: 0, top: hole.y + hole.h, width: vw, height: Math.max(0, vh - hole.y - hole.h) }} onMouseDown={onPause} />
      <div className="ob-dim" style={{ left: 0, top: hole.y, width: Math.max(0, hole.x), height: hole.h }} onMouseDown={onPause} />
      <div className="ob-dim" style={{ left: hole.x + hole.w, top: hole.y, width: Math.max(0, vw - hole.x - hole.w), height: hole.h }} onMouseDown={onPause} />
      <div className={`ob-ring${step.advance === 'click' ? ' pulse' : ''}`} style={{ left: hole.x, top: hole.y, width: hole.w, height: hole.h }} />
      {tip}
    </div>
  )
}

// the checklist is the tour: one item per stop
const ITEMS: { key: string; label: string; to: string | null }[] = [...TOUR_ITEMS]

function ChecklistCard({ compact }: { compact?: boolean }) {
  const { s, set } = usePlatform()
  // while the tour is running the box stays a small pill; it opens again when the tour is paused or done
  const open = s.checklistOpen && !compact
  const done = ITEMS.filter((i) => s.checklist[i.key]).length
  const { pathname } = useLocation()
  const last = useRef(pathname)
  // open on arrival, tuck away as soon as the person moves to another page
  useEffect(() => {
    if (last.current === pathname) return
    last.current = pathname
    set({ checklistOpen: false })
  }, [pathname, set])
  const complete = done === ITEMS.length
  // once everything is ticked, show "You are all set" for a moment, then close it
  useEffect(() => {
    if (!complete) return
    const t = window.setTimeout(() => set({ checklistDismissed: true }), 2500)
    return () => window.clearTimeout(t)
  }, [complete, set])
  if (s.checklistDismissed) return null
  const all = done === ITEMS.length
  return (
    <aside className="ob-check" aria-label="Getting started" data-open={open ? '' : undefined}>
      <div className="ob-check-head">
        <button type="button" className="ob-check-toggle" aria-expanded={open} disabled={compact} onClick={() => set({ checklistOpen: !s.checklistOpen })}>
          <span className="ob-ring-mini" style={{ ['--p' as string]: done / ITEMS.length }}><b>{done}/{ITEMS.length}</b></span>
          <span className="t">{all ? 'You are all set' : 'Getting started'}</span>
        </button>
        {!compact && (
          <div className="ob-check-ctl">
            <button type="button" aria-label={open ? 'Collapse checklist' : 'Expand checklist'} onClick={() => set({ checklistOpen: !s.checklistOpen })}>{open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}</button>
            <button type="button" aria-label="Dismiss checklist" onClick={() => set({ checklistDismissed: true })}><X size={16} /></button>
          </div>
        )}
      </div>
      {open && (
        <ul>
          {ITEMS.map((i, n) => {
            const ok = s.checklist[i.key]
            const inner = (
              <>
                <span className="tick" data-ok={ok ? '' : undefined}>{ok ? <Check size={12} strokeWidth={3} /> : n + 1}</span>
                <span>{i.label}</span>
              </>
            )
            const stop = TOUR_ITEMS.findIndex((t) => t.key === i.key)
            if (stop >= 0 && !ok) return <li key={i.key}><button type="button" onClick={() => set({ tour: { status: 'active', step: stop } })}>{inner}</button></li>
            return <li key={i.key}>{i.to && !ok ? <Link to={i.to}>{inner}</Link> : <div>{inner}</div>}</li>
          })}
        </ul>
      )}
    </aside>
  )
}

export function OnboardingLayer() {
  const { s, set, tick } = usePlatform()
  const steps = useMemo(() => buildTour(), [])
  const [finished, setFinished] = useState(false)
  const nav = useNavigate()
  const { pathname } = useLocation()
  const live = useRef({ s, steps })
  live.current = { s, steps }
  const prev = useRef(s.tour.status)

  const advance = useCallback(() => {
    const { s: cur, steps: st } = live.current
    if (cur.tour.status !== 'active') return
    const cs = st[cur.tour.step]
    if (cs?.key) tick(cs.key)
    const next = cur.tour.step + 1
    if (next >= st.length) set({ tour: { status: 'completed', step: 0 }, checklistOpen: true })
    else set({ tour: { status: 'active', step: next } })
  }, [set, tick])

  // clicking the lit item (or the control it names) moves the tour on
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const { s: cur, steps: st } = live.current
      if (cur.tour.status !== 'active') return
      const cs = st[cur.tour.step]
      if (!cs || cs.advance !== 'click') return
      const hit = [...document.querySelectorAll(`[data-tour="${cs.advanceOn ?? cs.target}"]`)].find((el) => e.target instanceof Node && el.contains(e.target))
      if (hit) {
        if ((hit as HTMLButtonElement).disabled) return
        window.setTimeout(advance, 0)
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [advance])

  useEffect(() => {
    if (prev.current === 'active' && s.tour.status === 'completed') {
      setFinished(true)
      const t = window.setTimeout(() => setFinished(false), 6000)
      return () => window.clearTimeout(t)
    }
    prev.current = s.tour.status
  }, [s.tour.status])

  const step = steps[s.tour.step]
  // each stop opens its page, so the screen behind the modal follows the tour
  useEffect(() => {
    if (s.tour.status === 'active' && step?.to && pathname !== step.to) nav(step.to)
  }, [s.tour.status, s.tour.step, step?.to, pathname, nav])
  return (
    <>
      {s.tour.status === 'active' && step && (
        <Spotlight
          step={step}
          index={s.tour.step}
          total={TOUR_STOPS}
          countText={`Step ${step.stop + 1} of ${TOUR_STOPS}`}
          onNext={advance}
          onSkip={() => set({ tour: { status: 'dismissed', step: 0 } })}
          onPause={() => set({ tour: { status: 'paused', step: s.tour.step } })}
          onSkipStep={advance}
        />
      )}
      {s.tour.status === 'paused' && (
        <div className="ob-paused" role="status">
          <span>Tour paused</span>
          <button type="button" className="ob-primary" onClick={() => set({ tour: { status: 'active', step: s.tour.step } })}>Resume</button>
          <button type="button" className="ob-link" onClick={() => set({ tour: { status: 'dismissed', step: 0 } })}>End tour</button>
        </div>
      )}
      {finished && (
        <div className="ob-paused" role="status">
          <span>Tour finished. Replay it any time from Show me around.</span>
          <button type="button" className="ob-link" onClick={() => setFinished(false)}>Close</button>
        </div>
      )}
      <ChecklistCard compact={s.tour.status === 'active'} />
    </>
  )
}
