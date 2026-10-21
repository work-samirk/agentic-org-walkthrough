// A scripted pointer that drives the real product screens inside the landing page's window.
// The window is a same-origin iframe, so the script finds real elements, moves a drawn pointer to them
// and fires the same events a visitor would.

export type Ctx = {
  doc: Document
  win: Window & typeof globalThis
  frame: HTMLIFrameElement
  cursor: HTMLElement
  alive: () => boolean
}

class Abort extends Error {}

export const isAbort = (e: unknown) => e instanceof Abort

const ensure = (c: Ctx) => {
  if (!c.alive()) throw new Abort()
}

export const sleep = async (c: Ctx, ms: number) => {
  await new Promise((r) => window.setTimeout(r, ms))
  ensure(c)
}

export async function find<T extends Element = HTMLElement>(c: Ctx, get: () => T | null | undefined, timeout = 4000): Promise<T> {
  const t0 = performance.now()
  for (;;) {
    ensure(c)
    const el = get()
    if (el) return el
    if (performance.now() - t0 > timeout) throw new Abort()
    await new Promise((r) => window.setTimeout(r, 120))
  }
}

export const byText = (c: Ctx, sel: string, text: string) =>
  [...c.doc.querySelectorAll<HTMLElement>(sel)].find((e) => (e.textContent ?? '').trim().toLowerCase().includes(text.toLowerCase()))

// where an element sits inside the landing window, in the window's own pixels
function spot(c: Ctx, el: Element, ax: number, ay: number) {
  const r = el.getBoundingClientRect()
  const f = c.frame.getBoundingClientRect()
  const k = f.width / c.frame.offsetWidth
  const box = c.cursor.parentElement!.getBoundingClientRect()
  return [f.left - box.left + (r.left + r.width * ax) * k, f.top - box.top + (r.top + r.height * ay) * k] as const
}

let at: readonly [number, number] = [40, 40]

export async function show(c: Ctx) {
  c.cursor.style.transition = 'none'
  c.cursor.style.transform = `translate(${at[0]}px, ${at[1]}px)`
  void c.cursor.offsetWidth
  c.cursor.dataset.on = ''
}

export function hide(c: { cursor: HTMLElement }) {
  delete c.cursor.dataset.on
}

export async function moveTo(c: Ctx, el: Element, ax = 0.5, ay = 0.5) {
  ensure(c)
  const p = spot(c, el, ax, ay)
  const d = Math.hypot(p[0] - at[0], p[1] - at[1])
  const ms = Math.min(1100, 380 + d * 0.9)
  c.cursor.style.transition = `transform ${ms}ms cubic-bezier(.45,.05,.2,1)`
  c.cursor.style.transform = `translate(${p[0]}px, ${p[1]}px)`
  at = p
  await sleep(c, ms + 120)
}

export async function click(c: Ctx, el: HTMLElement) {
  c.cursor.dataset.click = ''
  await sleep(c, 140)
  el.click()
  window.setTimeout(() => delete c.cursor.dataset.click, 500)
  await sleep(c, 200)
}

export async function typeInto(c: Ctx, el: HTMLInputElement | HTMLTextAreaElement, text: string, perChar = 38) {
  el.focus()
  const proto = el instanceof c.win.HTMLTextAreaElement ? c.win.HTMLTextAreaElement.prototype : c.win.HTMLInputElement.prototype
  const set = Object.getOwnPropertyDescriptor(proto, 'value')!.set!
  for (let i = 1; i <= text.length; i++) {
    set.call(el, text.slice(0, i))
    el.dispatchEvent(new c.win.Event('input', { bubbles: true }))
    await sleep(c, perChar + (text[i - 1] === ' ' ? 30 : 0))
  }
}

export async function setValue(c: Ctx, el: HTMLInputElement | HTMLTextAreaElement, text: string) {
  const proto = el instanceof c.win.HTMLTextAreaElement ? c.win.HTMLTextAreaElement.prototype : c.win.HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, text)
  el.dispatchEvent(new c.win.Event('input', { bubbles: true }))
  await sleep(c, 0)
}

export const scrollTo = async (c: Ctx, el: Element) => {
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  await sleep(c, 800)
}

/* One script per screen. Each ends with the screen still showing its result. */
export const SCRIPTS: Record<string, (c: Ctx) => Promise<void>> = {
  'Agent fleet': async (c) => {
    await sleep(c, 700)
    const search = await find(c, () => c.doc.querySelector<HTMLInputElement>('input[aria-label="Search agents"]'))
    await moveTo(c, search, 0.25, 0.5)
    await click(c, search)
    await typeInto(c, search, 'settlement', 80)
    await sleep(c, 900)
    const badge = await find(c, () => byText(c, 'span,div', 'Below Floor'))
    await moveTo(c, badge)
    await sleep(c, 1800)
    await moveTo(c, search, 0.5, 0.5)
    await setValue(c, search, '')
    await sleep(c, 1400)
  },

  'Create agent': async (c) => {
    await sleep(c, 600)
    const box = await find(c, () => c.doc.querySelector<HTMLTextAreaElement>('textarea[aria-label="Describe the employee you need"]'))
    await moveTo(c, box, 0.3, 0.35)
    await click(c, box)
    await typeInto(c, box, 'I need someone who matches daily settlements to the bank statement and flags any breaks.', 32)
    await sleep(c, 500)
    const go = await find(c, () => byText(c, 'button', 'Generate'))
    await moveTo(c, go)
    await click(c, go)
    await sleep(c, 2200)
    const name = await find(c, () => c.doc.querySelector<HTMLInputElement>('input[value]:not([type=range]):not([type=checkbox])'), 3000).catch(() => null)
    if (name) await moveTo(c, name, 0.4, 0.5)
    await sleep(c, 1800)
  },

  'Live observatory': async (c) => {
    await sleep(c, 800)
    const first = await find(c, () => c.doc.querySelector<HTMLElement>('.max-h-80 > div')).catch(() => null)
    if (first) {
      const rows = [...(first.parentElement?.children ?? [])].slice(0, 3)
      for (const r of rows) {
        await moveTo(c, r, 0.35, 0.5)
        await sleep(c, 500)
      }
    }
    const item = await find(c, () => c.doc.querySelector<HTMLElement>('[role="link"]'), 3000).catch(() => null)
    if (item) {
      await scrollTo(c, item)
      await moveTo(c, item, 0.5, 0.5)
      await sleep(c, 1800)
    }
  },

  Approvals: async (c) => {
    await sleep(c, 700)
    const trace = await find(c, () => byText(c, 'summary', 'Reasoning Trace'))
    await moveTo(c, trace, 0.15, 0.5)
    await click(c, trace)
    await sleep(c, 1800)
    const ok = await find(c, () => byText(c, 'button', 'Approve'))
    await moveTo(c, ok)
    await sleep(c, 400)
    await click(c, ok)
    await sleep(c, 1500)
    const next = await find(c, () => byText(c, 'summary', 'Reasoning Trace'), 3000).catch(() => null)
    if (next) {
      await moveTo(c, next, 0.15, 0.5)
      await click(c, next)
      await sleep(c, 2200)
    }
  },
}
