import { useState } from 'react'
import { Button } from '../ui/primitives'
import { inputCls, Mono, Page, Panel, selectCls, Status, Table, useSay } from './kit'

/* Scope dashboard, enforce audit and audit log ---------------------------------------------- */
const SCOPES = [
  ['AP Processor', 'zoho_books', 'list_invoices, create_bill', 'WRITE', '312 allowed / 0 denied'],
  ['AP Processor', 'gmail', 'read_inbox', 'READ', '88 allowed / 0 denied'],
  ['Reconciliation Agent', 'tally', 'list_ledgers', 'READ', '140 allowed / 0 denied'],
  ['Support Triage', 'slack', 'slack_send_message', 'WRITE', '201 allowed / 3 denied'],
  ['Lead Qualifier', 'hubspot', 'list_leads, update_deal', 'WRITE', '96 allowed / 1 denied'],
  ['Incident Watch', 'stripe', 'create_refund', 'ADMIN', '4 allowed / 6 denied'],
] as const
export function Scope() {
  const [q, setQ] = useState('')
  const [perm, setPerm] = useState('All permissions')
  const rows = SCOPES.filter((r) => r[0].toLowerCase().includes(q.toLowerCase()) && (perm === 'All permissions' || r[3] === perm))
  return (
    <Page title="Scope Dashboard" sub="Runtime permission boundaries, connector authorizations, and denial telemetry">
      <div className="flex flex-wrap gap-2">
        <input className={`${inputCls} max-w-xs`} placeholder="Search agent..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search agent" />
        <select className={selectCls} value={perm} onChange={(e) => setPerm(e.target.value)} aria-label="Permission">{['All permissions', 'READ', 'WRITE', 'ADMIN'].map((p) => <option key={p}>{p}</option>)}</select>
      </div>
      <Panel><Table cols={['Agent', 'Connector', 'Tools', 'Permission', 'Status (24h)']} rows={rows.map((r) => [r[0], <Mono key="c">{r[1]}</Mono>, r[2], <b key="p" className="text-xs">{r[3]}</b>, r[4]])} /></Panel>
    </Page>
  )
}

function EnforceBody() {
  const say = useSay()
  const [res, setRes] = useState('All Results')
  const data = [
    ['15:02:11', 'AP Processor', 'zoho_books', 'create_bill', 'WRITE', 'Allowed', 'Within granted scope'],
    ['14:58:40', 'Support Triage', 'slack', 'slack_send_message', 'WRITE', 'Allowed', 'Within granted scope'],
    ['14:41:03', 'Incident Watch', 'stripe', 'create_refund', 'ADMIN', 'Denied', 'Agent holds READ only'],
    ['14:12:27', 'Lead Qualifier', 'hubspot', 'update_deal', 'WRITE', 'Denied', 'Amount above the $50 limit'],
    ['13:55:09', 'Reconciliation Agent', 'tally', 'list_ledgers', 'READ', 'Allowed', 'Within granted scope'],
  ]
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <select className={selectCls} value={res} onChange={(e) => setRes(e.target.value)} aria-label="Result">{['All Results', 'Allowed', 'Denied'].map((r) => <option key={r}>{r}</option>)}</select>
        <Button variant="outline" onClick={() => say('CSV download is not enabled in the walkthrough')}>Download CSV</Button>
      </div>
      <Panel><Table cols={['Timestamp', 'Agent', 'Connector', 'Tool', 'Permission', 'Result', 'Reason']} rows={data.filter((r) => res === 'All Results' || r[5] === res).map((r) => [r[0], r[1], <Mono key="c">{r[2]}</Mono>, r[3], r[4], <Status key="s" v={r[5]} />, r[6]])} /></Panel>
    </>
  )
}
export const EnforceAudit = () => <Page title="Enforce Audit Log" sub="Real-time policy enforcement, authorization grants, and runtime permission denials"><EnforceBody /></Page>

function AuditBody() {
  const say = useSay()
  const [f, setF] = useState('')
  const data = [
    ['2026-10-23 15:02', 'agent.run', 'AP Processor', 'Created bill for Tata Steel Ltd', 'Success'],
    ['2026-10-23 14:44', 'approval.decision', 'Priya Nair', 'Approved refund of $120', 'Success'],
    ['2026-10-23 14:41', 'scope.denied', 'Incident Watch', 'Blocked create_refund (ADMIN)', 'Denied'],
    ['2026-10-23 13:10', 'connector.health', 'System', 'Zoho Books health check', 'Success'],
    ['2026-10-23 11:27', 'agent.promote', 'Priya Nair', 'Moved GST Compliance Agent to Shadow', 'Success'],
  ]
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input className={`${inputCls} max-w-xs`} placeholder="Filter by event type (partial match)..." value={f} onChange={(e) => setF(e.target.value)} aria-label="Filter by event type" />
        <div className="flex gap-2"><Button variant="outline" onClick={() => say('Evidence package export is not enabled in the walkthrough')}>Export Evidence Package</Button><Button variant="outline" onClick={() => say('CSV download is not enabled in the walkthrough')}>Download CSV</Button></div>
      </div>
      <Panel><Table cols={['Timestamp', 'Event type', 'Actor', 'Action', 'Outcome']} rows={data.filter((r) => r[1].includes(f.toLowerCase())).map((r) => [r[0], <Mono key="e">{r[1]}</Mono>, r[2], r[3], <Status key="o" v={r[4]} />])} /></Panel>
    </>
  )
}
export const AuditLog = () => <Page title="Audit Log" sub="Immutable event trail for regulatory assurance and governance compliance"><AuditBody /></Page>
