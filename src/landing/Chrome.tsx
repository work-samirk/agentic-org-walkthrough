import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wordmark } from '../components/Logo'
import { BANNER } from './config'

export function Chrome({ stuck, links, base = '' }: { stuck: boolean; links: [string, string][]; base?: string }) {
  // the bar follows whatever it sits over: dark over dark sections, light glass over light ones
  const [dark, setDark] = useState(true)
  useEffect(() => {
    const on = () => {
      const el = document.elementsFromPoint(window.innerWidth / 2, 130).find((e) => !e.closest('header.lp-nav'))
      setDark(!!el?.closest('.lp-dark'))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <>
      <div className="lp-banner" role="region" aria-label="Announcements">
        <div className="lp-static">{BANNER.map((b) => <span key={b}>{b}</span>)}</div>
      </div>
      <header className={`lp-nav${dark ? ' lp-dark' : ''}`} data-stuck={stuck ? '' : undefined}>
        <div className="lp-wrap lp-nav-in">
          <a href={base || '#top'} aria-label="AgenticOrg home"><Wordmark /></a>
          <nav aria-label="Page">
            {links.map(([id, l]) => <a key={id} href={`${base}#${id}`}>{l}</a>)}
          </nav>
          <div className="lp-nav-r">
            <Link to="/login" className="lp-btn ghost">Sign in</Link>
            <Link to="/signup" className="lp-btn ink">Start free</Link>
          </div>
        </div>
      </header>
    </>
  )
}
