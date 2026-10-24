import { Icon } from '../components/Icon'
import { LogoMark } from '../components/Logo'

/* What comes built in: our column is lifted and outlined, theirs is quiet ------------------- */
const ROWS: [string, string, string][] = [
  ['Agent creation', 'Plain-English setup, ready to test immediately.', 'Custom graph, prompt and integration code.'],
  ['Operations', 'Managed hosting with scheduling, scaling and cost caps.', 'Self-hosted infrastructure and monitoring.'],
  ['Human approval', 'Built-in approval queue with confidence thresholds and visible reasoning.', 'Approval flow designed and built in-house.'],
  ['Testing', 'Shadow Mode with accuracy scoring on sample data.', 'Separate test and evaluation tooling.'],
  ['Audit trail', 'Every step, tool call and approval logged.', 'Custom logging and record retention.'],
  ['Integrations', 'Pre-built connectors with scoped permissions.', 'Each integration built and maintained in-house.'],
  ['Deployment', 'Dashboard or embedded in an existing app, with the option to resell.', 'Custom interface for every channel.'],
]

export function Compare() {
  return (
    <section id="why" className="lp-sec lp-soft dv" aria-labelledby="dv-h-why">
      <div className="lp-wrap">
        <div className="lp-head c">
          <h2 id="dv-h-why">What comes built in.</h2>
          <p className="lp-lead">Frameworks such as LangGraph leave each of these to the engineering team.</p>
        </div>
        <div className="dv-cmp" role="table" aria-label="AgenticOrg compared with other platforms">
          <i className="dv-cmp-hl" aria-hidden="true" />
          <div className="dv-cmp-h" role="row">
            <span role="columnheader" />
            <span role="columnheader" className="us"><LogoMark size={22} />AgenticOrg</span>
            <span role="columnheader">Other platforms</span>
          </div>
          {ROWS.map(([k, a, b]) => (
            <div key={k} className="dv-cmp-r" role="row">
              <b role="rowheader">{k}</b>
              <span role="cell" className="us"><Icon name="check" size={16} strokeWidth={3} />{a}</span>
              <span role="cell" className="them">{b}</span>
            </div>
          ))}
        </div>
        <div className="dv-m" aria-label="AgenticOrg compared with other platforms">
          <div className="dv-m-card dv-m-us">
            <p className="dv-m-name"><LogoMark size={22} />AgenticOrg</p>
            <ul>{ROWS.map(([k, a]) => <li key={k}><Icon name="check" size={16} strokeWidth={3} /><div><b>{k}</b><span>{a}</span></div></li>)}</ul>
          </div>
          <p className="dv-m-vs" aria-hidden="true"><span>vs</span></p>
          <div className="dv-m-card dv-m-them">
            <p className="dv-m-name">Other platforms</p>
            <ul>{ROWS.map(([k, , b]) => <li key={k}><i aria-hidden="true" /><div><b>{k}</b><span>{b}</span></div></li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* The secondary audience: founders and business teams --------------------------------------- */
const FD_TILES = [
  { icon: 'clock', t: 'A team in 3 minutes', d: 'Pick Finance, HR, Marketing or Support. Each agent comes with its prompt, tools and approval rules already set.' },
  { icon: 'shield', t: 'You hold the limits', d: 'Set what each agent may spend or send. Anything above it waits for your yes.' },
  { icon: 'coin', t: 'No surprise bills', d: 'Start free. A monthly cost cap stops any agent from running past your budget.' },
] as const
export function TeamsIntro() {
  return (
    <section id="teams" className="lp-sec lp-dark fd" aria-labelledby="fd-h">
      <div className="lp-wrap">
        <div className="fd-card">
          <img className="fd-photo" src="/founder.webp" alt="" width="1600" height="1194" loading="lazy" decoding="async" />
          <div className="fd-copy">
            <h2 id="fd-h">Founder? Start with a ready team.</h2>
            <p className="lp-lead">Finance, HR, marketing and support agents, with a person approving what matters.</p>
            <a href="#org" className="lp-btn ink big">Start With Ready Agents</a>
          </div>
          <ul className="fd-tiles">
            {FD_TILES.map((x) => (
              <li key={x.t}>
                <i className="fd-ico" aria-hidden="true"><Icon name={x.icon} size={20} /></i>
                <b>{x.t}</b>
                <span>{x.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
