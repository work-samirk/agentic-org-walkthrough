import type { ReactNode } from 'react'
import { Info } from 'lucide-react'
import { usePlatform } from '../state'

// A one-sentence "What is this?" the first time a new idea appears. Shown once, then gone.
export function Hint({ id, title, children, inline }: { id: string; title: string; children: ReactNode; inline?: boolean }) {
  const { s, see } = usePlatform()
  if (s.seen.includes(id)) return null
  return (
    <div className={`ob-hint${inline ? ' ob-hint-wide' : ''}`} role="note">
      <Info size={18} aria-hidden="true" />
      <div>
        <b>{title}</b>
        <p>{children}</p>
      </div>
      <button type="button" onClick={() => see(id)}>Got it</button>
    </div>
  )
}
