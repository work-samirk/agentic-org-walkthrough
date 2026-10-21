import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { LogoMark } from '../components/Logo'
import { ThemeToggle } from '../components/Theme'
import { Icon } from '../components/Icon'
import { QUESTIONS } from './data'
import { loadAnswers, saveAnswers, type Answers } from './answers'

export function Welcome() {
  const nav = useNavigate()
  const { step } = useParams()
  const [answers, setAnswers] = useState<Answers>(loadAnswers)

  const flow = QUESTIONS
  const n = Number(step)
  if (!Number.isInteger(n) || n < 1 || n > flow.length) return <Navigate to="/welcome/1" replace />
  const q = flow[n - 1]
  const current = answers[q.key]

  function go(to: number, next: Answers) {
    saveAnswers(next)
    nav(to > flow.length ? '/home' : `/welcome/${to}`)
  }
  function skip() {
    const rest = { ...answers }
    delete rest[q.key]
    setAnswers(rest)
    go(n + 1, rest)
  }

  return (
    <div className="welcome">
      <div className="welcome-top">
        <button type="button" className="ghost" onClick={() => (n > 1 ? nav(`/welcome/${n - 1}`) : nav('/login'))}>
          <Icon name="arrowLeft" size={16} /> Back
        </button>
        <div className="welcome-right">
          <Link className="link small" to="/home">Skip all</Link>
          <ThemeToggle />
        </div>
      </div>

      <main className="welcome-main" key={q.key}>
        <LogoMark size={46} calm />
        <h1>{q.title}</h1>
        <p className="why">{q.why}</p>

        <div className="opts" style={{ ['--cols' as string]: q.cols }} role="radiogroup" aria-label={q.title}>
          {q.options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={current === o.id}
              className="opt"
              onClick={() => setAnswers((a) => ({ ...a, [q.key]: o.id }))}
            >
              {o.icon && <Icon name={o.icon} size={22} />}
              <b>{o.label}</b>
            </button>
          ))}
        </div>

        <div className="welcome-actions">
          <button type="button" className="btn primary" disabled={!current} onClick={() => go(n + 1, answers)}>
            {n === flow.length ? 'Finish' : 'Continue'}
          </button>
          <button type="button" className="quiet" onClick={skip}>Skip for now</button>
        </div>
      </main>

      <div className="dots" role="progressbar" aria-valuemin={1} aria-valuemax={flow.length} aria-valuenow={n} aria-label={`Question ${n} of ${flow.length}`}>
        {flow.map((f, k) => (
          <span key={f.key} data-on={k === n - 1 ? '' : undefined} data-done={k < n - 1 ? '' : undefined} />
        ))}
      </div>
    </div>
  )
}
