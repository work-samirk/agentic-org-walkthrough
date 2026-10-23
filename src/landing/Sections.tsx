import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { siClaude, siGithub, siGnometerminal, siNpm, siPypi } from 'simple-icons'
import { Icon } from '../components/Icon'
import { presetRole, reduced } from './config'
import { CASE_STEPS, DOMAIN_DATA, PROTOCOLS, SCENARIOS, SDKS, STATS, TESTIMONIALS, computeScale, formatINR, DEFAULT_CLOSE_DAYS, DEFAULT_EMPLOYEES, DEFAULT_INVOICES, DEFAULT_TICKETS } from './realData'

// white marks for the tags on the developer cards
const BADGE_ICON: Record<string, string> = { PyPI: siPypi.path, npm: siNpm.path, Terminal: siGnometerminal.path, 'ChatGPT / Claude': siClaude.path }

const EndOrb = lazy(() => import('./HeroOrb').then((m) => ({ default: m.StrandsSolo })))

/* Connectors on two curved rails ----------------------------------------- */
type Logo = { n: string; f: string }
const lg = (n: string, f: string): Logo => ({ n, f: `/connectors/${f}.svg` })
const ROW_A: Logo[] = [lg('Salesforce', 'salesforce'), lg('Zoho', 'zoho'), lg('HubSpot', 'hubspot'), lg('Stripe', 'stripe'), lg('Slack', 'slack'), lg('Jira', 'jira'), lg('Gmail', 'gmail'), lg('Microsoft Teams', 'microsoft-teams'), lg('Razorpay', 'razorpay'), lg('Shopify', 'shopify')]
const ROW_B: Logo[] = [lg('Google Calendar', 'google-calendar'), lg('Zoom', 'zoom'), lg('QuickBooks', 'quickbooks'), lg('Xero', 'xero'), lg('WhatsApp', 'whatsapp'), lg('Twilio', 'twilio'), lg('Okta', 'okta'), lg('PhonePe', 'phonepe'), lg('GitHub', 'github'), lg('Airtable', 'airtable')]

function Rail({ logos, dir }: { logos: Logo[]; dir: 'l' | 'r' }) {
  const GAP = 132
  const items = [...logos, ...logos, ...logos]
  const y = (i: number) => Math.sin(i * 0.95) * 16
  const d = items.map((_, i) => `${i === 0 ? 'M' : 'L'}${i * GAP + 36} ${56 + y(i)}`).join(' ')
  return (
    <div className="lp-rail" data-dir={dir}>
      <div className="lp-rail-track" style={{ width: items.length * GAP }}>
        <svg className="lp-rail-line" width={items.length * GAP} height="112" aria-hidden="true"><path d={d} fill="none" /></svg>
        {items.map((l, i) => (
          <span key={i} className="lp-pearl" title={l.n} style={{ left: i * GAP, top: 20 + y(i) }}>
            <img src={l.f} alt={l.n} width="40" height="40" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function Pearls() {
  return (
    <section id="connectors" className="lp-sec lp-center" aria-labelledby="lp-h-conn">
      <div className="lp-wrap">
        <div className="lp-head c">
          <h2 id="lp-h-conn">Connect the tools your agent uses.</h2>
          <p className="lp-lead">Agents work through connectors, each with the permissions you set. Cloud or your own VPC.</p>
        </div>
      </div>
      <div className="lp-rails"><Rail logos={ROW_A} dir="l" /><Rail logos={ROW_B} dir="r" /></div>
    </section>
  )
}

/* Live agent execution (the real scenarios, run as a terminal) ------------- */
const PREFIX: Record<string, string> = { system: 'SYS', agent: 'AGT', tool: 'TOOL', result: 'OUT', hitl: 'HITL', confidence: 'END' }
export function LiveExecution() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(0)
  const [running, setRunning] = useState(false)
  const feed = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const sc = SCENARIOS[active]

  const clear = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = [] }, [])
  const run = useCallback(() => {
    clear()
    if (reduced()) { setVisible(sc.lines.length); setRunning(false); return }
    setVisible(0)
    setRunning(true)
    sc.lines.forEach((line, i) => {
      timers.current.push(window.setTimeout(() => {
        setVisible(i + 1)
        if (feed.current) feed.current.scrollTop = feed.current.scrollHeight
        if (i === sc.lines.length - 1) setRunning(false)
      }, line.delay))
    })
  }, [sc, clear])

  useEffect(() => {
    const t = window.setTimeout(run, 500)
    return () => { clearTimeout(t); clear() }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (running || reduced()) return
    const t = window.setTimeout(() => setActive((p) => (p + 1) % SCENARIOS.length), 4500)
    return () => clearTimeout(t)
  }, [running, active])

  const shown = sc.lines.slice(0, visible)
  const done = shown[shown.length - 1]?.type === 'confidence'
  const steps = sc.lines.filter((l) => l.type === 'agent')
  const stepsDone = shown.filter((l) => l.type === 'agent').length

  return (
    <section id="live" className="lp-sec lp-dark" aria-labelledby="lp-h-live">
      <div className="lp-wrap">
        <div className="lp-head c">
          <h2 id="lp-h-live">See every step an agent takes.</h2>
          <p className="lp-lead">Reasoning, tool calls and a confidence score for every run. Pick a scenario to replay it.</p>
        </div>
        <div className="lp-tabs" role="tablist" aria-label="Scenarios">
          {SCENARIOS.map((s, i) => (
            <button key={s.id} type="button" role="tab" aria-selected={i === active} className="lp-tab" onClick={() => setActive(i)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>{s.label}
            </button>
          ))}
        </div>
        <div className="lp-term lg-dark">
          <div className="lp-term-bar"><i /><i /><i /><span><b data-s={running ? 'run' : done ? 'ok' : ''} />AgenticOrg Agent Terminal · {sc.agent} ({sc.designation})</span><button type="button" onClick={run} disabled={running}>Replay</button></div>
          <div className="lp-term-head">
            <span className="lp-av">{sc.avatar}</span>
            <div><b>{sc.agent}</b> <small>{sc.designation}</small><p>{sc.taskTitle}</p></div>
            <em>{sc.domain}</em>
            <code>Input: {sc.taskInput}</code>
          </div>
          <div className="lp-term-feed" ref={feed} aria-live="off">
            {shown.map((l, i) =>
              l.type === 'separator' ? <hr key={i} /> : (
                <p key={i} data-t={l.type}><span>{PREFIX[l.type]}</span><code>{l.text}</code></p>
              ),
            )}
            {running && <span className="lp-caret" />}
          </div>
          <div className="lp-term-foot"><span data-s={running ? 'run' : done ? 'ok' : ''}>{running ? 'Executing' : done ? 'Completed' : 'Ready'}</span><small>Steps: {stepsDone}/{steps.length}</small><em>Gemini 2.5 Flash · LLM + Tools</em></div>
        </div>
      </div>
    </section>
  )
}

/* Build with AgenticOrg ---------------------------------------------------- */
function Copy({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button type="button" className="lp-copy-btn" aria-label={ok ? 'Copied' : 'Copy to clipboard'} data-ok={ok ? '' : undefined} onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1600) }}>
      {ok ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" /></svg>
      )}
      <span aria-live="polite">{ok ? 'Copied' : label}</span>
    </button>
  )
}
export function Dev() {
  return (
    <section id="developers" className="lp-sec" aria-labelledby="lp-h-dev">
      <div className="lp-wrap">
        <div className="lp-head c">
          <p className="lp-badge"><i />Open-source SDKs, Apache 2.0</p>
          <h2 id="lp-h-dev">Build with AgenticOrg.</h2>
          <p className="lp-lead">Python SDK, TypeScript SDK, CLI and MCP Server. Launch agents, discover commerce tools, query knowledge and run workflows from your code or any MCP-compatible client.</p>
        </div>
        <div className="lp-sdks">
          {SDKS.map((s) => (
            <article key={s.title} className="lp-sdk">
              <header><h3>{s.title}</h3><span>{BADGE_ICON[s.badge] && <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d={BADGE_ICON[s.badge]} fill="currentColor" /></svg>}{s.badge}</span></header>
              <div className="lp-inst"><code><i>$</i> {s.install}</code><Copy text={s.install} /></div>
              <div className="lp-codebox"><pre><code>{s.code}</code></pre></div>
              <a href={s.link} target="_blank" rel="noreferrer">{s.cta}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg><span className="sr-only"> (opens in a new tab)</span></a>
            </article>
          ))}
        </div>
        <div className="lp-protos">
          {PROTOCOLS.map((p) => (
            <article key={p.t} className="lg"><h3>{p.t}</h3><p>{p.d}</p>{p.link && <a href="#developers" aria-disabled="true" onClick={(e) => e.preventDefault()}>Learn how it works</a>}</article>
          ))}
        </div>
        <div className="lp-action lg">
          <div><h3>See it in action: OACP-grounded shopping preview</h3><p>Safe workflow preview: a buyer asks from ChatGPT, AgenticOrg uses MCP and cached OACP artifacts, checks freshness and revocation posture, then prepares a non-executing handoff or refuses unsafe paths. Live checkout and payment remain blocked until approved.</p></div>
          <a className="lp-btn ink" href="#developers" onClick={(e) => e.preventDefault()}>View Safe Workflow</a>
        </div>
        <div className="lp-keyrow"><p>Get your API key from the dashboard to start building.</p><div><Link to="/signup" className="lp-btn ink big">Get API Key, Free</Link><a className="lp-btn line big" href="https://github.com/mishrasanjeev/agentic-org" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" width="18" height="18"><path d={siGithub.path} fill="currentColor" /></svg>View on GitHub</a></div></div>
      </div>
    </section>
  )
}

/* ROI calculator (same inputs and maths as the real page) ------------------- */
function useAnimated(target: number, ms = 600) {
  const [v, setV] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (reduced()) return
    const start = performance.now()
    const f0 = from.current
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / ms, 1)
      const e = 1 - Math.pow(1 - p, 3)
      const cur = f0 + (target - f0) * e
      from.current = cur
      setV(cur)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return reduced() ? target : v
}
function Slider({ label, value, set, min, max, step, suffix }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step: number; suffix?: string }) {
  return (
    <label className="lp-slider">
      <span><b>{label}</b><em>{value.toLocaleString('en-IN')}{suffix && ` ${suffix}`}</em></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} />
      <small><i>{min.toLocaleString('en-IN')}</i><i>{max.toLocaleString('en-IN')}</i></small>
    </label>
  )
}
function DomainCard({ d, weekly }: { d: (typeof DOMAIN_DATA)[number]; weekly: number }) {
  const v = useAnimated(weekly)
  return (
    <article className="lp-dom" data-d={d.domain}>
      <header><h3>{d.domain}</h3><b>{formatINR(v)}<small>/week</small></b></header>
      <ul>{d.metrics.map((m) => <li key={m.label}><Icon name="check" size={14} strokeWidth={3} /><div><span>{m.label}</span><small><s>{m.before}</s> → {m.after}</small></div></li>)}</ul>
    </article>
  )
}
export function Roi() {
  const [emp, setEmp] = useState(DEFAULT_EMPLOYEES)
  const [inv, setInv] = useState(DEFAULT_INVOICES)
  const [tix, setTix] = useState(DEFAULT_TICKETS)
  const [close, setClose] = useState(DEFAULT_CLOSE_DAYS)
  const scales = computeScale(emp, inv, tix)
  const weekly = DOMAIN_DATA.map((d) => Math.round(d.weeklyBase * (scales[d.domain] || 1)))
  const total = weekly.reduce((a, b) => a + b, 0)
  const faster = Math.max(1, Math.round(close * (2 / 7)))
  const aw = useAnimated(total)
  const aa = useAnimated(total * 52)
  return (
    <section id="roi" className="lp-sec lp-soft" aria-labelledby="lp-h-roi">
      <div className="lp-wrap">
        <div className="lp-head c"><h2 id="lp-h-roi">Calculate your savings with AgenticOrg.</h2><p className="lp-lead">Set your team size and volumes to see the estimated savings by department.</p></div>
        <div className="lp-roi">
          <form className="lp-roi-in lg" onSubmit={(e) => e.preventDefault()}>
            <h3>Your organization</h3>
            <Slider label="Number of employees" value={emp} set={setEmp} min={50} max={10000} step={50} />
            <Slider label="Monthly invoices processed" value={inv} set={setInv} min={100} max={50000} step={100} />
            <Slider label="Support tickets / month" value={tix} set={setTix} min={500} max={100000} step={500} />
            <Slider label="Current month-end close" value={close} set={setClose} min={3} max={15} step={1} suffix="days" />
            <div className="lp-close"><span>Month-end close improvement</span><div><b className="bad">D+{close}</b><i>→</i><b className="good">D+{close - (close - faster)}</b></div><small>{close - faster} days faster</small></div>
          </form>
          <div className="lp-roi-out">
            <div className="lp-hero-num">
              <div><small>Estimated weekly savings</small><b>{formatINR(aw)}</b><span>per week across all departments</span></div>
              <div><small>Estimated annual savings</small><b>{formatINR(aa)}</b><span>projected over 52 weeks</span></div>
              <ul><li><b>15x</b>Faster invoicing</li><li><b>65%</b>L1 auto-containment</li><li><b>99.7%</b>Recon accuracy</li></ul>
            </div>
            <div className="lp-doms">{DOMAIN_DATA.map((d, i) => <DomainCard key={d.domain} d={d} weekly={weekly[i]} />)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Reviews: a deck of liquid-glass cards ------------------------------------ */
export function Reviews() {
  const track = useRef<HTMLDivElement>(null)
  const n = TESTIMONIALS.length
  // three copies side by side, so there is always a card on each side of the one in the middle
  const ALL = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]
  const [k, setK] = useState(n + 1)
  const [hold, setHold] = useState(false)
  const [visible, setVisible] = useState(false)
  const i = k % n

  const left = (idx: number) => {
    const t = track.current
    const el = t?.children[idx] as HTMLElement | undefined
    return t && el ? el.offsetLeft - (t.clientWidth - el.clientWidth) / 2 : 0
  }
  const jump = (idx: number) => {
    const t = track.current
    if (!t) return
    t.style.scrollSnapType = 'none'
    t.scrollTo({ left: left(idx), behavior: 'auto' })
    requestAnimationFrame(() => { t.style.scrollSnapType = '' })
  }
  const go = (idx: number) => {
    const t = track.current
    if (!t) return
    t.scrollTo({ left: left(idx), behavior: reduced() ? 'auto' : 'smooth' })
    setK(idx)
  }

  // start with the second review in the middle, a card on each side
  useLayoutEffect(() => { jump(n + 1) }, [])

  useEffect(() => {
    const t = track.current
    if (!t) return
    let raf = 0
    let idle = 0
    const on = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0
          const mid = t.scrollLeft + t.clientWidth / 2
          let best = 0
          let d = Infinity
          ;[...t.children].forEach((c, j) => {
            const el = c as HTMLElement
            const dist = Math.abs(el.offsetLeft + el.clientWidth / 2 - mid)
            if (dist < d) { d = dist; best = j }
          })
          setK(best)
        })
      }
      // once it settles outside the middle copy, step back into it without anyone noticing
      window.clearTimeout(idle)
      idle = window.setTimeout(() => {
        const mid = t.scrollLeft + t.clientWidth / 2
        let best = 0
        let d = Infinity
        ;[...t.children].forEach((c, j) => {
          const el = c as HTMLElement
          const dist = Math.abs(el.offsetLeft + el.clientWidth / 2 - mid)
          if (dist < d) { d = dist; best = j }
        })
        if (best < n) { jump(best + n); setK(best + n) } else if (best >= 2 * n) { jump(best - n); setK(best - n) }
      }, 140)
    }
    t.addEventListener('scroll', on, { passive: true })
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(t)
    return () => { t.removeEventListener('scroll', on); io.disconnect(); cancelAnimationFrame(raf); window.clearTimeout(idle) }
  }, [n])

  // each card stays up for as long as its quote takes to read
  useEffect(() => {
    if (hold || !visible || reduced()) return
    const ms = 4500 + TESTIMONIALS[i].quote.length * 32
    const id = window.setTimeout(() => go(k + 1), ms)
    return () => window.clearTimeout(id)
  }, [k, hold, visible])

  return (
    <section id="reviews" className="lp-sec lp-dark lp-aurora" aria-labelledby="lp-h-rev">
      <div className="lp-wrap">
        <div className="lp-head c"><h2 id="lp-h-rev">Trusted by teams across India.</h2><p className="lp-lead">Feedback from teams using AgenticOrg.</p></div>
        <ul className="lp-stats">{STATS.map((s) => <li key={s.label}><b>{s.value}</b><span>{s.label}</span></li>)}</ul>
      </div>

      <div className="rv" onFocus={() => setHold(true)} onBlur={() => setHold(false)} role="group" aria-roledescription="carousel" aria-label="Customer reviews">
        <div
          className="rv-track"
          ref={track}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); go(k + 1) }
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(k - 1) }
          }}
        >
          {ALL.map((t, j) => {
            const [big, ...rest] = t.result.split(' ')
            return (
              <article key={`${t.name}-${j}`} className="rv-card" data-on={j === k ? '' : undefined} aria-hidden={j < n || j >= 2 * n} aria-roledescription="slide" aria-label={`${(j % n) + 1} of ${n}`}>
                <div className="rv-metric"><b>{big}</b><span>{rest.join(' ')}</span></div>
                <blockquote>{t.quote}</blockquote>
                <footer>
                  <div><b>{t.name}</b><small>{t.role}, {t.company}</small></div>
                  <p className="lp-stars" aria-label="5 out of 5">★★★★★</p>
                </footer>
              </article>
            )
          })}
        </div>
        <div className="lp-deck-ctl">
          <button type="button" aria-label="Previous review" onClick={() => go(k - 1)}>←</button>
          <div>{TESTIMONIALS.map((t, j) => <button key={t.name} type="button" aria-label={`Show review ${j + 1}`} aria-current={j === i} onClick={() => go(n + j)} />)}</div>
          <button type="button" aria-label="Next review" onClick={() => go(k + 1)}>→</button>
        </div>
      </div>
    </section>
  )
}

/* CA firm case study: a flowing four-step line ------------------------------ */
const CHIP: Record<string, string> = {
  'Zoho Books': '/logos/zoho-books.webp',
  'Finvu AA': '/logos/finvu.webp',
  GSTN: '/logos/gstn.webp',
  'Tally Bridge': '/logos/tally.webp',
}
const CASE_ICONS = ['send', 'landmark', 'shield', 'loop'] as const

export function CaseStudy() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(reduced())
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.08 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <section id="case" className="lp-sec cs" aria-labelledby="lp-h-case">
      <div className="lp-wrap">
        <div className="cs-grid" ref={ref} data-on={on ? '' : undefined}>
          <header className="cs-lead">
            <p className="cs-kicker"><span>Case study</span><i />CA firm</p>
            <p className="cs-num" aria-hidden="true">8</p>
            <h2 id="lp-h-case">A CA firm goes live in 8 days.</h2>
            <p className="cs-dek">Invoicing, bank reconciliation, GST filing and Tally sync, all handled by agents.</p>
            <a href="#case" className="lp-btn ink" onClick={(e) => e.preventDefault()}>Read the Full Case Study<Icon name="arrowRight" size={16} /></a>
          </header>

          <ol className="cs-story">
            {CASE_STEPS.map((s, k) => {
              const ch = CHIP[s.connector]
              return (
                <li key={s.stage} style={{ ['--k' as string]: k }}>
                  <span className="cs-ic"><Icon name={CASE_ICONS[k]} size={20} /></span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <em><img src={ch} alt={s.connector} height="24" /></em>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* End-of-page card ----------------------------------------------------------- */
export function EndCard({ role }: { role?: string }) {
  return (
    <section id="start" className="lp-sec lp-dark lp-end-wrap" aria-labelledby="lp-h-end">
      <div className="lp-wrap">
        <div className="lp-end">
          <div className="lp-end-art">
            <div className="lp-arch"><Suspense fallback={null}><EndOrb className="lp-end-sphere" /></Suspense></div>
          </div>
          <div className="lp-end-copy">
            <p className="lp-badge"><i />Free to start</p>
            <h2 id="lp-h-end">Ship your first <span className="lp-gt">AI agent today.</span></h2>
            <p className="lp-lead">Describe it, test it on sample data and put it to work. Approvals and an audit trail are built in.</p>
            <div className="lp-sso"><Link to="/signup" className="lp-btn ink big" onClick={() => role && presetRole(role)}>Build Your First Agent</Link><Link to="/app" className="lp-btn line big">Try the Live Demo</Link></div>
            <p className="lp-fine">No credit card required. Full audit trail built in.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
