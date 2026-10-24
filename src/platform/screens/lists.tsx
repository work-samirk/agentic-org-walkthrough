import { useState } from 'react'
import { Button, Badge, Textarea } from '../ui/primitives'
import { Field, inputCls, Mono, Page, Panel, selectCls, Stats, Status, Table, Tabs, useSay } from './kit'

/* Prompt templates ------------------------------------------------------------------------- */
const PROMPTS = [
  ['ap_processor', 'Finance', 'Process supplier invoices, match them to purchase orders and flag mismatches.', true],
  ['recon_agent', 'Finance', 'Match bank transactions to ledger entries and list the breaks for review.', true],
  ['lead_qualifier', 'Marketing', 'Score inbound leads against your ideal customer profile and draft a first reply.', true],
  ['support_triage', 'Ops', 'Read new tickets, tag them, answer the easy ones and escalate the rest.', true],
  ['custom_collections', 'Finance', 'You are the {{role}} Agent for {{org_name}}. Chase overdue invoices politely and log every reply.', false],
] as const
function NewPrompt() {
  const say = useSay()
  return <Button onClick={() => say('Creating templates is not enabled in the walkthrough')}>New Prompt Template</Button>
}
export function PromptTemplates() {
  const [dom, setDom] = useState('All Domains')
  const rows = PROMPTS.filter((p) => dom === 'All Domains' || p[1] === dom)
  return (
    <Page title="Prompt Templates" sub="Reusable instructions that agents start from" actions={<NewPrompt />}>
      <select aria-label="Domain" value={dom} onChange={(e) => setDom(e.target.value)} className={`${selectCls} w-48`}>{['All Domains', 'Finance', 'Marketing', 'Ops'].map((d) => <option key={d}>{d}</option>)}</select>
      <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
        {rows.map(([n, d, t, b]) => (
          <Panel key={n}>
            <div className="mb-2 flex items-center justify-between gap-2"><Mono>{n}</Mono>{b ? <Badge variant="secondary">Built-in</Badge> : <Badge variant="default">Custom</Badge>}</div>
            <p className="text-sm">{t}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>{d}</span><span>{b ? 'Clone to edit' : 'Edit · Delete'}</span></div>
          </Panel>
        ))}
      </div>
    </Page>
  )
}

/* Create from SOP -------------------------------------------------------------------------- */
function SopBody() {
  const say = useSay()
  const [mode, setMode] = useState<'file' | 'text'>('text')
  return (
    <Panel title="Step 1: Provide SOP document" desc="Upload a business process document and we will generate an AI agent configuration">
      <div className="space-y-4">
        <Tabs tabs={[['file', 'Upload file'], ['text', 'Paste text']]} value={mode} onChange={setMode} />
        {mode === 'file' ? (
          <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed text-sm text-muted-foreground">Drop a PDF, Markdown or text file here</div>
        ) : (
          <Field label="SOP text"><Textarea rows={7} placeholder="Paste your Standard Operating Procedure here..." defaultValue={'1. Receive the supplier invoice by email.\n2. Extract vendor, amount and PO number.\n3. Match against the purchase order within 2% tolerance.\n4. If it matches, schedule payment. If not, ask the finance lead.'} /></Field>
        )}
        <Field label="Domain hint (optional)"><select className={`${selectCls} w-56`}>{['Auto-detect', 'Finance', 'Marketing', 'Ops', 'HR'].map((d) => <option key={d}>{d}</option>)}</select></Field>
        <Button onClick={() => say('Generated: AP Processor, finance, confidence floor 88%')}>Generate agent configuration</Button>
      </div>
    </Panel>
  )
}
export const SOP = () => <Page title="Create Agent from SOP" sub="Upload a business process document and we will generate an AI agent configuration"><SopBody /></Page>

/* Schedules -------------------------------------------------------------------------------- */
function NewSchedule() {
  const say = useSay()
  return <Button onClick={() => say('Creating schedules is not enabled in the walkthrough')}>+ New Schedule</Button>
}
export const ReportSchedules = () => (
  <Page title="Report Schedules" sub="Configure automated report generation and delivery" actions={<NewSchedule />}>
    <Panel>
      <Table cols={['Report', 'Schedule', 'Next run', 'Last run', 'Status', 'Format', 'Actions']} rows={[
        ['Weekly finance summary', 'Every Monday 09:00', 'Mon 27 Oct, 09:00', 'Mon 20 Oct, 09:00', <Status key="1" v="Active" />, 'PDF', 'Edit · Run now'],
        ['Daily bank reconciliation', 'Every weekday 08:30', 'Fri 24 Oct, 08:30', 'Thu 23 Oct, 08:30', <Status key="2" v="Active" />, 'CSV', 'Edit · Run now'],
        ['Monthly GST filing status', '1st of every month', '1 Nov, 10:00', '1 Oct, 10:00', <Status key="3" v="Paused" />, 'PDF', 'Edit · Run now'],
      ]} />
    </Panel>
    <p className="text-xs text-muted-foreground">Delivered by Email, Slack or WhatsApp. Times are UTC.</p>
  </Page>
)

function MySchedulesBody() {
  const [tab, setTab] = useState<'merchant' | 'general'>('general')
  const [st, setSt] = useState('All statuses')
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={[['merchant', 'By Merchant'], ['general', 'General Schedules']]} value={tab} onChange={setTab} />
        <select aria-label="Status" value={st} onChange={(e) => setSt(e.target.value)} className={selectCls}>{['All statuses', 'Active', 'Paused', 'Running', 'Completed', 'Failed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {tab === 'general' ? (
        <Panel><Table cols={['Agent', 'Query', 'Run at', 'Mode', 'Status']} rows={[['AP Processor', 'Pay approved invoices due this week', 'Today 17:00', 'Once', <Status key="1" v="Active" />], ['Reconciliation Agent', 'Reconcile HDFC current account', 'Every day 08:30', 'Recurring', <Status key="2" v="Running" />], ['Support Triage', 'Summarise open tickets for the standup', 'Every weekday 09:15', 'Recurring', <Status key="3" v="Active" />]].filter((r) => st === 'All statuses' || (r[4] as { props: { v: string } }).props.v === st)} /></Panel>
      ) : (
        <Panel><p className="py-8 text-center text-sm text-muted-foreground">No merchant-specific schedules have been registered yet.</p></Panel>
      )}
    </>
  )
}
export const MySchedules = () => <Page title="Scheduled Agent Tasks" sub="Deferred or recurring agent runs created from chat workflows and background processes."><MySchedulesBody /></Page>

/* Voice ------------------------------------------------------------------------------------ */
function VoiceBody() {
  const say = useSay()
  return (
    <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
      <Panel title="Current candidate" desc="The version being tested"><p className="text-2xl font-bold">Candidate v12</p><p className="mt-1 text-xs text-muted-foreground">Updated 2 hours ago</p><div className="mt-4"><Button onClick={() => say('Voice Studio is not part of the walkthrough')}>Test in Studio</Button></div></Panel>
      <Panel title="Production state" desc="What callers hear today"><p className="text-2xl font-bold">Production v11</p><p className="mt-1 text-xs text-muted-foreground">Updated 9 days ago</p><div className="mt-4"><Button variant="outline" onClick={() => say('Releases are managed by your administrator')}>Manage release</Button></div></Panel>
    </div>
  )
}
export const Voice = () => <Page title="Voice" sub="Phone agents for inbound and outbound calls"><VoiceBody /><Panel title="Voice agents"><Table cols={['Agent', 'Language', 'Calls today', 'Avg length', 'Status']} rows={[['Collections caller', 'English, Hindi', 142, '2:10', <Status key="1" v="Active" />], ['Appointment reminders', 'English', 88, '0:48', <Status key="2" v="Active" />], ['Support line', 'English, Tamil', 0, '-', <Status key="3" v="Paused" />]]} /></Panel></Page>

/* RPA -------------------------------------------------------------------------------------- */
function RpaScriptsBody() {
  const say = useSay()
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
        {[['epfo_challan_download', 'Download the monthly EPFO challan from the portal.'], ['gst_return_status', 'Check the filing status of your GSTR returns.'], ['bank_statement_fetch', 'Log in to net banking and fetch yesterday\'s statement.'], ['mca_filing_check', 'Look up a company on the MCA portal.']].map(([n, d]) => (
          <Panel key={n}><div className="mb-2 flex items-center justify-between"><Mono>{n}</Mono><Badge variant="secondary">built-in</Badge></div><p className="text-sm text-muted-foreground">{d}</p><div className="mt-3"><Button size="sm" onClick={() => say('Scripts run on the server in the real product')}>Run Script</Button></div></Panel>
        ))}
      </div>
      <Panel title="Execution history"><Table cols={['Script', 'Started', 'Duration', 'Status']} rows={[['gst_return_status', 'Today 08:31', '14 s', <Status key="1" v="Completed" />], ['bank_statement_fetch', 'Today 08:30', '41 s', <Status key="2" v="Completed" />], ['epfo_challan_download', 'Yesterday 18:02', '1 m 12 s', <Status key="3" v="Failed" />]]} /></Panel>
    </>
  )
}
export const RpaScripts = () => <Page title="Browser RPA Scripts" sub="Scripts that work in a browser when a system has no API"><RpaScriptsBody /></Page>
export const RpaSchedules = () => (
  <Page title="RPA Schedules" sub="Run browser scripts on a timer">
    <Panel><Table cols={['Script', 'Schedule', 'Next run', 'Status', 'Actions']} rows={[['bank_statement_fetch', 'Every day 08:30', 'Fri 24 Oct, 08:30', <Status key="1" v="Active" />, 'Run now · Delete'], ['gst_return_status', 'Every weekday 09:00', 'Fri 24 Oct, 09:00', <Status key="2" v="Active" />, 'Run now · Delete'], ['epfo_challan_download', '15th of every month', '15 Nov, 10:00', <Status key="3" v="Paused" />, 'Run now · Delete']]} /></Panel>
  </Page>
)

/* Schemas, knowledge base, industry packs --------------------------------------------------- */
function NewSchema() {
  const say = useSay()
  return <Button onClick={() => say('Creating schemas is not enabled in the walkthrough')}>Create Schema</Button>
}
export const Schemas = () => (
  <Page title="Schema Registry" sub="The shapes of the data agents read and write" actions={<NewSchema />}>
    <Stats items={[['Total schemas', '14'], ['Platform default', '11'], ['Custom', '3']]} />
    <Panel><Table cols={['Schema', 'Version', 'Type', 'Description']} rows={[['Invoice', 'v2', <Badge key="1" variant="secondary">Platform</Badge>, 'Supplier invoice with GSTIN and line items'], ['BankTransaction', 'v1', <Badge key="2" variant="secondary">Platform</Badge>, 'One bank statement line'], ['SupportTicket', 'v3', <Badge key="3" variant="secondary">Platform</Badge>, 'Customer ticket with priority and tags'], ['InvoiceV2', 'v1', <Badge key="4">Custom</Badge>, 'Northwind variant with PO number']]} /></Panel>
  </Page>
)

function KbBody() {
  const say = useSay()
  return (
    <>
      <Stats items={[['Total documents', '23'], ['Total chunks', '1,840'], ['Index size', '12.4 MB']]} />
      <Panel title="Upload" desc="Supported formats: PDF, Word, Excel, Markdown, Plain Text"><Button onClick={() => say('Uploads are not enabled in the walkthrough')}>Browse Files</Button></Panel>
      <Panel title="Test a query"><div className="flex gap-2"><input className={inputCls} placeholder="Test a query against the knowledge base..." /><Button onClick={() => say('Top match: Refund policy v3, section 2')}>Search</Button></div></Panel>
      <Panel title="Documents"><Table cols={['Filename', 'Status', 'Size', 'Uploaded', 'Actions']} rows={[['refund-policy-v3.pdf', <Status key="1" v="Ready" />, '480 KB', '12 Oct', 'Delete'], ['vendor-contracts.xlsx', <Status key="2" v="Ready" />, '1.2 MB', '8 Oct', 'Delete'], ['onboarding-handbook.md', <Status key="3" v="Pending" />, '96 KB', 'Today', 'Delete']]} /></Panel>
    </>
  )
}
export const KnowledgeBase = () => <Page title="Knowledge Base" sub="Documents your agents can search and quote"><KbBody /></Page>

export const IndustryPacks = () => (
  <Page title="Industry Packs" sub="Ready-made agents, workflows and connectors for one industry">
    <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
      {[['Banking and Fintech', 'Installed', '9 agents', 'KYC check, dispute handling, reconciliation', 'Finvu, Razorpay, Zoho Books'], ['CA Firms', 'Installed', '6 agents', 'Invoicing, GST filing, Tally sync', 'GSTN, Tally, Zoho Books'], ['Retail and Ecommerce', 'Unavailable', '7 agents', 'Returns, inventory, support', 'Shopify, Stripe'], ['Healthcare', 'Unavailable', '5 agents', 'Appointments, claims, billing', 'Practo, Razorpay']].map(([n, st, ag, wf, cn]) => (
        <Panel key={n}><div className="mb-2 flex items-center justify-between"><b>{n}</b><Status v={st === 'Installed' ? 'Installed' : 'Pending'} /></div><p className="text-sm text-muted-foreground">{ag} · Workflows: {wf}</p><p className="mt-1 text-xs text-muted-foreground">Required connectors: {cn}</p></Panel>
      ))}
    </div>
  </Page>
)
