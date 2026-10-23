import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { reduced } from './config'

const TABS = [
  { id: 'recon', label: 'Reconciliation', prompt: 'Reconcile bank statements against invoices and flag mismatches for review' },
  { id: 'support', label: 'Support', prompt: 'Triage support tickets, answer the easy ones and escalate refunds over $100' },
  { id: 'leads', label: 'Lead follow-up', prompt: 'Qualify new leads from the CRM and draft a first email for each hot one' },
  { id: 'hr', label: 'HR onboarding', prompt: 'Onboard each new hire: create their accounts, send the welcome pack and schedule week-one check-ins' },
  { id: 'report', label: 'Reporting', prompt: 'Pull this week\'s numbers from our tools, build the report with charts and email it to the leadership team every Monday' },
]
const KEY = 'ao.draftPrompt'

// A dummy box: it types a few real jobs by itself, lets the visitor write their own, then hands over to sign-in.
export function PromptSection() {
  const nav = useNavigate()
  const root = useRef<HTMLElement>(null)
  const area = useRef<HTMLTextAreaElement>(null)
  const [tab, setTab] = useState(0)
  const [text, setText] = useState(reduced() ? TABS[0].prompt : '')
  const [mode, setMode] = useState<'loop' | 'once' | 'user'>(reduced() ? 'user' : 'loop')
  const [run, setRun] = useState(0)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (!root.current) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.3 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  // types the chosen job; in loop mode it waits a moment and moves to the next tab
  useEffect(() => {
    if (mode === 'user' || !seen) return
    const full = TABS[tab].prompt
    let i = 0, timer = 0
    const tick = () => {
      if (i <= full.length) { setText(full.slice(0, i++)); timer = window.setTimeout(tick, 26) }
      else if (mode === 'loop') timer = window.setTimeout(() => setTab((t) => (t + 1) % TABS.length), 2400)
    }
    timer = window.setTimeout(tick, 350)
    return () => window.clearTimeout(timer)
  }, [mode, tab, run, seen])

  const pick = (k: number) => {
    if (reduced()) { setTab(k); setText(TABS[k].prompt); setMode('user'); return }
    setTab(k); setMode('once'); setRun((r) => r + 1)
  }
  const go = (e: React.FormEvent) => {
    e.preventDefault()
    const v = text.trim().slice(0, 600)
    try { if (v) sessionStorage.setItem(KEY, v) } catch { /* private mode: the redirect still works */ }
    nav('/login')
  }

  return (
    <section id="try" className="lp-sec lp-dark pr" ref={root} aria-labelledby="pr-h">
      <div className="lp-wrap pr-wrap">
        <h2 id="pr-h">Describe the agent. We will build it.</h2>
        <p className="lp-lead">Say what the job is in plain English. You will connect tools and test it on sample data next.</p>
        <form className="pr-box" onSubmit={go}>
          <div className="pr-tabs" role="tablist" aria-label="Example jobs">
            {TABS.map((t, k) => (
              <button key={t.id} type="button" role="tab" id={`pr-tab-${t.id}`} aria-selected={tab === k && mode !== 'user'} aria-controls="pr-t" onClick={() => pick(k)}>{t.label}</button>
            ))}
          </div>
          <label htmlFor="pr-t" className="sr-only">What should your agent do?</label>
          <textarea id="pr-t" ref={area} rows={3} value={text} placeholder="Describe the job in plain English"
            onFocus={() => setMode('user')} onChange={(e) => { setMode('user'); setText(e.target.value) }} />
          <div className="pr-row">
            <p>Free to start. No credit card.</p>
            <button type="submit" className="pr-cta">Build This Agent<Icon name="arrowRight" size={18} /></button>
          </div>
        </form>
      </div>
    </section>
  )
}
