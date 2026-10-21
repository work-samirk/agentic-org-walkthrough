import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Icon } from '../components/Icon'
import { reduced } from './config'

gsap.registerPlugin(ScrollTrigger)

// scroll progress 0..1 of a section, as state. Static (1) when motion is reduced.
function useProgress(ref: React.RefObject<HTMLElement | null>, start = 'top 75%', end = 'bottom 55%') {
  const [p, setP] = useState(reduced() ? 1 : 0)
  useLayoutEffect(() => {
    if (!ref.current || reduced()) return
    const st = ScrollTrigger.create({ trigger: ref.current, start, end, scrub: true, onUpdate: (s) => setP(s.progress) })
    return () => st.kill()
  }, [ref, start, end])
  return p
}

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

export { Relay } from './Gates'

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
  const p = useProgress(ref, 'top 70%', 'bottom 70%')
  const idx = Math.min(2, Math.floor(p * 3))
  return (
    <section id="autonomy" className="lp-sec lp-dark lp-ladder-sec" ref={ref} aria-labelledby="lp-h-lad">
      <div className="lp-wrap">
        <div className="lp-head">
          <h2 id="lp-h-lad">Freedom is earned, one step at a time.</h2>
          <p className="lp-lead">You decide how far each agent goes. The Kill Switch is always one click away.</p>
        </div>
        <div className="lp-ladder">
          {RUNGS.map((r, i) => (
            <div key={r.n} className="lp-rung" data-on={i <= idx ? '' : undefined} style={{ ['--i' as string]: i }}>
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
          <span className="lp-ctl"><Icon name="loop" size={16} />Roll back</span>
          <span className="lp-ctl danger"><Icon name="alert" size={16} />Kill Switch</span>
        </div>
      </div>
    </section>
  )
}

/* 5. Staff the org (dark) ------------------------------------------------- */
const CSV = ['name,role,reports_to', 'Dana,VP Finance,', 'Priya,AP processor,Dana', 'Arjun,Recon agent,Dana']
const CSV_TEXT = CSV.join('\n')
const NODES = [
  { id: 'h', x: 300, y: 40, l: 'Dana', s: 'VP Finance · human', human: true },
  { id: 'a', x: 150, y: 150, l: 'Priya', s: 'AP processor · agent' },
  { id: 'b', x: 450, y: 150, l: 'Arjun', s: 'Recon agent · agent' },
  { id: 'c', x: 150, y: 260, l: 'Intern bot', s: 'Invoice intake · agent' },
  { id: 'd', x: 450, y: 260, l: 'Match bot', s: 'Matching · agent' },
]
const EDGES: [string, string][] = [['h', 'a'], ['h', 'b'], ['a', 'c'], ['b', 'd']]
// One clock drives the CSV and the chart, so they stay in step. The chart always starts from the top node.
const CHAR_MS = 60
const CYCLE = 11500
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
    c: t >= 5600,
    d: t >= 6300,
  }
  // the question climbs from Match bot to Arjun to Dana
  const rp = t >= 7200 && t < 10000 ? (t - 7200) / 2400 : -1
  const dot = rp < 0 ? null : rp < 0.45 ? [450, 260 - 110 * ease(rp / 0.45)] : [450 - 150 * ease((rp - 0.45) / 0.55), 150 - 110 * ease((rp - 0.45) / 0.55)]
  const glow = rp >= 1 || (t >= 9600 && t < 10000)

  return (
    <section id="org" className="lp-sec lp-dark" ref={ref} aria-labelledby="lp-h-org">
      <div className="lp-wrap lp-split">
        <div className="lp-copy">
          <h2 id="lp-h-org">Drop in your org chart. Get a staffed team.</h2>
          <p className="lp-lead">Agents match your hierarchy. When one is unsure, the question climbs to its manager, then the domain head, then a person.</p>
          <pre className="lp-csv" aria-label="Sample CSV">{CSV_TEXT.slice(0, typed)}<span className="lp-caret" /></pre>
        </div>
        <div className="lp-org">
          <svg viewBox="0 0 600 320" role="img" aria-label="An org chart where a question escalates from an agent up to a person">
            {EDGES.map(([a, b]) => (
              <line key={a + b} className="lp-edge" pathLength={1} x1={node(a).x} y1={node(a).y + 22} x2={node(b).x} y2={node(b).y - 22}
                style={{ strokeDasharray: 1, strokeDashoffset: on[b] ? 0 : 1, transition: 'stroke-dashoffset .7s ease' }} />
            ))}
            {NODES.map((n) => (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                <g className="lp-node" style={{ opacity: on[n.id] ? 1 : 0, transform: `scale(${on[n.id] ? (n.id === 'h' && glow ? 1.08 : 1) : 0.7})`, transformBox: 'fill-box', transformOrigin: 'center', transition: 'opacity .5s, transform .5s cubic-bezier(.3,1.4,.5,1)' }}>
                  <rect x="-78" y="-26" width="156" height="52" rx="16" className={n.human ? 'human' : ''} />
                  <text y="-3" textAnchor="middle" className="n">{n.l}</text>
                  <text y="14" textAnchor="middle" className="s">{n.s}</text>
                </g>
              </g>
            ))}
            {dot && <circle className="lp-ripple-dot" cx={dot[0]} cy={dot[1]} r="7" />}
          </svg>
        </div>
      </div>
    </section>
  )
}
