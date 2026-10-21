import { useEffect, useState } from 'react'
import { Icon } from './Icon'

type Mode = 'light' | 'dark'

function initial(): Mode {
  try {
    const saved = localStorage.getItem('ao-mode')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* storage can be blocked */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(initial)

  useEffect(() => {
    document.documentElement.dataset.mode = mode
    try {
      localStorage.setItem('ao-mode', mode)
    } catch {
      /* ignore */
    }
  }, [mode])

  return (
    <div className="seg" role="group" aria-label="Colour mode">
      {(['light', 'dark'] as const).map((m) => (
        <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} aria-label={`${m} mode`}>
          <Icon name={m === 'light' ? 'sun' : 'moon'} size={18} />
        </button>
      ))}
    </div>
  )
}
