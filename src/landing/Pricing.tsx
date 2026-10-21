import './landing.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Chrome } from './Chrome'
import { Footer } from './Start'

// Plans, comparison and questions follow the product's real pricing page.
const TIERS = [
  { name: 'Free', price: '$0', period: '/month', blurb: 'Get started with core AI agents and see results immediately.', cta: 'Start free', to: '/signup', features: ['39 AI agents', '20 connectors', '500 tasks/day', 'Community support', 'Shadow mode testing', 'Basic audit log', 'Single workspace'] },
  { name: 'Pro', price: '$2', period: '/month', blurb: 'Scale your operations with advanced agents and priority support.', cta: 'Start Pro', to: '#', popular: true, features: ['Unlimited AI agents', '112 connectors', 'Unlimited tasks', 'Email support', 'Custom workflows', 'Priority HITL queue', 'Advanced analytics', 'API access', 'Team workspaces'] },
  { name: 'Enterprise', price: 'Custom', period: '', blurb: 'Full platform with dedicated support, SLA and custom deployments.', cta: 'Contact sales', to: 'mailto:sanjeev@agenticorg.ai', features: ['Unlimited AI agents', '112 connectors', 'Unlimited everything', 'Dedicated support', '99.9% SLA guarantee', 'Custom connectors', 'On-premise option', 'SSO / SAML', 'Custom integrations', 'Dedicated CSM'] },
]

const ROWS: [string, string | boolean, string | boolean, string | boolean][] = [
  ['AI agents', '39', 'Unlimited', 'Unlimited'],
  ['Connectors', '20', '112', '112'],
  ['Tasks per day', '500', 'Unlimited', 'Unlimited'],
  ['Shadow mode', true, true, true],
  ['Custom workflows', false, true, true],
  ['Human-in-the-loop', 'Basic', 'Priority', 'Dedicated'],
  ['Audit log', '7 days', '90 days', 'Unlimited'],
  ['API access', false, true, true],
  ['Analytics and observatory', 'Basic', 'Advanced', 'Full'],
  ['SSO / SAML', false, false, true],
  ['Custom connectors', false, false, true],
  ['On-premise deployment', false, false, true],
  ['SLA guarantee', false, false, '99.9%'],
  ['Support', 'Community', 'Email', 'Dedicated'],
  ['Dedicated CSM', false, false, true],
]

const FAQS = [
  ['Can I switch plans at any time?', 'Yes. You can upgrade or downgrade at any time. When upgrading, you get immediate access to the new features. When downgrading, the change takes effect at the next billing cycle.'],
  ['What happens when I hit the task limit on Free?', 'Tasks beyond the daily limit are queued and processed the next day. You will get a notification suggesting an upgrade. No data is lost.'],
  ['Do you offer annual billing?', 'Yes. Annual plans receive a 20% discount. Contact our sales team for details on annual Enterprise agreements.'],
  ['What connectors are included?', 'Free includes 20 core connectors (Oracle, SAP, Salesforce, Slack, GSTN and more). Pro and Enterprise include every native connector (Darwinbox, Stripe, HubSpot, EPFO, Jira and more). Enterprise adds custom integrations.'],
  ['Is my data secure?', 'All plans include encryption at rest and in transit, tenant isolation and HMAC-signed audit logs. Enterprise adds on-premise deployment, SSO/SAML and a dedicated security review.'],
  ['Can I try Pro features before committing?', 'Yes. We offer a 14-day free trial of Pro. Book a demo and we will set it up for your team.'],
]

const cell = (v: string | boolean) => (v === true ? <Icon name="check" size={18} strokeWidth={2.6} /> : v === false ? <i className="pr-no" aria-label="Not included" /> : v)

export function Pricing() {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(0)
  useEffect(() => {
    const on = () => setStuck(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.title = 'Pricing | AgenticOrg' }, [])

  return (
    <div className="lp">
      <Chrome stuck={stuck} base="/" links={[['product', 'Product'], ['live', 'Live agents'], ['developers', 'Developers'], ['roi', 'Savings'], ['reviews', 'Reviews']]} />
      <main id="top">
        <section className="lp-sec lp-dark pr-hero" aria-labelledby="pr-h">
          <div className="lp-wrap">
            <div className="lp-head c">
              <h1 id="pr-h">Simple, <span className="lp-gt">transparent pricing.</span></h1>
              <p className="lp-lead">Start free. Scale to unlimited agents as your team grows. No hidden fees. Cancel anytime.</p>
            </div>
            <div className="pr-tiers">
              {TIERS.map((t) => (
                <article key={t.name} className="pr-tier lg-dark" data-pop={t.popular ? '' : undefined}>
                  {t.popular && <span className="pr-pop">Most popular</span>}
                  <h2>{t.name}</h2>
                  <p className="pr-price"><b>{t.price}</b><span>{t.period}</span></p>
                  <p className="pr-blurb">{t.blurb}</p>
                  {t.to.startsWith('/') ? <Link to={t.to} className="lp-btn ink big">{t.cta}</Link> : <a href={t.to} className={`lp-btn ${t.popular ? 'ink' : 'line'} big`}>{t.cta}</a>}
                  <ul>{t.features.map((f) => <li key={f}><Icon name="check" size={16} strokeWidth={3} />{f}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-sec" aria-labelledby="pr-cmp">
          <div className="lp-wrap">
            <div className="lp-head c"><h2 id="pr-cmp">Compare plans in detail.</h2></div>
            <div className="pr-table" role="region" aria-label="Plan comparison" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Feature</th>{TIERS.map((t) => <th key={t.name} scope="col" data-pop={t.popular ? '' : undefined}>{t.name}</th>)}</tr></thead>
                <tbody>
                  {ROWS.map(([f, a, b, c]) => (
                    <tr key={f}><th scope="row">{f}</th><td>{cell(a)}</td><td data-pop="">{cell(b)}</td><td>{cell(c)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="lp-sec lp-soft" aria-labelledby="pr-faq">
          <div className="lp-wrap pr-faq">
            <div className="lp-head c"><h2 id="pr-faq">Frequently asked questions.</h2></div>
            <div className="pr-qs">
              {FAQS.map(([q, a], i) => (
                <details key={q} open={open === i}><summary onClick={(e) => { e.preventDefault(); setOpen(open === i ? -1 : i) }}>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-sec lp-dark pr-end" aria-labelledby="pr-end">
          <div className="lp-wrap">
            <div className="lp-head c">
              <h2 id="pr-end">Ready to <span className="lp-gt">automate your enterprise?</span></h2>
              <p className="lp-lead">Start free with 39 agents and 20 connectors. Upgrade to Pro for unlimited tasks.</p>
              <div className="pr-cta">
                <Link to="/signup" className="lp-btn ink big">Start free</Link>
                <a href="mailto:sanjeev@agenticorg.ai" className="lp-btn line big">Book a demo</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
