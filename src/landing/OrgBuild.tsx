import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { reduced } from './config'

const CSV = ['name,role,reports_to', 'Dana,VP Finance,', 'Priya,Accounts Payable Agent,Dana', 'Arjun,Reconciliation Agent,Dana', 'Kavya,GST Compliance Agent,Dana', 'Nisha,Reporting Agent,Dana']
const NODES = [
  { id: 'h', x: 320, y: 62, l: 'Dana', s: 'VP Finance · human', c: '#d7efe6', job: '' },
  { id: 'a', x: 120, y: 214, l: 'Priya', s: 'Accounts Payable Agent', c: '#36cc8b', job: 'Paying 12 approved invoices' },
  { id: 'b', x: 320, y: 214, l: 'Arjun', s: 'Reconciliation Agent', c: '#86dd70', job: 'Matching 847 transactions' },
  { id: 'c', x: 520, y: 214, l: 'Kavya', s: 'GST Compliance Agent', c: '#7fd6c2', job: 'Filing returns for May' },
  { id: 'd', x: 320, y: 412, l: 'Nisha', s: 'Reporting Agent', c: '#d0f255', job: 'Building the board pack' },
] as const
// elbow connectors, drawn top to bottom
const EDGES = [
  { to: 'a', d: 'M320 148 V158 H120 V176' },
  { to: 'b', d: 'M320 148 V176' },
  { to: 'c', d: 'M320 148 V158 H520 V176' },
  { to: 'd', d: 'M120 334 V354 H320 V374' },
  { to: 'd', d: 'M320 334 V374' },
  { to: 'd', d: 'M520 334 V354 H320' },
] as const
const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x))
const clamp = (x: number) => Math.min(1, Math.max(0, x))

function Orb({ n, shown, glow, lift }: { n: (typeof NODES)[number]; shown: number; glow?: boolean; lift?: number }) {
  return (
    <g transform={`translate(${n.x} ${n.y})`}>
      <g style={{ opacity: shown, transform: `scale(${0.6 + 0.4 * shown * (glow ? 1.06 : 1)}) translateY(${(lift ?? 0) * (1 - shown)}px)`, transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle r="34" fill={n.c} opacity={glow ? 0.28 : 0.1} style={{ filter: 'blur(10px)' }} />
        <circle r="30" fill="#07100e" />
        <circle r="30" fill={`url(#o-${n.id})`} />
        <path d="M-27 4 C-14 -7 -3 9 10 0 S22 -5 27 -2" fill="none" stroke="#f4fff9" strokeWidth="3" strokeLinecap="round" opacity=".95" />
        <path d="M-27 4 C-14 -7 -3 9 10 0 S22 -5 27 -2" fill="none" stroke={n.c} strokeWidth="7" strokeLinecap="round" opacity=".35" />
        <circle r="29.3" fill="none" stroke={n.c} strokeWidth="1.6" opacity=".9" />
        <text y="58" textAnchor="middle" className="n">{n.l}</text>
        <text y="77" textAnchor="middle" className="s">{n.s}</text>
      </g>
    </g>
  )
}

function Defs() {
  return (
    <defs>
      {NODES.map((n) => (
        <radialGradient key={n.id} id={`o-${n.id}`} cx="50%" cy="78%" r="70%">
          <stop offset="0" stopColor={n.c} stopOpacity=".55" />
          <stop offset="1" stopColor={n.c} stopOpacity="0" />
        </radialGradient>
      ))}
      <linearGradient id="pulse" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#d0f255" />
        <stop offset="1" stopColor="#36cc8b" />
      </linearGradient>
    </defs>
  )
}

// the question climbs from the reporting agent, through the reconciliation agent, up to the person
function pulsePos(p: number): [number, number] | null {
  if (p <= 0 || p >= 1) return null
  if (p < 0.5) return [320, 374 - 160 * ease(p / 0.5)]
  return [320, 214 - 152 * ease((p - 0.5) / 0.5)]
}

function Chart({ show, edge, pulse, chip, jobs }: { show: (id: string) => number; edge: (to: string) => number; pulse: number; chip: number; jobs: number }) {
  const dot = pulsePos(pulse)
  return (
    <svg viewBox="0 0 640 530" role="img" aria-label="An org chart where a question escalates from an agent up to a person">
      <Defs />
      {EDGES.map((e) => (
        <path key={e.d} d={e.d} className="edge" style={{ strokeDasharray: 400, strokeDashoffset: 400 * (1 - edge(e.to)) }} />
      ))}
      {dot && <><circle cx={dot[0]} cy={dot[1]} r="16" className="halo" /><circle cx={dot[0]} cy={dot[1]} r="6.5" fill="url(#pulse)" /></>}
      {NODES.map((n) => <Orb key={n.id} n={n} shown={show(n.id)} glow={n.id === 'h' && chip > 0} lift={n.id === 'h' ? -10 : 14} />)}
      {NODES.filter((n) => n.job).map((n) => (
        <g key={n.id} style={{ opacity: jobs }} transform={`translate(${n.x} ${n.y + 98})`}>
          <rect x="-86" y="-14" width="172" height="26" rx="13" className="job" />
          <circle cx="-70" cy="-1" r="3.4" fill="#36cc8b" />
          <text x="-60" y="3.5" className="jt">{n.job}</text>
        </g>
      ))}
      <g style={{ opacity: chip, transform: `translateY(${(1 - chip) * 6}px)` }}>
        <rect x="372" y="44" width="150" height="36" rx="18" className="chip" />
        <circle cx="392" cy="62" r="4.5" fill="#d0f255" />
        <text x="404" y="67" className="ct">Needs approval</text>
      </g>
    </svg>
  )
}


const CYC = 12000
const SCAN = 650
const START = 1000

export function OrgChart() {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)
  const [t, setT] = useState(reduced() ? 9500 : 0)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!seen || reduced()) return
    const s = performance.now()
    const id = window.setInterval(() => setT((performance.now() - s) % CYC), 33)
    return () => window.clearInterval(id)
  }, [seen])

  // the file is shown first, then each row is read in turn and its person appears on the chart
  const read = t < START ? -1 : Math.min(6, Math.floor((t - START) / SCAN))
  const order: Record<string, number> = { h: 1, a: 2, b: 3, c: 4, d: 5 }
  const sh = (id: string) => (read >= order[id] ? 1 : 0)
  const fade = t > CYC - 700 ? clamp((CYC - t) / 700) : 1
  const pulse = t >= 6300 ? (t - 6300) / 2200 : -1
  const chip = ease(clamp((t - 8500) / 400))
  const fileIn = ease(clamp(t / 700))
  return (
    <section id="org" className="lp-sec lp-dark og" ref={ref} aria-labelledby="lp-h-org">
      <div className="lp-wrap og-grid">
        <div className="og-copy">
          <h2 id="lp-h-org">Drop in your org chart. Get a staffed team.</h2>
          <p className="lp-lead">Agents match your hierarchy. When one is unsure, the question climbs to its manager, then the domain head, then a person.</p>
          <div className="og-file" style={{ opacity: fileIn, transform: `translateY(${(1 - fileIn) * 14}px)` }} aria-label="Sample CSV file">
            <div className="og-file-head"><Icon name="layers" size={16} /><b>org.csv</b><span>{read >= 6 ? "5 people read" : "5 rows"}</span></div>
            <ol>
              {CSV.map((l, i) => (
                <li key={l} data-now={i === read ? '' : undefined} data-done={i < read || (i === 0 && read >= 0) ? '' : undefined}>
                  <span>{l}</span>
                  {(i < read || (i === 0 && read >= 0)) && <Icon name="check" size={14} strokeWidth={3} />}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="og-card" style={{ opacity: fade }}>
          {read < 1 && <p className="og-wait">Waiting for org.csv</p>}
          <Chart show={sh} edge={(to) => (read >= order[to] ? 1 : 0)} pulse={pulse} chip={chip} jobs={ease(clamp((t - 5000) / 600))} />
          <p className="og-strip" style={{ opacity: ease(clamp((t - 5100) / 600)) }}><i />5 agents staffed · 1 person approves</p>
        </div>
      </div>
    </section>
  )
}
