import { useEffect, useState } from 'react'
import { STAGES } from './stages'

export function useStage(interval = 3400) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced || paused) return
    const t = window.setInterval(() => setI((n) => (n + 1) % STAGES.length), interval)
    return () => window.clearInterval(t)
  }, [interval, reduced, paused])

  return { i, set: setI, pause: setPaused }
}
