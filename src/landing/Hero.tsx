import { Fragment, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Icon } from '../components/Icon'
import { GoogleMark, MicrosoftMark } from '../components/Icon'
import { FREE_LINE, ROLES, SCENES, presetRole, reduced, type RoleId, type VariantKey, VARIANTS } from './config'

const Constellation = lazy(() => import('./Constellation'))

type Phase = 'working' | 'asking' | 'done'

// The agent card: it works through its steps, then waits. The visitor presses Approve.
function Stage({ role }: { role: RoleId }) {
  const sc = SCENES[role]
  const [shown, setShown] = useState(0)
  const [phase, setPhase] = useState<Phase>('working')
  const [paused, setPaused] = useState(false)
  const total = sc.steps.length

  useEffect(() => {
    if (reduced()) {
      const t = window.setTimeout(() => {
        setShown(total)
        setPhase('asking')
      }, 0)
      return () => window.clearTimeout(t)
    }
    const timers: number[] = []
    timers.push(window.setTimeout(() => { setShown(0); setPhase('working') }, 0))
    for (let i = 1; i <= total; i++) timers.push(window.setTimeout(() => setShown(i), 700 + i * 900))
    timers.push(window.setTimeout(() => setPhase('asking'), 700 + (total + 1) * 900))
    return () => timers.forEach(window.clearTimeout)
  }, [role, total])

  const replay = () => {
    setPhase('working')
    setShown(0)
    const timers: number[] = []
    for (let i = 1; i <= total; i++) timers.push(window.setTimeout(() => setShown(i), 500 + i * 700))
    timers.push(window.setTimeout(() => setPhase('asking'), 500 + (total + 1) * 700))
  }

  const status = phase === 'working' ? { t: 'Working', c: 'sky' } : phase === 'asking' ? { t: 'Your turn', c: 'coral' } : { t: 'Done', c: 'lime' }

  return (
    <div className="lp-stage ao-field" data-paused={paused ? '' : undefined}>
      <article className="lp-card" aria-label={`${sc.agent}, ${sc.title}, sample task`}>
        <header className="lp-card-head">
          <span className="lp-tile"><Icon name="spark" size={18} /></span>
          <div>
            <b>{sc.agent}</b>
            <small>{sc.title}</small>
          </div>
          <span className={`lp-pill ${status.c}`}><i />{status.t}</span>
        </header>
        <h3 className="lp-card-title">{sc.prompt}</h3>
        <ol className="lp-trace" aria-live="polite">
          {sc.steps.map((s, i) => (
            <li key={s} data-on={i < shown ? '' : undefined} data-now={i === shown && phase === 'working' ? '' : undefined}>
              <span className="lp-dot">{i < shown && <Icon name="check" size={12} strokeWidth={3} />}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        {shown >= total && <p className="lp-result"><b>Result.</b> {sc.result}</p>}
        {phase === 'asking' && (
          <div className="lp-ask" role="group" aria-label="Approval needed">
            <p><Icon name="shield" size={18} /> {sc.ask}</p>
            <div className="lp-ask-row">
              <button type="button" className="lp-btn ink pulse" onClick={() => setPhase('done')}>{sc.approve}</button>
              <button type="button" className="lp-btn ghost" onClick={replay}>Not now</button>
            </div>
            <small>Try it. This is a sample, nothing is sent.</small>
          </div>
        )}
        {phase === 'done' && (
          <div className="lp-ask done" role="status">
            <p><Icon name="check" size={18} strokeWidth={3} /> Approved by you. Recorded in the audit trail.</p>
            <div className="lp-ask-row">
              <Link to="/signup" className="lp-btn ink" onClick={() => presetRole(role)}>Try this with your own data</Link>
              <button type="button" className="lp-btn ghost" onClick={replay}>Replay</button>
            </div>
          </div>
        )}
      </article>
      <button type="button" className="lp-pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>{paused ? 'Play background' : 'Pause background'}</button>
    </div>
  )
}

export function Hero({ variant }: { variant: VariantKey }) {
  const v = VARIANTS[variant]
  const [role, setRole] = useState<RoleId>('founder')
  const [text, setText] = useState(SCENES.founder.prompt)
  const copy = useRef<HTMLDivElement>(null)
  const nav = useNavigate()
  const [picked, setPicked] = useState(false)
  const keep = () => picked && presetRole(role)

  useLayoutEffect(() => {
    if (!copy.current || reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.lp-w', { yPercent: 110, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 })
      gsap.from('.lp-hero-in', { y: 18, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, delay: 0.35 })
    }, copy)
    return () => ctx.revert()
  }, [v.h1])

  const pick = (id: RoleId) => {
    setRole(id)
    setPicked(true)
    setText(SCENES[id].prompt)
    presetRole(id)
  }

  return (
    <section className="lp-hero lp-dark" aria-labelledby="lp-h1">
      <div className="lp-wrap lp-hero-grid">
        <div className="lp-hero-copy" ref={copy}>
          <h1 id="lp-h1">
            {v.h1.split(' ').slice(0, v.g).map((w, i) => (
              <Fragment key={i}><span className="lp-wm"><span className="lp-w">{w}</span></span>{' '}</Fragment>
            ))}
            <span className="lp-grad">
              {v.h1.split(' ').slice(v.g).map((w, i) => (
                <Fragment key={i}><span className="lp-wm"><span className="lp-w">{w}</span></span>{' '}</Fragment>
              ))}
            </span>
          </h1>
          <p className="lp-sub lp-hero-in">{v.sub}</p>

          <form className="lp-prompt lp-hero-in" onSubmit={(e) => { e.preventDefault(); keep(); nav('/signup') }}>
            <label htmlFor="lp-job">What should your agent do?</label>
            <div className="lp-prompt-box">
              <textarea id="lp-job" rows={2} value={text} onChange={(e) => setText(e.target.value)} />
              <button type="submit" className="lp-send" aria-label="Start free with this job"><Icon name="send" size={20} /></button>
            </div>
          </form>

          <div className="lp-roles lp-hero-in" role="group" aria-label="I work in">
            <span className="lp-roles-l">I work in</span>
            {ROLES.map((r) => (
              <button key={r.id} type="button" className="lp-chip" aria-pressed={role === r.id} onClick={() => pick(r.id)}>
                <Icon name={r.icon} size={16} />{r.label}
              </button>
            ))}
          </div>

          <div className="lp-sso lp-hero-in">
            <Link to="/signup" className="lp-btn ink big" onClick={keep}><GoogleMark size={18} />Continue with Google</Link>
            <Link to="/signup" className="lp-btn line big" onClick={keep}><MicrosoftMark size={18} />Continue with Microsoft</Link>
            <Link to="/signup" className="lp-link" onClick={keep}>or use email</Link>
          </div>
          <p className="lp-fine lp-hero-in">{FREE_LINE}</p>
        </div>
        <div className="lp-orbit">
          <Suspense fallback={null}><Constellation className="lp-const" light={false} /></Suspense>
          <Stage key={role} role={role} />
        </div>
      </div>
    </section>
  )
}
