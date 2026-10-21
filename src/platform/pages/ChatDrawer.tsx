import { useEffect, useRef, useState } from 'react'
import type { Script } from '../scripts'

type Message = { id: number; role: 'user' | 'agent'; text: string; agent?: string; confidence?: number; hitl?: boolean }

// The "Chat with Agent" slide-out from the app: a dark panel, the agent's badge and confidence on each answer.
export function ChatDrawer({ open, onClose, agentName, script, prefill, onAnswered }: { open: boolean; onClose: () => void; agentName: string; script: Script; prefill?: boolean; onAnswered: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const n = useRef(0)

  // During the tour the box already holds a sample question for the role.
  useEffect(() => {
    if (prefill && !input && !messages.length) {
      const t = window.setTimeout(() => setInput(script.ask), 0)
      return () => window.clearTimeout(t)
    }
  }, [prefill, input, messages.length, script.ask])

  useEffect(() => {
    listRef.current?.scrollTo?.({ top: listRef.current.scrollHeight })
  }, [messages, sending])

  function send() {
    const q = input.trim()
    if (!q || sending) return
    setMessages((m) => [...m, { id: ++n.current, role: 'user', text: q }])
    setInput('')
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setMessages((m) => [...m, { id: ++n.current, role: 'agent', text: script.answer, agent: agentName, confidence: script.confidence, hitl: !!script.hold }])
      onAnswered()
    }, 1300)
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />}
      <div role="dialog" aria-label={`Chat with ${agentName}`} aria-modal={open ? 'true' : undefined} data-tour="chat-drawer" className={`fixed top-0 right-0 z-50 flex h-full w-full transform flex-col border-l border-slate-700 bg-slate-900 transition-transform duration-300 ease-in-out sm:w-[420px] ${open ? 'translate-x-0' : 'pointer-events-none translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-200">Chat with {agentName}</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200" aria-label="Close chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="mt-8 text-center text-sm text-slate-500">
              <p className="mb-1">Ask any question about your business.</p>
              <p className="text-xs">The right agent will be routed automatically.</p>
            </div>
          )}
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-lg bg-blue-600 px-3 py-2 text-sm break-words whitespace-pre-wrap text-white">{m.text}</div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[80%] rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">{m.agent}</span>
                    {m.confidence != null && <span className="text-[10px] text-slate-500">{Math.round(m.confidence * 100)}%</span>}
                    {m.hitl && <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">HITL</span>}
                  </div>
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-slate-300">{m.text}</p>
                </div>
              </div>
            ),
          )}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-700 bg-slate-900 p-3">
          <div className="flex min-w-0 items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Type a message..."
              disabled={sending}
              aria-label="Type a message"
              className="h-9 min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
            />
            <button data-tour="chat-send" onClick={send} disabled={sending || !input.trim()} className="h-9 min-w-[56px] shrink-0 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">Send</button>
          </div>
        </div>
      </div>
    </>
  )
}
