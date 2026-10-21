import { usePlatform } from '../state'

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

const TAB_NAMES: Record<string, string> = { overview: 'Overview', workspace: 'Workspace', config: 'Config', workflow: 'Workflow Config', prompt: 'Prompt', shadow: 'Shadow', cost: 'Cost', scopes: 'Scopes', learning: 'Learning', voice: 'Voice' }
const TAB_STEPS: Omit<Step, 'stop'>[] = Object.keys(TAB_NAMES).map((k, i) => ({ id: `tab-${k}`, stopName: 'Agent tabs', target: `tab-${k}`, advance: i === 0 ? 'next' : 'click', side: 'bottom', title: TAB_NAMES[k], body: (i === 0 ? '' : '') + TAB_HELP[k] + (i === 0 ? ' Now take a look at each tab. Click the next one.' : '') }))

type StopKey = 'agents' | 'workflows' | 'connectors' | 'templates'

const HANDS_ON: Record<Exclude<StopKey, 'templates'>, Omit<Step, 'stop'>[]> = {
  agents: [
    { id: 'nav-agents', stopName: 'Agents', target: 'nav-agents', advance: 'click', side: 'right', title: 'Open Agents', body: 'Agents are the workers you create. Click Agents to see yours.' },
    { id: 'create', stopName: 'Agents', target: 'create-agent', advance: 'click', side: 'bottom', title: 'Create your first agent', body: 'Click Create Agent. It takes about a minute.' },
    { id: 'describe', stopName: 'Agents', target: 'describe-card', advanceOn: 'generate', advance: 'click', side: 'bottom', title: 'Describe the job', body: 'We filled in an example for your role. Change it if you like, then press Generate.' },
    { id: 'wiz-persona', stopName: 'Agents', target: 'wiz-persona', advanceOn: 'wizard-next', advance: 'click', side: 'right', title: 'Who this agent is', body: 'We filled in all five steps from your description. This one is its name and job title. Edit anything, then press Next.' },
    { id: 'wiz-role', stopName: 'Agents', target: 'wiz-role', advanceOn: 'wizard-next', advance: 'click', side: 'right', title: 'What kind of agent it is', body: 'The type decides which built-in skills it starts with. Press Next.' },
    { id: 'wiz-prompt', stopName: 'Agents', target: 'wiz-prompt', advanceOn: 'wizard-next', advance: 'click', side: 'right', title: 'Its instructions', body: 'This is the brief it works from, written from your request. Press Next.' },
    { id: 'wiz-behavior', stopName: 'Agents', target: 'wiz-behavior', advanceOn: 'wizard-next', advance: 'click', side: 'right', title: 'How careful it is', body: 'It asks a person when its confidence drops below 88%. A sample connector is already added. Press Next.' },
    { id: 'review', stopName: 'Agents', target: 'review-card', advanceOn: 'create-shadow', advance: 'click', side: 'dock', title: 'Check and create', body: 'Press Create as Shadow. A Shadow agent runs on sample data and touches nothing real.' },
    { id: 'chat-open', stopName: 'Agents', target: 'chat-btn', advance: 'click', side: 'bottom', title: 'Talk to it', body: 'Your agent is live in Shadow Mode. Press Chat with Agent.' },
    { id: 'chat-send', stopName: 'Chat and trace', target: 'chat-drawer', advanceOn: 'chat-send', advance: 'click', side: 'left', title: 'Ask it something', body: 'We added a question for your role. Press Send.' },
    { id: 'chat-answer', stopName: 'Chat and trace', target: 'chat-drawer', advance: 'next', side: 'left', title: 'Read the answer', body: 'The badge shows which agent answered and how sure it was. HITL means a person is needed before it acts.' },
    { id: 'explain', stopName: 'Chat and trace', target: 'explainer', advance: 'click', side: 'top', title: 'See why it did that', body: 'Open "Why did the agent do this?" to read its steps.' },
    { id: 'explain-body', stopName: 'Chat and trace', target: 'explainer', advance: 'next', side: 'top', title: 'The trace', body: 'Every step it took, how confident it was, and the tools it used. Thumbs up, thumbs down or "Correct this" teaches it.' },
    ...TAB_STEPS,
  ],
  workflows: [
    { id: 'nav-workflows', stopName: 'Workflows', target: 'nav-workflows', advance: 'click', side: 'right', title: 'Open Workflows', body: 'A workflow chains agents into one job. Click Workflows.' },
    { id: 'wf-run', stopName: 'Workflows', target: 'wf-run', advance: 'click', side: 'top', title: 'Run the sample workflow', body: 'Press Run Now. It runs on sample data, so nothing real is sent.' },
    { id: 'wf-approve', stopName: 'Workflows', target: 'wf-approval', advanceOn: 'wf-approve-btn', advance: 'click', side: 'top', title: 'You decide', body: 'The agents did their parts. The last step waits for you. Press Approve.' },
    { id: 'wf-result', stopName: 'Workflows', target: 'wf-steps', advance: 'next', side: 'top', title: 'Read the result', body: 'Each step shows who did it and what they found. A person always has the final say.' },
  ],
  connectors: [
    { id: 'nav-connectors', stopName: 'Connectors', target: 'nav-connectors', advance: 'click', side: 'right', title: 'Open Connectors', body: 'Connectors link agents to your tools. Click Connectors.' },
    { id: 'health-check', stopName: 'Connectors', target: 'health-check', advance: 'click', side: 'bottom', title: 'Test a connection', body: 'Press Health Check on the first connector. This one is a sample, so it is safe.' },
    { id: 'conn-card', stopName: 'Connectors', target: 'conn-card', advance: 'next', side: 'bottom', title: 'Connected', body: 'Healthy means agents can use it. Real connectors work the same way.' },
  ],
}

const QUICK: Record<StopKey, Omit<Step, 'stop'>[]> = {
  agents: [
    { id: 'q-agents-nav', stopName: 'Agents', target: 'nav-agents', advance: 'click', side: 'right', title: 'Agents', body: 'Your agents live here. Click to take a look.' },
    { id: 'q-agents-page', stopName: 'Agents', target: 'page-title', advance: 'next', side: 'bottom', title: 'Your fleet', body: 'Create an agent any time from here. Sample agents are labelled Sample and can be removed.' },
  ],
  workflows: [
    { id: 'q-wf-nav', stopName: 'Workflows', target: 'nav-workflows', advance: 'click', side: 'right', title: 'Workflows', body: 'Chain agents into one job. Click to take a look.' },
    { id: 'q-wf-page', stopName: 'Workflows', target: 'page-title', advance: 'next', side: 'bottom', title: 'Your workflows', body: 'One sample is ready to run. You can build your own later.' },
  ],
  connectors: [
    { id: 'q-conn-nav', stopName: 'Connectors', target: 'nav-connectors', advance: 'click', side: 'right', title: 'Connectors', body: 'Link agents to Gmail, your bank and more. Click to take a look.' },
    { id: 'q-conn-page', stopName: 'Connectors', target: 'page-title', advance: 'next', side: 'bottom', title: 'Your connectors', body: 'Health Check tells you if a connection works.' },
  ],
  templates: [
    { id: 'q-tpl-nav', stopName: 'Templates', target: 'nav-templates', advance: 'click', side: 'right', title: 'Agent Templates', body: 'Start from an agent that already works. Click to take a look.' },
    { id: 'q-tpl-page', stopName: 'Templates', target: 'template-list', advance: 'next', side: 'bottom', title: 'Ready-made agents', body: 'Pick one and create your own copy in a click.' },
  ],
}

const ORDER: Record<string, StopKey[]> = {
  agents: ['agents', 'workflows', 'connectors', 'templates'],
  workflows: ['workflows', 'agents', 'connectors', 'templates'],
  connectors: ['connectors', 'agents', 'workflows', 'templates'],
}

export function buildTour(intent?: string): Step[] {
  const order = ORDER[intent ?? ''] ?? (['agents', 'workflows', 'connectors', 'templates'] as StopKey[])
  const handsOn = intent === 'agents' || intent === 'workflows' || intent === 'connectors' ? (intent as Exclude<StopKey, 'templates'>) : null
  return order.flatMap((key, stop) => {
    const list = key === handsOn ? HANDS_ON[key] : QUICK[key]
    return list.map((st) => ({ ...st, stop }))
  })
}

export function useTourStep(): string | null {
  const { s, intent } = usePlatform()
  if (s.tour.status !== 'active') return null
  return buildTour(intent)[s.tour.step]?.id ?? null
}

export function useTourTarget(): string | null {
  const { s, intent } = usePlatform()
  if (s.tour.status !== 'active') return null
  return buildTour(intent)[s.tour.step]?.target ?? null
}
