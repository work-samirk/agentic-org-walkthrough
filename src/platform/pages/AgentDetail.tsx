import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Activity, GitBranch, Gauge, Percent, TestTube2 } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePlatform } from '../state'
import { SCRIPTS, scriptFor, toolPermission, type Script } from '../scripts'
import type { Agent } from '../data'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '../ui/primitives'
import { Hint } from '../onboarding/Hint'
import { TAB_HELP } from '../onboarding/tour'
import { Spotlight } from '../onboarding/Layer'
import { useTourStep } from '../onboarding/tour'
import { ChatDrawer } from './ChatDrawer'

type Tab = 'overview' | 'workspace' | 'config' | 'workflow' | 'prompt' | 'shadow' | 'cost' | 'scopes' | 'learning' | 'voice' | 'recon'

export { TAB_HELP }

const BY_DOMAIN: Record<string, string> = { finance: 'finance', comms: 'ops', marketing: 'sales', hr: 'hr', ops: 'product' }

function ExplainerPanel({ sc, ran, onOpen }: { sc: Script; ran: boolean; onOpen: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [sent, setSent] = useState<string | null>(null)
  const [correcting, setCorrecting] = useState(false)
  const [text, setText] = useState('')
  return (
    <div className="border-t pt-2" data-tour="explainer">
      <button onClick={() => { setExpanded(!expanded); if (!expanded) onOpen() }} className="flex w-full items-center gap-2 text-left text-sm font-medium text-primary hover:underline">
        <span className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>&#9656;</span>
        Why did the agent do this?
      </button>
      {expanded && (
        <div className="mt-3 space-y-3 rounded-lg bg-muted/30 p-4">
          <Hint id="trace" title="What is a trace?" inline>A step-by-step record of what the agent did, so you can check its work.</Hint>
          {!ran ? (
            <p className="text-sm text-muted-foreground">No explanation yet. Run the agent at least once to generate a real trace.</p>
          ) : (
            <>
              <ul className="list-inside list-disc space-y-1 text-sm">{sc.explain.map((b, i) => <li key={i}>{b}</li>)}</ul>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground"><span>Confidence</span><span>{(sc.confidence * 100).toFixed(0)}%</span></div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${sc.confidence * 100}%` }} /></div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Tools used:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">{sc.toolsCited.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div>
              </div>
              <div className="flex items-center gap-3 border-t pt-2">
                <span className="text-xs text-muted-foreground">Was this helpful?</span>
                <button onClick={() => setSent('thumbs_up')} className={`text-lg transition-transform hover:scale-110 ${sent === 'thumbs_up' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`} title="Thumbs up" disabled={sent !== null}>&#128077;</button>
                <button onClick={() => setSent('thumbs_down')} className={`text-lg transition-transform hover:scale-110 ${sent === 'thumbs_down' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`} title="Thumbs down" disabled={sent !== null}>&#128078;</button>
                {!correcting && <button onClick={() => setCorrecting(true)} className="ml-2 text-xs text-primary hover:underline" disabled={sent !== null}>Correct this</button>}
                {sent && <span className="ml-2 text-xs text-green-600">Feedback recorded</span>}
              </div>
              {correcting && (
                <div className="space-y-2">
                  <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What should the correct output be?" className="min-h-[80px] w-full rounded border bg-background px-3 py-2 text-sm" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { setSent('correction'); setCorrecting(false) }} disabled={!text.trim()}>Submit Correction</Button>
                    <Button variant="outline" size="sm" onClick={() => { setCorrecting(false); setText('') }}>Cancel</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function OverviewTab({ agent, sc, ran, onTrace }: { agent: Agent; sc: Script; ran: boolean; onTrace: () => void }) {
  const fields = [
    { label: 'Agent ID', value: <span className="font-mono text-xs">3d7296b1-c8fc-4e87-8905-4ee91e7536bf</span> },
    { label: 'Domain', value: <Badge variant="secondary">{agent.domain}</Badge> },
    { label: 'Agent Type', value: agent.agentType },
    { label: 'Description', value: 'No description' },
    { label: 'HITL Condition', value: `confidence < ${agent.conf.toFixed(2)}` },
    { label: 'Confidence Floor', value: `${(agent.conf * 100).toFixed(0)}%` },
    { label: 'LLM Model', value: 'openai — gpt-5.4' },
    { label: 'Created', value: new Date().toLocaleString() },
  ]
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {fields.map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <span className="text-xs tracking-wide text-muted-foreground uppercase">{f.label}</span>
              <span>{f.value}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-wide text-muted-foreground uppercase">Reports To (Org Chart)</span>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <p className="mt-1 text-sm"><span className="text-muted-foreground">None — escalates directly to human</span></p>
        </div>
        <div className="border-t pt-2">
          <span className="text-xs tracking-wide text-muted-foreground uppercase">Authorized Tools</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(agent.tools ?? []).length ? agent.tools!.map((t) => <Badge key={t} variant="outline">{t}</Badge>) : <span className="text-sm text-muted-foreground">No tools configured</span>}
          </div>
        </div>
        <ExplainerPanel sc={sc} ran={ran} onOpen={onTrace} />
      </CardContent>
    </Card>
  )
}

function ConfigTab({ agent }: { agent: Agent }) {
  const rows = [
    { label: 'LLM Model', value: 'openai — gpt-5.4' },
    { label: 'Max Retries', value: '3' },
    { label: 'HITL Condition', value: `confidence < ${agent.conf.toFixed(2)}` },
    { label: 'Confidence Floor', value: `${(agent.conf * 100).toFixed(0)}%` },
    { label: 'Connectors', value: 'sample_bank' },
  ]
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold">Agent Configuration</CardTitle>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between border-b py-2 last:border-0">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className="font-mono text-sm font-medium">{r.value}</span>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <span className="text-sm text-muted-foreground">Authorized Tools</span>
          <div className="mt-2 flex flex-wrap gap-2">{(agent.tools ?? []).map((t) => <Badge key={t} variant="default">{t}</Badge>)}</div>
        </div>
        <div className="space-y-3 pt-4">
          <span className="text-sm text-muted-foreground">Workflow Bindings</span>
          <p><span className="text-sm text-muted-foreground">No workflow bindings configured</span></p>
        </div>
      </CardContent>
    </Card>
  )
}

function WorkflowConfigTab() {
  return (
    <div className="space-y-4">
      <div className="space-y-1 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
        <p className="font-semibold">Workflow Config</p>
        <p>Define any JSON config your agent needs at runtime. LangGraph reads it as <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">state["workflow_config"]</code>. The structure is entirely up to you — no fixed schema.</p>
        <p className="text-blue-600 dark:text-blue-400">Leave blank to use the standard ReAct graph. Set any JSON to activate the workflow graph.</p>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Config JSON</CardTitle>
          <p className="text-xs text-muted-foreground">Stored in <code className="rounded bg-muted px-1">agent.config.workflow</code>. Any valid JSON object. Your graph reads whatever keys you define here.</p>
        </CardHeader>
        <CardContent>
          <textarea className="min-h-[220px] w-full resize-y rounded-md border bg-muted p-3 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none" spellCheck={false} placeholder={'{\n  "datasource_map": [],\n  "trace_flows": []\n}'} />
        </CardContent>
      </Card>
      <Button className="w-full sm:w-auto">Save Workflow Config</Button>
    </div>
  )
}

function PromptTab({ agent }: { agent: Agent }) {
  const locked = agent.status === 'active'
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold">System Prompt</CardTitle>
            {locked ? (
              <div className="flex items-center gap-2"><Badge variant="destructive">Locked</Badge><span className="text-xs text-muted-foreground">Clone this agent to edit prompt</span></div>
            ) : (
              <div className="flex items-center gap-2"><Badge variant="secondary">Editable</Badge><Button variant="outline" size="sm">Edit</Button></div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <pre className="max-h-96 overflow-auto rounded bg-muted p-4 font-mono text-xs whitespace-pre-wrap">{agent.prompt ?? 'This agent uses a built-in file-based prompt template.'}</pre>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Prompt Edit History</CardTitle></CardHeader>
        <CardContent>
          <div className="border-l-2 border-muted py-1 pl-3">
            <div className="flex justify-between text-xs text-muted-foreground"><span>System</span><span>{new Date().toLocaleString()}</span></div>
            <p className="mt-1 text-xs text-muted-foreground">Initial prompt ({(agent.prompt ?? '').length} chars)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ShadowTab({ agent, onSample }: { agent: Agent; onSample: () => void }) {
  const [busy, setBusy] = useState(false)
  const min = 20
  const count = agent.samples
  const pct = Math.min(100, (count / min) * 100)
  const meets = count >= min
  const acc = (agent.accuracy ?? 0) * 100
  const floor = agent.conf * 100
  const okAcc = acc >= floor
  const ready = meets && okAcc
  const data = [{ name: 'Current', value: Number(acc.toFixed(1)) }, { name: 'Required', value: Number(floor.toFixed(1)) }]
  function gen() {
    setBusy(true)
    window.setTimeout(() => { setBusy(false); onSample() }, 700)
  }
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold">Shadow Sample Progress</CardTitle>
            <div className="flex gap-2">
              <input type="number" min={1} max={10} defaultValue={1} aria-label="Samples per click" className="w-16 rounded border bg-background px-2 py-1 text-sm" />
              <Button variant="outline" size="sm" onClick={gen} disabled={busy || meets}>{busy ? 'Generating...' : 'Generate Test Sample'}</Button>
              {count > 0 && <Button variant="outline" size="sm">Retest</Button>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Samples generated</span><span className="font-medium">{count}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Promotion target</span><span className="font-medium">{min}</span></div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-muted"><div className={`h-full rounded-full transition-all ${meets ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${pct}%` }} /></div>
          <p className="text-xs text-muted-foreground">{meets ? 'Sample count requirement met' : `${min - count} more samples needed — use "Generate Test Sample" to collect samples`}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Accuracy: Current vs Required</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" barSize={28}>{data.map((_, i) => <Cell key={i} fill={i === 0 ? (okAcc ? '#22c55e' : '#f59e0b') : '#94a3b8'} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3"><span className="text-sm font-medium">Promotion Readiness:</span><Badge variant={ready ? 'success' : 'warning'}>{ready ? 'Ready to promote' : 'Not yet ready'}</Badge></div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2"><span className={meets ? 'text-green-600' : 'text-yellow-600'}>{meets ? '✓' : '✗'}</span>Sample count ({count}/{min})</div>
            <div className="flex items-center gap-2"><span className={okAcc ? 'text-green-600' : 'text-yellow-600'}>{okAcc ? '✓' : '✗'}</span>Accuracy ({acc.toFixed(1)}% / {floor.toFixed(1)}%)</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CostTab({ ran }: { ran: boolean }) {
  const cap = 50
  const spend = ran ? 0.0184 : 0
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm font-semibold">Cost Controls</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1"><span className="text-xs tracking-wide text-muted-foreground uppercase">Monthly Cap</span><span className="text-2xl font-bold">${cap.toFixed(2)}</span></div>
          <div className="flex flex-col gap-1"><span className="text-xs tracking-wide text-muted-foreground uppercase">Current Spend</span><span className="text-2xl font-bold">${spend.toFixed(4)}</span></div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-1"><span className="text-xs tracking-wide text-muted-foreground uppercase">Tokens Used (Month)</span><span className="font-semibold">{ran ? '1,240' : '0'}</span></div>
          <div className="flex flex-col gap-1"><span className="text-xs tracking-wide text-muted-foreground uppercase">Tasks Run (Month)</span><span className="font-semibold">{ran ? 1 : 0}</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Budget Utilization</span><span className="font-medium">{((spend / cap) * 100).toFixed(1)}%</span></div>
          <div className="h-5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-muted"><div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${Math.min(100, (spend / cap) * 100)}%` }} /></div>
          <p className="text-xs text-muted-foreground">Within budget.</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ScopesTab({ agent }: { agent: Agent }) {
  const tools = agent.tools ?? []
  const perm = { READ: 'bg-green-100 text-green-700 border-green-300', WRITE: 'bg-blue-100 text-blue-700 border-blue-300', DELETE: 'bg-red-100 text-red-700 border-red-300', ADMIN: 'bg-purple-100 text-purple-700 border-purple-300' }
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Grantex Scopes</CardTitle></CardHeader>
        <CardContent>
          {tools.length > 0 ? (
            <div className="-mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="pr-4 pb-2">Tool</th><th className="pr-4 pb-2">Permission</th><th className="pr-4 pb-2">Connector</th><th className="pr-4 pb-2">Scope String</th><th className="pr-4 pb-2">Status</th><th className="pb-2">Grant Token</th>
                  </tr>
                </thead>
                <tbody>
                  {tools.map((t) => {
                    const p = toolPermission(t)
                    return (
                      <tr key={t} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">{t}</td>
                        <td className="py-2 pr-4"><span className={`inline-block rounded border px-1.5 py-0 text-[10px] font-semibold ${perm[p]}`}>{p}</span></td>
                        <td className="py-2 pr-4 text-xs">sample_bank</td>
                        <td className="py-2 pr-4"><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">tool:sample_bank:execute:{t}</code></td>
                        <td className="py-2 pr-4"><Badge variant="secondary" className="text-[10px]">not issued</Badge></td>
                        <td className="py-2"><span className="inline-flex items-center gap-1.5 text-xs"><span className="h-2 w-2 rounded-full bg-muted-foreground" />Not issued</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : <p className="text-sm text-muted-foreground">No tools configured; no scopes to display.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Enforcement Log</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">No enforcement decisions recorded for this agent yet.</p></CardContent>
      </Card>
    </div>
  )
}

function LearningTab({ sentFeedback }: { sentFeedback: boolean }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [rules, setRules] = useState<string[]>([])
  function analyze() {
    setAnalyzing(true)
    window.setTimeout(() => { setAnalyzing(false); setRules(['Match on order ID first, then amount.']) }, 900)
  }
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold">Learned Rules (Amendments)</CardTitle>
            <Button variant="outline" size="sm" onClick={analyze} disabled={analyzing}>{analyzing ? 'Analyzing...' : 'Analyze Feedback'}</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.length ? rules.map((r) => <div key={r} className="flex items-start justify-between rounded bg-muted/40 px-3 py-2"><span className="flex-1 text-sm">{r}</span><Button variant="outline" size="sm" className="ml-2 text-xs" onClick={() => setRules([])}>Dismiss</Button></div>) : <p className="text-sm text-muted-foreground">No learned rules yet. Submit feedback and run analysis to generate amendments.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Feedback Timeline</CardTitle></CardHeader>
        <CardContent>
          {sentFeedback ? <div className="flex items-start gap-3 pb-2"><span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">thumbs up</span><span className="text-xs text-muted-foreground">Just now</span></div> : <p className="text-sm text-muted-foreground">No feedback submitted yet.</p>}
        </CardContent>
      </Card>
    </div>
  )
}

function WorkspaceTab() {
  const [p, setP] = useState('')
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Generate Workspace from Prompt</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <textarea aria-label="Workspace prompt" value={p} onChange={(e) => setP(e.target.value)} className="min-h-20 w-full rounded border bg-background p-2 text-sm" placeholder="Describe the business workspace you need…" />
          <Button disabled={p.trim().length < 3}>Generate draft</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function ReconTab() {
  const [done, setDone] = useState(false)
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm font-semibold">Reconciliation workspace</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Upload two files to match them. This walkthrough uses a sample settlement file and a sample bank statement.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-dashed p-4 text-sm"><b>Settlement file</b><p className="text-xs text-muted-foreground">sample_settlements.csv · 415 rows</p></div>
          <div className="rounded-lg border border-dashed p-4 text-sm"><b>Bank statement</b><p className="text-xs text-muted-foreground">sample_bank_statement.csv · 418 rows</p></div>
        </div>
        <Button onClick={() => setDone(true)}>Run reconciliation (sample data)</Button>
        {done && <p className="rounded-lg bg-muted/40 p-3 text-sm">412 matched · 3 need attention (one short by ₹4,200, one missing, one duplicate). Nothing was changed.</p>}
      </CardContent>
    </Card>
  )
}

export function AgentDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const { allAgents, role, tick, set, s } = usePlatform()
  const agent = allAgents.find((a) => a.id === id)
  const tab = (params.get('tab') ?? 'overview') as Tab
  const tourStep = useTourStep()
  const [chatOpen, setChatOpen] = useState(false)
  const [runOpen, setRunOpen] = useState(false)
  const [runTask, setRunTask] = useState('')
  const [runResult, setRunResult] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState(false)

  const sc: Script = agent?.sample ? SCRIPTS[BY_DOMAIN[agent.domain] ?? 'finance'] : scriptFor(role)

  // the tour closes the chat when it moves on to the explanation panel
  useEffect(() => {
    if (tourStep === 'explain') {
      const t = window.setTimeout(() => setChatOpen(false), 0)
      return () => window.clearTimeout(t)
    }
  }, [tourStep])

  if (!agent) {
    return (
      <div className="rounded-lg border border-border/80 bg-card p-10 text-center">
        <p className="mb-3 font-medium">That agent is not here</p>
        <Button variant="outline" size="sm" onClick={() => nav('/app/agents')}>Back to agents</Button>
      </div>
    )
  }

  const isRecon = agent.agentType === 'recon_agent'
  const tabs: Tab[] = ['overview', 'workspace', 'config', 'workflow', 'prompt', 'shadow', 'cost', 'scopes', 'learning', 'voice', ...(isRecon ? (['recon'] as Tab[]) : [])]
  const label = (t: Tab) => (t === 'workflow' ? 'Workflow Config' : t)
  const statusVariant = ({ active: 'success', shadow: 'warning', paused: 'destructive' } as const)[agent.status]
  const dot = agent.status === 'active' ? 'bg-[hsl(var(--success))] shadow-[0_0_8px_hsl(var(--success)/0.5)]' : agent.status === 'shadow' ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]' : 'bg-[hsl(var(--warning))]'

  function runAgent() {
    setRunning(true)
    window.setTimeout(() => {
      setRunning(false)
      setRunOpen(false)
      setRunResult(sc.answer)
      set({ ran: true })
    }, 1200)
  }
  function addSample() {
    if (!agent || agent.sample) return
    const n = agent.samples + 5
    const accuracy = Math.min(0.94, 0.86 + n * 0.004)
    set({ agents: s.agents.map((a) => ({ ...a, samples: n, accuracy })) })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-linear-to-br from-primary/20 via-accent/15 to-primary/5 text-2xl font-bold text-primary shadow-[var(--shadow-card)]">{agent.name.charAt(0).toUpperCase()}</div>
            <span className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-background transition-colors duration-200 ${dot}`} title={`Status: ${agent.status}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" data-tour="page-title">{agent.name}</h2>
            <p className="text-sm text-muted-foreground">{agent.designation} | {agent.domain}</p>
            {agent.specialization && <p className="mt-1 text-xs text-muted-foreground">Specialization: {agent.specialization}</p>}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-[10px]">LangGraph</Badge>
              {agent.sample && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">Sample</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm" disabled={agent.status === 'active'} onClick={() => setActionError('Not enough shadow samples yet. Open the Shadow tab and generate test samples first.')}>Promote</Button>
            <Button variant="outline" size="sm" disabled={agent.status !== 'active'}>Rollback</Button>
            <Button variant="destructive" size="sm" onClick={() => setActionError('The Kill Switch is turned off in the walkthrough.')}>Kill Switch</Button>
            <Button size="sm" onClick={() => { setRunTask(''); setRunOpen(true) }}>Run Agent</Button>
            <Button variant="outline" size="sm" data-tour="chat-btn" onClick={() => setChatOpen(true)}>Chat with Agent</Button>
          </div>
          {actionError && <p className="text-xs text-destructive">{actionError}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 [&>*]:min-w-0">
        {[
          { t: 'Status', icon: Activity, bg: 'bg-primary/10 text-primary border border-primary/20', v: <Badge variant={statusVariant}>{agent.status}</Badge> },
          { t: 'Version', icon: GitBranch, bg: 'bg-accent/15 text-accent-foreground border border-accent/25', v: <p className="text-xl font-extrabold tracking-tight tabular-nums">1.0.0</p> },
          { t: 'Confidence Floor', icon: Gauge, bg: 'bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success-foreground))] border border-[hsl(var(--success)/0.25)]', v: <p className="text-xl font-extrabold tracking-tight tabular-nums">{(agent.conf * 100).toFixed(0)}%</p> },
          { t: 'Shadow Samples', icon: TestTube2, bg: 'bg-[hsl(var(--info)/0.12)] text-[hsl(var(--info-foreground))] border border-[hsl(var(--info)/0.25)]', v: <p className="text-xl font-extrabold tracking-tight tabular-nums">{agent.samples}</p> },
          { t: 'Shadow Accuracy', icon: Percent, bg: 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning-foreground))] border border-[hsl(var(--warning)/0.3)]', v: <p className="text-xl font-extrabold tracking-tight tabular-nums">{agent.accuracy == null ? 'N/A' : `${(agent.accuracy * 100).toFixed(1)}%`}</p> },
        ].map((k, i) => (
          <Card key={k.t} className={`card-elevated animate-fade-slide-up stagger-${i + 1} group relative overflow-hidden`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="truncate text-sm font-semibold text-muted-foreground">{k.t}</CardTitle>
              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${k.bg}`}><k.icon className="h-4 w-4" /></span>
            </CardHeader>
            <CardContent>{k.v}</CardContent>
          </Card>
        ))}
      </div>

      {runResult && (
        <Card className="card-elevated animate-fade-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold">Run Result</CardTitle>
              <div className="flex items-center gap-2"><Badge variant="success">completed</Badge><span className="text-xs text-muted-foreground">Confidence {(sc.confidence * 100).toFixed(1)}%</span></div>
            </div>
          </CardHeader>
          <CardContent><div className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-sm leading-relaxed whitespace-pre-wrap">{runResult}</div></CardContent>
        </Card>
      )}

      <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-1 shadow-sm" data-tour="agent-tabs">
        {tabs.map((t) => (
          <button key={t} data-tour={`tab-${t}`} onClick={() => { setParams(t === 'overview' ? {} : { tab: t }); setActionError(null) }} className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap capitalize transition-all duration-150 ease-out-quart ${tab === t ? 'border border-border/80 bg-card font-bold text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}>
            {label(t)}
          </button>
        ))}
      </div>

      {tab !== 'overview' && <TabCoach tab={tab} title={label(tab)} />}

      {tab === 'overview' && <OverviewTab agent={agent} sc={sc} ran={s.ran} onTrace={() => tick('trace')} />}
      {tab === 'workspace' && <WorkspaceTab />}
      {tab === 'config' && <ConfigTab agent={agent} />}
      {tab === 'workflow' && <WorkflowConfigTab />}
      {tab === 'prompt' && <PromptTab agent={agent} />}
      {tab === 'shadow' && <ShadowTab agent={agent} onSample={addSample} />}
      {tab === 'cost' && <CostTab ran={s.ran} />}
      {tab === 'scopes' && <ScopesTab agent={agent} />}
      {tab === 'learning' && <LearningTab sentFeedback={feedback} />}
      {tab === 'voice' && (
        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Voice use cases</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm"><p className="text-muted-foreground">Voice is governed at organisation level. Agent-specific voice assignment, call history, and operational controls will appear here when the voice use-case builder is available.</p></CardContent>
        </Card>
      )}
      {tab === 'recon' && isRecon && <ReconTab />}

      {chatOpen && (
        <ChatDrawer
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          agentName={agent.name}
          script={sc}
          prefill={tourStep === 'chat-send'}
          onAnswered={() => { tick('chatted'); set({ ran: true }); setFeedback(false) }}
        />
      )}

      {runOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h3 className="mb-1 text-lg font-semibold">Run {agent.name}</h3>
            <p className="mb-3 text-sm text-muted-foreground">Describe the task (e.g., &ldquo;Process today&apos;s invoices&rdquo;, &ldquo;Generate sales report&rdquo;).</p>
            <textarea value={runTask} onChange={(e) => setRunTask(e.target.value)} placeholder="What should the agent do?" className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" autoFocus />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setRunOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={runAgent} disabled={!runTask.trim() || running}>{running ? 'Running…' : 'Run'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// First visit to a tab: light that tab and say what it is for. "Skip all" turns these off.
function TabCoach({ tab, title }: { tab: string; title: string }) {
  const { s, see } = usePlatform()
  if (s.tour.status === 'active' || s.tour.status === 'completed' || s.seen.includes('tabs-off') || s.seen.includes(`tab-${tab}`) || !TAB_HELP[tab]) return null
  const done = () => see(`tab-${tab}`)
  return (
    <Spotlight
      key={tab}
      step={{ id: `tab-${tab}`, stop: 0, stopName: 'Tabs', target: `tab-${tab}`, advance: 'next', side: 'bottom', title, body: TAB_HELP[tab] }}
      index={0}
      total={1}
      countText="About this tab"
      skipText="Skip all"
      nextText="Got it"
      onNext={done}
      onPause={done}
      onSkipStep={done}
      onSkip={() => see('tabs-off')}
    />
  )
}
