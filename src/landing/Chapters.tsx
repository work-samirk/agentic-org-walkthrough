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

/* 4. Earn trust, one step at a time: static left, cards that stack on the right ----------- */
const STEPS = [
  { n: 'Draft', tag: 'Step 1', d: 'You describe the job. The agent writes a plan and touches nothing yet.', demo: 'draft', icon: 'spark' as const, limit: 'No actions yet' },
  { n: 'Shadow', tag: 'Step 2', d: 'It runs on sample data and pretends to act. Nothing leaves.', demo: 'shadow', icon: 'eye' as const, limit: 'Simulated only' },
  { n: 'Approve', tag: 'Step 3', d: 'It acts for real, but waits for a yes on each important step.', demo: 'approve', icon: 'users' as const, limit: 'Up to $120, with your yes' },
  { n: 'Auto', tag: 'Step 4', d: 'It works alone inside your limits and asks when unsure.', demo: 'auto', icon: 'play' as const, limit: 'Up to $50 on its own' },
  { n: 'Audit and roll back', tag: 'Always on', d: 'Every step is logged. Roll back or hit the kill switch at any time.', demo: 'audit', icon: 'shield' as const, limit: 'Always yours to change' },
]
function StepDemo({ kind }: { kind: string }) {
  if (kind === 'draft') return (
    <div className="lp-mini ts-p">
      <div className="ts-p-head"><span className="lp-pill sky"><i />Plan ready</span><small>3 steps · no actions taken</small></div>
      <p>Refund customers for damaged orders</p>
      <ol className="ts-p-list">
        <li><i />Find damaged orders from the last 7 days<small>Not run</small></li>
        <li><i />Check each one against the refund policy<small>Not run</small></li>
        <li><i />Prepare the refunds for review<small>Not run</small></li>
      </ol>
    </div>
  )
  if (kind === 'shadow') return (
    <div className="lp-mini ts-p">
      <div className="ts-p-head"><span className="lp-pill sky"><i />Simulated</span><small>Sample data only</small></div>
      <p>Refund $120 on sample order #4821</p>
      <div className="ts-p-row"><span>Customer's bank</span><b>Untouched</b></div>
      <div className="ts-p-row"><span>Accuracy on 40 sample orders</span><b>97%</b></div>
      <div className="ts-p-bar"><i style={{ width: '97%' }} /></div>
    </div>
  )
  if (kind === 'approve') return (
    <div className="lp-mini ts-p">
      <div className="ts-p-head"><span className="lp-pill coral"><i />Your turn</span><small>91% sure</small></div>
      <p>Refund $120 to a customer?</p>
      <div className="ts-p-why"><b>Why</b>Item arrived damaged. Inside the refund policy.</div>
      <div className="ts-p-btns"><span className="lp-ctl" aria-hidden="true">Reject</span><span className="lp-btn ink sm" aria-hidden="true">Approve</span></div>
    </div>
  )
  if (kind === 'auto') return (
    <div className="lp-mini ts-p">
      <div className="ts-p-head"><span className="lp-pill lime"><i />Done, 93% sure</span><small>Inside your limit</small></div>
      <p>Refund $12 sent</p>
      <div className="ts-p-row"><span>Today, on its own</span><b>$36 of $50</b></div>
      <div className="ts-p-bar"><i style={{ width: '72%' }} /></div>
      <small className="ts-p-note">Anything above $50 still asks you first.</small>
    </div>
  )
  return (
    <div className="lp-mini ts-log ts-p">
      <div className="ts-p-head"><span className="lp-pill sky"><i />Every action logged</span><small>Last 3 of 214</small></div>
      <p><b>09:42</b> Refund $12 sent within policy</p>
      <p><b>09:44</b> Refund $120 approved by Dana</p>
      <p><b>09:51</b> Refund $60 paused, over the limit</p>
      <div className="ts-log-btns"><span className="lp-ctl" aria-hidden="true"><Icon name="loop" size={14} />Roll Back</span><span className="lp-ctl danger" aria-hidden="true"><Icon name="alert" size={14} />Kill Switch</span></div>
    </div>
  )
}
const STICKY = 112
const STEP_GAP = 22
export function Ladder() {
  const ref = useRef<HTMLElement>(null)
  const [idx, setIdx] = useState(0)
  // the cards pin one over another; the last one to reach its pinned place is the current step
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const pick = () => {
      raf = 0
      if (!window.matchMedia('(min-width:961px)').matches) { setIdx(0); return }
      const cards = Array.from(el.querySelectorAll<HTMLElement>('.ts-card'))
      let cur = 0
      cards.forEach((c, i) => { if (c.getBoundingClientRect().top <= STICKY + i * STEP_GAP + 8) cur = i })
      setIdx(cur)
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(pick) }
    pick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf) }
  }, [])
  return (
    <section id="autonomy" className="lp-sec lp-dark ts" ref={ref} aria-labelledby="lp-h-lad">
      <div className="lp-wrap ts-grid">
        <div className="ts-left">
          <h2 id="lp-h-lad">Every action is checked. You decide how far agents go.</h2>
          <p className="lp-lead">Start with tight limits and widen them as the agent proves itself. The kill switch is always one click away.</p>
          <ol className="ts-steps" aria-label="Steps">
            {STEPS.map((x, i) => <li key={x.n} data-on={i <= idx ? '' : undefined} data-now={i === idx ? '' : undefined}><i>{i + 1}</i>{x.n}</li>)}
          </ol>
          <p className="ts-limit" aria-live="polite"><span>What it may do</span><b>{STEPS[idx].limit}</b></p>
          <ul className="ts-gates" aria-label="Every action passes three checks">
            <li><Icon name="eye" size={16} />Confidence check</li>
            <li><Icon name="users" size={16} />Human approval</li>
            <li><Icon name="lock" size={16} />Audit trail</li>
          </ul>
        </div>
        <div className="ts-stack">
          {STEPS.map((x, i) => (
            <article key={x.n} className="ts-card" data-now={i === idx ? '' : undefined}
              style={{ ['--i' as string]: i, ['--s' as string]: i < idx ? 1 - 0.035 * (idx - i) : 1, ['--o' as string]: i < idx ? Math.max(0.5, 1 - 0.14 * (idx - i)) : 1 }}>
              <div className="ts-top"><span className="ts-ico"><Icon name={x.icon} size={18} /></span><span className="lp-tag">{x.tag}</span></div>
              <b>{x.n}</b>
              <p>{x.d}</p>
              <StepDemo kind={x.demo} />
            </article>
          ))}
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
