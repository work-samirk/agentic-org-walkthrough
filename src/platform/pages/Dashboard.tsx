import { Link, useNavigate } from 'react-router-dom'
import { Bot, CheckCircle2, Eye, ShieldAlert, Zap } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePlatform } from '../state'
import { ACTIVITY, APPROVAL, EMBED_APPROVALS } from '../data'
import { Badge, Card, CardContent, CardHeader, CardTitle } from '../ui/primitives'
import { TourBanner } from '../onboarding/TourBanner'
import { Hint } from '../onboarding/Hint'
import { EmptyState } from '../ui/EmptyState'

const DOMAIN_COLORS: Record<string, string> = { finance: '#3b82f6', hr: '#8b5cf6', marketing: '#f59e0b', ops: '#10b981', backoffice: '#6366f1', comms: '#ec4899', compliance: '#94a3b8' }
const STATUS_COLORS: Record<string, string> = { active: '#22c55e', shadow: '#f59e0b', paused: '#ef4444' }
const TOOLTIP = { backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))', borderRadius: '0.5rem' }

export function Dashboard() {
  const { s, allAgents } = usePlatform()
  const nav = useNavigate()

  const total = allAgents.length
  const active = allAgents.filter((a) => a.status === 'active').length
  const shadow = allAgents.filter((a) => a.status === 'shadow').length
  const embed = new URLSearchParams(window.location.search).has('embed')
  const pending = embed ? EMBED_APPROVALS.filter((a) => !s.approvalsDone.includes(a.id)) : s.pendingResolved ? [] : [APPROVAL]
  const resolved = s.resolved
  const decisions = resolved + pending.length
  const resolvedPct = Math.round((resolved / decisions) * 100)

  const statusCounts: Record<string, number> = {}
  allAgents.forEach((a) => (statusCounts[a.status] = (statusCounts[a.status] || 0) + 1))
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  const domainCounts: Record<string, number> = {}
  allAgents.forEach((a) => (domainCounts[a.domain] = (domainCounts[a.domain] || 0) + 1))
  const domainData = Object.entries(domainCounts).map(([name, count]) => ({ name, count }))
  const confidence = allAgents.map((a) => ({ name: a.name.length > 12 ? a.name.slice(0, 12) + '...' : a.name, confidence: a.conf, domain: a.domain }))

  const metrics = [
    { label: 'Total Agents', value: total, color: 'text-foreground', subtitle: 'Provisioned fleet', icon: Bot, iconBg: 'bg-primary/10 text-primary border border-primary/20', pill: 'Fleet', stagger: 'stagger-1' },
    { label: 'Active Agents', value: active, color: 'text-[hsl(var(--success-foreground))]', subtitle: 'Live execution', icon: Zap, iconBg: 'bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success-foreground))] border border-[hsl(var(--success)/0.25)]', pill: 'Active', stagger: 'stagger-2' },
    { label: 'Pending Approvals', value: pending.length, color: 'text-destructive', subtitle: 'Awaiting review', icon: ShieldAlert, iconBg: 'bg-destructive/12 text-destructive border border-destructive/25', pill: 'HITL', stagger: 'stagger-3' },
    { label: 'Shadow Agents', value: shadow, color: 'text-[hsl(var(--warning-foreground))]', subtitle: 'Observing baseline', icon: Eye, iconBg: 'bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning-foreground))] border border-[hsl(var(--warning)/0.25)]', pill: 'Shadow', stagger: 'stagger-4' },
    { label: 'Approvals Resolved', value: `${resolvedPct}%`, color: 'text-foreground', subtitle: `${resolved}/${decisions} decisions`, icon: CheckCircle2, iconBg: 'bg-accent/12 text-accent border border-accent/25', pill: 'Resolved', stagger: 'stagger-5' },
  ]

  const rows = [
    ...(s.agents[0] ? [{ id: 0, event_type: 'agent.create', action: s.agents[0].name, outcome: 'success', time: 'just now' }] : []),
    ...ACTIVITY,
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold tracking-tight" data-tour="page-title">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Badge variant="success" pulse>System Live</Badge>
          <span className="font-mono text-xs text-muted-foreground">v4.8.0</span>
        </div>
      </div>

      <TourBanner />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5" data-tour="kpis">
        {metrics.map((m) => (
          <Card key={m.label} className={`card-elevated animate-fade-slide-up ${m.stagger} group relative overflow-hidden p-1`}>
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-1">
              <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{m.label}</CardTitle>
              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-110 ${m.iconBg}`}>
                <m.icon className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="flex items-baseline justify-between gap-1">
                <p className={`text-3xl font-extrabold tracking-tight tabular-nums ${m.color}`}>{m.value}</p>
                <span className="rounded-full border border-border/60 bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{m.pill}</span>
              </div>
              <p className="mt-2 truncate text-xs font-medium text-muted-foreground">{m.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="card-elevated animate-fade-slide-up stagger-2">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Agent Runtime</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--success))] opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[hsl(var(--success))]" /></span>
              <span className="text-lg font-bold">LangGraph</span>
              <Badge variant="secondary" className="text-[10px]">v1.1</Badge>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">39 agents, 104 native connectors + 1000+ via Composio, 1111 tools</p>
          </CardContent>
        </Card>
        <Card className="card-elevated animate-fade-slide-up stagger-3">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Grantex Authorization</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--success))] opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[hsl(var(--success))]" /></span>
              <span className="text-lg font-bold">Connected</span>
              <Badge variant="success" className="text-[10px]">RS256</Badge>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Agent DIDs auto-assigned, RS256 grant tokens</p>
          </CardContent>
        </Card>
        <Card className="card-elevated animate-fade-slide-up stagger-4">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">External Access</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2"><Badge variant="default" className="text-xs">A2A Protocol</Badge><Badge variant="secondary" className="text-xs">MCP Server</Badge></div>
            <Link to="/app/p/a2a-mcp" className="mt-2.5 block text-xs font-medium text-primary hover:underline">View integration details →</Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="card-elevated animate-fade-slide-up stagger-3">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Agent Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {statusData.map((e) => <Cell key={e.name} fill={STATUS_COLORS[e.name] || '#94a3b8'} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="card-elevated animate-fade-slide-up stagger-3">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Domain Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={domainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP} />
                <Bar dataKey="count">{domainData.map((e) => <Cell key={e.name} fill={DOMAIN_COLORS[e.name] || '#94a3b8'} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="card-elevated animate-fade-slide-up stagger-4">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Agent Confidence Floors (%)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={confidence}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={TOOLTIP} />
              <Bar dataKey="confidence">{confidence.map((e, i) => <Cell key={i} fill={DOMAIN_COLORS[e.domain] || '#94a3b8'} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="card-elevated animate-fade-slide-up stagger-5">
          <CardHeader className="border-b border-border/50 pb-3"><CardTitle className="text-sm font-semibold">Recent Activity</CardTitle></CardHeader>
          <CardContent className="pt-4">
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {rows.map((r) => (
                <div key={r.id} className="interactive-surface flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-2.5 text-sm transition-all duration-150 hover:bg-muted/70">
                  <div className="flex min-w-0 items-center gap-2">
                    <Badge variant={r.outcome === 'success' ? 'success' : 'warning'} pulse={r.outcome === 'pending'}>{r.outcome === 'success' ? 'Success' : 'Pending'}</Badge>
                    <span className="truncate"><span className="font-medium text-foreground">{r.event_type}</span> <span className="text-muted-foreground">{r.action}</span></span>
                  </div>
                  <span className="ml-2 font-mono text-xs whitespace-nowrap text-muted-foreground">{r.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated animate-fade-slide-up stagger-5" data-tour="approvals">
          <CardHeader className="border-b border-border/50 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold">Pending Approvals</CardTitle>
              {pending.length > 0 && <Badge variant="destructive" pulse>{pending.length} pending</Badge>}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Hint id="approval" title="What is human approval?">
              When an agent wants to do something that matters, like sending a refund, it stops and asks a person first. You decide.
            </Hint>
            {pending.length === 0 ? (
              <EmptyState title="No pending approvals" description="All high-value actions and human-in-the-loop requests have been addressed." illustration="approvals" />
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {pending.map((item) => (
                  <div key={item.id} role="link" tabIndex={0} onClick={() => nav('/app/approvals')} onKeyDown={(e) => e.key === 'Enter' && nav('/app/approvals')} className="interactive-surface flex cursor-pointer items-center justify-between rounded-xl border border-border/70 bg-card/60 p-3 shadow-sm transition-all duration-150 hover:border-primary/40 hover:bg-muted/70 hover:shadow-[var(--shadow-card)]">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.title} <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase">Sample</span></p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.trigger_type} &middot; {item.assignee_role}</p>
                    </div>
                    <Badge variant="warning">{item.priority}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
