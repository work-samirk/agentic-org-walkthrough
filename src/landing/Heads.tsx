import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Landmark, Megaphone, Users, Workflow } from 'lucide-react'
import { Icon } from '../components/Icon'
import { reduced } from './config'

// Four department heads. Tabs on the left, one big card on the right that moves on by itself.
const MS = 5000

const HEADS = [
  { id: 'CFO', icon: Landmark, promise: 'Close the books in 1 day, not 5', count: '10 finance agents', grad: ['#005656', '#36cc8b'], chips: ['Accounts Payable', 'Accounts Receivable', 'Treasury', 'Reconciliation', 'Tax Filing', 'Month-end Close', 'FP&A', 'Expense Mgmt'], proof: 'Shadow mode measures exact ROI with your real data before go-live' },
  { id: 'CHRO', icon: Users, promise: 'Onboard in hours, not weeks', count: '6 HR agents', grad: ['#0f7a6b', '#36cc8b'], chips: ['Onboarding', 'Payroll', 'Talent Acquisition', 'Performance', 'L&D', 'Offboarding'], proof: 'Zero payroll errors with automated PF, ESI and TDS' },
  { id: 'CMO', icon: Megaphone, promise: 'Launch campaigns while you sleep', count: '9 marketing agents', grad: ['#1f9e75', '#86dd70'], chips: ['Campaign Mgmt', 'A/B Testing', 'Email Drip', 'ABM + Intent', 'Content Gen', 'SEO', 'CRM Nurture', 'Brand Monitor'], proof: 'A/B auto-winner selection, with a CMO override on multi-channel campaigns' },
  { id: 'COO', icon: Workflow, promise: 'Resolve P1s before the CEO asks', count: '5 ops agents', grad: ['#003f3f', '#1f9e75'], chips: ['Support Triage', 'IT Ops', 'Compliance', 'Contracts', 'Vendor Mgmt'], proof: '42 tickets triaged per day with zero manual routing' },
] as const

const CLOSE = ['Bank reconciliation', 'AP accruals', 'Tax provisions', 'Revenue recognition', 'Books closed']

// each visual is driven by t, the milliseconds since the card appeared, so it replays with the card
function Visual({ id, t }: { id: string; t: number }) {
  if (id === 'CFO') {
    const done = Math.min(CLOSE.length, Math.floor(t / 420) + 1)
    return (
      <ul className="hd-close" aria-label="Month-end close checklist">
        {CLOSE.map((c, i) => (
          <li key={c} data-on={i < done ? '' : undefined}><span>{i < done && <Icon name="check" size={12} strokeWidth={3} />}</span>{c}<small>{i < done ? 'Done' : i === done ? 'Running' : ''}</small></li>
        ))}
      </ul>
    )
  }
  if (id === 'CHRO') {
    const n = Math.round(Math.min(1, t / 1500) * 847)
    return (
      <div className="hd-pay" aria-label="Payroll run">
        <p><b>{n}</b><span> of 847 employees processed</span></p>
        {['PF', 'ESI', 'TDS'].map((k, i) => <div key={k} className="hd-bar"><small>{k}</small><i><em style={{ width: `${Math.round(Math.min(1, Math.max(0, (t - i * 200) / 1500)) * 100)}%` }} /></i><small>{Math.min(1, Math.max(0, (t - i * 200) / 1500)) >= 1 ? 'Clean' : '...'}</small></div>)}
        <p className="hd-note">0 errors</p>
      </div>
    )
  }
  if (id === 'CMO') {
    const a = Math.min(1, t / 1300) * 46
    const b = Math.min(1, t / 1300) * 64
    const win = t > 1400
    return (
      <div className="hd-ab" aria-label="A/B test">
        {[['A', a, false], ['B', b, true]].map(([k, v, w]) => (
          <div key={String(k)} className="hd-bar"><small>{String(k)}</small><i><em style={{ width: `${Number(v)}%` }} data-win={w && win ? '' : undefined} /></i><small>{Math.round(Number(v))}%</small></div>
        ))}
        <p className="hd-note" data-on={win ? '' : undefined}>B wins by 18%. Sent to the rest of the list.</p>
      </div>
    )
  }
  const tk = Math.min(42, Math.floor(t / 30))
  return (
    <div className="hd-ops" aria-label="Ticket triage">
      <p><b>{tk}</b><span> tickets routed today</span></p>
      <ul>
        {['P1: payment gateway timeout', 'P2: access request, finance', 'P3: invoice query'].map((x, i) => (
          <li key={x} data-on={t > 100 + i * 250 ? '' : undefined}>{x}<small>{t > 500 + i * 250 ? 'Routed' : 'Triaging'}</small></li>
        ))}
      </ul>
    </div>
  )
}

export function Heads() {
  const ref = useRef<HTMLElement>(null)
  const [idx, setIdx] = useState(0)
  const [t, setT] = useState(reduced() ? MS : 0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // one clock per card: it fills the progress bar, drives the visual, then moves to the next role
  useEffect(() => {
    if (reduced() || !visible) return
    const start = performance.now()
    const id = window.setInterval(() => {
      const el = performance.now() - start
      if (el >= MS) {
        setIdx((i) => (i + 1) % HEADS.length)
        setT(0)
      } else setT(el)
    }, 50)
    return () => window.clearInterval(id)
  }, [idx, visible])

  const pick = (i: number) => { setIdx(i); setT(0) }
  // the footer's role links choose the tab
  useEffect(() => {
    const on = (e: Event) => {
      const j = HEADS.findIndex((x) => x.id === (e as CustomEvent).detail)
      if (j >= 0) { setIdx(j); setT(0) }
    }
    window.addEventListener('ao-head', on)
    return () => window.removeEventListener('ao-head', on)
  }, [])
  const h = HEADS[idx]
  const bg = `linear-gradient(135deg,${h.grad[0]},${h.grad[1]})`

  return (
    <section id="heads" className="lp-sec lp-soft hd" ref={ref} aria-labelledby="hd-h">
      <div className="lp-wrap">
        <div className="lp-head c">
          <h2 id="hd-h">Built for every department head.</h2>
          <p className="lp-lead">Ready agents for finance, HR, marketing and operations teams.</p>
        </div>

        <div className="hd-grid">
          <div className="hd-tabs" role="tablist" aria-label="Department heads">
            {HEADS.map((x, i) => (
              <button key={x.id} type="button" role="tab" aria-selected={i === idx} className="hd-tab" onClick={() => pick(i)}>
                <span className="hd-badge" style={{ background: `linear-gradient(135deg,${x.grad[0]},${x.grad[1]})` }}>{<x.icon size={22} strokeWidth={1.8} aria-hidden="true" />}</span>
                <span><b>{x.id}</b><small>{x.promise}</small></span>
                <i className="hd-prog"><em style={{ width: i === idx ? `${(t / MS) * 100}%` : '0%' }} /></i>
              </button>
            ))}
          </div>

          <article className="hd-card" key={h.id} style={{ ['--g' as string]: bg }} role="tabpanel">
            <header>
              <span className="hd-badge big" style={{ background: bg }}><h.icon size={26} strokeWidth={1.8} aria-hidden="true" /></span>
              <div><b>{h.id}</b><small>{h.promise}</small></div>
              <span className="hd-count">{h.count}</span>
            </header>
            <ul className="hd-chips">
              {h.chips.map((c, i) => <li key={c} style={{ animationDelay: `${i * 70}ms` }}>{c}</li>)}
            </ul>
            <div className="hd-vis"><Visual id={h.id} t={t} /></div>
            <p className="hd-proof"><Icon name="check" size={16} strokeWidth={3} />{h.proof}</p>
            <Link to="/app" className="hd-link">See the {h.id} dashboard<Icon name="arrowRight" size={16} /></Link>
          </article>
        </div>
      </div>
    </section>
  )
}
