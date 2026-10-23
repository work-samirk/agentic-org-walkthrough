import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { ROWS, TIERS } from './Pricing'

const Cta = ({ t, big }: { t: (typeof TIERS)[number]; big?: boolean }) =>
  t.to.startsWith('/')
    ? <Link to={t.to} className={`lp-btn ${t.popular ? 'ink' : 'line'}${big ? ' big' : ' sm'}`}>{t.cta}</Link>
    : <a href={t.to} className={`lp-btn ${t.popular ? 'ink' : 'line'}${big ? ' big' : ' sm'}`}>{t.cta}</a>

const cell = (v: string | boolean) =>
  v === true ? <Icon name="check" size={18} strokeWidth={3} aria-label="Included" />
  : v === false ? <span className="pz-no" aria-label="Not included">&ndash;</span>
  : v

const Tabs = ({ plan, set }: { plan: number; set: (n: number) => void }) => (
  <div className="pz-tabs" role="tablist" aria-label="Plans">
    {TIERS.map((t, i) => <button key={t.name} type="button" role="tab" aria-selected={plan === i} onClick={() => set(i)}>{t.name}</button>)}
  </div>
)

// The plan columns carry the price and the button, and the rows sit under them, so a button is always in reach.
export function PricingSection() {
  const [plan, setPlan] = useState(1)
  return (
    <section id="pricing" className="lp-sec lp-dark pz" aria-labelledby="pz-a">
      <div className="lp-wrap">
        <div className="pz-grid" data-plan={plan} role="table" aria-label="Plans and features" style={{ gridTemplateRows: `repeat(${ROWS.length + 1}, auto)` }}>
          <div className="pz-hl" aria-hidden="true" />
          <div className="pz-r pz-head" role="row">
            <div className="pz-lab pz-title" role="columnheader"><h2 id="pz-a">Simple, transparent pricing.</h2><Tabs plan={plan} set={setPlan} /></div>
            {TIERS.map((t, i) => (
              <div key={t.name} className="pz-c pz-plan" data-c={i} role="columnheader">
                <b>{t.name}</b>
                {t.price !== 'Custom' && <p className="pz-price"><i>{t.price}</i><span>{t.period}</span></p>}
                <p className="pz-blurb">{t.blurb}</p>
                <Cta t={t} big />
              </div>
            ))}
          </div>
          {ROWS.map(([f, ...v]) => (
            <div key={f} className="pz-r" role="row">
              <div className="pz-lab" role="rowheader">{f}</div>
              {v.map((x, i) => <div key={i} className="pz-c" data-c={i} role="cell">{cell(x)}</div>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

