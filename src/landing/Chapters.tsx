import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { reduced } from './config'

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.35 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref])
  return seen
}

/* 4. Earn autonomy -------------------------------------------------------- */
const RUNGS = [
  { n: 'Shadow', d: 'Drafts and simulates on samples. Nothing leaves.', tag: 'Day 1', demo: 'shadow' },
  { n: 'Approve', d: 'Acts for real, but waits for a yes on each important step.', tag: 'Trusted', demo: 'approve' },
  { n: 'Auto', d: 'Works alone inside your limits and asks when unsure.', tag: 'Proven', demo: 'auto' },
]
function RungDemo({ kind }: { kind: string }) {
  if (kind === 'shadow') return <div className="lp-mini"><span className="lp-pill sky"><i />Simulated</span><p>Refund $120 on a sample order</p><small>Customer's bank: untouched</small></div>
  if (kind === 'approve') return <div className="lp-mini"><span className="lp-pill coral"><i />Your turn</span><p>Refund $120 to a customer?</p><span className="lp-btn ink sm" aria-hidden="true">Approve</span></div>
  return <div className="lp-mini"><span className="lp-pill lime"><i />Done, 93% sure</span><p>Refund $12 inside your limit</p><small>Anything above $50 still asks you</small></div>
}
export function Ladder() {
  const ref = useRef<HTMLElement>(null)
  const [idx, setIdx] = useState(0)
  // scrolling picks the level: the section stays pinned on wide screens and each third of the scroll lights the next box;
  // on narrow screens the boxes stack, so the one nearest the middle of the screen is lit
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const pick = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      if (window.matchMedia('(min-width:961px)').matches && !reduced()) {
        const span = r.height - window.innerHeight
        const p = span > 0 ? Math.min(0.999, Math.max(0, -r.top / span)) : 0
        setIdx(Math.floor(p * 3))
      } else {
        const mid = window.innerHeight / 2
        const rungs = Array.from(el.querySelectorAll('.lp-rung'))
        let best = 0, d = Infinity
        rungs.forEach((n, i) => {
          const b = n.getBoundingClientRect()
          const dist = Math.abs(b.top + b.height / 2 - mid)
          if (dist < d) { d = dist; best = i }
        })
        setIdx(r.top > 0 && r.top > mid ? 0 : best)
      }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(pick) }
    pick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf) }
  }, [])
  return (
    <section id="autonomy" className="lp-sec lp-dark lp-ladder-sec" ref={ref} aria-labelledby="lp-h-lad">
      <div className="lp-wrap lp-ladder-stick">
        <div className="lp-head">
          <h2 id="lp-h-lad">Every action is checked. You decide how far agents go.</h2>
          <p className="lp-lead">Start with tight limits and widen them as the agent proves itself. The kill switch is always one click away.</p>
        </div>
        <ol className="lp-gates3" aria-label="Every action passes three gates">
            <li><Icon name="eye" size={18} /><span><b>Confidence check</b>It acts alone only when it is sure.</span></li>
            <li><Icon name="users" size={18} /><span><b>Human approval</b>Anything that matters waits for a person.</span></li>
            <li><Icon name="lock" size={18} /><span><b>Audit trail</b>Every step is logged.</span></li>
        </ol>
        <div className="lp-ladder">
          {RUNGS.map((r, i) => (
            <div key={r.n} className="lp-rung" data-on={i <= idx ? '' : undefined} data-now={i === idx ? '' : undefined} style={{ ['--i' as string]: i }}>
              <span className="lp-tag">{r.tag}</span>
              <b>{r.n}</b>
              <p>{r.d}</p>
              <RungDemo kind={r.demo} />
              {i === idx && <span className="lp-climber" aria-hidden="true"><Icon name="spark" size={16} /></span>}
            </div>
          ))}
        </div>
        <div className="lp-controls" aria-label="Controls you always have">
          <span className="lp-ctl"><Icon name="play" size={16} />Promote</span>
          <span className="lp-ctl"><Icon name="loop" size={16} />Roll Back</span>
          <span className="lp-ctl danger"><Icon name="alert" size={16} />Kill Switch</span>
        </div>
      </div>
    </section>
  )
}

/* 5. Staff the org (dark) ------------------------------------------------- */
const CSV = ['name,role,reports_to', 'Dana,VP Finance,', 'Priya,Accounts Payable Agent,Dana', 'Arjun,Reconciliation Agent,Dana', 'Kavya,GST Compliance Agent,Dana', 'Nisha,Reporting Agent,Dana']
const CSV_TEXT = CSV.join('\n')
// one person, three agents under them, and one agent that gathers what the three produce
const NODES = [
  { id: 'h', x: 300, y: 40, l: 'Dana', s: 'VP Finance · human', human: true, c: '#b9c7ff' },
  { id: 'a', x: 100, y: 200, l: 'Priya', s: 'Accounts Payable Agent', c: '#ff7f63' },
  { id: 'b', x: 300, y: 200, l: 'Arjun', s: 'Reconciliation Agent', c: '#6db1f5' },
  { id: 'c', x: 500, y: 200, l: 'Kavya', s: 'GST Compliance Agent', c: '#9b82f5' },
  { id: 'd', x: 300, y: 360, l: 'Nisha', s: 'Reporting Agent', c: '#ffc58a' },
]
const EDGES: [string, string][] = [['h', 'a'], ['h', 'b'], ['h', 'c'], ['a', 'd'], ['b', 'd'], ['c', 'd']]
// One clock drives the CSV and the chart, so they stay in step. The chart always starts from the top node.
const CHAR_MS = 36
const CYCLE = 13000
const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x))
export function OrgChart() {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref)
  const [t, setT] = useState(reduced() ? 9000 : 0)
  const node = (id: string) => NODES.find((n) => n.id === id)!

  useEffect(() => {
    if (!seen || reduced()) return
    const start = performance.now()
    const id = window.setInterval(() => setT((performance.now() - start) % CYCLE), 50)
    return () => window.clearInterval(id)
  }, [seen])

  const typed = Math.min(CSV_TEXT.length, Math.floor(t / CHAR_MS))
  const upTo = (line: number) => CSV.slice(0, line + 1).join('\n').length
  const on: Record<string, boolean> = {
    h: true,
    a: typed >= upTo(2),
    b: typed >= upTo(3),
    c: typed >= upTo(4),
    d: typed >= upTo(5),
  }
  // the question climbs from the reporting agent through the reconciliation agent to Dana
  const rp = t >= 7400 && t < 9800 ? (t - 7400) / 2400 : -1
  const dot = rp < 0 ? null : rp < 0.45 ? [300, 360 - 160 * ease(rp / 0.45)] : [300, 200 - 160 * ease((rp - 0.45) / 0.55)]
  const glow = rp >= 1 || (t >= 9800 && t < 10200)

  return (
    <section id="org" className="lp-sec lp-dark" ref={ref} aria-labelledby="lp-h-org">
      <div className="lp-wrap lp-split">
        <div className="lp-copy">
          <h2 id="lp-h-org">Drop in your org chart. Get a staffed team.</h2>
          <p className="lp-lead">Agents match your hierarchy. When one is unsure, the question climbs to its manager, then the domain head, then a person.</p>
          <pre className="lp-csv" aria-label="Sample CSV">{CSV_TEXT.slice(0, typed)}<span className="lp-caret" /></pre>
        </div>
        <div className="lp-org">
          <svg viewBox="0 -34 600 490" role="img" aria-label="An org chart where a question escalates from an agent up to a person">
            <defs>
              {NODES.map((n) => (
                <radialGradient key={n.id} id={`og-${n.id}`} cx="50%" cy="78%" r="70%">
                  <stop offset="0" stopColor={n.c} stopOpacity=".55" />
                  <stop offset="1" stopColor={n.c} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>
            {EDGES.map(([a, b]) => (
              <line key={a + b} className="lp-edge" pathLength={1} x1={node(a).x} y1={node(a).y + 88} x2={node(b).x} y2={node(b).y - 38}
                style={{ strokeDasharray: 1, strokeDashoffset: on[b] ? 0 : 1, transition: 'stroke-dashoffset .7s ease' }} />
            ))}
            {dot && <circle className="lp-ripple-dot" cx={dot[0]} cy={dot[1]} r="7" />}
            {NODES.map((n) => (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                <g className="lp-node" style={{ opacity: on[n.id] ? 1 : 0, transform: `scale(${on[n.id] ? (n.id === 'h' && glow ? 1.08 : 1) : 0.7})`, transformBox: 'fill-box', transformOrigin: 'center', transition: 'opacity .5s, transform .5s cubic-bezier(.3,1.4,.5,1)' }}>
                  <g aria-hidden="true">
                    <circle r="30" fill="#07080c" />
                    <circle r="30" fill={`url(#og-${n.id})`} />
                    <path d="M-27 5 C-14 -6 -3 9 10 0 S22 -5 27 -2" fill="none" stroke="#fff6e8" strokeWidth="3" strokeLinecap="round" opacity=".95" />
                    <path d="M-27 5 C-14 -6 -3 9 10 0 S22 -5 27 -2" fill="none" stroke={n.c} strokeWidth="7" strokeLinecap="round" opacity=".35" />
                    <circle r="29.3" fill="none" stroke={n.c} strokeWidth="1.6" opacity=".85" />
                  </g>
                  <text y="56" textAnchor="middle" className="n">{n.l}</text>
                  <text y="74" textAnchor="middle" className="s">{n.s}</text>
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}
