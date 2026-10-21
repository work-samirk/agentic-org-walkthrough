import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Wordmark } from './Logo'
import { ThemeToggle } from './Theme'
import { Icon } from './Icon'
import { useStage } from '../stage/useStage'
import { StageGates } from '../stage/StageGates'

function Stage() {
  const ref = useRef<HTMLDivElement>(null)
  const { i } = useStage(4600)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.stage-copy, .viz', { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.1 })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <aside className="stage ao-field" ref={ref} aria-label="How AgenticOrg works">
      <div className="stage-copy">
        <h2 className="ao-display">Agents you can see and control.</h2>
      </div>
      <div className="viz">
        <StageGates i={i} />
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
