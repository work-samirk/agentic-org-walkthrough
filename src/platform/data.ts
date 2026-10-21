import type { LucideIcon } from 'lucide-react'
import {
  Activity, BookOpen, Boxes, Briefcase, Bot, CalendarClock, CheckSquare, Cog, Cpu, Crown, CreditCard, Database, Eye,
  FileClock, FileCode, FileText, Gauge, GitBranch, Key, KeyRound, LayoutDashboard, Megaphone, Mic, Network, Package,
  Plug, ScrollText, ShieldAlert, Sliders, Target, Terminal, Timer, TrendingUp, UserCheck, UserCog,
} from 'lucide-react'

export type NavItem = { id: string; label: string; icon: LucideIcon; to: string }
export type NavGroup = { id: string; label?: string; items: NavItem[] }

const p = (slug: string) => `/app/p/${slug}`

// The sidebar as it exists today: 5 groups, 33 links. Only some pages are rebuilt for the walkthrough.
export const NAV: NavGroup[] = [
  { id: 'top', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/app' }] },
  {
    id: 'exec',
    label: 'Executive Dashboards',
    items: [
      { id: 'ceo', label: 'CEO Dashboard', icon: Crown, to: p('ceo-dashboard') },
      { id: 'finance', label: 'Finance Dashboard', icon: TrendingUp, to: p('finance-dashboard') },
      { id: 'marketing', label: 'Marketing Dashboard', icon: Megaphone, to: p('marketing-dashboard') },
      { id: 'chro', label: 'CHRO Dashboard', icon: UserCheck, to: p('chro-dashboard') },
      { id: 'coo', label: 'COO Dashboard', icon: Activity, to: p('coo-dashboard') },
      { id: 'cbo', label: 'CBO Dashboard', icon: Briefcase, to: p('cbo-dashboard') },
      { id: 'abm', label: 'ABM', icon: Target, to: p('abm') },
    ],
  },
  {
    id: 'agents',
    label: 'Agents & Automation',
    items: [
      { id: 'agents', label: 'Agents', icon: Bot, to: '/app/agents' },
      { id: 'orgchart', label: 'Org Chart', icon: Network, to: p('org-chart') },
      { id: 'workflows', label: 'Workflows', icon: GitBranch, to: '/app/workflows' },
      { id: 'templates', label: 'Agent Templates', icon: Boxes, to: '/app/templates' },
      { id: 'prompts', label: 'Prompt Templates', icon: FileCode, to: p('prompt-templates') },
      { id: 'sop', label: 'Create from SOP', icon: FileText, to: p('create-from-sop') },
      { id: 'reports', label: 'Report Schedules', icon: FileClock, to: p('report-schedules') },
      { id: 'schedules', label: 'My Schedules', icon: CalendarClock, to: p('my-schedules') },
      { id: 'voice', label: 'Voice', icon: Mic, to: p('voice') },
      { id: 'rpa', label: 'RPA Scripts', icon: Terminal, to: p('rpa-scripts') },
      { id: 'rpa-s', label: 'RPA Schedules', icon: Timer, to: p('rpa-schedules') },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations & Knowledge',
    items: [
      { id: 'connectors', label: 'Connectors', icon: Plug, to: '/app/connectors' },
      { id: 'a2a', label: 'A2A / MCP', icon: Cpu, to: p('a2a-mcp') },
      { id: 'schemas', label: 'Schemas', icon: Database, to: p('schemas') },
      { id: 'kb', label: 'Knowledge Base', icon: BookOpen, to: p('knowledge-base') },
      { id: 'packs', label: 'Industry Packs', icon: Package, to: p('industry-packs') },
    ],
  },
  {
    id: 'gov',
    label: 'Governance & Observability',
    items: [
      { id: 'observatory', label: 'Observatory', icon: Eye, to: p('observatory') },
      { id: 'approvals', label: 'Approvals', icon: CheckSquare, to: '/app/approvals' },
      { id: 'scope', label: 'Scope Dashboard', icon: Key, to: p('scope-dashboard') },
      { id: 'enforce', label: 'Enforce Audit', icon: ShieldAlert, to: p('enforce-audit') },
      { id: 'audit', label: 'Audit Log', icon: ScrollText, to: p('audit-log') },
      { id: 'sla', label: 'SLA Monitor', icon: Gauge, to: p('sla-monitor') },
    ],
  },
  {
    id: 'admin',
    label: 'Admin & Settings',
    items: [
      { id: 'billing', label: 'Billing', icon: CreditCard, to: p('billing') },
      { id: 'users', label: 'User Management', icon: UserCog, to: p('user-management') },
      { id: 'creds', label: 'AI Credentials', icon: KeyRound, to: p('ai-credentials') },
      { id: 'aiconfig', label: 'AI Configuration', icon: Sliders, to: p('ai-configuration') },
      { id: 'settings', label: 'Settings', icon: Cog, to: p('settings') },
    ],
  },
]

export const NAV_LABELS: Record<string, string> = Object.fromEntries(
  NAV.flatMap((g) => g.items).map((i) => [i.to.split('/').pop() as string, i.label]),
)

export type Agent = {
  id: string
  name: string // the employee's name
  designation: string
  agentType: string // e.g. recon_agent
  domain: string
  status: 'shadow' | 'active' | 'paused'
  conf: number // confidence floor, 0 to 1
  samples: number // shadow samples
  accuracy: number | null // shadow accuracy, 0 to 1
  specialization?: string
  sample?: boolean
  prompt?: string
  tools?: string[]
}

// Preloaded sample workspace: the same for every new tenant, labelled Sample, removable.
export const SAMPLE_AGENTS: Agent[] = [
  { id: 'sample-settlement', name: 'Meera Iyer', designation: 'Settlement Analyst', agentType: 'recon_agent', domain: 'finance', status: 'shadow', conf: 0.88, samples: 25, accuracy: 0.834, specialization: 'Match daily settlements to the bank statement', sample: true, tools: ['fetch_bank_statement', 'get_transaction_list'] },
  { id: 'sample-support', name: 'Rohan Das', designation: 'Support Specialist', agentType: 'chat_agent', domain: 'comms', status: 'active', conf: 0.88, samples: 41, accuracy: 0.912, specialization: 'Triage tickets and draft replies', sample: true, tools: ['read_inbox', 'send_email'] },
  { id: 'sample-leads', name: 'Kavya Rao', designation: 'Sales Analyst', agentType: 'lead_scorer', domain: 'marketing', status: 'shadow', conf: 0.88, samples: 12, accuracy: 0.765, specialization: 'Score new leads and draft follow-ups', sample: true, tools: ['list_leads'] },
  { id: 'sample-leave', name: 'Sana Khan', designation: 'HR Coordinator', agentType: 'hr_assistant', domain: 'hr', status: 'shadow', conf: 0.88, samples: 6, accuracy: 0.667, specialization: 'Answer leave questions from the policy', sample: true, tools: ['search_policy'] },
]

export type Connector = { id: string; name: string; category: string; auth: string; rate: number; sample?: boolean }

export const CONNECTORS: Connector[] = [
  { id: 'sample_bank', name: 'sample_bank', category: 'finance', auth: 'API_KEY', rate: 60, sample: true },
  { id: 'zoho_books', name: 'zoho_books', category: 'finance', auth: 'OAUTH2', rate: 60 },
  { id: 'gmail', name: 'gmail', category: 'comms', auth: 'OAUTH2', rate: 100 },
  { id: 'stripe', name: 'stripe', category: 'finance', auth: 'API_KEY', rate: 60 },
  { id: 'tally', name: 'tally', category: 'finance', auth: 'BRIDGE', rate: 60 },
  { id: 'slack', name: 'slack', category: 'comms', auth: 'OAUTH2', rate: 100 },
]

export type WorkflowStep = { id: string; name: string; description: string; agent: string; observation: string }
export type Workflow = { id: string; name: string; version: string; trigger: string; created: string; active: boolean; steps: WorkflowStep[] }

export const WORKFLOWS: Workflow[] = [
  {
    id: 'refund-review',
    name: 'Refund Review Pipeline',
    version: '1.0',
    trigger: 'manual',
    created: '21/10/2026',
    active: true,
    steps: [
      { id: 'read_request', name: 'Read the refund request', description: 'Support Triage reads the customer message.', agent: 'Rohan Das', observation: 'Customer asks for a refund of ₹4,200 for order 80412.' },
      { id: 'check_payment', name: 'Check the payment', description: 'Settlement Matcher compares it with the sample bank file.', agent: 'Meera Iyer', observation: 'Payment found. The customer was charged twice, so the refund is valid.' },
      { id: 'draft_reply', name: 'Draft the reply', description: 'Support Triage writes the customer reply.', agent: 'Rohan Das', observation: 'Drafted a short reply confirming the refund. Not sent.' },
      { id: 'approval', name: 'Approve before anything is sent', description: 'A person approves the refund and the reply.', agent: 'Human approval', observation: '' },
    ],
  },
]

export const WORKFLOW_TEMPLATES = [
  { id: 'wt1', name: 'Invoice to payment match', domain: 'finance', steps: 4, trigger: 'manual', description: 'Match invoices to bank lines and flag gaps.' },
  { id: 'wt2', name: 'New hire onboarding', domain: 'hr', steps: 5, trigger: 'event', description: 'Create accounts and send the welcome pack.' },
  { id: 'wt3', name: 'Daily sales summary', domain: 'marketing', steps: 3, trigger: 'schedule', description: 'Pull yesterday\'s sales and post a summary.' },
]

export const AGENT_TEMPLATES = [
  { id: 't1', name: 'Settlement reconciler', domain: 'finance', type: 'Buyer', prompt: 'Match my daily settlements to my bank statement and flag what does not match' },
  { id: 't2', name: 'Ticket triage', domain: 'comms', type: 'Seller', prompt: 'Triage new support tickets and draft replies' },
  { id: 't3', name: 'Lead follow-up', domain: 'marketing', type: 'Seller', prompt: 'Score new leads and draft a follow-up for each' },
]

export const ACTIVITY = [
  { id: 1, event_type: 'agent.run', action: 'execute', outcome: 'success', time: '2 min ago' },
  { id: 2, event_type: 'agent.run', action: 'execute', outcome: 'success', time: '18 min ago' },
  { id: 3, event_type: 'agent.create', action: 'create', outcome: 'success', time: '1 hr ago' },
  { id: 4, event_type: 'approval.request', action: 'refund_over_limit', outcome: 'pending', time: '1 hr ago' },
]

export const APPROVAL = { id: 'appr-1', title: 'Refund of ₹4,200 to a customer', trigger_type: 'refund_over_limit', assignee_role: 'admin', priority: 'high' }
