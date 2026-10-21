import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Wordmark } from './Logo'
import { ThemeToggle } from './Theme'
import { Icon } from './Icon'
import { useStage } from '../stage/useStage'
import { StageMac } from '../stage/StageMac'
import { StageFlow } from '../stage/StageFlow'
import { StageSphere } from '../stage/StageSphere'

type Variant = 'mac' | 'sphere' | 'flow'
const VARIANTS: { id: Variant; label: string }[] = [
  { id: 'mac', label: 'Mac' },
  { id: 'sphere', label: 'Sphere' },
  { id: 'flow', label: 'Flow' },
]

function initialVariant(): Variant {
  try {
    const v = localStorage.getItem('ao-stage')
    if (v === 'mac' || v === 'sphere' || v === 'flow') return v
  } catch {
    /* ignore */
  }
  return 'sphere'
}

function Stage() {
  const ref = useRef<HTMLDivElement>(null)
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const { i } = useStage()

  useEffect(() => {
    try {
      localStorage.setItem('ao-stage', variant)
    } catch {
      /* ignore */
    }
  }, [variant])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.stage-copy, .viz', { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.1 })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <aside className="stage ao-field" ref={ref} aria-label="How AgenticOrg works">
      <div className="viz-toggle seg" role="group" aria-label="Animation style">
        {VARIANTS.map((v) => (
          <button key={v.id} type="button" aria-pressed={variant === v.id} onClick={() => setVariant(v.id)}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="stage-copy">
        <h2 className="ao-display">Agents you can see and control.</h2>
      </div>
      <div className="viz" key={variant}>
        {variant === 'mac' && <StageMac i={i} />}
        {variant === 'sphere' && <StageSphere i={i} />}
        {variant === 'flow' && <StageFlow i={i} />}
      </div>
    </aside>
  )
}

export function AuthLayout({ children, back }: { children: ReactNode; back?: { to: string; label: string } }) {
  // every visit to an auth screen starts a fresh demo journey
  useEffect(() => {
    try {
      ;['ao-platform-v2', 'ao-welcome', 'ao-user'].forEach((k) => sessionStorage.removeItem(k))
    } catch {
      /* ignore */
    }
  }, [])
  return (
    <div className="auth">
      <main className="auth-pane">
        <header className="auth-top">
          <Link to="/login" aria-label="AgenticOrg home">
            <Wordmark />
          </Link>
          <ThemeToggle />
        </header>
        <div className="auth-body">
          {back && (
            <Link className="back" to={back.to}>
              <Icon name="arrowLeft" size={18} />
              {back.label}
            </Link>
          )}
          {children}
        </div>
      </main>
      <Stage />
    </div>
  )
}
