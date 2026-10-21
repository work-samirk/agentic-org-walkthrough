import { useRef, useState } from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { Player, type PlayerRef } from '@remotion/player'

const STEPS = [
  { t: 'Read the sample sales file: 128 rows', tool: 'get_transaction_list' },
  { t: 'Added up sales and settlements', tool: 'fetch_bank_statement' },
  { t: 'Flagged one change: refunds up from 1.6% to 2.1%', tool: 'compare_days' },
  { t: 'Wrote the summary and waited for approval', tool: 'draft_summary' },
]

// "Why did the agent do this?" as a six second loop. Colours come from the page, so it follows light and dark.
function Trace() {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const conf = interpolate(f, [20, 140], [0, 93], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const out = interpolate(f, [165, 180], [1, 0], { extrapolateLeft: 'clamp' })
  return (
    <AbsoluteFill style={{ background: 'var(--ao-panel)', color: 'var(--ao-ink)', fontFamily: 'var(--ao-font-text)', padding: 36, opacity: out }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--ao-font-display)', fontWeight: 700, fontSize: 30 }}>Why did the agent do this?</div>
        <div style={{ background: 'var(--ao-sky-tint)', color: 'var(--ao-control)', fontWeight: 600, fontSize: 18, padding: '6px 16px', borderRadius: 99 }}>{Math.round(conf)}% sure</div>
      </div>
      <div style={{ height: 8, borderRadius: 8, background: 'var(--ao-soft)', margin: '18px 0 26px' }}>
        <div style={{ width: `${conf}%`, height: '100%', borderRadius: 8, background: 'var(--ao-control)' }} />
      </div>
      {STEPS.map((s, i) => {
        const at = 18 + i * 30
        const k = spring({ frame: f - at, fps, config: { damping: 200 } })
        return (
          <div key={s.t} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
            <div style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--ao-ink)', color: 'var(--ao-ground)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 15 }}>{i + 1}</div>
            <div style={{ fontSize: 22, flex: 1 }}>{s.t}</div>
            <div style={{ fontSize: 15, background: 'var(--ao-soft)', color: 'var(--ao-muted)', padding: '4px 12px', borderRadius: 99 }}>{s.tool}</div>
          </div>
        )
      })}
      <div style={{ position: 'absolute', left: 36, bottom: 30, display: 'flex', gap: 12, opacity: interpolate(f, [140, 156], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <span style={{ background: 'var(--ao-soft)', padding: '8px 16px', borderRadius: 99, fontSize: 17, fontWeight: 600 }}>Good answer</span>
        <span style={{ background: 'var(--ao-soft)', padding: '8px 16px', borderRadius: 99, fontSize: 17, fontWeight: 600 }}>Correct this</span>
      </div>
    </AbsoluteFill>
  )
}

export default function Film() {
  const ref = useRef<PlayerRef>(null)
  const [on, setOn] = useState(true)
  const toggle = () => {
    if (!ref.current) return
    if (on) ref.current.pause()
    else ref.current.play()
    setOn(!on)
  }
  return (
    <div className="lp-film">
      <Player ref={ref} component={Trace} durationInFrames={180} compositionWidth={800} compositionHeight={460} fps={30} loop autoPlay style={{ width: '100%', borderRadius: 24 }} acknowledgeRemotionLicense />
      <button type="button" className="lp-pause" onClick={toggle} aria-pressed={!on}>{on ? 'Pause animation' : 'Play animation'}</button>
    </div>
  )
}
