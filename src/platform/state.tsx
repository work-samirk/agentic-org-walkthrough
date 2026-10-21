import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SAMPLE_AGENTS, type Agent } from './data'
import { loadAnswers } from '../onboarding/answers'

export type TourStatus = 'offered' | 'active' | 'paused' | 'dismissed' | 'completed'
export type Checklist = { signedIn: true; questions: boolean; created: boolean; chatted: boolean; trace: boolean }

type Persisted = {
  agents: Agent[]
  extraApprovals: number
  resolved: number
  pendingResolved: boolean
  approvalDecision: string | null
  healthy: string[]
  tour: { status: TourStatus; step: number }
  checklist: Checklist
  checklistOpen: boolean
  checklistDismissed: boolean
  seen: string[]
  workflowRuns: number
  ran: boolean
}

const KEY = 'ao-platform-v2'

function fresh(): Persisted {
  const a = loadAnswers()
  return {
    agents: [],
    extraApprovals: 0,
    resolved: 12,
    pendingResolved: false,
    approvalDecision: null,
    healthy: [],
    tour: { status: 'offered', step: 0 },
    checklist: { signedIn: true, questions: Object.keys(a).length > 0, created: false, chatted: false, trace: false },
    checklistOpen: true,
    checklistDismissed: false,
    seen: [],
    workflowRuns: 0,
    ran: false,
  }
}

function load(): Persisted {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) {
      const p = { ...fresh(), ...JSON.parse(raw) }
      p.agents = Array.isArray(p.agents) ? p.agents.filter((a: Agent) => a && typeof a.name === 'string') : []
      return p
    }
  } catch {
    /* ignore */
  }
  return fresh()
}

export type User = { name: string; email: string; org: string }
export function loadUser(): User {
  try {
    const raw = sessionStorage.getItem('ao-user')
    if (raw) return { name: 'Priya Nair', email: 'priya@northwindpay.in', org: 'Northwind Pay', ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { name: 'Priya Nair', email: 'priya@northwindpay.in', org: 'Northwind Pay' }
}
export function saveUser(u: Partial<User>) {
  try {
    sessionStorage.setItem('ao-user', JSON.stringify({ ...loadUser(), ...u }))
  } catch {
    /* ignore */
  }
}

type Ctx = {
  s: Persisted
  user: User
  role?: string
  intent?: string
  allAgents: Agent[]
  set: (patch: Partial<Persisted>) => void
  createAgent: (agent: Agent) => Agent
  tick: (k: keyof Checklist) => void
  see: (id: string) => void
  reset: () => void
}

const PlatformCtx = createContext<Ctx | null>(null)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Persisted>(load)
  const answers = useMemo(() => loadAnswers(), [])
  const user = useMemo(loadUser, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(s))
    } catch {
      /* ignore */
    }
  }, [s])

  const set = useCallback((patch: Partial<Persisted>) => setS((p) => ({ ...p, ...patch })), [])
  const tick = useCallback((k: keyof Checklist) => setS((p) => ({ ...p, checklist: { ...p.checklist, [k]: true } })), [])
  const see = useCallback((id: string) => setS((p) => (p.seen.includes(id) ? p : { ...p, seen: [...p.seen, id] })), [])

  const createAgent = useCallback((agent: Agent) => {
    setS((p) => ({ ...p, agents: [agent], checklist: { ...p.checklist, created: true } }))
    return agent
  }, [])

  const reset = useCallback(() => setS(fresh()), [])
  const allAgents = useMemo(() => [...s.agents, ...SAMPLE_AGENTS], [s.agents])

  const value: Ctx = { s, user, role: answers.role, intent: answers.intent, allAgents, set, createAgent, tick, see, reset }
  return <PlatformCtx.Provider value={value}>{children}</PlatformCtx.Provider>
}

export function usePlatform() {
  const c = useContext(PlatformCtx)
  if (!c) throw new Error('usePlatform outside provider')
  return c
}
