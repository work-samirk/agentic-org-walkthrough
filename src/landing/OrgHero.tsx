import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { DemoButton } from './DemoModal'

// if the chunk fails to load once (dropped connection, a redeploy), try again before giving up
type Mod = typeof import('./Warps')
const load = (): Promise<Mod> => import('./Warps').catch(() => new Promise<void>((r) => window.setTimeout(r, 800)).then(load))
const WarpTree = lazy(() => load().then((m) => ({ default: m.WarpTree })))
const StrandsSolo = lazy(() => import('./HeroOrb').then((m) => ({ default: m.StrandsSolo })))

export function OrgHero({ art }: { art: 'tree' | 'solo' }) {
  return (
    <section className="lp-hero lp-dark" aria-labelledby="cl-h1">
      <div className="lp-wrap lp-hero-grid">
        <div className="lp-hero-copy">
          <p className="cl-badge"><span className="lp-pill lime"><i />v4.8.0: Governed agents with OACP trust boundaries</span></p>
          <h1 id="cl-h1">Build AI Agents<br /><span className="lp-grad">Production Ready<br />Enterprise Safe</span></h1>
          <ul className="lp-ticks cl-hero-ticks">
            <li><Icon name="check" size={16} strokeWidth={3} /><b>Prompt</b><span>Describe it in plain English</span></li>
            <li><Icon name="check" size={16} strokeWidth={3} /><b>Test</b><span>Dry-run it on sample data</span></li>
            <li><Icon name="check" size={16} strokeWidth={3} /><b>Ship</b><span>Use it anywhere, or sell it</span></li>
          </ul>
          <div className="lp-sso">
            <Link to="/signup" className="lp-btn ink big">Build Your First Agent<Icon name="arrowRight" size={18} /></Link>
            <DemoButton />
          </div>
          <p className="lp-fine">No credit card required · Free to start · Full audit trail built in</p>
          <p className="lp-fine cl-teams-line">Not a developer? <a href="#teams">Start with ready made agents</a>.</p>
        </div>
        <div className="cl-org">
          <Suspense fallback={null}>{art === 'tree' ? <WarpTree className="cl-org-player" /> : <StrandsSolo className="cl-org-player" />}</Suspense>
        </div>
      </div>
    </section>
  )
}
