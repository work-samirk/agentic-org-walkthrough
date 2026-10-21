import { Icon } from '../components/Icon'
import { STAGES } from './stages'

const CONNECTORS = ['Gmail', 'Bank feed', 'Zoho Books']
const PROMPT = 'Match every settlement to the bank statement and flag what does not add up.'

// One step is open at a time; the rail fills as it moves on. Each body replays when its step opens.
function Body({ i }: { i: number }) {
  if (i === 0)
    return (
      <ul className="gs-list">
        {CONNECTORS.map((c, n) => (
          <li key={c} style={{ ['--d' as string]: `${300 + n * 450}ms` }}>
            <span>{c}</span>
            <em><Icon name="check" size={13} strokeWidth={3} />Connected</em>
          </li>
        ))}
      </ul>
    )
  if (i === 1)
    return (
      <div className="gs-prompt">
        <p><span style={{ ['--n' as string]: PROMPT.length }}>{PROMPT}</span></p>
        <b className="gs-go">Create agent</b>
      </div>
    )
  if (i === 2)
    return (
      <pre className="gs-log">
        <span style={{ ['--d' as string]: '250ms' }}>mode        shadow</span>
        <span style={{ ['--d' as string]: '800ms' }}>recon.run   847 sample rows</span>
        <span style={{ ['--d' as string]: '1350ms' }}>matched     99.7%</span>
        <span style={{ ['--d' as string]: '1900ms' }}>sent        0, changed 0</span>
      </pre>
    )
  if (i === 3)
    return (
      <div className="gs-learn">
        <div className="gs-row"><small>Matched before your fixes</small><b>96%</b></div>
        <div className="gs-meter"><span /></div>
        <div className="gs-row"><small>After 3 corrections</small><b className="up">100%</b></div>
      </div>
    )
  return (
    <div className="gs-ask">
      <b>Settlement Reconciler</b>
      <small>Confidence 94%, floor 88%</small>
      <span className="gs-appr"><i>Approve</i><u><Icon name="check" size={14} strokeWidth={3} />Approved by Priya Nair</u></span>
    </div>
  )
}

export function StageGates({ i }: { i: number }) {
  return (
    <ol className="gs">
      {STAGES.map((s, n) => (
        <li key={s.key} data-now={n === i ? '' : undefined} data-done={n < i ? '' : undefined}>
          <span className="gs-node">{n < i ? <Icon name="check" size={14} strokeWidth={3} /> : n + 1}</span>
          <div className="gs-card">
            <header><b>{s.title}</b><small>{s.line}</small></header>
            {n === i && <div className="gs-body" key={`b${i}`}><Body i={i} /></div>}
          </div>
        </li>
      ))}
    </ol>
  )
}
