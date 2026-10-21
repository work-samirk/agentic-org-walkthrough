import './landing.css'
import { useEffect, useState } from 'react'
import { Chrome } from './Chrome'
import { OrgHero } from './OrgHero'
import { Trust } from './Trust'
import { Steps } from './Steps'
import { Heads } from './Heads'
import { ProductTabs } from './ProductWindow'
import { Ladder, OrgChart, Relay } from './Chapters'
import { Faq, Footer } from './Start'
import { CaseStudy, Dev, EndCard, LiveExecution, Pearls, Reviews, Roi } from './Sections'

export function Landing() {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.removeItem('ao-preset-role')
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const on = () => setStuck(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <div className="lp">
      <Chrome stuck={stuck} links={[['product', 'Product'], ['live', 'Live agents'], ['developers', 'Developers'], ['roi', 'Savings'], ['reviews', 'Reviews']]} />
      <main id="top">
        <OrgHero art="solo" />
        <Trust />
        <section id="product" className="lp-sec lp-soft" aria-labelledby="lp-h-prod">
          <div className="lp-wrap">
            <div className="lp-head c"><h2 id="lp-h-prod">One Platform. Unlimited AI Employees. Complete Automation.</h2><p className="lp-lead">Agents, a live view of the work, and every approval in one place.</p></div>
            <ProductTabs />
          </div>
        </section>
        <Pearls />
        <LiveExecution />
        <Relay />
        <Steps />
        <OrgChart />
        <Ladder />
        <Heads />
        <Dev />
        <Roi />
        <Reviews />
        <CaseStudy />
        <Faq />
        <EndCard />
      </main>
      <Footer />
    </div>
  )
}
