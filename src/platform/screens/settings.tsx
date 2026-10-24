import { useState } from 'react'
import { Button, Badge, Checkbox } from '../ui/primitives'
import { Field, inputCls, Mono, Page, Panel, selectCls, Stats, Status, Table, useSay } from './kit'

/* A2A and MCP (External Integrations) -------------------------------------------------------- */
function Code({ children }: { children: string }) {
  return <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">{children}</pre>
}
export const A2A = () => (
  <Page title="External Integrations" sub="Connect SDKs, external agents, MCP clients, connectors, workflows, and knowledge.">
    <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
      <Panel title="Python SDK" desc="Launch agents, commerce, KB, and workflows"><Code>pip install agenticorg</Code></Panel>
      <Panel title="TypeScript SDK" desc="The same calls from Node or the browser"><Code>npm i agenticorg-sdk</Code></Panel>
      <Panel title="CLI tool" desc="Terminal"><Code>{'agenticorg agents list\nagenticorg agents run ap_processor'}</Code></Panel>
      <Panel title="Agent-to-Agent (A2A) Protocol" desc="External buyer agents discover launchable AgenticOrg seller agents through A2A."><Badge variant="secondary">Grantex Auth</Badge></Panel>
      <Panel title="Model Context Protocol (MCP)" desc="MCP-compatible clients can discover AgenticOrg agents and call them as tools."><Badge variant="secondary">ChatGPT / Claude</Badge></Panel>
    </div>
    <Panel title="Authentication">
      <div className="grid gap-4 md:grid-cols-3 [&>*]:min-w-0">
        <div><b className="text-sm">API key</b><p className="mb-2 text-xs text-muted-foreground">For dashboard users.</p><Code>{'AgenticOrg(api_key="...")'}</Code></div>
        <div><b className="text-sm">Grantex token</b><p className="mb-2 text-xs text-muted-foreground">For scoped external agents.</p><Code>{'AgenticOrg(grantex_token="...")'}</Code></div>
        <div><b className="text-sm">Environment</b><p className="mb-2 text-xs text-muted-foreground">Detected by SDKs and MCP server.</p><Code>AGENTICORG_API_KEY=...</Code></div>
      </div>
    </Panel>
  </Page>
)

/* Billing ---------------------------------------------------------------------------------- */
function BillingBody() {
  const say = useSay()
  return (
    <>
      <Stats items={[['Current plan', 'Free', '$0 per month'], ['Agents', '4 of 39'], ['Tasks today', '212 of 500'], ['Connectors', '6 of 20']]} />
      <Panel title="Available plans">
        <div className="grid gap-4 md:grid-cols-3 [&>*]:min-w-0">
          {[['Free', '$0', 'Current plan', true], ['Pro', '$20', 'Upgrade to Pro', false], ['Enterprise', 'Custom', 'Contact sales', false]].map(([n, p, c, cur]) => (
            <div key={n as string} className={`rounded-xl border p-4 ${cur ? 'border-primary/50 bg-primary/5' : ''}`}>
              <b>{n}</b><p className="my-1 text-2xl font-bold">{p}<span className="text-xs font-normal text-muted-foreground">{p === 'Custom' ? '' : ' /month'}</span></p>
              <Button size="sm" variant={cur ? 'outline' : 'default'} disabled={!!cur} onClick={() => say('Plan changes are not enabled in the walkthrough')}>{c}</Button>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}
export const Billing = () => <Page title="Billing & Usage" sub="Your plan, usage and invoices"><BillingBody /></Page>

/* User management --------------------------------------------------------------------------- */
function UsersBody() {
  const say = useSay()
  return (
    <>
      <Panel title="Provision access" desc="Invite someone and choose what they can see">
        <div className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
          <Field label="Full name"><input className={inputCls} placeholder="Jane Doe" /></Field>
          <Field label="Work email"><input className={inputCls} placeholder="jane@company.com" /></Field>
          <Field label="Role"><select className={selectCls}>{['Admin', 'Domain head', 'Operator', 'Viewer'].map((r) => <option key={r}>{r}</option>)}</select></Field>
          <Field label="Business domain" hint="Some roles are limited to one business domain."><select className={selectCls}>{['Finance', 'Marketing', 'Ops', 'HR'].map((r) => <option key={r}>{r}</option>)}</select></Field>
        </div>
        <div className="mt-4"><Button onClick={() => say('Invitation sent on sample data')}>Send invitation</Button></div>
      </Panel>
      <Panel title="Tenant users"><Table cols={['User', 'Role', 'Domain', 'Status']} rows={[['Priya Nair · priya@northwindpay.in', 'CEO / Admin', 'All', <Status key="1" v="Active" />], ['Arjun Mehta · arjun@northwindpay.in', 'Domain head', 'Finance', <Status key="2" v="Active" />], ['Meera Shah · meera@northwindpay.in', 'Operator', 'Ops', <Status key="3" v="Active" />]]} /></Panel>
      <Panel title="Outstanding invitations"><Table cols={['Invitee', 'Role', 'Created', 'Action']} rows={[['rohan@northwindpay.in', 'Viewer', '2 days ago', 'Revoke']]} /></Panel>
    </>
  )
}
export const Users = () => <Page title="User Management" sub="Who can sign in and what they can see"><UsersBody /></Page>

/* AI credentials and configuration ---------------------------------------------------------- */
function CredsBody() {
  const say = useSay()
  const [key, setKey] = useState('')
  return (
    <>
      <Panel title="Providers" desc="Agents run on a model provider you own. Your key is encrypted and never shown again.">
        <Table cols={['Provider', 'Key', 'Status', 'Actions']} rows={[['OpenAI', <Mono key="1">sk-...a91f</Mono>, <Status key="a" v="Configured" />, <div key="x" className="flex gap-2"><Button size="sm" variant="outline" onClick={() => say('Connection test passed')}>Test</Button><Button size="sm" variant="outline" onClick={() => say('Rotate the key by pasting a new one below')}>Rotate</Button></div>], ['Anthropic', <Mono key="2">sk-ant-...7c2d</Mono>, <Status key="b" v="Configured" />, <div key="y" className="flex gap-2"><Button size="sm" variant="outline" onClick={() => say('Connection test passed')}>Test</Button><Button size="sm" variant="outline" onClick={() => say('Rotate the key by pasting a new one below')}>Rotate</Button></div>], ['Google Gemini', '-', <Status key="c" v="Pending" />, <Button key="z" size="sm" onClick={() => say('Paste a key below to add it')}>Add key</Button>]]} />
      </Panel>
      <Panel title="Add or rotate a key">
        <div className="grid max-w-xl gap-4">
          <Field label="Provider"><select className={selectCls}>{['OpenAI', 'Anthropic', 'Google Gemini', 'Azure OpenAI'].map((p) => <option key={p}>{p}</option>)}</select></Field>
          <Field label="Paste the new API key"><input className={inputCls} type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-..." /></Field>
          <div><Button onClick={() => { say('Key saved (sample only, nothing is stored)'); setKey('') }}>Save key</Button></div>
        </div>
      </Panel>
    </>
  )
}
export const Credentials = () => <Page title="AI Provider Credentials" sub="The model provider and key your agents run on"><CredsBody /></Page>

function AiConfigBody() {
  const say = useSay()
  return (
    <Panel title="Large Language Model" desc="LLM features stay unavailable until this tenant has a provider, a model and a matching credential.">
      <div className="grid max-w-2xl gap-4 md:grid-cols-2 [&>*]:min-w-0">
        <Field label="Provider"><select className={selectCls}>{['OpenAI', 'Anthropic', 'Google Gemini'].map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Model"><select className={selectCls}>{['gpt-5.5', 'claude-sonnet-5-5', 'gemini-2.5-flash'].map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Embedding model"><select className={selectCls}>{['Use platform default', 'text-embedding-3-large'].map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Fallback policy"><select className={selectCls}>{['Ask a person', 'Try the next provider', 'Stop the run'].map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Chunk size (tokens)"><input className={inputCls} defaultValue={512} /></Field>
        <Field label="Chunk overlap"><input className={inputCls} defaultValue={64} /></Field>
      </div>
      <div className="mt-4"><Button onClick={() => say('Saved (sample only)')}>Save configuration</Button></div>
    </Panel>
  )
}
export const AiConfig = () => <Page title="AI Configuration" sub="Which model your agents use, and how documents are indexed"><AiConfigBody /></Page>

/* Settings --------------------------------------------------------------------------------- */
function SettingsBody() {
  const say = useSay()
  const [demo, setDemo] = useState(false)
  return (
    <>
      <Panel title="Fleet governance limits" desc="Caps on how many agents can run">
        <div className="grid max-w-md gap-4 md:grid-cols-2"><Field label="Max active agents"><input className={inputCls} defaultValue={39} /></Field><Field label="Max shadow agents"><input className={inputCls} defaultValue={10} /></Field></div>
        <div className="mt-4 flex items-center gap-4"><Button onClick={() => say('Saved (sample only)')}>Save</Button><Checkbox checked={demo} onChange={setDemo} label="Seed demo data" /></div>
      </Panel>
      <Panel title="Compliance and data">
        <div className="grid max-w-md gap-4 md:grid-cols-2"><Field label="Data region"><select className={selectCls}>{['India (asia-south1)', 'EU (europe-west1)', 'US (us-central1)'].map((r) => <option key={r}>{r}</option>)}</select></Field><Field label="Audit retention (years)"><input className={inputCls} defaultValue={7} /></Field></div>
      </Panel>
      <Panel title="API keys" desc="Use a key with the Python SDK, TypeScript SDK, CLI or MCP server">
        <div className="mb-4 flex max-w-xl gap-2"><input className={inputCls} placeholder="e.g. Production SDK" aria-label="Key name" /><select className={`${selectCls} w-36`}>{['Never', '30 days', '90 days', '1 year'].map((r) => <option key={r}>{r}</option>)}</select><Button onClick={() => say('Key created on sample data. Real keys are shown once.')}>Create</Button></div>
        <Table cols={['Name', 'Key prefix', 'Status', 'Last used', 'Created', 'Actions']} rows={[['Production SDK', <Mono key="1">ao_sk_9f2c</Mono>, <Status key="a" v="Active" />, 'Today', '2 Oct', 'Revoke'], ['Claude MCP', <Mono key="2">ao_sk_41be</Mono>, <Status key="b" v="Active" />, 'Yesterday', '14 Oct', 'Revoke']]} />
      </Panel>
      <Panel title="Webhook configuration"><Table cols={['Provider', 'Inbound URL']} rows={[['SendGrid (Email events)', <Mono key="1">/api/v1/webhooks/email/sendgrid</Mono>], ['Mailchimp', <Mono key="2">/api/v1/webhooks/email/mailchimp</Mono>], ['MoEngage', <Mono key="3">/api/v1/webhooks/email/moengage</Mono>]]} /></Panel>
    </>
  )
}
export const Settings = () => <Page title="Settings" sub="Limits, data, API keys and webhooks"><SettingsBody /></Page>
