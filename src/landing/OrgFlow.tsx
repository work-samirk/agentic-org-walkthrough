import { useEffect, useRef, type CSSProperties } from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { Player, type PlayerRef } from '@remotion/player'
import { reduced } from './config'

// A virtual org at work: a goal reaches the CXO agent, it delegates to three team leads, each lead
// hands work to two virtual employees, results flow back up, and a person approves the final result.
const W = 760
const H = 740
const LOOP = 360

const CORAL = '#ff7f63'
const SKY = '#6db1f5'
const VIOLET = '#9b82f5'
const PAPER = '#f4f1ec'

type Team = { id: string; label: string; lead: string; role: string; color: string; x: number; staff: { name: string; role: string }[] }
const TEAMS: Team[] = [
  { id: 'sales', label: 'Sales', lead: 'Aarav', role: 'Sales head', color: CORAL, x: 127, staff: [{ name: 'Kavya', role: 'Lead qualifier' }, { name: 'Neil', role: 'Outreach' }] },
  { id: 'ops', label: 'Operations', lead: 'Meera', role: 'Ops head', color: SKY, x: 380, staff: [{ name: 'Dev', role: 'Ticket triage' }, { name: 'Isha', role: 'Vendor chaser' }] },
  { id: 'fin', label: 'Finance', lead: 'Rohan', role: 'Finance head', color: VIOLET, x: 633, staff: [{ name: 'Priya', role: 'AP processor' }, { name: 'Arjun', role: 'Recon agent' }] },
]

const CXO = { x: 380, y: 124, w: 310, h: 88 }
const LEAD = { y: 300, w: 226, h: 80 }
const STAFF = { y: 492, w: 112, h: 90 }
const GOAL_Y = 28

// Timeline, in frames
const T = {
  goal: 34,
  down1: (i: number) => 62 + i * 8, // CXO to lead
  down2: (i: number, w: number) => 118 + i * 8 + w * 6, // lead to employee
  work: 70,
  up1: (i: number, w: number) => T.down2(i, w) + 20 + T.work, // employee to lead
  up2: (i: number) => 262 + i * 6, // lead to CXO
  ask: 304,
  click: 330,
  fade: 346,
}

const clamp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
const ease = Easing.inOut(Easing.cubic)

type P = [number, number]
// A vertical-tangent curve between a parent's bottom and a child's top, with its point at t.
function curve(a: P, b: P) {
  const my = (a[1] + b[1]) / 2
  const d = `M${a[0]},${a[1]} C${a[0]},${my} ${b[0]},${my} ${b[0]},${b[1]}`
  const at = (t: number): P => {
    const u = 1 - t
    return [u * u * u * a[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * b[1]]
  }
  return { d, at }
}

function Packet({ pos, color, size = 5 }: { pos: P; color: string; size?: number }) {
  return (
    <g transform={`translate(${pos[0]} ${pos[1]})`}>
      <circle r={size * 3.2} fill={color} opacity={0.22} />
      <circle r={size * 1.8} fill={color} opacity={0.35} />
      <circle r={size} fill={color} />
    </g>
  )
}

function Edge({ a, b, color, draw, f, start, dur, up }: { a: P; b: P; color: string; draw: number; f: number; start: number; dur: number; up?: boolean }) {
  const c = curve(a, b)
  const t = ease(clamp(f, start, start + dur))
  const live = t > 0 && t < 1
  return (
    <g>
      <path d={c.d} pathLength={1} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth={1.5} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {live && <path d={c.d} fill="none" stroke={up ? PAPER : color} strokeWidth={2} opacity={0.5} />}
      {live && <Packet pos={c.at(up ? 1 - t : t)} color={up ? PAPER : color} />}
    </g>
  )
}

const glass: CSSProperties = {
  position: 'absolute',
  boxSizing: 'border-box',
  borderRadius: 20,
  border: '1px solid rgba(255,255,255,.16)',
  background: 'linear-gradient(180deg, rgba(255,255,255,.13), rgba(255,255,255,.04))',
  backdropFilter: 'blur(14px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.5)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.28), 0 18px 40px rgba(2,6,20,.45)',
  color: PAPER,
  fontFamily: "'Timeless Sans', system-ui, sans-serif",
}

function Status({ text, color, check }: { text: string; color: string; check?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, lineHeight: 1, padding: '4px 9px', borderRadius: 99, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)', color: PAPER, whiteSpace: 'nowrap' }}>
      {check ? (
        <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6.4l2.6 2.6L10 3.4" fill="none" stroke={PAPER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <i style={{ width: 7, height: 7, borderRadius: 9, background: color, boxShadow: `0 0 8px ${color}` }} />
      )}
      {text}
    </span>
  )
}

function Avatar({ letter, color, size }: { letter: string; color: string; size: number }) {
  return (
    <span style={{ flex: 'none', width: size, height: size, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: size * 0.46, color: '#0b1226', background: `radial-gradient(circle at 30% 25%, #fff, ${color} 62%)`, boxShadow: `0 0 18px ${color}88` }}>{letter}</span>
  )
}

function Card({ x, y, w, h, scale, children, glow, style }: { x: number; y: number; w: number; h: number; scale: number; children: React.ReactNode; glow?: string; style?: CSSProperties }) {
  return (
    <div style={{ ...glass, left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${scale})`, opacity: Math.min(1, scale * 1.4), boxShadow: `${glass.boxShadow}${glow ? `, 0 0 0 1px ${glow}55, 0 0 34px ${glow}40` : ''}`, ...style }}>{children}</div>
  )
}

const LOG: [number, string][] = [
  [T.goal + 26, 'You set a goal: prepare the Q3 board pack'],
  [T.down1(0) + 14, 'CXO agent split it across three teams'],
  [T.down2(0, 0) + 12, 'Team leads briefed six virtual employees'],
  [T.up1(2, 1) + 8, 'Every output passed its policy checks'],
  [T.up2(2) + 24, 'Leads merged the results for review'],
  [T.ask + 4, 'Waiting for your approval'],
  [T.click + 6, 'Approved by you. Saved to the audit trail'],
]

function Scene() {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = (delay: number) => spring({ frame: f - delay, fps, config: { damping: 18, stiffness: 120, mass: 0.7 } })
  const out = 1 - clamp(f, T.fade, LOOP - 2)
  const drift = Math.sin((f / LOOP) * Math.PI * 2) * 4

  const cxoEnter = enter(2)
  const cxoStatus =
    f < T.down1(0) ? { t: 'Ready', c: PAPER } : f < T.up2(0) + 22 ? { t: 'Delegating', c: CORAL } : f < T.ask ? { t: 'Merging', c: SKY } : f < T.click + 4 ? { t: 'Needs you', c: CORAL } : { t: 'Done', c: PAPER }
  const approved = f >= T.click + 4

  const logLines = LOG.filter(([t]) => f >= t)
  const shown = logLines.slice(-3)

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ transform: `perspective(1800px) rotateX(5deg) translateY(${drift}px)`, transformOrigin: '50% 40%' }}>
        {/* a soft glow under each team */}
        {TEAMS.map((t, i) => (
          <div key={t.id} style={{ position: 'absolute', left: t.x - 150, top: 250, width: 300, height: 400, borderRadius: '50%', background: `radial-gradient(closest-side, ${t.color}2e, transparent)`, opacity: enter(14 + i * 5) }} />
        ))}

        <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {/* goal to CXO */}
          <path d={`M${CXO.x},${GOAL_Y + 22} L${CXO.x},${CXO.y - CXO.h / 2}`} stroke="rgba(255,255,255,.2)" strokeWidth={1.5} strokeDasharray="4 5" opacity={clamp(f, T.goal, T.goal + 12)} />
          {TEAMS.map((t, i) => {
            const from: P = [CXO.x, CXO.y + CXO.h / 2]
            const to: P = [t.x, LEAD.y - LEAD.h / 2]
            const draw = ease(clamp(f, 12 + i * 5, 34 + i * 5))
            return (
              <g key={t.id}>
                <Edge a={from} b={to} color={t.color} draw={draw} f={f} start={T.down1(i)} dur={22} />
                <Edge a={from} b={to} color={t.color} draw={0} f={f} start={T.up2(i)} dur={22} up />
                {t.staff.map((s, w) => {
                  const sx = t.x + (w ? 60 : -60)
                  const a: P = [t.x, LEAD.y + LEAD.h / 2]
                  const b: P = [sx, STAFF.y - STAFF.h / 2]
                  return (
                    <g key={s.name}>
                      <Edge a={a} b={b} color={t.color} draw={ease(clamp(f, 26 + i * 5 + w * 3, 46 + i * 5 + w * 3))} f={f} start={T.down2(i, w)} dur={20} />
                      <Edge a={a} b={b} color={t.color} draw={0} f={f} start={T.up1(i, w)} dur={20} up />
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>

        {/* the person with the goal */}
        <div style={{ position: 'absolute', left: CXO.x - 190, top: GOAL_Y - 22, width: 380, height: 44, opacity: clamp(f, T.goal, T.goal + 12), transform: `translateY(${(1 - clamp(f, T.goal, T.goal + 12)) * -10}px)` }}>
          <div style={{ ...glass, inset: 0, borderRadius: 99, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 0 8px', fontSize: 14 }}>
            <Avatar letter="Y" color={PAPER} size={28} />
            <span style={{ flex: 1, color: 'rgba(244,241,236,.86)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {f < T.ask ? 'Goal: prepare the Q3 board pack' : approved ? 'Q3 board pack approved' : 'Q3 board pack is ready'}
            </span>
            {f >= T.ask && !approved && (
              <span style={{ fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 99, background: PAPER, color: '#0b1226', transform: `scale(${f > T.click - 4 ? 0.93 : 1})`, boxShadow: `0 0 0 ${3 + 3 * Math.sin(f / 4)}px rgba(255,127,99,.28)` }}>Approve</span>
            )}
            {approved && <Status text="Approved" color={PAPER} check />}
          </div>
        </div>

        {/* CXO */}
        <Card x={CXO.x} y={CXO.y} w={CXO.w} h={CXO.h} scale={cxoEnter} glow={f >= T.ask && !approved ? CORAL : undefined}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: '100%', padding: '0 18px' }}>
            <Avatar letter="C" color={PAPER} size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>CXO agent</div>
              <div style={{ fontSize: 13, color: 'rgba(244,241,236,.6)', margin: '2px 0 7px' }}>Orchestrator</div>
              <Status text={cxoStatus.t} color={cxoStatus.c} check={cxoStatus.t === 'Done'} />
            </div>
          </div>
        </Card>

        {TEAMS.map((t, i) => {
          const e = enter(10 + i * 5)
          const briefed = f >= T.down1(i) + 22
          const back = T.up1(i, 1) + 20
          const merged = f >= T.up2(i) + 22
          const st = !briefed ? { t: 'Standby', c: 'rgba(244,241,236,.5)' } : f < back ? { t: 'Delegating', c: t.color } : !merged ? { t: 'Reviewing', c: t.color } : { t: 'Done', c: PAPER }
          return (
            <div key={t.id}>
              <div style={{ position: 'absolute', left: t.x - 70, top: LEAD.y - LEAD.h / 2 - 24, width: 140, textAlign: 'center', fontFamily: "'Timeless Sans', system-ui, sans-serif", fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: t.color, opacity: e }}>{t.label}</div>
              <Card x={t.x} y={LEAD.y} w={LEAD.w} h={LEAD.h} scale={e} glow={briefed && f < back ? t.color : undefined}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: '100%', padding: '0 14px' }}>
                  <Avatar letter={t.lead[0]} color={t.color} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{t.lead}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(244,241,236,.6)', margin: '1px 0 6px' }}>{t.role}</div>
                    <Status text={st.t} color={st.c} check={st.t === 'Done'} />
                  </div>
                </div>
              </Card>
              {t.staff.map((s, w) => {
                const sx = t.x + (w ? 60 : -60)
                const se = enter(24 + i * 5 + w * 3)
                const start = T.down2(i, w) + 20
                const p = clamp(f, start, start + T.work)
                const done = p >= 1
                return (
                  <Card key={s.name} x={sx} y={STAFF.y} w={STAFF.w} h={STAFF.h} scale={se} glow={p > 0 && !done ? t.color : undefined} style={{ borderRadius: 16 }}>
                    <div style={{ padding: '12px 11px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar letter={s.name[0]} color={t.color} size={24} />
                        <span style={{ fontSize: 14.5, fontWeight: 600 }}>{s.name}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(244,241,236,.6)', margin: '6px 0 9px', whiteSpace: 'nowrap' }}>{s.role}</div>
                      <div style={{ height: 5, borderRadius: 9, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
                        <div style={{ width: `${p * 100}%`, height: '100%', borderRadius: 9, background: done ? PAPER : t.color }} />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )
        })}

        {/* the audit trail */}
        <div style={{ ...glass, left: 60, top: 614, width: W - 120, height: 96, borderRadius: 18, padding: '12px 18px', opacity: clamp(f, T.goal, T.goal + 14) }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(244,241,236,.55)', marginBottom: 7 }}>
            <span>Audit trail</span>
            <span style={{ letterSpacing: 0, textTransform: 'none' }}>{Math.min(7, logLines.length)} events logged</span>
          </div>
          {shown.map(([t, text], i) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: "'Timeless Sans', system-ui, sans-serif", fontSize: 13, lineHeight: '19px', color: PAPER, opacity: (i === shown.length - 1 ? 1 : 0.5) * clamp(f, t, t + 8) }}>
              <i style={{ width: 6, height: 6, borderRadius: 9, background: i === shown.length - 1 ? CORAL : 'rgba(244,241,236,.4)' }} />
              {text}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default function OrgFlow({ className }: { className?: string }) {
  const ref = useRef<PlayerRef>(null)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!box.current) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? ref.current?.play() : ref.current?.pause()), { threshold: 0.05 })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={box} className={className} role="img" aria-label="A goal from a person flows to a CXO agent, which delegates to sales, operations and finance leads and their virtual employees. The results return for the person to approve.">
      <Player ref={ref} component={Scene} durationInFrames={LOOP} compositionWidth={W} compositionHeight={H} fps={30} loop autoPlay={!reduced()} initialFrame={reduced() ? T.ask + 10 : 0} style={{ width: '100%', aspectRatio: `${W} / ${H}`, background: 'transparent' }} acknowledgeRemotionLicense />
    </div>
  )
}
