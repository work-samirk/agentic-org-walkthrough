import './landing.css'
import './landing-v2.css'
import { useEffect } from 'react'
import { Chrome } from './Chrome'
import { OrgHeroV2 } from './OrgHeroV2'
import { PricingSection } from './PricingSection'
import { PromptSection } from './PromptSection'
import { AsciiBackdrop } from './AsciiBackdrop'
import { Trust } from './Trust'
import { Heads } from './Heads'
import { ProductTabs } from './ProductWindow'
import { Ladder, OrgChart } from './Chapters'
import { Faq, Footer } from './Start'
import { Compare, TeamsIntro } from './DevSections'
import { CaseStudy, Dev, EndCard, LiveExecution, Pearls, Reviews, Roi } from './Sections'

export function LandingV2() {
  useEffect(() => {
    try {
      sessionStorage.removeItem('ao-preset-role')
    } catch {
      /* ignore */
    }
  }, [])

  // the product window starts at 80% width and grows to 100% as it scrolls up into view
  useEffect(() => {
    const sec = document.getElementById('product')
    if (!sec) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const tick = () => {
      raf = 0
      const win = sec.querySelector('.lp-win')
      if (!win) return
      const vh = window.innerHeight
      const top = win.getBoundingClientRect().top
      const t = Math.min(1, Math.max(0, (vh * 0.95 - top) / (vh * 0.83)))
      sec.style.setProperty('--grow', String(0.8 + 0.2 * (t * t * (3 - 2 * t))))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div className="lp v2">
      <Chrome clearOverHero links={[['why', 'Why AgenticOrg'], ['product', 'Product'], ['developers', 'Developers'], ['reviews', 'Reviews'], ['pricing', 'Pricing']]} />
      <main id="top">
        <OrgHeroV2 />
        <section id="product" className="lp-sec lp-soft" aria-label="Product">
          <div className="lp-wrap">
            <ProductTabs />
          </div>
        </section>
        <PromptSection backdrop={<AsciiBackdrop />} merged />
        <Compare />
        <Pearls merged />
        <LiveExecution />
        <Ladder />
        <Dev />
        <TeamsIntro />
        <OrgChart />
        <Heads />
        <Roi />
        <Trust />
        <CaseStudy />
        <Reviews />
        <PricingSection />
        <Faq />
        <EndCard />
      </main>
      <Footer />
    </div>
  )
}
