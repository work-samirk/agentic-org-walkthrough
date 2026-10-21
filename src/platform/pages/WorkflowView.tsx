import { useNavigate, useParams } from 'react-router-dom'
import { WORKFLOWS } from '../data'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '../ui/primitives'

export function WorkflowView() {
  const { id } = useParams()
  const nav = useNavigate()
  const wf = WORKFLOWS.find((w) => w.id === id) ?? WORKFLOWS[0]
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" data-tour="page-title">{wf.name}</h2>
          <p className="text-sm text-muted-foreground">Version {wf.version} · Trigger: {wf.trigger}</p>
        </div>
        <div className="flex gap-2"><Badge variant="success">Active</Badge><Button variant="outline" size="sm" onClick={() => nav('/app/workflows')}>Back</Button><Button size="sm" onClick={() => nav(`/app/workflows/${wf.id}/runs/run-1`)}>Run Now</Button></div>
      </div>
      <Card className="card-elevated">
        <CardHeader><CardTitle className="text-sm font-semibold">Steps</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {wf.steps.map((st, i) => (
            <div key={st.id} className="rounded bg-muted/30 px-3 py-2">
              <p className="text-sm font-medium">{i + 1}. {st.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{st.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
