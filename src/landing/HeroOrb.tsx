// Hero art: the Strands glass orb (after reactbits) with the agent hand-over and terminal prompts, timed by Remotion.
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion'
import { Player } from '@remotion/player'
import Strands from './strands/Strands'
import { reduced } from './config'
import { CMDS, FONT, PAPER, SEG, SLOTS, BOX_H, BOX_W, STEPS, Term, chip, clamp, rnd, type P } from './Warps'

const W = 760
const H = 740
// reactbits role order: red, orange, amber, warm white, cyan, blue, deep
const COLORS = ['#ff7f63', '#ff9a6a', '#ffc58a', '#fff1e0', '#8fd0ff', '#6db1f5', '#5a4bd6']
const CMDS_ALL = [...CMDS, CMDS[0]]

const colors = COLORS
function Scene() {
  const f = useCurrentFrame()
  const n = STEPS.length
  const idx = Math.min(n - 1, Math.floor(f / SEG))
  const local = f - idx * SEG
  const cur = STEPS[idx]
  const out = 1 - clamp(f, SEG * n - 8, SEG * n - 2)
  const intro = spring({ frame: f, fps: 30, config: { damping: 18, stiffness: 100, mass: 0.9 } })
  const text = clamp(local, 12, 26)
  const last = idx === n - 1
  const agent = Math.min(idx, CMDS_ALL.length - 1)
  // each hand-over nudges the hue and the energy of the strands
  const hue = [0, -0.04, 0.06, 0.12, 0][idx] ?? 0
  const energy = 0.55 + 0.4 * Math.sin(Math.min(1, local / SEG) * Math.PI)
  const placed: P[] = []
  const boxes = [0, 1, 2].map((b) => {
    const seed = idx * 10 + b
    const start = [6, 34, 66][b] + Math.floor(rnd(seed) * 18)
    const life = 100 + Math.floor(rnd(seed + 1) * 26)
    const first = Math.floor(rnd(seed + 2) * SLOTS.length)
    let slot = SLOTS[first]
    for (let j = 0; j < SLOTS.length; j++) {
      const c = SLOTS[(first + j) % SLOTS.length]
      if (placed.every((q) => Math.abs(c[0] - q[0]) >= BOX_W || Math.abs(c[1] - q[1]) >= BOX_H)) { slot = c; break }
    }
    placed.push(slot)
    const age = local - start
    if (age < 0 || age > life) return null
    return <Term key={b} at={slot} color={colors[0]} lines={CMDS_ALL[agent][b]} age={age} life={life} />
  })
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: 'absolute', left: 380 - 260, top: 320 - 260, width: 520, height: 520, transform: `scale(${0.9 + 0.1 * intro})` }}>
        <Strands colors={colors} intensity={0.6} waviness={2.25} glassSize={0.78} hueShift={hue} energy={energy} intro={false} interactive={false} clickPulse={false} maxDevicePixelRatio={1.25} />
      </div>
      <div style={{ position: 'absolute', left: 0, width: W, top: 508, textAlign: 'center', color: PAPER, fontFamily: FONT, opacity: text, transform: `translateY(${(1 - text) * 10}px)` }}>
        <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{cur.role}</div>
        <div style={{ height: 12 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
          {cur.tasks.map((t, i) => {
            const o = clamp(local, 14 + i * 9, 26 + i * 9)
            return (
              <div key={t} style={{ ...chip, position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 99, fontSize: 15, opacity: o, transform: `translateY(${(1 - o) * 8}px)` }}>
                <i style={{ width: 8, height: 8, borderRadius: 9, background: last && i === 2 ? '#d0f255' : '#36cc8b', boxShadow: `0 0 10px ${last && i === 2 ? '#d0f255' : '#36cc8b'}` }} />
                {t}
              </div>
            )
          })}
        </div>
      </div>
      {boxes}
    </AbsoluteFill>
  )
}

export function StrandsSolo({ className }: { className?: string }) {
  // autoPlay alone: a manual play() without a click makes the browser block Remotion's audio and the scene stays on frame one
  return (
    <div className={className} role="img" aria-label="A glowing orb hands work between four agents: business analyst, lead generation, customer support and reconciliation, then back for your approval.">
      <Player component={Scene} durationInFrames={SEG * 5} compositionWidth={W} compositionHeight={H} fps={30} loop autoPlay={!reduced()} initialFrame={reduced() ? 300 : 24} style={{ width: '100%', aspectRatio: `${W}/${H}` }} />
    </div>
  )
}
