import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { DemoButton } from './DemoModal'

import { AsciiBackdrop } from './AsciiBackdrop'


export function OrgHeroV2() {
  return (
    <section className="lp-hero lp-dark v2-hero" aria-labelledby="cl-h1">
      <AsciiBackdrop />
      <div className="lp-wrap lp-hero-grid">
        <div className="lp-hero-copy">
          <p className="cl-badge"><span className="lp-pill lime"><i />v4.8.0: Governed agents with OACP trust boundaries</span></p>
          <h1 id="cl-h1"><span className="v2-h1-lead">Build AI Agents</span><span className="lp-grad">Production Ready<br />Enterprise Safe</span></h1>
          <ul className="lp-ticks cl-hero-ticks">
            <li><Icon name="check" size={16} strokeWidth={3} /><b>Prompt</b><span>Describe it in plain English</span></li>
            <li><Icon name="check" size={16} strokeWidth={3} /><b>Test</b><span>Dry-run it on sample data</span></li>
            <li><Icon name="check" size={16} strokeWidth={3} /><b>Ship</b><span>Use it anywhere, or sell it</span></li>
          </ul>
          <div className="lp-sso">
            <Link to="/signup" className="lp-btn ink big">Build Your First Agent<Icon name="arrowRight" size={18} /></Link>
            <DemoButton />
          </div>
          <p className="lp-fine">No credit card required, start now</p>
        </div>
      </div>
    </section>
  )
}
