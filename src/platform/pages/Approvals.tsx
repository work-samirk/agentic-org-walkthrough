import { useState } from 'react'
import { Check, Clock, ShieldCheck, X } from 'lucide-react'
import { APPROVAL, EMBED_APPROVALS, type ApprovalItem } from '../data'
import { usePlatform } from '../state'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '../ui/primitives'
import { EmptyState } from '../ui/EmptyState'
import { Hint } from '../onboarding/Hint'

export function Approvals() {
  const { s, set } = usePlatform()
  const [tab, setTab] = useState<'pending' | 'decided'>('pending')
  const [priority, setPriority] = useState('all')
  const [feedback, setFeedback] = useState<string | null>(null)
  const embed = new URLSearchParams(window.location.search).has('embed')
  const items: ApprovalItem[] = embed ? EMBED_APPROVALS : [APPROVAL]
  const doneIds = embed ? s.approvalsDone : s.pendingResolved ? [APPROVAL.id] : []
  const pending = items.filter((i) => !doneIds.includes(i.id))
  const decided = items.filter((i) => doneIds.includes(i.id))
  const list = (tab === 'pending' ? pending : decided).filter((a) => priority === 'all' || a.priority === priority)

  function decide(d: 'approve' | 'reject' | 'defer', id: string) {
    if (d === 'defer') return setFeedback('Deferred. It stays in the queue.')
    set(embed ? { approvalsDone: [...s.approvalsDone, id], approvalDecision: d, resolved: s.resolved + 1 } : { pendingResolved: true, approvalDecision: d, resolved: s.resolved + 1 })
    setFeedback(d === 'approve' ? 'Approved. In Shadow Mode nothing was actually sent.' : 'Rejected.')
  }

  const tabBtn = (id: 'pending' | 'decided', label: string) => (
    <button onClick={() => setTab(id)} className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${tab === id ? 'border border-border/80 bg-card font-bold text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}>{label}</button>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-primary/15 to-violet-500/15 text-primary"><ShieldCheck className="h-5 w-5" /></span>
          <h2 className="text-2xl font-bold" data-tour="page-title">Approval Queue</h2>
        </div>
        <Badge variant="destructive">{pending.length} pending</Badge>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 p-1.5">
        <div className="flex items-center gap-1">{tabBtn('pending', `Pending (${pending.length})`)}{tabBtn('decided', `Decided (${decided.length})`)}</div>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority" className="cursor-pointer rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-ring">
          <option value="all">All Priorities</option><option value="critical">Critical</option><option value="high">High</option><option value="normal">Normal</option>
        </select>
      </div>

      <Hint id="approval" title="What is human approval?">When an agent wants to do something that matters, like sending a refund, it stops and asks a person first. You decide.</Hint>

      {feedback && <div role="alert" className="animate-fade-slide-up rounded-lg border border-[hsl(var(--success)/0.25)] bg-[hsl(var(--success)/0.12)] px-4 py-3 text-sm font-medium text-[hsl(var(--success-foreground))]">{feedback}</div>}

      {list.length === 0 ? (
        <EmptyState illustration="approvals" title={tab === 'pending' ? 'Queue is clear' : 'No decided records'} description={tab === 'pending' ? 'No pending approvals requiring human review right now. All agent operations are running within authorized autonomy boundaries.' : 'Historical decisions and approved items will appear here.'} />
      ) : (
        <div className="space-y-4">
          {list.map((item) => (
            <Card key={item.id} className="card-elevated transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold">{item.title} {!embed && <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 align-middle text-[10px] font-semibold tracking-wide text-primary uppercase">Sample</span>}</CardTitle>
                  <Badge variant="warning">{item.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Trigger: {item.trigger_type} | Role: {item.assignee_role}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.15)] p-3 text-sm font-medium whitespace-pre-wrap text-[hsl(var(--warning-foreground))]">{item.msg ?? 'Support Triage wants to refund ₹4,200 and send the customer a reply. Nothing is sent until you decide.'}</div>
                <details className="rounded-lg border border-border/60 p-2.5">
                  <summary className="cursor-pointer text-sm font-medium transition-colors hover:text-primary">Reasoning Trace (3 steps)</summary>
                  <ul className="mt-2 space-y-1">
                    {(item.trace ?? ['The customer was charged twice for order 80412.', 'The refund is over the ₹2,500 limit the agent may approve alone.', 'So it asked a person.']).map((t) => <li key={t} className="flex items-start gap-1.5 text-xs text-muted-foreground"><span className="mt-0.5 text-primary">•</span><span>{t}</span></li>)}
                  </ul>
                </details>
                {tab === 'pending' ? (
                  <div className="flex gap-2 border-t border-border/80 pt-2">
                    <Button className="gap-2 shadow-sm" onClick={() => decide('approve', item.id)}><Check className="h-4 w-4" /> Approve</Button>
                    <Button variant="destructive" className="gap-2 shadow-sm" onClick={() => decide('reject', item.id)}><X className="h-4 w-4" /> Reject</Button>
                    <Button variant="outline" className="gap-2" onClick={() => decide('defer', item.id)}><Clock className="h-4 w-4" /> Defer</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Decision:</span><Badge variant={s.approvalDecision === 'approve' ? 'default' : 'destructive'}>{s.approvalDecision === 'approve' ? 'Approve' : 'Reject'}</Badge></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
