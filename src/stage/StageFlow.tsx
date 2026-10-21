import { Icon } from '../components/Icon'
import { STAGES } from './stages'
import { Dialog } from './Dialog'

const P = [
  { x: 64, y: 292 },
  { x: 170, y: 176 },
  { x: 288, y: 262 },
  { x: 386, y: 128 },
  { x: 470, y: 224 },
]

// A different corner of the graph for each stage, each clear of every node, label and line.
const DIALOG = [
  { x: 0.04, y: -6 },
  { x: 1.0, y: 92 },
  { x: 0.96, y: -6 },
  { x: 0.4, y: 94 },
  { x: 0.0, y: 94 },
]

export function StageFlow({ i }: { i: number }) {
  const { x, y } = DIALOG[i]
  return (
    <div className="flow-wrap">
    <svg className="flow" viewBox="0 0 540 380" role="img" aria-label="Connect, create, run in Shadow Mode, learn, approve">
      {P.slice(1).map((p, n) => (
        <line key={n} x1={P[n].x} y1={P[n].y} x2={p.x} y2={p.y} className="seg-line" data-on={n < i ? '' : undefined} />
      ))}
      <line x1={P[2].x} y1={P[2].y} x2={P[0].x} y2={P[0].y} className="back-line" data-on={i >= 3 ? '' : undefined} />

      <circle className="packet" r="6" style={{ transform: `translate(${P[i].x}px, ${P[i].y}px)` }} />

      {P.map((p, n) => {
        const on = n === i
        const done = n < i
        return (
          <g key={n} className="node" data-on={on ? '' : undefined} data-done={done ? '' : undefined} style={{ ['--c' as string]: STAGES[n].color }}>
            {on && <circle className="halo" cx={p.x} cy={p.y} r="30" />}
            <circle className="disc" cx={p.x} cy={p.y} r="30" />
            <Icon name={done ? 'check' : STAGES[n].icon} x={p.x - 12} y={p.y - 12} size={24} />
            <text x={p.x} y={p.y + 54} textAnchor="middle">{STAGES[n].label}</text>
          </g>
        )
      })}
    </svg>
      <Dialog i={i} x={x} y={y} />
    </div>
  )
}
