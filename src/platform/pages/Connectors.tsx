import { useState } from 'react'
import { Cable, CheckCircle2, XCircle } from 'lucide-react'
import { CONNECTORS } from '../data'
import { usePlatform } from '../state'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Toast, useToast } from '../ui/primitives'

const CATEGORY_LABELS: Record<string, string> = { all: 'All Categories', b2b_supplier: 'B2B Supplier', restaurant: 'Restaurant' }
const CATEGORIES = ['all', 'finance', 'hr', 'marketing', 'ops', 'comms', 'compliance']
const CATALOG = [
  { id: 'zoho_books', display_name: 'Zoho Books', category: 'finance', description: 'Invoices, bills, ledgers and bank statements.', tools: ['list_invoices', 'get_ledger_balance', 'fetch_bank_statement'] },
  { id: 'gmail', display_name: 'Gmail', category: 'comms', description: 'Read the inbox and send email.', tools: ['read_inbox', 'send_email'] },
  { id: 'slack', display_name: 'Slack', category: 'comms', description: 'Post and read messages in channels.', tools: ['slack_send_message', 'slack_read_channel'] },
  { id: 'tally', display_name: 'Tally', category: 'finance', description: 'Vouchers and ledgers through the Tally bridge.', tools: ['get_voucher', 'list_ledgers'] },
  { id: 'stripe', display_name: 'Stripe', category: 'finance', description: 'Payments, refunds and payouts.', tools: ['list_payments', 'create_refund'] },
  { id: 'hubspot', display_name: 'HubSpot', category: 'marketing', description: 'Contacts, deals and campaigns.', tools: ['list_leads', 'update_deal'] },
]

export function Connectors() {
  const { s, set } = usePlatform()
  const { msg, say } = useToast()
  const [tab, setTab] = useState<'native' | 'marketplace'>('native')
  const [cat, setCat] = useState('all')
  const [testing, setTesting] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const shown = CONNECTORS.filter((c) => cat === 'all' || c.category === cat)
  const registered = new Set(CONNECTORS.map((c) => c.id))

  function check(id: string) {
    setTesting(id)
    setResult(null)
    window.setTimeout(() => {
      setTesting(null)
      if (!s.healthy.includes(id)) set({ healthy: [...s.healthy, id] })
      setResult(`${id}: connection is healthy.`)
    }, 1400)
  }

  const tabBtn = (id: 'native' | 'marketplace', label: string) => (
    <button onClick={() => setTab(id)} className={`flex-shrink-0 cursor-pointer rounded-lg px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 ${tab === id ? 'border border-border/80 bg-card font-bold text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}>{label}</button>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold" data-tour="page-title">Connectors</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => say('Sandbox setup is not part of this walkthrough')}>CMO Sandbox Setup</Button>
          <Button onClick={() => say('Register Connector is not part of this walkthrough')}>Register Connector</Button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-1 shadow-sm">
        {tabBtn('native', 'Connected Connectors')}
        {tabBtn('marketplace', 'Marketplace')}
      </div>

      {tab === 'native' ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 [&>*]:min-w-0">
            {[
              { t: 'Total connected', v: CONNECTORS.length, icon: Cable, bg: 'bg-primary/10 text-primary border border-primary/20', c: '' },
              { t: 'Healthy', v: s.healthy.length, icon: CheckCircle2, bg: 'bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success-foreground))] border border-[hsl(var(--success)/0.25)]', c: 'text-[hsl(var(--success-foreground))]' },
              { t: 'Unhealthy', v: 0, icon: XCircle, bg: 'bg-destructive/15 text-destructive border border-destructive/25', c: 'text-destructive' },
            ].map((k, i) => (
              <Card key={k.t} className={`card-elevated animate-fade-slide-up stagger-${i + 1} group relative overflow-hidden`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="min-w-0 truncate text-xs font-semibold tracking-wider text-muted-foreground uppercase">{k.t}</CardTitle>
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${k.bg}`}><k.icon className="h-4 w-4" /></span>
                </CardHeader>
                <CardContent><p className={`text-3xl font-extrabold tracking-tight tabular-nums ${k.c}`}>{k.v}</p></CardContent>
              </Card>
            ))}
          </div>

          {result && (
            <div role="alert" className="animate-fade-slide-up flex items-center justify-between rounded-lg border border-[hsl(var(--success)/0.25)] bg-[hsl(var(--success)/0.12)] px-4 py-3 text-sm text-[hsl(var(--success-foreground))]">
              <span className="font-medium">{result}</span>
              <button onClick={() => setResult(null)} className="ml-2 cursor-pointer text-xs underline hover:opacity-80">Dismiss</button>
            </div>
          )}

          <div className="flex items-center gap-4">
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category" className="cursor-pointer rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-ring">
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c] || c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((c, i) => {
              const ok = s.healthy.includes(c.id)
              return (
                <div key={c.id} className="flex flex-col gap-2">
                  <Card className="card-elevated group cursor-pointer transition-all duration-200 hover:border-primary/50" data-tour={i === 0 ? 'conn-card' : undefined} onClick={() => say('Connector details are not part of this walkthrough')}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--success)/0.25)] bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success-foreground))] transition-transform duration-200 group-hover:scale-105"><Cable className="h-4 w-4" /></span>
                          <CardTitle className="truncate text-sm font-bold">{c.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {c.sample && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">Sample</span>}
                          <Badge variant="success">{ok ? 'healthy' : 'active'}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">{c.category}</span><span>•</span>
                        <span>Auth: <strong className="text-[10px] font-semibold text-foreground uppercase">{c.auth}</strong></span><span>•</span>
                        <span>Rate: <strong className="font-semibold text-foreground tabular-nums">{c.rate}</strong>/min</span>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => say('Edit is not part of this walkthrough')}>Edit</Button>
                    <Button variant="outline" size="sm" data-tour={i === 0 ? 'health-check' : undefined} disabled={testing === c.id} onClick={() => check(c.id)}>{testing === c.id ? 'Checking…' : 'Health Check'}</Button>
                    <Button variant="destructive" size="sm" onClick={() => say('Archive is turned off in the walkthrough')}>Archive</Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold">Native Connector Catalog ({CATALOG.length})</h3>
            <p className="mb-4 text-sm text-muted-foreground">Full catalog of supported native connectors. Click "Register" to add one to your tenant.</p>
            <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {CATALOG.map((c) => {
                const reg = registered.has(c.id)
                return (
                  <Card key={c.id} className="flex h-full flex-col p-3 transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="truncate text-sm font-medium">{c.display_name}</span>
                      <span className="text-xs text-muted-foreground">{c.category.charAt(0).toUpperCase() + c.category.slice(1)}</span>
                      <span className="line-clamp-2 text-xs text-muted-foreground">{c.description}</span>
                      <div className="mt-2">
                        <span className="text-xs font-medium">Tools ({c.tools.length})</span>
                        <div className="mt-1 flex flex-wrap gap-1">{c.tools.map((t) => <span key={t} className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-normal break-all">{t}</span>)}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 h-7 w-full text-xs" disabled={reg} onClick={() => say('Register is not part of this walkthrough')}>{reg ? 'Registered' : 'Register'}</Button>
                  </Card>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-border/70 bg-card/60 p-10 text-center">
          <h3 className="text-base font-semibold">The marketplace is not part of this walkthrough</h3>
          <p className="mt-1.5 text-xs text-muted-foreground">It lists thousands of apps you can add in a few clicks.</p>
        </div>
      )}
      <Toast msg={msg} />
    </div>
  )
}
