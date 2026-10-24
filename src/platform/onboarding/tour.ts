import { usePlatform } from '../state'
import { NAV } from '../data'

// The assisted walkthrough (PRD section 7). Four stops, one per major tab. The answer to
// "What brings you here?" decides which stop comes first and gets a hands-on task.
export type Step = {
  id: string
  stop: number // 0..3 within this person's order
  stopName: string
  target: string // data-tour id that is lit
  advanceOn?: string // data-tour id whose click completes the step (defaults to target)
  advance: 'click' | 'next'
  title: string
  body: string
  side?: 'right' | 'left' | 'bottom' | 'top' | 'dock'
  to?: string // the page this stop opens
  key?: string // checklist key ticked when the stop is done
}

// What each tab is for, in plain words. Shown the first time a tab is opened.
export const TAB_HELP: Record<string, string> = {
  overview: 'The agent\'s identity card: who it is, what it can use, and who it reports to.',
  workspace: 'A small working screen for this agent\'s job. Describe the screen you want and it builds the forms and buttons.',
  config: 'The agent\'s settings: which model it uses, how careful it is, and which connectors and tools it may use.',
  workflow: 'Advanced. Optional JSON that tells the agent how to run a custom workflow. Leave it blank to use the standard flow.',
  prompt: 'Its instructions, in plain text. Locked once the agent is live, so changes are always deliberate.',
  shadow: 'The safe trial. The agent runs on test samples and you see how accurate it is before it touches anything real.',
  cost: 'What this agent spends on AI each month, against a cap you set.',
  scopes: 'Exactly what it is allowed to do. Every tool has a permission level and a signed token.',
  learning: 'How it improves. Your thumbs up, thumbs down and corrections become rules it follows.',
  voice: 'Voice calls for this agent. Voice is managed at organisation level.',
  recon: 'The reconciliation workspace: match two files and fix what does not agree.',
}

// One stop per major area, one modal each: the sidebar tab is lit and the modal says what it is for.
// Moving to the next stop opens that page, so the screen behind the modal follows the tour.
const navTo = (id: string) => NAV.flatMap((g) => g.items).find((i) => i.id === id)!.to
const STOPS = [
  { key: 'dashboard', nav: 'dashboard', name: 'Dashboard', title: 'Dashboard', body: 'Your live view of every agent, run and approval, and anything waiting on a person.' },
  { key: 'agents', nav: 'agents', name: 'Agents', title: 'Agents', body: 'The workers you build. Each has a prompt, tools, a confidence floor and a Shadow trial. Open one to chat with it and read its trace.' },
  { key: 'connectors', nav: 'connectors', name: 'Connectors', title: 'Connectors', body: 'Connectors give agents their tools, like Gmail, Slack and your accounting system. Nothing is connected until you connect it with your own login.' },
  { key: 'workflows', nav: 'workflows', name: 'Workflows', title: 'Workflows', body: 'Chain agents into one job, with approvals in between. Run it on sample data first, so nothing real is sent.' },
  { key: 'schedules', nav: 'schedules', name: 'Schedules', title: 'Schedules', body: 'Run an agent or a report on a timer, every morning or every Monday, without anyone pressing a button.' },
  { key: 'approvals', nav: 'approvals', name: 'Approvals', title: 'Approvals', body: 'When an agent is unsure, it asks a person here. Approve or reject, and the decision goes into the audit trail.' },
  { key: 'templates', nav: 'templates', name: 'Templates', title: 'Agent and Prompt Templates', body: 'Start from an agent or a prompt that already works. Create your own copy in a click, then change it to fit your job.' },
  { key: 'creds', nav: 'creds', name: 'AI Credentials', title: 'AI Credentials', body: 'Agents run on the AI model provider you choose. Set the provider and key here before you run your first agent.' },
] as const

export const TOUR_ITEMS = STOPS.map((x) => ({ key: x.key as string, label: x.name, to: navTo(x.nav) }))
export const TOUR_STOPS = STOPS.length

export function buildTour(): Step[] {
  return STOPS.map((x, stop) => ({ id: `stop-${x.key}`, key: x.key, stop, stopName: x.name, target: `nav-${x.nav}`, advance: 'next' as const, side: 'right' as const, title: x.title, body: x.body, to: navTo(x.nav) }))
}

export function useTourStep(): string | null {
  const { s } = usePlatform()
  if (s.tour.status !== 'active') return null
  return buildTour()[s.tour.step]?.id ?? null
}

export function useTourTarget(): string | null {
  const { s } = usePlatform()
  if (s.tour.status !== 'active') return null
  return buildTour()[s.tour.step]?.target ?? null
}
