import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { reduced } from './config'

// One action, three gates. A "Refund $120" card travels through the confidence check,
// the human approval and the audit trail. The visitor can send a confident case or an unsure one.
const CONF = 94
const FLOOR = 88

// time, in ms, at which each step of a run begins
const K = { g1: 700, meter: 1100, g1done: 2300, g2: 3000, ok: 4700, g3: 5400, log: 6000, done: 7600, end: 10200 }

export function Relay() {
  const box = useRef<HTMLElement>(null)
  const [t, setT] = useState(reduced() ? 99999 : 0)
  const [run, setRun] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!box.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])

  // a simple clock that restarts when the case changes or the run ends
  useEffect(() => {
    if (reduced() || !visible) return
    const start = performance.now()
    const end = K.end
    const id = window.setInterval(() => {
      const el = performance.now() - start
      if (el >= end) setRun((r) => r + 1)
      else setT(el)
    }, 60)
    return () => window.clearInterval(id)
  }, [run, visible])

  const k = K
  const stage = t >= k.done ? 4 : t >= k.g3 ? 3 : t >= k.g2 ? 2 : t >= k.g1 ? 1 : 0
  const conf = CONF
  const meter = t >= k.meter ? conf : 0
  const approved = t >= k.ok
  const logged = t >= k.log
  const pos = [3, 16.67, 50, 83.33, 97][stage]
  const stamp = '10:42'

  return (
    <section id="approval" className="lp-sec gt" ref={box} aria-labelledby="lp-h-rel">
      <div className="lp-wrap">
        <div className="lp-head gt-head">
          <h2 id="lp-h-rel">Every action passes three gates.</h2>
        </div>

        <div className="gt-rail" aria-hidden="true">
          <i className="gt-line" />
          <i className="gt-fill" style={{ width: `${Math.max(0, pos - 3)}%` }} />
          {[16.67, 50, 83.33].map((x, i) => <i key={x} className="gt-node" data-on={stage > i ? '' : undefined} style={{ left: `${x}%` }} />)}
          <span className="gt-token" data-done={stage === 4 ? '' : undefined} style={{ left: `${pos}%` }}>
            {stage === 4 ? <><Icon name="check" size={14} strokeWidth={3} />Done</> : <><Icon name="spark" size={14} />Refund $120</>}
          </span>
        </div>

        <div className="gt-grid">
          <article className="gt-card" data-now={stage === 1 ? '' : undefined} data-pass={stage > 1 ? '' : undefined}>
            <header><span className="gt-ic"><Icon name="eye" size={20} /></span><div><b>Confidence check</b><p>It acts alone only when it is sure. Below your floor, it stops and asks.</p></div></header>
            <div className="gt-body">
              <div className="gt-meter" aria-label={`Confidence ${conf} percent, floor ${FLOOR} percent`}>
                <span style={{ width: `${meter}%` }} data-low={conf < FLOOR ? '' : undefined} />
                <i style={{ left: `${FLOOR}%` }}><em>Floor {FLOOR}%</em></i>
              </div>
              <div className="gt-row"><small>Agent confidence</small><b>{meter ? `${meter}%` : '...'}</b></div>
              <span className="gt-res" data-state={t < k.g1done ? 'wait' : 'ok'}>
                {t < k.g1done ? 'Checking' : 'Clear to continue'}
              </span>
            </div>
          </article>

          <article className="gt-card" data-now={stage === 2 ? '' : undefined} data-pass={stage > 2 ? '' : undefined}>
            <header><span className="gt-ic"><Icon name="users" size={20} /></span><div><b>Human approval</b><p>Anything that matters waits for a person. You see the reason and the evidence.</p></div></header>
            <div className="gt-body">
              <div className="gt-ask">
                <b>Refund $120 to a customer</b>
                <small>Within policy, needs a yes</small>
                {approved ? (
                  <span className="gt-res" data-state="ok"><Icon name="check" size={14} strokeWidth={3} />Approved by Priya Nair</span>
                ) : stage >= 2 ? (
                  <button type="button" className="lp-btn ink sm pulse" onClick={() => setT(k.ok)}>Approve</button>
                ) : (
                  <span className="gt-res" data-state="wait">Waiting for the first gate</span>
                )}
              </div>
            </div>
          </article>

          <article className="gt-card" data-now={stage === 3 ? '' : undefined} data-pass={stage > 3 ? '' : undefined}>
            <header><span className="gt-ic"><Icon name="lock" size={20} /></span><div><b>Audit trail</b><p>Every step, who approved it and when, kept in one log you can read later.</p></div></header>
            <div className="gt-body">
              <pre className="gt-log" aria-label="Audit log">
                <span data-on={stage >= 3 ? '' : undefined}>{stamp} refund.request  $120</span>
                <span data-on={stage >= 3 ? '' : undefined}>{stamp} confidence    {conf}% / floor {FLOOR}%</span>
                <span data-on={logged ? '' : undefined}>{stamp} approved_by    priya.nair</span>
                <span data-on={logged ? '' : undefined}>{stamp} saved          #4821</span>
              </pre>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
