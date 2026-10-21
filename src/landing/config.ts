// Things the team changes without touching the layout: the banner, the headline variants and the placeholders.
export const BANNER = ['Pine Labs is coming to Singapore Fintech Festival 2026. Watch AgenticOrg in action on 18th November']

export type VariantKey = 'control' | 'outcome' | 'operating'
export const VARIANTS: Record<VariantKey, { h1: string; g: number; sub: string }> = {
  control: { h1: 'Hire an agent. Approve its work.', g: 3, sub: 'Describe the job in plain words. Your agent starts on probation, shows its work, and waits for your approval before anything real happens.' },
  outcome: { h1: 'Agents that do the work.', g: 2, sub: 'Describe the job in plain words. Your agent does it on sample data first, shows its work, and only acts for real when you say so.' },
  operating: { h1: 'Run a workforce of agents.', g: 3, sub: 'Give each job to an agent, watch every step, and decide how much freedom each one earns. People keep the final say.' },
}

export const FREE_LINE = 'Free to start. No credit card required.'

export const ROLES = [
  { id: 'founder', label: 'Founder', icon: 'spark' },
  { id: 'finance', label: 'Finance and compliance', icon: 'landmark' },
  { id: 'ops', label: 'Operations and support', icon: 'headset' },
  { id: 'sales', label: 'Sales and marketing', icon: 'send' },
  { id: 'hr', label: 'HR', icon: 'users' },
  { id: 'eng', label: 'Engineering', icon: 'code' },
  { id: 'product', label: 'Product and design', icon: 'layers' },
  { id: 'other', label: 'Other', icon: 'dots' },
] as const
export type RoleId = (typeof ROLES)[number]['id']

export type Scene = {
  agent: string
  title: string
  prompt: string
  steps: string[]
  result: string
  ask: string
  approve: string
}

// Sample data only. No real company, person or figure.
export const SCENES: Record<RoleId, Scene> = {
  founder: {
    agent: 'Anika', title: 'Business summary analyst',
    prompt: 'Send me a daily summary of sales and payments',
    steps: ['Read yesterday\'s sales: 128 orders', 'Compared settlements with the bank', 'Spotted refunds up from 1.6% to 2.1%'],
    result: '$6,400 in sales, $6,100 settled, $302 still in transit.',
    ask: 'Send this summary to you and your co-founder at 8:00?', approve: 'Approve and send',
  },
  finance: {
    agent: 'Arjun', title: 'Reconciliation specialist',
    prompt: 'Match my daily settlements to the bank statement and flag what does not match',
    steps: ['Loaded 851 bank lines and 847 ledger entries', 'Matched 844 of them automatically', 'Found 3 that do not agree'],
    result: '99.6% matched. 3 breaks need a person.',
    ask: 'Post a $42.00 adjustment for order 80412?', approve: 'Approve the entry',
  },
  ops: {
    agent: 'Dev', title: 'Support triage lead',
    prompt: 'Read new support tickets and draft replies',
    steps: ['Read ticket 4821: a double charge', 'Checked the payment: charged twice', 'Drafted a reply with the refund'],
    result: 'Refund of $24 drafted. Customer is in good standing.',
    ask: 'Send this reply to the customer?', approve: 'Approve and send',
  },
  sales: {
    agent: 'Neha', title: 'Campaign pilot',
    prompt: 'Follow up with leads that went quiet',
    steps: ['Pulled 12 leads with no reply in 10 days', 'Ranked them by last activity', 'Drafted 3 short follow-ups'],
    result: '3 follow-ups ready, each with a different angle.',
    ask: 'Send 3 follow-up emails?', approve: 'Approve and send',
  },
  hr: {
    agent: 'Maya', title: 'Onboarding specialist',
    prompt: 'Get new hires ready for day one',
    steps: ['Read the offer letter for a new hire', 'Built a 9-task day-one checklist', 'Prepared laptop and access requests'],
    result: 'Checklist ready. 4 access requests waiting.',
    ask: 'Send the welcome email and the access requests?', approve: 'Approve and send',
  },
  eng: {
    agent: 'Rhea', title: 'Incident responder',
    prompt: 'Watch alerts and act on the clear ones',
    steps: ['Read the alert: error rate at 4.2%', 'Traced it to the latest release', 'Opened a rollback request'],
    result: 'Release 4f2a9c is the likely cause.',
    ask: 'Roll back release 4f2a9c?', approve: 'Approve the rollback',
  },
  product: {
    agent: 'Isha', title: 'Feedback analyst',
    prompt: 'Turn customer feedback into tickets',
    steps: ['Read 214 feedback notes', 'Grouped them into 5 themes', 'Top theme: slow checkout, 61 notes'],
    result: '3 tickets drafted from the top themes.',
    ask: 'Create 3 tickets in your tracker?', approve: 'Approve and create',
  },
  other: {
    agent: 'Sam', title: 'Inbox assistant',
    prompt: 'Sort my inbox and draft the easy replies',
    steps: ['Read 48 new emails', 'Sorted them into 4 groups', 'Drafted 6 short replies'],
    result: '6 replies ready. 2 emails need your eyes.',
    ask: 'Send 6 drafted replies?', approve: 'Approve and send',
  },
}

export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The role picked on this page carries into sign-up and answers the first welcome question.
export function presetRole(id: string) {
  try {
    sessionStorage.setItem('ao-preset-role', id)
  } catch {
    /* ignore */
  }
}
