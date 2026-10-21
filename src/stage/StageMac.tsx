import { Icon } from '../components/Icon'
import { STAGES } from './stages'
import { Dialog } from './Dialog'

const POS = [
  { x: 0.96, y: 72 },
  { x: 0.04, y: 74 },
  { x: 0.96, y: 76 },
  { x: 0.04, y: 74 },
  { x: 0.96, y: 72 },
]

const CONNECTORS = ['Gmail', 'Bank', 'Zoho Books', 'Slack']

export function StageMac({ i }: { i: number }) {
  return (
    <div className="mac-wrap" data-stage={STAGES[i].key}>
      {CONNECTORS.map((c, n) => (
        <span key={c} className={`float-chip f${n}`}>
          <Icon name="plug" size={16} />
          {c}
        </span>
      ))}

      <Dialog i={i} x={POS[i].x} y={POS[i].y} />

      <div className="mac">
        <div className="mac-bar">
          <span /><span /><span />
          <small>AgenticOrg</small>
        </div>
        <div className="mac-body">
          <ol className="mac-side">
            {STAGES.map((s, n) => (
              <li key={s.key} data-on={n === i ? '' : undefined} data-done={n < i ? '' : undefined}>
                <Icon name={s.icon} size={16} />
                {s.label}
              </li>
            ))}
          </ol>

          <div className="mac-main">
            <section data-on={i === 0 ? '' : undefined}>
              <h4>Connectors</h4>
              <div className="tiles">
                {CONNECTORS.map((c, n) => (
                  <div className="mini" key={c} style={{ ['--d' as string]: `${n * 140}ms` }}>
                    <b>{c}</b>
                    <em><Icon name="check" size={12} strokeWidth={3} /> Connected</em>
                  </div>
                ))}
              </div>
            </section>

            <section data-on={i === 1 ? '' : undefined}>
              <h4>New agent</h4>
              <div className="prompt">Match every settlement file against the bank statement and flag what does not add up.</div>
              <span className="mini-btn">Create agent</span>
            </section>

            <section data-on={i === 2 ? '' : undefined}>
              <h4>Settlement matcher <span className="badge lime">Shadow Mode</span></h4>
              {['Settlement 0412 matched', 'Settlement 0413 matched', 'Settlement 0414 has a gap'].map((t, n) => (
                <div className="row" key={t} style={{ ['--d' as string]: `${n * 220}ms` }}>
                  <Icon name={n === 2 ? 'alert' : 'check'} size={16} />
                  {t}
                </div>
              ))}
              <small className="foot">Sample data. Nothing real is touched.</small>
            </section>

            <section data-on={i === 3 ? '' : undefined}>
              <h4>What it learned from you</h4>
              {['Match on order ID first', 'Ignore gaps under ₹5', 'Group refunds by merchant'].map((t, n) => (
                <div className="row" key={t} style={{ ['--d' as string]: `${n * 220}ms` }}>
                  <Icon name="loop" size={16} />
                  {t}
                </div>
              ))}
            </section>

            <section data-on={i === 4 ? '' : undefined}>
              <h4>Needs you</h4>
              <div className="approve">
                <span className="dot coral ring" />
                <div>
                  <b>Refund of ₹4,200</b>
                  <small>Nothing is sent until you approve</small>
                </div>
                <span className="mini-btn dark">Approve</span>
              </div>
              <span className="badge lime live">Then it goes live</span>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
