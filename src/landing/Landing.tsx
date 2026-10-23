import './landing.css'
import { useEffect, useState } from 'react'
import { Chrome } from './Chrome'
import { OrgHero } from './OrgHero'
import { PricingSection } from './PricingSection'
import { PromptSection } from './PromptSection'
import { Trust } from './Trust'
import { Heads } from './Heads'
import { ProductTabs } from './ProductWindow'
import { Ladder, OrgChart } from './Chapters'
import { Faq, Footer } from './Start'
import { Compare, TeamsIntro } from './DevSections'
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
      <Chrome stuck={stuck} links={[['why', 'Why AgenticOrg'], ['product', 'Product'], ['developers', 'Developers'], ['reviews', 'Reviews'], ['pricing', 'Pricing']]} />
      <main id="top">
        <OrgHero art="solo" />
        <section id="product" className="lp-sec lp-soft" aria-labelledby="lp-h-prod">
          <div className="lp-wrap">
            <div className="lp-head c"><h2 id="lp-h-prod">Describe it. Test it. Ship it.</h2><p className="lp-lead">Create an agent from a prompt, watch it run, and clear every approval in one place.</p></div>
            <ProductTabs />
          </div>
        </section>
        <PromptSection />
        <Compare />
        <Pearls />
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
