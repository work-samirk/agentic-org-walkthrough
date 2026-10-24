import { useEffect } from 'react'

// the colour mode follows the browser or system setting and updates live when it changes
export function useSystemTheme() {
  useEffect(() => {
    const q = window.matchMedia('(prefers-color-scheme: dark)')
    // the landing page's product window is always light
    const embed = new URLSearchParams(window.location.search).has('embed')
    const apply = () => {
      document.documentElement.dataset.mode = q.matches && !embed ? 'dark' : 'light'
    }
    apply()
    q.addEventListener('change', apply)
    return () => q.removeEventListener('change', apply)
  }, [])
}
