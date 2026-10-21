import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, PauseCircle, Plus, Search, Users, Zap } from 'lucide-react'
import { usePlatform } from '../state'
import { humanize } from '../scripts'
import type { Agent } from '../data'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Toast, useToast } from '../ui/primitives'
import { EmptyState } from '../ui/EmptyState'

const STAT_CONFIGS: Record<string, { icon: typeof Users; badge: string; pill: string; color: string; stagger: string }> = {
  total: { icon: Users, badge: 'bg-primary/10 text-primary border border-primary/20', pill: 'Fleet', color: 'text-foreground', stagger: 'stagger-1' },
  active: { icon: Zap, badge: 'bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success-foreground))] border border-[hsl(var(--success)/0.25)]', pill: 'Active', color: 'text-[hsl(var(--success-foreground))]', stagger: 'stagger-2' },
  shadow: { icon: Eye, badge: 'bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning-foreground))] border border-[hsl(var(--warning)/0.25)]', pill: 'Shadow', color: 'text-[hsl(var(--warning-foreground))]', stagger: 'stagger-3' },
  paused: { icon: PauseCircle, badge: 'bg-destructive/12 text-destructive border border-destructive/25', pill: 'Paused', color: 'text-destructive', stagger: 'stagger-4' },
}
const DOMAIN_STYLES: Record<string, string> = {
  finance: 'bg-primary/10 text-primary border border-primary/20',
  hr: 'bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success-foreground))] border border-[hsl(var(--success)/0.25)]',
  marketing: 'bg-accent/12 text-accent border border-accent/25',
  ops: 'bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning-foreground))] border border-[hsl(var(--warning)/0.25)]',
  backoffice: 'bg-muted text-muted-foreground border border-border',
}
const DOMAINS = ['all', 'backoffice', 'comms', 'compliance', 'ecommerce', 'engineering', 'finance', 'hr', 'marketing', 'ops', 'procurement', 'quick_commerce', 'reports', 'travel']
const STATUSES = ['all', 'active', 'shadow', 'paused', 'staging', 'deprecated']

export function AgentCard({ agent, onClick, mine }: { agent: Agent; onClick: () => void; mine?: boolean }) {
  const statusVariant = ({ active: 'success', shadow: 'warning', paused: 'destructive' } as const)[agent.status]
  const acc = agent.accuracy
  const below = acc != null && acc < agent.conf
  const confPct = Math.round(agent.conf * 100)
  const accPct = acc != null ? Math.round(acc * 100) : null
  return (
    <Card className="card-elevated group relative cursor-pointer overflow-hidden" onClick={onClick} data-tour={mine ? 'my-agent' : undefined}>
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-primary/20 via-primary/10 to-accent/20 text-sm font-bold text-primary shadow-sm ring-2 ring-primary/20">{agent.name.charAt(0).toUpperCase()}</div>
              <span className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-card ring-2 ring-card">
                <span className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'animate-pulse bg-[hsl(var(--success))]' : agent.status === 'shadow' ? 'bg-[hsl(var(--warning))]' : 'bg-destructive'}`} />
              </span>
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base transition-colors group-hover:text-primary" title={agent.name}>{agent.name}</CardTitle>
              <p className="truncate text-xs text-muted-foreground" title={agent.designation}>{agent.designation}</p>
            </div>
          </div>
          <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
            <Badge variant={statusVariant} pulse={agent.status === 'active'}>{agent.status}</Badge>
            {below && <Badge variant="destructive">Below Floor</Badge>}
            {agent.sample && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">Sample</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{humanize(agent.agentType)}</span>
          <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${DOMAIN_STYLES[agent.domain] || 'bg-muted text-muted-foreground border border-border'}`}>{agent.domain}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
          <div className="min-w-0 rounded-lg border border-border/40 bg-muted/40 p-2 text-center">
            <p className="truncate text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Conf.</p>
            <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">{confPct}%</p>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${Math.min(100, confPct)}%` }} /></div>
          </div>
          <div className="min-w-0 rounded-lg border border-border/40 bg-muted/40 p-2 text-center">
            <p className="truncate text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Samples</p>
            <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">{agent.samples}</p>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${Math.min(100, agent.samples)}%` }} /></div>
          </div>
          <div className="min-w-0 rounded-lg border border-border/40 bg-muted/40 p-2 text-center">
            <p className="truncate text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Accuracy</p>
            <p className={`mt-0.5 text-sm font-bold tabular-nums ${below ? 'text-destructive' : 'text-foreground'}`}>{acc != null ? `${(acc * 100).toFixed(1)}%` : 'N/A'}</p>
            {accPct != null && <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full transition-all duration-300 ${below ? 'bg-destructive' : 'bg-[hsl(var(--success))]'}`} style={{ width: `${Math.min(100, accPct)}%` }} /></div>}
          </div>
        </div>
        {agent.specialization && <p className="mt-2.5 truncate text-xs text-muted-foreground"><span className="font-medium text-foreground/80">Specialization:</span> {agent.specialization}</p>}
      </CardContent>
    </Card>
  )
}

export function Agents() {
  const nav = useNavigate()
  const { allAgents } = usePlatform()
  const { msg, say } = useToast()
  const [domain, setDomain] = useState('all')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [showImport, setShowImport] = useState(false)

  const filtered = allAgents.filter(
    (a) => (domain === 'all' || a.domain === domain) && (status === 'all' || a.status === status) && (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.agentType.toLowerCase().includes(search.toLowerCase()) || a.designation.toLowerCase().includes(search.toLowerCase())),
  )
  const stats = {
    total: allAgents.length,
    active: allAgents.filter((a) => a.status === 'active').length,
    shadow: allAgents.filter((a) => a.status === 'shadow').length,
    paused: allAgents.filter((a) => a.status === 'paused').length,
  }
  const filterOn = !!search || domain !== 'all' || status !== 'all'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold" data-tour="page-title">Agent Fleet</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowImport(!showImport)}>Import CSV</Button>
          <Button variant="outline" onClick={() => say('Create from SOP is not part of this walkthrough')}>Create from SOP</Button>
          <Button data-tour="create-agent" onClick={() => nav('/app/agents/new')}>Create Agent</Button>
        </div>
      </div>

      {showImport && (
        <Card>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Import Agents from CSV</p>
                <p className="text-xs text-muted-foreground">Upload a CSV with your org hierarchy. Agents are created in shadow mode. Parent links set via "reporting_to_name" column.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => say('Download Template is not part of this walkthrough')}>Download Template</Button>
            </div>
            <div className="flex items-center gap-2"><input type="file" accept=".csv" className="text-sm" /><Button size="sm" disabled>Upload &amp; Import</Button></div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(stats).map(([label, value]) => {
          const cfg = STAT_CONFIGS[label]
          return (
            <Card key={label} className={`card-elevated animate-fade-slide-up ${cfg.stagger} group relative overflow-hidden p-1`}>
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-1">
                <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{label}</CardTitle>
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-110 ${cfg.badge}`}><cfg.icon className="h-4 w-4" /></span>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="flex items-baseline justify-between gap-1">
                  <p className={`text-3xl font-extrabold tracking-tight tabular-nums ${cfg.color}`}>{value}</p>
                  <span className="rounded-full border border-border/60 bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{cfg.pill}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3 shadow-sm backdrop-blur-sm">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" aria-label="Search agents" placeholder="Search agents by name or role..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-input bg-background/80 py-2 pr-3 pl-9 text-sm transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none" />
        </div>
        <select aria-label="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">
          {DOMAINS.map((d) => <option key={d} value={d}>{d === 'all' ? 'All Domains' : humanize(d)}</option>)}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          illustration="agents"
          title="No agents found"
          description={filterOn ? 'No agents match the current filter criteria. Try resetting filters.' : 'No virtual employees in your fleet yet. Create one to get started.'}
          action={filterOn ? { label: 'Clear Filters', onClick: () => { setSearch(''); setDomain('all'); setStatus('all') } } : { label: 'Deploy First Agent', onClick: () => nav('/app/agents/new'), icon: Plus }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a, i) => (
            <div key={a.id} className={`animate-fade-slide-up stagger-${Math.min(6, (i % 6) + 1)}`}>
              <AgentCard agent={a} mine={!a.sample} onClick={() => nav(`/app/agents/${a.id}`)} />
            </div>
          ))}
        </div>
      )}
      <Toast msg={msg} />
    </div>
  )
}
