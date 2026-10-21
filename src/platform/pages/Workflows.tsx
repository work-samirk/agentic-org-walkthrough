import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Sparkles, GitBranch } from 'lucide-react'
import { WORKFLOWS, WORKFLOW_TEMPLATES } from '../data'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Toast, useToast } from '../ui/primitives'

const domainColors: Record<string, string> = {
  finance: 'bg-blue-100 text-blue-700',
  hr: 'bg-purple-100 text-purple-700',
  marketing: 'bg-amber-100 text-amber-700',
}

export function Workflows() {
  const nav = useNavigate()
  const { msg, say } = useToast()
  const [tab, setTab] = useState<'mine' | 'templates'>('mine')

  const tabBtn = (id: 'mine' | 'templates', label: string) => (
    <button
      onClick={() => setTab(id)}
      className={`flex-shrink-0 cursor-pointer rounded-lg px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 ${tab === id ? 'border border-border/80 bg-card font-bold text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold" data-tour="page-title">Workflows</h2>
        <Button onClick={() => say('Create Workflow is not part of this walkthrough')} className="gap-2 shadow-sm"><Plus className="h-4 w-4" />Create Workflow</Button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-1 shadow-sm">
        {tabBtn('mine', 'My Workflows')}
        {tabBtn('templates', 'Templates')}
      </div>

      {tab === 'mine' && (
        <div className="space-y-4">
          {WORKFLOWS.map((wf, idx) => (
            <Card key={wf.id} className={`card-elevated animate-fade-slide-up stagger-${idx + 1}`}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--success)/0.25)] bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success-foreground))] transition-transform duration-200 hover:scale-105"><GitBranch className="h-4 w-4" /></span>
                    <div>
                      <CardTitle className="text-base font-bold">{wf.name} <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 align-middle text-[10px] font-semibold tracking-wide text-primary uppercase">Sample</span></CardTitle>
                      <span className="text-xs text-muted-foreground">Version {wf.version}</span>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Trigger: <strong className="font-semibold text-foreground capitalize">{wf.trigger}</strong></span><span>•</span>
                    <span>Created: <strong className="font-semibold text-foreground">{wf.created}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => nav(`/app/workflows/${wf.id}`)}>View</Button>
                    <Button size="sm" data-tour="wf-run" onClick={() => nav(`/app/workflows/${wf.id}/runs/run-1`)}>Run Now</Button>
                    <Button variant="destructive" size="sm" onClick={() => say('Delete is turned off in the walkthrough')}>Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'templates' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKFLOW_TEMPLATES.map((t, idx) => (
            <Card key={t.id} className={`card-elevated animate-fade-slide-up stagger-${idx + 1} group flex flex-col`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/15 text-accent-foreground transition-transform duration-200 group-hover:scale-110"><Sparkles className="h-4 w-4" /></span>
                    <CardTitle className="truncate text-sm font-bold">{t.name}</CardTitle>
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${domainColors[t.domain] || 'border border-border/80 bg-muted text-muted-foreground'}`}>{t.domain}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground">{t.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2">
                  <div className="text-[11px] font-medium text-muted-foreground">{t.steps} steps • {t.trigger}</div>
                  <Button size="sm" className="h-8 text-xs" onClick={() => say('Using a workflow template is not part of this walkthrough')}>Use Template</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Toast msg={msg} />
    </div>
  )
}
