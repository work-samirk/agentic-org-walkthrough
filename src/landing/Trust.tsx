import { Icon } from '../components/Icon'

const CHAIN = [
  ['Merchant systems', 'Catalog, price, order truth'],
  ['Seller agent', 'Connector setup, preview'],
  ['Grantex authority', 'Signed OACP artifacts'],
  ['OACP cache', 'Scoped refs, freshness'],
  ['Buyer agent', 'Answers, compares, refuses'],
  ['Channels', 'ChatGPT, Claude, web, MCP'],
]

const FACTS = [
  { tag: 'Source', h: 'Facts come from merchant systems', p: 'Catalog, price and policy stay grounded in approved sources.' },
  { tag: 'Authority', h: 'Grantex signs the OACP artifacts', p: 'Grantex owns the protocol and policy. AgenticOrg consumes the signed artifacts.' },
  { tag: 'Runtime', h: 'Agents show freshness before they act', p: 'Source labels, freshness and revocation are checked before an answer or a handoff.' },
  { tag: 'Boundary', h: 'Commitment stays gated', p: 'Checkout, payments and private merchant APIs stay blocked until a separate rollout approves that exact path.' },
]

export function Trust() {
  return (
    <section id="trust" className="lp-sec tr" aria-labelledby="tr-h">
      <div className="lp-wrap">
        <div className="lp-head tr-head">
          <h2 id="tr-h">A trust layer for seller and buyer agents.</h2>
          <p className="lp-lead">OACP gives commerce agents one way to check source-backed facts, freshness and commitment limits before they answer, prepare or refuse a buyer request.</p>
        </div>

        <div className="tr-grid">
          <article className="tr-map lp-dark lg-dark" aria-label="Who owns what in an agentic commerce request">
            <p className="tr-eyebrow">Custody map</p>
            <h3>Who owns what in an agentic commerce request</h3>
            <ol className="tr-chain">
              {CHAIN.map(([a, b], i) => (
                <li key={a} style={{ ['--i' as string]: i }}>
                  <span className="tr-n">{i + 1}</span>
                  <b>{a}</b>
                  <small>{b}</small>
                </li>
              ))}
            </ol>
            <div className="tr-rails">
              <div className="tr-rail"><span>Provider rail</span>Mandates and payments stay with approved providers.</div>
              <div className="tr-rail fail"><span>Fail-closed</span>Missing, stale or revoked artifacts are refused.</div>
            </div>
          </article>

          {FACTS.map((f, i) => (
            <article key={f.tag} className={`tr-card c${i}`}>
              <span className="tr-tag">{f.tag}</span>
              <h3>{f.h}</h3>
              <p>{f.p}</p>
            </article>
          ))}

          <article className="tr-posture lp-dark lg-dark">
            <p className="tr-eyebrow">Protocol posture</p>
            <p>AgenticOrg uses OACP for grounded discovery and prepared handoffs. This section does not claim live checkout or payment execution.</p>
            <a href="https://agenticorg.pinelabs.com/open-agentic-commerce-protocol" target="_blank" rel="noopener noreferrer" className="lp-btn ink">Explore the OACP Model<Icon name="arrowRight" size={18} /></a>
          </article>
        </div>
      </div>
    </section>
  )
}
