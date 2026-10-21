import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

// if the chunk fails to load once (dropped connection, a redeploy), try again before giving up
type Mod = typeof import('./Warps')
const load = (): Promise<Mod> => import('./Warps').catch(() => new Promise<void>((r) => window.setTimeout(r, 800)).then(load))
const WarpTree = lazy(() => load().then((m) => ({ default: m.WarpTree })))
const WarpSolo = lazy(() => load().then((m) => ({ default: m.WarpSolo })))

export function OrgHero({ art }: { art: 'tree' | 'solo' }) {
  return (
    <section className="lp-hero lp-dark" aria-labelledby="cl-h1">
      <div className="lp-wrap lp-hero-grid">
        <div className="lp-hero-copy">
          <p className="cl-badge"><span className="lp-pill lime"><i />v4.8.0: Governed agents with OACP trust boundaries</span></p>
          <h1 id="cl-h1">Your Back Office <span className="lp-grad">Runs Itself.</span></h1>
          <p className="lp-sub">Name them. Train them. Deploy them. AI virtual employees that process invoices, run payroll, launch campaigns, and resolve incidents, with human approval on every critical decision.</p>
          <div className="lp-sso">
            <Link to="/signup" className="lp-btn ink big">Start Free<Icon name="arrowRight" size={18} /></Link>
            <a href="#live" className="lp-btn line big">Watch Demo<Icon name="arrowRight" size={18} className="cl-down" /></a>
          </div>
          <p className="lp-fine">No credit card required · Free to start · Full audit trail built in</p>
          <ul className="lp-ticks cl-hero-ticks">
            <li><Icon name="check" size={16} strokeWidth={3} />Upload your org chart CSV</li>
            <li><Icon name="check" size={16} strokeWidth={3} />Agents match your hierarchy</li>
            <li><Icon name="check" size={16} strokeWidth={3} />Human approval on every critical decision</li>
          </ul>
        </div>
        <div className="cl-org">
          <Suspense fallback={null}>{art === 'tree' ? <WarpTree className="cl-org-player" /> : <WarpSolo className="cl-org-player" />}</Suspense>
        </div>
      </div>
    </section>
  )
}
