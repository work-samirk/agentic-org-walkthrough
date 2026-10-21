import { useNavigate } from 'react-router-dom'
import { AGENT_TEMPLATES } from '../data'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Toast, useToast } from '../ui/primitives'

const ACTIONS = [
  { t: 'Find products', d: 'Search the catalog and inspect product details.' },
  { t: 'Create and complete checkout', d: 'Prepare checkout and place a governed order.' },
  { t: 'View and track orders', d: 'Read order details and fulfillment status.' },
]
const input = 'mt-1 w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none'

export function Templates() {
  const nav = useNavigate()
  const { msg, say } = useToast()
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold" data-tour="page-title">Agent Templates</h2>
          <p className="text-sm text-muted-foreground">Create, publish, and instantiate governed buyer and seller templates.</p>
        </div>
        <Button variant="outline" onClick={() => say('New Template is not part of this walkthrough')} className="flex-shrink-0 whitespace-nowrap">New Template</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="card-elevated border-border/70">
          <CardHeader><CardTitle>Create Template</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="t-domain" className="text-sm font-medium text-foreground">Domain</label>
                <select id="t-domain" className={input}><option>Ecommerce</option><option>Finance</option></select>
                <p className="mt-1 text-xs text-muted-foreground">Product discovery, checkout, orders, fulfillment, and merchant operations.</p>
              </div>
              <div><label htmlFor="t-type" className="text-sm font-medium text-foreground">Template Type</label><select id="t-type" className={input}><option>Buyer</option><option>Seller</option></select></div>
              <div><label htmlFor="t-name" className="text-sm font-medium text-foreground">Name</label><input id="t-name" className={input} /></div>
              <div><label htmlFor="t-desc" className="text-sm font-medium text-foreground">Description</label><input id="t-desc" className={input} /></div>
              <div><label htmlFor="t-prompt" className="text-sm font-medium text-foreground">Prompt Template</label><select id="t-prompt" className={input}><option>Select a prompt template</option></select></div>
            </div>
            <section>
              <h3 className="text-sm font-semibold">What should this agent be allowed to do?</h3>
              <p className="mt-1 text-xs text-muted-foreground">Choose business actions. The platform derives the technical tool permissions automatically.</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {ACTIONS.map((a) => (
                  <label key={a.t} className="flex cursor-pointer items-start gap-3 rounded-lg border border-primary/60 bg-primary/5 p-3 transition-colors">
                    <input className="mt-1" type="checkbox" defaultChecked />
                    <span><span className="block text-sm font-medium text-foreground">{a.t}</span><span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{a.d}</span></span>
                  </label>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold">Integrations users must connect</h3>
              <p className="mt-1 text-xs text-muted-foreground">Select integration types, not providers. During agent creation, each user chooses their own compatible active connection.</p>
            </section>
            <div className="flex gap-2"><Button disabled>Create Template</Button></div>
          </CardContent>
        </Card>

        <Card className="card-elevated border-border/70" data-tour="template-list">
          <CardHeader><CardTitle>Templates</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {AGENT_TEMPLATES.map((t) => (
              <div key={t.id} className="rounded-xl border border-border/80 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-muted/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{t.name} <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 align-middle text-[10px] font-semibold tracking-wide text-primary uppercase">Sample</span></p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.domain.charAt(0).toUpperCase() + t.domain.slice(1)} · {t.type}</p>
                  </div>
                  <Badge variant="success">published</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t.prompt}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => say('Edit is not part of this walkthrough')}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => say('Unpublish is not part of this walkthrough')}>Unpublish</Button>
                  <Button size="sm" onClick={() => nav(`/app/agents/new?template=${t.id}`)}>Create Agent from Template</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Toast msg={msg} />
    </div>
  )
}
