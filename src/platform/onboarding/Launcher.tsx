import { Sparkles } from 'lucide-react'
import { usePlatform } from '../state'

export function Launcher() {
  const { s, set } = usePlatform()
  const st = s.tour.status

  // a finished tour is done for good: nothing about it stays on screen
  if (st === 'completed') return null
  const label = st === 'paused' ? 'Resume tour' : 'Show me around'

  function go() {
    if (s.checklistDismissed) set({ checklistDismissed: false })
    if (st === 'paused') set({ tour: { status: 'active', step: s.tour.step } })
    else set({ tour: { status: 'active', step: 0 } })
  }

  return (
    <div className="ob-launch">
      <button type="button" className="ob-launch-btn" onClick={go} disabled={st === 'active'}>
        <Sparkles size={16} />
        {st === 'active' ? 'Tour in progress' : label}
      </button>
    </div>
  )
}
