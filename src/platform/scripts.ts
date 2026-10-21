// What the first agent looks like for each of the eight roles in the onboarding PRD (Appendix D):
// its persona, the wizard values the "Describe" step fills in, and how it answers. Sample data throughout.

export type Tool = { name: string; connector: string }
export type Script = {
  // describe box
  prompt: string
  // persona (wizard step 1)
  employee: string
  designation: string
  domain: string
  // role (step 2)
  agentType: string
  specialization: string
  // behaviour (step 4)
  tools: Tool[]
  // chat
  ask: string
  answer: string
  confidence: number
  hold?: string
  // "Why did the agent do this?"
  explain: string[]
  toolsCited: string[]
}

export const SCRIPTS: Record<string, Script> = {
  founder: {
    prompt: 'Send me a daily summary of sales and payments',
    employee: 'Anika Rao', designation: 'Business Summary Analyst', domain: 'finance', agentType: 'fpa_agent',
    specialization: 'Daily sales, payments and settlement summaries for the founder',
    tools: [{ name: 'get_transaction_list', connector: 'sample_bank' }, { name: 'fetch_bank_statement', connector: 'sample_bank' }, { name: 'list_invoices', connector: 'zoho_books' }],
    ask: 'Give me yesterday\'s summary.',
    answer: 'Yesterday: 128 orders, ₹6.4 lakh in sales, ₹6.1 lakh settled. ₹30,200 is still in transit and should land tomorrow. Refunds were 2.1%, a little above your usual 1.6%.',
    confidence: 0.93,
    explain: ['Read the sample sales file: 128 rows.', 'Added up sales and settlements and compared them with the day before.', 'Flagged one change: the refund rate moved from 1.6% to 2.1%.', 'Wrote the summary. Shadow Mode kept it here and sent nothing.'],
    toolsCited: ['get_transaction_list', 'fetch_bank_statement'],
  },
  finance: {
    prompt: 'Match my daily settlements to my bank statement and flag what does not match',
    employee: 'Arjun Mehta', designation: 'Bank Reconciliation Specialist', domain: 'finance', agentType: 'recon_agent',
    specialization: 'Bank reconciliation and discrepancy resolution',
    tools: [{ name: 'fetch_bank_statement', connector: 'sample_bank' }, { name: 'get_transaction_list', connector: 'sample_bank' }, { name: 'check_account_balance', connector: 'sample_bank' }, { name: 'list_invoices', connector: 'zoho_books' }],
    ask: 'Reconcile yesterday\'s settlements.',
    answer: '412 of 415 settlements match the bank statement. 3 do not: one is short by ₹4,200, one is missing from the bank file, and one is a duplicate. I have not changed anything.',
    confidence: 0.91,
    hold: 'Adjust ₹4,200 on order 80412',
    explain: ['Read the settlement file: 415 rows (sample_bank).', 'Read the bank statement for the same day.', 'Matched on order ID first, then amount. 412 matched and 3 were left over.', 'Held a correction of ₹4,200 for approval. It was not applied because the agent is in Shadow Mode.'],
    toolsCited: ['fetch_bank_statement', 'get_transaction_list'],
  },
  ops: {
    prompt: 'Triage new support tickets and draft replies',
    employee: 'Rohit Sen', designation: 'Support Triage Specialist', domain: 'ops', agentType: 'support_triage',
    specialization: 'Ranking new tickets by urgency and drafting first replies',
    tools: [{ name: 'read_inbox', connector: 'gmail' }, { name: 'send_email', connector: 'gmail' }],
    ask: 'Triage the 3 new tickets.',
    answer: '3 tickets triaged: 1 urgent (a double charge), 1 routine (a receipt request) and 1 for the billing team. I drafted a reply for each. None were sent.',
    confidence: 0.9,
    hold: 'Send the reply about the double charge',
    explain: ['Read the 3 new tickets from the sample inbox.', 'Ranked them by urgency. The double charge goes first.', 'Drafted a short reply for each ticket.', 'Held the urgent reply for approval because it promises a refund. Nothing was sent.'],
    toolsCited: ['read_inbox'],
  },
  sales: {
    prompt: 'Score new leads and draft a follow-up for each',
    employee: 'Neha Kapoor', designation: 'Lead Intelligence Analyst', domain: 'marketing', agentType: 'crm_intelligence',
    specialization: 'Scoring new leads and drafting follow-ups',
    tools: [{ name: 'list_leads', connector: 'sample_crm' }, { name: 'send_email', connector: 'gmail' }],
    ask: 'Score this week\'s new leads.',
    answer: '14 new leads: 3 hot, 6 warm, 5 cold. The three hot ones asked about pricing in the last two days. I drafted a short follow-up for each.',
    confidence: 0.89,
    hold: 'Send 3 follow-up emails',
    explain: ['Read 14 leads from the sample CRM.', 'Scored each on recent activity and company size.', 'Drafted a follow-up for each hot lead.', 'Held the emails for approval. Shadow Mode sends nothing.'],
    toolsCited: ['list_leads'],
  },
  hr: {
    prompt: 'Answer employee leave questions from our policy',
    employee: 'Isha Verma', designation: 'HR Policy Assistant', domain: 'hr', agentType: 'onboarding_agent',
    specialization: 'Answering leave and policy questions with the source cited',
    tools: [{ name: 'search_policy', connector: 'sample_docs' }],
    ask: 'How many days of casual leave can I carry over?',
    answer: 'Up to 5 days of casual leave carry over into the next year. Anything above 5 lapses on 31 March. Source: Leave Policy, section 4.2 (sample document).',
    confidence: 0.95,
    explain: ['Searched the sample Leave Policy (12 pages).', 'Found the carry-over rule in section 4.2.', 'Answered with the section cited so you can check it.'],
    toolsCited: ['search_policy'],
  },
  eng: {
    prompt: 'Call an agent from code and read the result',
    employee: 'Dev Malhotra', designation: 'Integration Engineer', domain: 'ops', agentType: 'it_operations',
    specialization: 'Showing how to call agents from code and reading results',
    tools: [{ name: 'get_api_reference', connector: 'sample_docs' }],
    ask: 'Show me how I call you from code.',
    answer: 'POST /v1/agents/dev-malhotra/run with {"input": "..."} and read result.answer. Every run returns a trace ID you can open here to see the steps.',
    confidence: 0.94,
    explain: ['Looked up the run endpoint in the sample API reference.', 'Built an example request and response for you.'],
    toolsCited: ['get_api_reference'],
  },
  product: {
    prompt: 'Summarise customer feedback every week',
    employee: 'Sara Joseph', designation: 'Feedback Analyst', domain: 'marketing', agentType: 'brand_monitor',
    specialization: 'Weekly customer feedback themes',
    tools: [{ name: 'list_feedback', connector: 'sample_crm' }],
    ask: 'Summarise this week\'s feedback.',
    answer: '62 comments this week. Top themes: slow refunds (18), a confusing settlement report (11), and praise for the new dashboard (9). The settlement report is the one to fix first.',
    confidence: 0.9,
    explain: ['Read 62 comments from the sample feedback list.', 'Grouped them into 3 themes that cover 61% of comments.', 'Ranked the themes by how many people raised each.'],
    toolsCited: ['list_feedback'],
  },
  other: {
    prompt: 'Describe the job in your own words',
    employee: 'Maya Shah', designation: 'Virtual Assistant', domain: 'comms', agentType: 'chat_agent',
    specialization: 'General assistance on the job you describe',
    tools: [{ name: 'read_inbox', connector: 'gmail' }],
    ask: 'What can you do?',
    answer: 'I can do the job you described, using the sample data in this workspace. I run in Shadow Mode, so I show you what I would do and nothing real changes until you approve.',
    confidence: 0.88,
    explain: ['Checked what I can reach: one sample connector.', 'Answered from the instructions you gave me.'],
    toolsCited: ['read_inbox'],
  },
}

export function scriptFor(role?: string): Script {
  return SCRIPTS[role && SCRIPTS[role] ? role : 'finance']
}

export const humanize = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export function toolPermission(tool: string): 'READ' | 'WRITE' | 'DELETE' | 'ADMIN' {
  if (/^(get_|fetch_|list_|query|search_|check_|read_)/.test(tool)) return 'READ'
  if (/^(create_|update_|send_|post_)/.test(tool)) return 'WRITE'
  if (/^(delete_|remove_)/.test(tool)) return 'DELETE'
  if (/^(bulk_|reset_|admin_)/.test(tool)) return 'ADMIN'
  return 'READ'
}

// The long system prompt the describe step generates from a short request.
export function generatedPrompt(s: Script, request: string) {
  return `As a ${s.designation}, your primary responsibility is to handle the work described below with accuracy and care. You work inside AgenticOrg's governed environment: you start in Shadow Mode, you cite the tools you used, and you escalate to a person whenever your confidence drops below the floor or an action could affect real money, customers or data.\n\nYou will collaborate with the team, keep your answers short and plain, and never act outside the tools you are authorised to use.\n\n## User-provided requirements (authoritative)\n\n${request}`
}
