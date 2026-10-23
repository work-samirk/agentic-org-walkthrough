import { usePlatform } from '../state'

export function TourBanner() {
  const { s, set } = usePlatform()
  if (s.tour.status !== 'offered' || new URLSearchParams(window.location.search).has('embed')) return null
  return (
    <section className="ob-banner" aria-label="Quick tour">
      <div>
        <b>Want a quick tour?</b>
        <p>About two minutes. We light up each main tab and explain what it is for. Nothing real is touched.</p>
      </div>
      <div className="ob-banner-actions">
        <button type="button" className="ob-ghost" onClick={() => set({ tour: { status: 'dismissed', step: 0 } })}>Not now</button>
        <button type="button" className="ob-primary" onClick={() => set({ tour: { status: 'active', step: 0 } })}>Show me around</button>
      </div>
    </section>
  )
}
