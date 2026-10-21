import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { WORKFLOWS } from '../data'
import { usePlatform } from '../state'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '../ui/primitives'

type Status = 'pending' | 'running' | 'completed' | 'waiting' | 'rejected'

// One run of the sample workflow, on sample data. The last step waits for a person.
export function WorkflowRun() {
  const { id } = useParams()
  const nav = useNavigate()
  const { set, s } = usePlatform()
  const wf = WORKFLOWS.find((w) => w.id === id) ?? WORKFLOWS[0]
  const [done, setDone] = useState(0) // how many agent steps are complete
  const [decision, setDecision] = useState<null | 'approved' | 'rejected'>(null)
  const [started] = useState(() => new Date())
  const waitingAt = wf.steps.length - 1

  useEffect(() => {
    if (done >= waitingAt) return
    const t = window.setTimeout(() => setDone((d) => d + 1), 1100)
    return () => window.clearTimeout(t)
  }, [done, waitingAt])

  const status = (i: number): Status => {
    if (i < done) return 'completed'
    if (i === done && i < waitingAt) return 'running'
    if (i === waitingAt && done >= waitingAt) return decision === 'approved' ? 'completed' : decision === 'rejected' ? 'rejected' : 'waiting'
    return 'pending'
  }
  const runStatus = decision === 'approved' ? 'completed' : decision === 'rejected' ? 'failed' : done >= waitingAt ? 'waiting_hitl' : 'running'
  const completed = wf.steps.filter((_, i) => status(i) === 'completed').length
  const progress = Math.round((completed / wf.steps.length) * 100)
  const badge = (st: Status) => ({ completed: 'success', running: 'default', waiting: 'warning', rejected: 'destructive', pending: 'secondary' } as const)[st]

  function decide(d: 'approved' | 'rejected') {
    setDecision(d)
    set({ workflowRuns: s.workflowRuns + 1 })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold" data-tour="page-title">Workflow Run</h2>
          <p className="font-mono text-sm break-all text-muted-foreground">run_8f3c21a4-sample</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={runStatus === 'completed' ? 'success' : runStatus === 'failed' ? 'destructive' : runStatus === 'waiting_hitl' ? 'warning' : 'default'}>{runStatus}</Badge>
          <Button variant="outline" size="sm" onClick={() => nav('/app/workflows')}>Back</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
        <Card className="card-elevated border-border/70"><CardHeader><CardTitle className="text-sm text-muted-foreground">Progress</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{completed}/{wf.steps.length}</p><div className="mt-2 h-2 w-full rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div></CardContent></Card>
        <Card className="card-elevated border-border/70"><CardHeader><CardTitle className="text-sm text-muted-foreground">Started</CardTitle></CardHeader><CardContent><p className="text-sm">{started.toLocaleString()}</p></CardContent></Card>
        <Card className="card-elevated border-border/70"><CardHeader><CardTitle className="text-sm text-muted-foreground">Completed</CardTitle></CardHeader><CardContent><p className="text-sm">{decision === 'approved' ? new Date().toLocaleString() : 'In progress'}</p></CardContent></Card>
        <Card className="card-elevated border-border/70"><CardHeader><CardTitle className="text-sm text-muted-foreground">Workflow</CardTitle></CardHeader><CardContent><p className="font-mono text-sm break-all">{wf.id}</p></CardContent></Card>
      </div>

      <Card className="card-elevated border-border/70" data-tour="wf-steps">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Step Executions</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">{completed} / {wf.steps.length} steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-r-lg border-l-4 border-l-slate-400 bg-muted/50 px-4 pt-3 pb-4">
            <div className="mb-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">Additional Steps</span></div>
            <div className="space-y-4">
              {wf.steps.map((st, i) => {
                const ss = status(i)
                const isHuman = i === waitingAt
                return (
                  <div key={st.id} className="flex gap-3">
                    <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${ss === 'completed' ? 'bg-primary text-primary-foreground' : ss === 'waiting' ? 'bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning-foreground))]' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm leading-tight font-semibold">{st.name}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{st.id} · {st.agent}{ss === 'completed' && !isHuman ? ` · ${600 + i * 180}ms · 91% conf` : ''}</p>
                        </div>
                        <Badge variant={badge(ss)} className="text-[10px]">{ss === 'waiting' ? 'waiting for approval' : ss}</Badge>
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">{st.description}</p>
                      {ss === 'completed' && st.observation && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                          <p className="mb-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">Observation</p>
                          <p className="text-xs leading-relaxed whitespace-pre-wrap text-foreground">{st.observation}</p>
                        </div>
                      )}
                      {isHuman && ss === 'waiting' && (
                        <div className="space-y-2 rounded-lg border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.1)] p-3" data-tour="wf-approval">
                          <p className="text-sm font-medium text-[hsl(var(--warning-foreground))]">Approve refund of ₹4,200 and the reply to the customer</p>
                          <p className="text-xs text-[hsl(var(--warning-foreground))] opacity-90">Role: admin | Priority: high</p>
                          <p className="text-sm font-medium text-[hsl(var(--warning-foreground))]">Nothing is sent until you decide.</p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Button size="sm" data-tour="wf-approve-btn" onClick={() => decide('approved')}>Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => decide('rejected')}>Reject</Button>
                          </div>
                        </div>
                      )}
                      {isHuman && ss === 'completed' && <p className="text-xs text-muted-foreground">Approved by you. In Shadow Mode nothing was actually sent.</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
