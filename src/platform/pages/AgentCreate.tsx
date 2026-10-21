import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { usePlatform } from '../state'
import { AGENT_TEMPLATES, CONNECTORS, type Agent } from '../data'
import { generatedPrompt, humanize, scriptFor, toolPermission, type Script } from '../scripts'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Stepper } from '../ui/primitives'
import { useTourStep } from '../onboarding/tour'

const DOMAINS = ['finance', 'hr', 'marketing', 'ops', 'backoffice', 'comms', 'compliance']
const AGENT_TYPES: Record<string, string[]> = {
  finance: ['ap_processor', 'ar_collections', 'recon_agent', 'tax_compliance', 'close_agent', 'fpa_agent'],
  hr: ['talent_acquisition', 'onboarding_agent', 'payroll_engine', 'performance_coach', 'ld_coordinator', 'offboarding_agent'],
  marketing: ['content_factory', 'campaign_pilot', 'seo_strategist', 'crm_intelligence', 'brand_monitor'],
  ops: ['support_triage', 'vendor_manager', 'contract_intelligence', 'compliance_guard', 'it_operations', 'email_support'],
  backoffice: ['legal_ops', 'risk_sentinel', 'facilities_agent'],
  comms: ['email_agent', 'notification_agent', 'chat_agent'],
  compliance: ['cse_onboarding_service'],
}
const STEPS = ['Persona', 'Role', 'Prompt', 'Behavior', 'Review']
const PROMPT_TEMPLATES = ['Ap Processor', 'Recon Agent', 'Support Triage', 'Chat Agent']
const ALL_TOOLS = ['fetch_bank_statement', 'get_transaction_list', 'check_account_balance', 'list_invoices', 'get_ledger_balance', 'list_vendors', 'read_inbox', 'send_email', 'search_policy', 'list_leads']

function PermissionBadge({ tool }: { tool: string }) {
  const p = toolPermission(tool)
  const cls = { READ: 'bg-green-100 text-green-700 border-green-300', WRITE: 'bg-blue-100 text-blue-700 border-blue-300', DELETE: 'bg-red-100 text-red-700 border-red-300', ADMIN: 'bg-purple-100 text-purple-700 border-purple-300' }[p]
  return <span className={`inline-block rounded border px-1.5 py-0 text-[10px] font-semibold ${cls}`}>{p}</span>
}

const field = 'border rounded px-3 py-2 text-sm w-full mt-1 bg-background'

export function AgentCreate() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const { role, createAgent } = usePlatform()
  const sc: Script = scriptFor(role)
  const tpl = AGENT_TEMPLATES.find((t) => t.id === params.get('template'))
  const tourStep = useTourStep()

  const [step, setStep] = useState(-1)
  const [nl, setNl] = useState(tpl?.prompt ?? '')
  const [generating, setGenerating] = useState(false)

  const [employeeName, setEmployeeName] = useState('')
  const [designation, setDesignation] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [domain, setDomain] = useState('finance')
  const [useCustomType, setUseCustomType] = useState(false)
  const [agentType, setAgentType] = useState('recon_agent')
  const [customType, setCustomType] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([])
  const [promptText, setPromptText] = useState('')
  const [floor, setFloor] = useState(0.88)
  const [hitl, setHitl] = useState('confidence < 0.88')
  const [retries, setRetries] = useState(3)
  const [routing, setRouting] = useState('auto')
  const [connectorIds, setConnectorIds] = useState<string[]>([])
  const [tools, setTools] = useState<string[]>([])
  const [picker, setPicker] = useState(false)
  const [composio, setComposio] = useState(false)
  const [cron, setCron] = useState(false)

  // During the tour the describe box is filled with an example for the person's role.
  useEffect(() => {
    if (tourStep === 'describe' && !nl) setNl(sc.prompt)
  }, [tourStep, nl, sc.prompt])

  function generate() {
    setGenerating(true)
    window.setTimeout(() => {
      const s = tpl ? { ...sc, employee: tpl.name, designation: tpl.name, domain: tpl.domain } : sc
      setEmployeeName(s.employee)
      setDesignation(s.designation)
      setDomain(s.domain)
      setAgentType(s.agentType)
      setSpecialization(s.specialization)
      setPromptText(generatedPrompt(s, nl.trim()))
      const ids = [...new Set(s.tools.map((t) => t.connector))].filter((c) => CONNECTORS.some((x) => x.id === c))
      setConnectorIds(ids.length ? ids : ['sample_bank'])
      setTools(s.tools.map((t) => t.name))
      setGenerating(false)
      setStep(0)
    }, 1100)
  }

  const finalType = useCustomType ? customType : agentType
  const typeList = AGENT_TYPES[domain] ?? AGENT_TYPES.finance
  const canNext = step === 0 ? employeeName.trim().length > 0 : step === 1 ? finalType.trim().length > 0 : step === 2 ? promptText.trim().length > 0 : true
  const availableTools = useMemo(() => ALL_TOOLS.filter((t) => !tools.includes(t)), [tools])
  const scopes = useMemo(() => [...new Set(tools.map((t) => `tool:${domain}:${toolPermission(t).toLowerCase()}:*`))], [tools, domain])

  function create() {
    const agent: Agent = {
      id: 'mine-1', name: employeeName, designation, agentType: finalType, domain, status: 'shadow', conf: floor, samples: 0, accuracy: null,
      specialization, prompt: promptText, tools,
    }
    createAgent(agent)
    nav('/app/agents/mine-1')
  }

  const back = () => (step === 0 ? setStep(-1) : setStep(step - 1))

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-2xl font-bold" data-tour="page-title">Create Virtual Employee</h2>
        <Button variant="outline" onClick={() => nav('/app/agents')}>Back</Button>
      </div>

      {step >= 0 && (
        <div className="card-elevated animate-fade-slide-up rounded-xl border border-border/80 bg-card/70 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm" data-tour="wizard-steps">
          <Stepper steps={STEPS} activeStep={step} />
        </div>
      )}

      {step === -1 && (
        <Card className="card-elevated animate-fade-slide-up shadow-[var(--shadow-card)]" data-tour="describe-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></span>
              <CardTitle>Describe the employee you need</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Tell us in plain English what you need this virtual employee to do. We'll generate the full configuration for you to review.</p>
            <textarea
              aria-label="Describe the employee you need"
              value={nl}
              onChange={(e) => setNl(e.target.value)}
              placeholder={'Examples:\n- "I need someone who processes invoices and matches them with POs"\n- "Customer support agent that handles refund requests and tracks SLAs"\n- "An HR coordinator who manages onboarding for new hires"\n- "Someone to monitor brand mentions and sentiment across social media"'}
              className="mt-1 min-h-[160px] w-full resize-y rounded border bg-background px-4 py-3 text-sm"
              rows={6}
            />
            <div className="flex items-center justify-between pt-2">
              <button onClick={() => { setEmployeeName(''); setStep(0) }} className="text-sm text-muted-foreground underline transition-colors hover:text-primary">Skip to manual setup</button>
              <Button data-tour="generate" onClick={generate} disabled={generating || nl.trim().length < 10}>
                {generating ? (
                  <span className="flex items-center gap-2"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Generating...</span>
                ) : 'Generate'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step >= 0 && (
        <Card className="card-elevated shadow-[var(--shadow-card)] transition-all duration-300" data-tour={['wiz-persona', 'wiz-role', 'wiz-prompt', 'wiz-behavior', 'review-card'][step]}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Step {step + 1}: {STEPS[step]}</CardTitle>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Step {step + 1} of {STEPS.length}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <>
                <div>
                  <label className="text-sm font-medium">Employee Name *</label>
                  <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="e.g. Priya, Arjun, Maya" className={field} />
                  <p className="mt-1 text-xs text-muted-foreground">The virtual employee's identity, how they'll appear across the platform.</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Designation</label>
                  <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Senior AP Analyst - Mumbai Office" className={field} />
                </div>
                <div>
                  <label className="text-sm font-medium">Avatar URL</label>
                  <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.jpg" className={field} />
                </div>
                <div>
                  <label className="text-sm font-medium">Domain *</label>
                  <select value={domain} onChange={(e) => { setDomain(e.target.value); setAgentType((AGENT_TYPES[e.target.value] ?? [''])[0]) }} className={field}>
                    {DOMAINS.map((d) => <option key={d} value={d}>{humanize(d)}</option>)}
                  </select>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={useCustomType} onChange={(e) => setUseCustomType(e.target.checked)} />
                    Create custom agent type
                  </label>
                  {useCustomType ? (
                    <input type="text" value={customType} onChange={(e) => setCustomType(e.target.value)} placeholder="e.g. customer_success" className="w-full rounded border bg-background px-3 py-2 text-sm" />
                  ) : (
                    <select value={agentType} onChange={(e) => setAgentType(e.target.value)} className="w-full rounded border bg-background px-3 py-2 text-sm">
                      {typeList.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Specialization</label>
                  <textarea value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Import invoices above 10L, ICEGATE compliance" className={field} rows={2} />
                </div>
                <div>
                  <label className="text-sm font-medium">Routing Filters</label>
                  <p className="mb-2 text-xs text-muted-foreground">When multiple agents share this type, routing filters decide who gets the task.</p>
                  {filters.map((f, i) => (
                    <div key={i} className="mb-2 flex gap-2">
                      <input type="text" value={f.key} onChange={(e) => setFilters(filters.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))} placeholder="Key (e.g. region)" className="flex-1 rounded border bg-background px-2 py-1 text-sm" />
                      <input type="text" value={f.value} onChange={(e) => setFilters(filters.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} placeholder="Value (e.g. APAC)" className="flex-1 rounded border bg-background px-2 py-1 text-sm" />
                      <Button variant="outline" size="sm" onClick={() => setFilters(filters.filter((_, j) => j !== i))}>Remove</Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setFilters([...filters, { key: '', value: '' }])}>+ Add Filter</Button>
                </div>
                <div>
                  <label className="text-sm font-medium">Reports To (Org Chart)</label>
                  <p className="mb-2 text-xs text-muted-foreground">Select a parent agent for escalation hierarchy. Leave empty for no parent.</p>
                  <select className="w-full rounded border bg-background px-3 py-2 text-sm" defaultValue="">
                    <option value="">No parent (escalates to human)</option>
                  </select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="text-sm font-medium">Select Template</label>
                  <select className={field} defaultValue="">
                    <option value="">Write custom prompt</option>
                    {PROMPT_TEMPLATES.map((t) => <option key={t}>{t} (built-in)</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Prompt Text *</label>
                  <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} placeholder="You are the {{role}} Agent for {{org_name}}..." className="mt-1 w-full rounded border bg-background px-3 py-2 font-mono text-sm" rows={12} />
                  <p className="mt-1 text-xs text-muted-foreground">{promptText.length} characters</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="text-sm font-medium">LLM Model</label>
                  <select className={field} defaultValue="openai|gpt-5.4">
                    <option value="openai|gpt-5.4">openai / gpt-5.4</option>
                    <option value="openai|gpt-4o-mini">openai / gpt-4o-mini</option>
                    <option value="anthropic|claude-opus-4">anthropic / claude-opus-4</option>
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">Only providers/models with a usable key for your tenant are shown above.</p>
                </div>
                <div>
                  <label className="text-sm font-medium">LLM Routing</label>
                  <select value={routing} onChange={(e) => setRouting(e.target.value)} className={field}>
                    <option value="auto">Auto (Recommended)</option>
                    <option value="tier1">Economy - Gemini Flash (Free)</option>
                    <option value="tier2">Standard - Gemini Pro</option>
                    <option value="tier3">Premium - Claude/GPT-4o</option>
                    <option value="disabled">Disabled - Use selected model</option>
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Estimated cost per 1K tokens: {routing === 'auto' && 'varies by task complexity'}{routing === 'tier1' && '~$0.00 (free tier)'}{routing === 'tier2' && '~$0.30'}{routing === 'tier3' && '~$3.00'}{routing === 'disabled' && 'depends on selected model above'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Confidence Floor: {(floor * 100).toFixed(0)}%</label>
                  <input type="range" min={0.5} max={0.99} step={0.01} value={floor} onChange={(e) => { setFloor(Number(e.target.value)); setHitl(`confidence < ${Number(e.target.value).toFixed(2)}`) }} className="mt-1 w-full accent-[hsl(var(--primary))]" />
                  <p className="mt-1 text-xs text-muted-foreground">Agent escalates to HITL when confidence drops below this threshold.</p>
                </div>
                <div>
                  <label className="text-sm font-medium">HITL Condition</label>
                  <input type="text" value={hitl} onChange={(e) => setHitl(e.target.value)} placeholder="confidence < 0.88 OR amount > 500000" className={field} />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Retries</label>
                  <input type="number" min={1} max={10} value={retries} onChange={(e) => setRetries(Number(e.target.value))} className="mt-1 w-24 rounded border bg-background px-3 py-2 text-sm" />
                </div>

                <div>
                  <label className="text-sm font-medium">Connectors</label>
                  <p className="mb-2 text-xs text-muted-foreground">Choose the concrete connector instances this agent may use.</p>
                  {connectorIds.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {connectorIds.map((id) => (
                        <span key={id} className="inline-flex items-center gap-1">
                          <Badge variant="outline">{id}</Badge>
                          <button type="button" aria-label={`Remove ${id}`} className="rounded px-1 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setConnectorIds(connectorIds.filter((c) => c !== id))}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <select value="" onChange={(e) => e.target.value && setConnectorIds([...connectorIds, e.target.value])} className={field}>
                    <option value="">+ Add connector</option>
                    {CONNECTORS.filter((c) => !connectorIds.includes(c.id)).map((c) => <option key={c.id} value={c.id}>{c.id} ({c.category})</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Authorized Tools</label>
                  <p className="mb-2 text-xs text-muted-foreground">Tools this agent can call. {connectorIds.length > 0 ? 'Filtered to the connectors you picked above.' : 'Add a connector above to auto-populate its tools, none are added by default.'}</p>
                  {tools.length > 0 ? (
                    <div className="mb-2 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {tools.map((t) => (
                          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {humanize(t)} <PermissionBadge tool={t} />
                            <span className="ml-1 font-mono text-[9px] text-muted-foreground">tool:{domain}:{toolPermission(t).toLowerCase()}:{t}</span>
                            <button type="button" onClick={() => setTools(tools.filter((x) => x !== t))} className="ml-1 text-primary/60 hover:text-primary" aria-label={`Remove ${t}`}>&times;</button>
                          </span>
                        ))}
                      </div>
                      <div className="rounded bg-muted/40 p-2">
                        <p className="mb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">Minimal Scope Set ({scopes.length} scopes)</p>
                        <div className="flex flex-wrap gap-1">{scopes.map((s) => <code key={s} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">{s}</code>)}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-2 text-xs text-amber-600">No tools selected. Default tools will be assigned based on agent type.</p>
                  )}
                  <div className="flex items-stretch gap-2">
                    <button type="button" onClick={() => setPicker(!picker)} className="flex-1 rounded border px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/40">
                      {picker ? '▲ Hide tools' : `▼ Pick tools… (${availableTools.length + 659} available)`}
                    </button>
                    {availableTools.length > 0 && <button type="button" onClick={() => setTools([...new Set([...tools, ...ALL_TOOLS])])} className="rounded border bg-primary/10 px-3 py-2 text-sm font-medium whitespace-nowrap text-primary hover:bg-primary/20">Select All</button>}
                    {tools.length > 0 && <button type="button" onClick={() => setTools([])} className="rounded border bg-destructive/10 px-3 py-2 text-sm font-medium whitespace-nowrap text-destructive hover:bg-destructive/20">Clear</button>}
                  </div>
                  {picker && (
                    <div className="mt-1 max-h-52 overflow-y-auto rounded border bg-background">
                      {availableTools.map((t) => (
                        <div key={t} className="group flex cursor-pointer items-center justify-between px-3 py-1.5 text-sm hover:bg-primary/10 hover:text-primary" onClick={() => setTools([...tools, t])}>
                          <span>{humanize(t)}</span><span className="font-mono text-[10px] text-muted-foreground">{t}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 border-t pt-4">
                    <button type="button" onClick={() => setComposio(!composio)} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                      <span>{composio ? '▼' : '▶'}</span>Browse Marketplace Tools
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-normal text-muted-foreground">Composio</span>
                    </button>
                    {composio && <p className="mt-3 text-xs text-muted-foreground">Register a Composio toolkit on the Connectors page first; its real tools will appear here.</p>}
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                  <p>New agents start in <strong>Shadow Mode</strong>. Promote to Active after validation.</p>
                  <p className="mt-2">The agent will auto-register on Grantex with a unique DID and scoped token for A2A/MCP external access.</p>
                </div>
              </>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">{employeeName.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{employeeName}</h3>
                    {designation && <p className="text-sm text-muted-foreground">{designation}</p>}
                    <div className="mt-1 flex gap-2"><Badge>{humanize(domain)}</Badge><Badge variant="outline">{humanize(finalType)}</Badge><Badge variant="secondary">Shadow</Badge></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Agent Type:</span> {humanize(finalType)}</div>
                  <div><span className="text-muted-foreground">Confidence Floor:</span> {(floor * 100).toFixed(0)}%</div>
                  <div><span className="text-muted-foreground">HITL Condition:</span> {hitl}</div>
                  <div><span className="text-muted-foreground">Max Retries:</span> {retries}</div>
                  <div><span className="text-muted-foreground">LLM Model:</span> openai / gpt-5.4</div>
                  {specialization && <div className="col-span-2"><span className="text-muted-foreground">Specialization:</span> {specialization}</div>}
                </div>
                {tools.length > 0 && (
                  <div>
                    <p className="mb-1 text-sm font-medium">Authorized Tools ({tools.length})</p>
                    <div className="flex flex-wrap gap-1.5">{tools.map((t) => <Badge key={t} variant="outline" className="inline-flex items-center gap-1 text-xs">{humanize(t)} <PermissionBadge tool={t} /></Badge>)}</div>
                  </div>
                )}
                <div>
                  <p className="mb-1 text-sm font-medium">Prompt Preview ({promptText.length} chars)</p>
                  <pre className="max-h-40 overflow-auto rounded bg-muted p-3 text-xs whitespace-pre-wrap">{promptText.slice(0, 500)}{promptText.length > 500 ? '...' : ''}</pre>
                </div>
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm font-medium">Cron Schedule</p><p className="text-xs text-muted-foreground">Automatically run this agent on a schedule</p></div>
                    <button type="button" role="switch" aria-checked={cron} aria-label="Cron schedule" onClick={() => setCron(!cron)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${cron ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${cron ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  {cron && <p className="text-xs text-muted-foreground">Scheduling is not part of this walkthrough.</p>}
                </div>
              </div>
            )}

            <div className="flex justify-between border-t border-border/80 pt-4">
              <Button variant="outline" onClick={back} className="gap-2"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{step === 0 ? 'Back to Describe' : 'Back'}</Button>
              {step < 4 ? (
                <Button data-tour="wizard-next" onClick={() => setStep(step + 1)} disabled={!canNext} className="gap-2">Next<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
              ) : (
                <Button data-tour="create-shadow" onClick={create} className="gap-2"><Sparkles className="h-4 w-4" aria-hidden="true" />Create as Shadow</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
