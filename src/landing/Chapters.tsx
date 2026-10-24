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

export { OrgChart } from './OrgBuild'
