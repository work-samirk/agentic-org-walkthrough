import { useRef } from 'react'
import { Icon } from '../components/Icon'

// "Watch Demo": a native dialog, so focus is trapped, Escape closes it and the page behind is inert.
export function DemoButton() {
  const dlg = useRef<HTMLDialogElement>(null)
  const vid = useRef<HTMLVideoElement>(null)

  const open = () => {
    dlg.current?.showModal()
    vid.current?.play().catch(() => undefined)
  }
  const stop = () => {
    const v = vid.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <>
      <button type="button" className="lp-btn line big" onClick={open} aria-haspopup="dialog">
        Watch Demo<Icon name="play" size={18} />
      </button>
      <dialog
        ref={dlg}
        className="dm"
        aria-labelledby="dm-title"
        onClose={stop}
        onClick={(e) => e.target === dlg.current && dlg.current?.close()}
      >
        <div className="dm-box">
          <header>
            <h2 id="dm-title">Chargeback Agent demo</h2>
            <button type="button" className="dm-x" onClick={() => dlg.current?.close()} aria-label="Close demo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </header>
          <video ref={vid} src="/video/chargeback-agent-demo.mp4" poster="/video/chargeback-agent-demo-poster.webp" controls playsInline preload="none" />
        </div>
      </dialog>
    </>
  )
}
