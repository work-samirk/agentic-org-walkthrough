import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wordmark } from '../components/Logo'
import { BANNER } from './config'

export function Chrome({ stuck, links, base = '', clearOverHero = false }: { stuck?: boolean; links: [string, string][]; base?: string; clearOverHero?: boolean }) {
  // the bar follows whatever it sits over: dark over dark sections, light glass over light ones
  const [dark, setDark] = useState(true)
  // clearOverHero: no fill until the hero has scrolled up behind the bar
  const [pastHero, setPastHero] = useState(false)
  // when the page doesn't pass `stuck`, the bar tracks it itself so a scroll past 40px re-renders only the header, not the whole page
  const [ownStuck, setOwnStuck] = useState(false)
  useEffect(() => {
    const on = () => {
      const el = document.elementsFromPoint(window.innerWidth / 2, 130).find((e) => !e.closest('header.lp-nav'))
      setOwnStuck(window.scrollY > 40)
      const hero = document.querySelector('.lp-hero')
      const past = !hero || hero.getBoundingClientRect().bottom <= 72
      setPastHero(past)
      // clearOverHero pages: transparent-and-dark over the hero, then one white bar for the rest of the page
      setDark(clearOverHero ? !past : !!el?.closest('.lp-dark'))
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
      <header className={`lp-nav${dark ? ' lp-dark' : ''}`} data-stuck={(stuck ?? ownStuck) ? '' : undefined} data-clear={clearOverHero && !pastHero ? '' : undefined}>
        <div className="lp-wrap lp-nav-in">
          <a href={base || '#top'} aria-label="AgenticOrg home"><Wordmark gradient={clearOverHero && !dark} /></a>
          <nav aria-label="Page">
            {links.map(([id, l]) => <a key={id} href={`${base}#${id}`}>{l}</a>)}
          </nav>
          <div className="lp-nav-r">
            <Link to="/login" className="lp-btn ghost">Sign In</Link>
            <Link to="/signup" className="lp-btn ink">Start Free</Link>
          </div>
        </div>
      </header>
    </>
  )
}
