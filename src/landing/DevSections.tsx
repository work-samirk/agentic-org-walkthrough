import { Icon } from '../components/Icon'
import { LogoMark } from '../components/Logo'

/* What comes built in: our column is lifted and outlined, theirs is quiet ------------------- */
const ROWS: [string, string, string][] = [
  ['First agent', 'Describe it in plain English. It is ready to test straight away.', 'You write the graph, the prompts and the glue code.'],
  ['Running it', 'We run it, with schedules, scaling and a monthly cost cap.', 'You host, scale and monitor it.'],
  ['Human approval', 'Low-confidence actions wait for a person, with the reasoning shown.', 'You design and build the approval flow.'],
  ['Testing', 'Dry-run on sample data and see its accuracy before it goes live.', 'You set up your own tests and evaluation.'],
  ['Audit trail', 'Every step, tool call and approval is logged.', 'You add logging and keep the records.'],
  ['Tools', 'Ready-made connectors with permissions you control.', 'You build and maintain every integration.'],
  ['Where it runs', 'In the dashboard or your own app. Use it yourself or sell it.', 'You build every interface yourself.'],
]

export function Compare() {
  return (
    <section id="why" className="lp-sec lp-soft dv" aria-labelledby="dv-h-why">
      <div className="lp-wrap">
        <div className="lp-head c">
          <h2 id="dv-h-why">What comes built in.</h2>
          <p className="lp-lead">With a framework like LangGraph, you build all of this yourself.</p>
        </div>
        <div className="dv-cmp" role="table" aria-label="AgenticOrg compared with building it yourself">
          <i className="dv-cmp-hl" aria-hidden="true" />
          <div className="dv-cmp-h" role="row">
            <span role="columnheader" />
            <span role="columnheader" className="us"><LogoMark size={22} />AgenticOrg</span>
            <span role="columnheader">Building it yourself</span>
          </div>
          {ROWS.map(([k, a, b]) => (
            <div key={k} className="dv-cmp-r" role="row">
              <b role="rowheader">{k}</b>
              <span role="cell" className="us"><Icon name="check" size={16} strokeWidth={3} />{a}</span>
              <span role="cell" className="them">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* The secondary audience: founders and business teams --------------------------------------- */
const FD_TILES = [
  { c: '#ff7f63', t: 'A team in 3 minutes', d: 'Share your department structure and get an agent for every role.' },
  { c: '#6db1f5', t: 'You approve what matters', d: 'Anything risky waits for a yes from a person.' },
  { c: '#9b82f5', t: 'See what it saves', d: 'Estimate the hours and money back before you start.' },
]
export function TeamsIntro() {
  return (
    <section id="teams" className="lp-sec lp-dark fd" aria-labelledby="fd-h">
      <div className="lp-wrap">
        <div className="fd-card">
          <img className="fd-photo" src="/founder.webp" alt="" width="1000" height="1500" loading="lazy" decoding="async" />
          <div className="fd-copy">
            <h2 id="fd-h">Founder? Start with a ready team.</h2>
            <p className="lp-lead">Finance, HR, marketing and support agents, with a person approving what matters.</p>
            <a href="#org" className="lp-btn ink big">Start With Ready Agents</a>
          </div>
          <ul className="fd-tiles">
            {FD_TILES.map((x) => (
              <li key={x.t}>
                <i className="fd-orb" style={{ ['--c' as string]: x.c }} aria-hidden="true" />
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
