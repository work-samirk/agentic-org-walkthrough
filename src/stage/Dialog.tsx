import { Icon } from '../components/Icon'
import { STAGES } from './stages'

// x: 0 = hard left, 1 = hard right of the positioned parent. y: percent from top.
export function Dialog({ i, x, y }: { i: number; x: number; y: number }) {
  const s = STAGES[i]
  return (
    <div className="dialog" style={{ ['--x' as string]: x, top: `${y}%`, ['--c' as string]: s.color }} role="status" aria-live="polite">
      <span className="dialog-icon">
        <Icon name={s.icon} size={22} />
      </span>
      <div key={s.key}>
        <b>{s.title}</b>
        <span>{s.line}</span>
      </div>
    </div>
  )
}
