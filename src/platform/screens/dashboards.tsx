import { useState } from 'react'
import { Button, Badge } from '../ui/primitives'
import { Bar, Mono, Page, Panel, selectCls, Stats, Status, Table, Tabs, useSay } from './kit'

/* Role dashboards: the same layout for every executive, with that area's agents ------------ */
type Row = [string, string, number, number, number] // agent, domain, tasks, success %, confidence %
const ALL: Row[] = [
  ['AP Processor', 'Finance', 412, 98, 94],
  ['Reconciliation Agent', 'Finance', 187, 99, 96],
  ['GST Compliance Agent', 'Finance', 64, 100, 97],
  ['Lead Qualifier', 'Marketing', 96, 93, 88],
  ['Campaign Reporter', 'Marketing', 41, 97, 91],
  ['Support Triage', 'Ops', 241, 95, 90],
  ['Incident Watch', 'Ops', 58, 96, 92],
  ['Onboarding Specialist', 'HR', 38, 100, 95],
  ['Email Responder', 'Comms', 133, 94, 89],
]

function RoleDashboard({ title, sub, domains }: { title: string; sub: string; domains: string[] | null }) {
  const rows = domains ? ALL.filter((r) => domains.includes(r[1])) : ALL
  const tasks = rows.reduce((a, r) => a + r[2], 0)
  const success = Math.round(rows.reduce((a, r) => a + r[3] * r[2], 0) / tasks)
  const conf = Math.round(rows.reduce((a, r) => a + r[4] * r[2], 0) / tasks)
  const byDomain = [...new Set(rows.map((r) => r[1]))].map((d) => [d, rows.filter((r) => r[1] === d).reduce((a, r) => a + r[2], 0)] as const)
  return (
    <Page title={title} sub={sub} actions={<Badge variant="success" pulse>System Live</Badge>}>
      <Stats items={[['Total tasks', String(tasks), 'Last 30 days'], ['Success rate', `${success}%`, 'Completed without a person'], ['Avg confidence', `${conf}%`, 'Across all runs'], ['Pending approvals', String(Math.max(1, Math.round(tasks / 150))), 'Waiting on a person']]} />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3"><Panel title="Agent activity" desc="Every agent in this area, busiest first"><Table cols={['Agent', 'Domain', 'Tasks', 'Success', 'Confidence']} rows={[...rows].sort((a, b) => b[2] - a[2]).map((r) => [r[0], r[1], r[2], `${r[3]}%`, `${r[4]}%`])} /></Panel></div>
        <div className="lg:col-span-2"><Panel title="Domain distribution" desc="Share of tasks by area"><div className="space-y-3">{byDomain.map(([d, n]) => <Bar key={d} label={d} value={n} max={tasks} text={`${n} tasks`} />)}</div></Panel></div>
      </div>
    </Page>
  )
}
export const CEO = () => <RoleDashboard title="CEO Dashboard" sub="The whole company at a glance" domains={null} />
export const CFO = () => <RoleDashboard title="Finance Dashboard" sub="Close, payables, reconciliation and compliance" domains={['Finance']} />
export const CMO = () => <RoleDashboard title="Marketing Dashboard" sub="Leads, campaigns and reporting" domains={['Marketing', 'Comms']} />
export const CHRO = () => <RoleDashboard title="CHRO Dashboard" sub="Hiring, onboarding and people operations" domains={['HR']} />
export const COO = () => <RoleDashboard title="COO Dashboard" sub="Operations, support and incidents" domains={['Ops']} />
export const CBO = () => <RoleDashboard title="CBO Dashboard" sub="Business operations across finance and ops" domains={['Finance', 'Ops']} />

/* ABM -------------------------------------------------------------------------------------- */
const ACCOUNTS = [
  ['Tata Steel Ltd', 'tatasteel.com', 'Tier 1', 'Manufacturing', 91, '2 hours ago'],
  ['Infosys BPM', 'infosysbpm.com', 'Tier 1', 'IT Services', 84, 'Yesterday'],
  ['Northwind Pay', 'northwindpay.in', 'Tier 2', 'Fintech', 77, '3 days ago'],
  ['Apollo Hospitals', 'apollohospitals.com', 'Tier 2', 'Healthcare', 63, '5 days ago'],
  ['Zomato Ltd', 'zomato.com', 'Tier 3', 'Consumer', 48, '1 week ago'],
] as const
export function ABM() {
  return (
    <Page title="Account-Based Marketing" sub="Target accounts, their intent and the campaigns aimed at them" actions={<UploadCsv />}>
      <ABMBody />
    </Page>
  )
}
function UploadCsv() {
  const say = useSay()
  return <Button variant="outline" onClick={() => say('CSV upload is not enabled in the walkthrough')}>Upload CSV</Button>
}
function ABMBody() {
  const say = useSay()
  const [tier, setTier] = useState('All Tiers')
  const rows = ACCOUNTS.filter((a) => tier === 'All Tiers' || a[2] === tier)
  return (
    <>
      <Stats items={[['Total accounts', '128', '5 added this week'], ['Avg intent score', '73', 'Out of 100'], ['Pipeline influenced', '₹4.2 Cr', 'Last quarter']]} />
      <Panel title="Target accounts" action={<select aria-label="Tier" value={tier} onChange={(e) => setTier(e.target.value)} className={selectCls}>{['All Tiers', 'Tier 1', 'Tier 2', 'Tier 3'].map((t) => <option key={t}>{t}</option>)}</select>}>
        <Table cols={['Company', 'Domain', 'Tier', 'Industry', 'Intent score', 'Last activity', 'Actions']} rows={rows.map((a) => [a[0], a[1], <Badge key="t" variant="secondary">{a[2]}</Badge>, a[3], <b key="s">{a[4]}</b>, a[5], <div key="a" className="flex gap-2"><Button size="sm" variant="outline" onClick={() => say('Intent detail opens here in the real product')}>View intent</Button><Button size="sm" onClick={() => say('Campaign launched on sample data')}>Launch campaign</Button></div>])} />
      </Panel>
    </>
  )
}

/* Org chart -------------------------------------------------------------------------------- */
const TREE: { domain: string; agents: [string, string][] }[] = [
  { domain: 'Finance', agents: [['AP Processor', 'Active'], ['Reconciliation Agent', 'Active'], ['GST Compliance Agent', 'Shadow']] },
  { domain: 'Marketing', agents: [['Lead Qualifier', 'Active'], ['Campaign Reporter', 'Shadow']] },
  { domain: 'Ops', agents: [['Support Triage', 'Active'], ['Incident Watch', 'Paused']] },
  { domain: 'Comms', agents: [['Email Responder', 'Active']] },
]
export function OrgChart() {
  const [view, setView] = useState<'tree' | 'list'>('tree')
  return (
    <Page title="Organization Chart" sub="Who reports to whom, people and agents together" actions={<div className="flex gap-2 text-xs">{['Active', 'Shadow', 'Paused'].map((s) => <Status key={s} v={s} />)}<Badge variant="outline">Human</Badge></div>}>
      <Tabs tabs={[['tree', 'Tree'], ['list', 'List']]} value={view} onChange={setView} />
      {view === 'tree' ? (
        <Panel>
          <div className="flex flex-col items-center gap-6">
            <div className="rounded-xl border-2 border-primary/40 bg-primary/5 px-5 py-3 text-center"><p className="font-semibold">Priya Nair</p><p className="text-xs text-muted-foreground">CEO / Admin · Human</p></div>
            <div className="grid w-full gap-4 md:grid-cols-4 [&>*]:min-w-0">
              {TREE.map((d) => (
                <div key={d.domain} className="space-y-2">
                  <div className="rounded-lg bg-muted px-3 py-2 text-center text-sm font-semibold">{d.domain}</div>
                  {d.agents.map(([n, st]) => <div key={n} className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-sm"><span className="leading-tight">{n}</span><Status v={st} /></div>)}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      ) : (
        <Panel><Table cols={['Agent', 'Domain', 'Reports to', 'Status']} rows={TREE.flatMap((d) => d.agents.map(([n, st]) => [n, d.domain, 'Priya Nair', <Status key={n} v={st} />]))} /></Panel>
      )}
    </Page>
  )
}

/* Observatory and SLA ----------------------------------------------------------------------- */
export function Observatory() {
  return (
    <Page title="Agent Observatory" sub="Live runs, latency and cost across the fleet" actions={<Badge variant="success" pulse>Live</Badge>}>
      <Stats items={[['Active runs', '7', 'Right now'], ['Avg latency', '2.3 s', 'Last hour'], ['Error rate', '0.8%', 'Last 24 hours'], ['AI spend today', '₹1,240', 'Cap ₹10,000']]} />
      <Panel title="Live runs"><Table cols={['Agent', 'Task', 'Step', 'Confidence', 'Status']} rows={[['AP Processor', 'Invoice INV-4521', 'Step 3 of 5', '94%', <Status key="1" v="Running" />], ['Support Triage', 'Ticket #8841', 'Step 2 of 4', '90%', <Status key="2" v="Running" />], ['Reconciliation Agent', 'Daily bank rec', 'Step 3 of 3', '99%', <Status key="3" v="Completed" />], ['Lead Qualifier', 'Batch of 42 leads', 'Step 1 of 3', '88%', <Status key="4" v="Running" />]]} /></Panel>
      <Panel title="Tasks per hour" desc="Last 8 hours"><div className="space-y-3">{[['08:00', 38], ['09:00', 64], ['10:00', 91], ['11:00', 77], ['12:00', 52], ['13:00', 44], ['14:00', 83], ['15:00', 69]].map(([h, n]) => <Bar key={h as string} label={h as string} value={n as number} max={100} text={`${n} tasks`} />)}</div></Panel>
    </Page>
  )
}

export function SLA() {
  const up = Array.from({ length: 24 }, (_, i) => (i === 7 || i === 15 ? 'Degraded' : 'Up'))
  return (
    <Page title="SLA Monitor" sub="Uptime and response targets">
      <Stats items={[['Uptime (24h)', '99.92%', 'Target 99.9%'], ['Avg response', '1.9 s', 'Target under 3 s'], ['Incidents', '2', 'Both resolved'], ['Error budget left', '82%', 'This month']]} />
      <Panel title="Uptime (last 24 hours)"><div className="flex gap-1">{up.map((s, i) => <div key={i} title={`${String(i).padStart(2, '0')}:00 ${s}`} className={`h-10 flex-1 rounded ${s === 'Up' ? 'bg-[hsl(var(--success))]' : 'bg-[hsl(var(--warning))]'}`} />)}</div></Panel>
      <Panel title="Recent checks"><Table cols={['Timestamp', 'Status']} rows={[['2026-10-23 15:00', <Status key="a" v="Up" />], ['2026-10-23 14:00', <Status key="b" v="Up" />], ['2026-10-23 13:00', <Status key="c" v="Degraded" />], ['2026-10-23 12:00', <Status key="d" v="Up" />]]} /></Panel>
      <p className="text-xs text-muted-foreground">Checks run every hour. <Mono>/api/v1/health</Mono></p>
    </Page>
  )
}
