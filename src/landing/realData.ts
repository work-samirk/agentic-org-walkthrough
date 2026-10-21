// Content copied from the real AgenticOrg landing page (components/InteractiveDemo, ROICalculator, SocialProof and pages/Landing).
// The behaviour in the page components follows the originals; only the look changes.

/* ── Scenario definitions ── */

export interface TraceLine {
  type: "system" | "agent" | "tool" | "result" | "hitl" | "confidence" | "separator";
  text: string;
  delay: number; // ms before this line appears
  color?: string;
}

export interface Scenario {
  id: string;
  label: string;
  icon: string;
  agent: string;
  designation: string;
  avatar: string;
  avatarColor: string;
  domain: string;
  taskTitle: string;
  taskInput: string;
  lines: TraceLine[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "invoice",
    label: "Invoice Processing",
    icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
    agent: "Priya",
    designation: "AP Processor, Mumbai",
    avatar: "P",
    avatarColor: "bg-emerald-500",
    domain: "finance",
    taskTitle: "Process Invoice INV-2024-4521",
    taskInput: '{ "vendor": "Tata Steel Ltd", "amount": "₹3,24,500", "po_ref": "PO-8847" }',
    lines: [
      { type: "system", text: "Task assigned to Priya (AP Processor, Mumbai)", delay: 0 },
      { type: "system", text: "Loading prompt template: ap_processor.prompt.txt", delay: 400 },
      { type: "separator", text: "", delay: 600 },
      { type: "agent", text: "STEP 1: EXTRACT", delay: 800 },
      { type: "tool", text: "→ ocr_extract_invoice(s3_key: inv-2024-4521.pdf)", delay: 1000 },
      { type: "result", text: "  ✓ Extracted: vendor=Tata Steel, GSTIN=27AAACT2727Q1ZV, amount=₹3,24,500", delay: 1800 },
      { type: "separator", text: "", delay: 2000 },
      { type: "agent", text: "STEP 2: VALIDATE", delay: 2200 },
      { type: "tool", text: "→ gstn_validate(gstin: 27AAACT2727Q1ZV)", delay: 2400 },
      { type: "result", text: "  ✓ GSTIN valid: Tata Steel Limited, Maharashtra", delay: 3200 },
      { type: "tool", text: "→ check_duplicate(inv_id: INV-2024-4521, vendor: tata_steel)", delay: 3400 },
      { type: "result", text: "  ✓ No duplicate found", delay: 4000 },
      { type: "separator", text: "", delay: 4200 },
      { type: "agent", text: "STEP 3: 3-WAY MATCH", delay: 4400 },
      { type: "tool", text: "→ erp_get_po(po_ref: PO-8847)", delay: 4600 },
      { type: "result", text: "  ✓ PO amount: ₹3,25,000 | Invoice: ₹3,24,500 | Delta: ₹500 (0.15%)", delay: 5400 },
      { type: "result", text: "  ✓ Within 2% tolerance, MATCHED", delay: 5800, color: "text-emerald-400" },
      { type: "separator", text: "", delay: 6000 },
      { type: "agent", text: "STEP 4: SCHEDULE PAYMENT", delay: 6200 },
      { type: "tool", text: "→ erp_queue_payment(date: 2026-04-02, discount: 2% early-pay)", delay: 6400 },
      { type: "result", text: "  ✓ Payment scheduled for Apr 2, saving ₹6,490 in early-pay discount", delay: 7200 },
      { type: "separator", text: "", delay: 7400 },
      { type: "agent", text: "STEP 5: POST TO GL", delay: 7600 },
      { type: "tool", text: "→ erp_post_journal(idempotency_key: INV-2024-4521_gl_post)", delay: 7800 },
      { type: "result", text: "  ✓ Journal entry JE-29847 posted to GL", delay: 8600 },
      { type: "separator", text: "", delay: 8800 },
      { type: "confidence", text: "Confidence: 94% | Status: COMPLETED | Latency: 2.3s | Tokens: 847", delay: 9000 },
    ],
  },
  {
    id: "onboarding",
    label: "Employee Onboarding",
    icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    agent: "Maya",
    designation: "Onboarding Specialist",
    avatar: "M",
    avatarColor: "bg-purple-500",
    domain: "hr",
    taskTitle: "Onboard New Hire: Rahul Kumar (SDE-II)",
    taskInput: '{ "name": "Rahul Kumar", "role": "SDE-II", "dept": "Engineering", "start": "2026-04-01" }',
    lines: [
      { type: "system", text: "Task assigned to Maya (Onboarding Specialist)", delay: 0 },
      { type: "system", text: "Loading prompt template: onboarding_agent.prompt.txt", delay: 400 },
      { type: "separator", text: "", delay: 600 },
      { type: "agent", text: "STEP 1: CREATE EMPLOYEE RECORD", delay: 800 },
      { type: "tool", text: "→ darwinbox.create_employee(name: Rahul Kumar, role: SDE-II)", delay: 1000 },
      { type: "result", text: "  ✓ Employee ID: EMP-10847 created in Darwinbox", delay: 1800 },
      { type: "separator", text: "", delay: 2000 },
      { type: "agent", text: "STEP 2: PROVISION IT ACCESS", delay: 2200 },
      { type: "tool", text: "→ google_workspace.create_account(rahul.kumar@agenticorg.ai)", delay: 2400 },
      { type: "result", text: "  ✓ Email account created", delay: 3000 },
      { type: "tool", text: "→ slack.invite_user(rahul.kumar@agenticorg.ai, channels: #engineering, #general)", delay: 3200 },
      { type: "result", text: "  ✓ Slack invite sent to 2 channels", delay: 3800 },
      { type: "tool", text: "→ github.add_to_team(user: rahulkumar, team: engineering)", delay: 4000 },
      { type: "result", text: "  ✓ Added to GitHub Engineering team", delay: 4600 },
      { type: "separator", text: "", delay: 4800 },
      { type: "agent", text: "STEP 3: SCHEDULE ORIENTATION", delay: 5000 },
      { type: "tool", text: "→ google_calendar.create_event(Day 1 Orientation, Apr 1, 10:00 AM)", delay: 5200 },
      { type: "result", text: "  ✓ Orientation scheduled with hiring manager", delay: 5800 },
      { type: "separator", text: "", delay: 6000 },
      { type: "agent", text: "STEP 4: SEND WELCOME KIT", delay: 6200 },
      { type: "tool", text: "→ email.send(to: rahul.kumar@agenticorg.ai, template: welcome_kit)", delay: 6400 },
      { type: "result", text: "  ✓ Welcome email sent with Day 1 checklist, laptop setup guide, benefits enrollment", delay: 7200 },
      { type: "separator", text: "", delay: 7400 },
      { type: "confidence", text: "Confidence: 96% | Status: COMPLETED | Latency: 1.8s | Tokens: 623", delay: 7600 },
    ],
  },
  {
    id: "ticket",
    label: "Support Triage",
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    agent: "Dev",
    designation: "Support Triage Lead",
    avatar: "D",
    avatarColor: "bg-orange-500",
    domain: "ops",
    taskTitle: "Triage: 'Payment gateway timeout in production'",
    taskInput: '{ "ticket": "TKT-9921", "subject": "Payment gateway timeout", "source": "PagerDuty", "severity": "P1" }',
    lines: [
      { type: "system", text: "Task assigned to Dev (Support Triage Lead)", delay: 0 },
      { type: "system", text: "Loading prompt template: support_triage.prompt.txt", delay: 400 },
      { type: "separator", text: "", delay: 600 },
      { type: "agent", text: "STEP 1: CLASSIFY SEVERITY", delay: 800 },
      { type: "tool", text: "→ analyze_ticket(subject: Payment gateway timeout, source: PagerDuty)", delay: 1000 },
      { type: "result", text: "  ✓ Classification: P1, Production, Revenue-impacting, Payment system", delay: 1800 },
      { type: "result", text: "  ✓ Category: Infrastructure > Payment Gateway > Timeout", delay: 2200, color: "text-red-400" },
      { type: "separator", text: "", delay: 2400 },
      { type: "agent", text: "STEP 2: CHECK RELATED INCIDENTS", delay: 2600 },
      { type: "tool", text: "→ pagerduty.search_incidents(service: payment-gateway, last_24h: true)", delay: 2800 },
      { type: "result", text: "  ✓ Found 3 related alerts in last 2 hours, possible systemic issue", delay: 3600 },
      { type: "separator", text: "", delay: 3800 },
      { type: "agent", text: "STEP 3: ROUTE TO SPECIALIST", delay: 4000 },
      { type: "tool", text: "→ get_oncall_engineer(team: payments, escalation_level: 1)", delay: 4200 },
      { type: "result", text: "  ✓ On-call: Amit Shah (Payments Team Lead)", delay: 4800 },
      { type: "tool", text: "→ slack.send_alert(channel: #payments-oncall, mention: @amitshah)", delay: 5000 },
      { type: "result", text: "  ✓ P1 alert sent to #payments-oncall with full context", delay: 5600 },
      { type: "separator", text: "", delay: 5800 },
      { type: "agent", text: "STEP 4: CREATE WAR ROOM", delay: 6000 },
      { type: "tool", text: "→ zoom.create_meeting(title: P1 War Room, Payment Gateway, auto_record: true)", delay: 6200 },
      { type: "result", text: "  ✓ War room created, link shared in #payments-oncall", delay: 6800 },
      { type: "separator", text: "", delay: 7000 },
      { type: "hitl", text: "⚠ HITL TRIGGERED: P1 incident requires COO acknowledgment within 15 minutes", delay: 7200 },
      { type: "confidence", text: "Confidence: 91% | Status: HITL_TRIGGERED | Latency: 1.4s | Tokens: 712", delay: 7800 },
    ],
  },
  {
    id: "recon",
    label: "Bank Reconciliation",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    agent: "Arjun",
    designation: "Recon Agent, East",
    avatar: "A",
    avatarColor: "bg-blue-500",
    domain: "finance",
    taskTitle: "Daily Bank Reconciliation, March 24, 2026",
    taskInput: '{ "date": "2026-03-24", "bank": "HDFC Current A/C", "expected_txns": 847 }',
    lines: [
      { type: "system", text: "Task assigned to Arjun (Recon Agent, East)", delay: 0 },
      { type: "system", text: "Loading prompt template: recon_agent.prompt.txt", delay: 400 },
      { type: "separator", text: "", delay: 600 },
      { type: "agent", text: "STEP 1: FETCH DATA", delay: 800 },
      { type: "tool", text: "→ banking_api.get_transactions(date: 2026-03-24, account: HDFC-001)", delay: 1000 },
      { type: "result", text: "  ✓ Fetched 847 bank transactions (₹4.2 Cr total)", delay: 1800 },
      { type: "tool", text: "→ erp.get_gl_entries(date: 2026-03-24)", delay: 2000 },
      { type: "result", text: "  ✓ Fetched 839 GL entries", delay: 2600 },
      { type: "separator", text: "", delay: 2800 },
      { type: "agent", text: "STEP 2: AUTO-MATCH", delay: 3000 },
      { type: "tool", text: "→ match_engine.run(bank_txns: 847, gl_entries: 839, tolerance: ₹10)", delay: 3200 },
      { type: "result", text: "  ✓ Round 1 (exact match): 812 matched", delay: 4000 },
      { type: "result", text: "  ✓ Round 2 (fuzzy ref match): 31 matched", delay: 4600 },
      { type: "result", text: "  ✓ Total matched: 843 / 847 (99.5%)", delay: 5200, color: "text-emerald-400" },
      { type: "separator", text: "", delay: 5400 },
      { type: "agent", text: "STEP 3: ANALYZE BREAKS", delay: 5600 },
      { type: "result", text: "  Break 1: ₹15,400, Bank debit, no GL entry (possible bank charge)", delay: 6000 },
      { type: "result", text: "  Break 2: ₹2,30,000, GL credit, no bank entry (cheque not cleared)", delay: 6400 },
      { type: "result", text: "  Break 3: ₹8,200, Amount mismatch (bank ₹8,200 vs GL ₹8,000)", delay: 6800 },
      { type: "result", text: "  Break 4: ₹47,500, Timing difference (posted Mar 25 in bank)", delay: 7200 },
      { type: "separator", text: "", delay: 7400 },
      { type: "hitl", text: "⚠ HITL TRIGGERED: 4 breaks totaling ₹3,01,100, CFO review required", delay: 7600 },
      { type: "confidence", text: "Confidence: 97% | Status: HITL_TRIGGERED | Latency: 3.1s | Tokens: 1,243", delay: 8200 },
    ],
  },
];

/*  ROI Calculator, Interactive savings estimator for agenticorg.ai   */
/* ------------------------------------------------------------------ */

export interface DomainSavings {
  domain: string;
  emoji: string;
  weeklyBase: number; // base weekly savings in INR for default inputs
  color: string;
  gradient: string;
  metrics: { label: string; before: string; after: string }[];
}

export const DOMAIN_DATA: DomainSavings[] = [
  {
    domain: "Finance",
    emoji: "\u{1F4B0}",
    weeklyBase: 320000, // 3.2L
    color: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
    metrics: [
      { label: "Invoice Processing", before: "30 min/invoice", after: "2 min/invoice" },
      { label: "Bank Reconciliation", before: "T+2, 80% accuracy", after: "T+0, 99.7% accuracy" },
      { label: "Month-end Close", before: "D+7", after: "D+2" },
    ],
  },
  {
    domain: "HR",
    emoji: "\u{1F465}",
    weeklyBase: 180000, // 1.8L
    color: "text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
    metrics: [
      { label: "Employee Onboarding", before: "3 days", after: "Instant (Day-0)" },
      { label: "Payroll Processing", before: "2 days", after: "4 hours" },
      { label: "Leave Management", before: "Manual approval chains", after: "Auto-routed" },
    ],
  },
  {
    domain: "Operations",
    emoji: "\u2699\uFE0F",
    weeklyBase: 210000, // 2.1L
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-600",
    metrics: [
      { label: "L1 Support", before: "Manual triage", after: "65% auto-contained" },
      { label: "Vendor Onboarding", before: "3 days", after: "4 hours" },
      { label: "IT Incident Response", before: "Hours", after: "Minutes" },
    ],
  },
  {
    domain: "Marketing",
    emoji: "\u{1F4E3}",
    weeklyBase: 90000, // 0.9L
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-600",
    metrics: [
      { label: "Campaign Optimization", before: "Weekly manual review", after: "Real-time AI tuning" },
      { label: "Content Production", before: "5 days/piece", after: "Same-day" },
      { label: "SEO & Analytics", before: "Monthly reports", after: "Continuous monitoring" },
    ],
  },
];

export const DEFAULT_EMPLOYEES = 500;
export const DEFAULT_INVOICES = 2000;
export const DEFAULT_TICKETS = 5000;
export const DEFAULT_CLOSE_DAYS = 7;

/* Scaling multipliers relative to the default input values */
export function computeScale(employees: number, invoices: number, tickets: number): Record<string, number> {
  return {
    Finance: invoices / DEFAULT_INVOICES,
    HR: employees / DEFAULT_EMPLOYEES,
    Operations: tickets / DEFAULT_TICKETS,
    Marketing: employees / DEFAULT_EMPLOYEES,
  };
}

/*  Data                                                               */
/* ------------------------------------------------------------------ */

export const STATS = [
  { value: "500+", label: "tasks automated daily" },
  { value: "99.7%", label: "reconciliation accuracy" },
  { value: "4.8/5", label: "customer rating" },
];

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  initials: string;
  gradient: string;
  quote: string;
  result: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rajesh Mehta",
    role: "CFO",
    company: "Larsen Manufacturing",
    initials: "RM",
    gradient: "from-blue-500 to-cyan-500",
    quote:
      "Our month-end close went from 5 days to 18 hours. The AP Processor catches GST mismatches we used to find weeks later.",
    result: "72% faster close cycle",
  },
  {
    name: "Ananya Sharma",
    role: "CHRO",
    company: "Nexgen Fintech",
    initials: "AS",
    gradient: "from-purple-500 to-pink-500",
    quote:
      "Onboarding that took our HR team 2 weeks now happens in a day. PF and ESI calculations are 100% accurate.",
    result: "Zero payroll errors in 6 months",
  },
  {
    name: "Vikrant Desai",
    role: "COO",
    company: "CloudServe India",
    initials: "VD",
    gradient: "from-orange-500 to-red-500",
    quote:
      "Support triage went from 40% mis-route rate to near zero. The P1 war room auto-creation alone saved us 3 outages.",
    result: "88% first-contact resolution",
  },
  {
    name: "Priya Nair",
    role: "CMO",
    company: "ShopLocal",
    initials: "PN",
    gradient: "from-emerald-500 to-teal-500",
    quote:
      "Campaign setup that used to take our team a full week launches overnight. ROI tracking is automatic.",
    result: "3.2x campaign ROI improvement",
  },
  {
    name: "Suresh Iyer",
    role: "VP Finance",
    company: "GreenEnergy Corp",
    initials: "SI",
    gradient: "from-indigo-500 to-violet-500",
    quote:
      "Bank reconciliation runs at 4 AM every day. We went from 3 FTEs reconciling to zero manual work.",
    result: "\u20B969,800/month saved in early-pay discounts",
  },
];

/* ------------------------------------------------------------------ */

export function formatINR(value: number): string {
  if (value >= 10000000) return `\u20B9${(value / 10000000).toFixed(1)} Cr`
  if (value >= 100000) return `\u20B9${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `\u20B9${(value / 1000).toFixed(1)}K`
  return `\u20B9${value.toFixed(0)}`
}

export const SDKS = [
  { title: 'Python SDK', badge: 'PyPI', install: 'pip install agenticorg', link: 'https://pypi.org/project/agenticorg/', cta: 'View on PyPI', code: `from agenticorg import AgenticOrg

client = AgenticOrg(api_key="ao_sk_...")
result = client.agents.run(
  "commerce_sales_agent",
  action="buyer_discovery_preview",
  inputs={"merchant_id": "merchant_demo"}
)
workflow = client.workflows.generate(
  "Review vendor renewal risk"
)` },
  { title: 'TypeScript SDK', badge: 'npm', install: 'npm i agenticorg-sdk', link: 'https://www.npmjs.com/package/agenticorg-sdk', cta: 'View on npm', code: `import { AgenticOrg } from "agenticorg-sdk"

const client = new AgenticOrg({
  apiKey: "ao_sk_..."
})
const result = await client.agents.run(
  "commerce_sales_agent",
  { action: "buyer_discovery_preview" }
)
const kb = await client.knowledge.search(
  "vendor renewal policy"
)` },
  { title: 'CLI', badge: 'Terminal', install: 'pip install agenticorg', link: 'https://github.com/mishrasanjeev/agentic-org', cta: 'View on GitHub', code: `$ agenticorg agents list
$ agenticorg agents run ap_processor \\
    --input invoice_id=INV-001
$ agenticorg sop deploy \\
    --file onboarding.pdf` },
  { title: 'MCP Server', badge: 'ChatGPT / Claude', install: 'npx agenticorg-mcp-server', link: 'https://www.npmjs.com/package/agenticorg-mcp-server', cta: 'View on ChatGPT / Claude', code: `// claude_desktop_config.json
{
  "mcpServers": {
    "agenticorg": {
      "command": "npx",
      "args": ["agenticorg-mcp-server"],
      "env": {
        "AGENTICORG_API_KEY": "ao_sk_..."
      }
    }
  }
}` },
]

export const PROTOCOLS = [
  { t: 'A2A Protocol', d: "Google's Agent-to-Agent protocol. Your agents publish Agent Cards, discovered by external agents automatically." },
  { t: 'MCP (Model Context Protocol)', d: "Anthropic's MCP. Expose 668+ tools to ChatGPT, Claude Desktop, Cursor, Windsurf, or any MCP client." },
  { t: 'Grantex Scope Enforcement', d: 'Manifest-based permission enforcement with offline JWT verification. Every tool call is checked against connector manifests before execution. Commerce artifacts add a separate fail-closed OACP cache boundary for freshness, revocation, risk, and non-execution posture.', link: '/how-grantex-works' },
]

export const CASE_STEPS = [
  { stage: '1', title: 'Invoice', desc: 'Create invoices in Zoho Books with GSTIN validation and HSN codes', connector: 'Zoho Books' },
  { stage: '2', title: 'Bank Reconcile', desc: 'Fetch statements via Account Aggregator, auto-match with high accuracy', connector: 'Finvu AA' },
  { stage: '3', title: 'GST Filing', desc: 'Push GSTR-1/3B to GSTN via Adaequare GSP with DSC digital signing', connector: 'GSTN' },
  { stage: '4', title: 'Tally Sync', desc: 'Post vouchers to Tally Prime via XML/TDL protocol through local bridge', connector: 'Tally Bridge' },
]
