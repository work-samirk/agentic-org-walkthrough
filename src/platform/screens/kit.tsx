import { createContext, useContext, type ReactNode } from 'react'
import { Badge, Card, CardContent, CardHeader, CardTitle, Toast, useToast } from '../ui/primitives'

// Small building blocks shared by the walkthrough screens that mirror the real AgenticOrg pages.
const SayCtx = createContext<(m: string) => void>(() => {})
export const useSay = () => useContext(SayCtx)

export function Page({ title, sub, actions, children }: { title: string; sub?: string; actions?: ReactNode; children: ReactNode }) {
  const { msg, say } = useToast()
  return (
    <SayCtx.Provider value={say}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold" data-tour="page-title">{title}</h2>
            {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
        {children}
        <Toast msg={msg} />
      </div>
    </SayCtx.Provider>
  )
}

export function Stats({ items }: { items: [string, string, string?][] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
      {items.map(([label, value, hint]) => (
        <Card key={label}>
          <CardContent className="p-5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function Panel({ title, desc, action, children }: { title?: string; desc?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card>
      {title && (
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {desc && <p className="mt-1 text-xs text-muted-foreground">{desc}</p>}
          </div>
          {action}
        </CardHeader>
      )}
      <CardContent className={title ? '' : 'pt-6'}>{children}</CardContent>
    </Card>
  )
}

export function Table({ cols, rows }: { cols: string[]; rows: ReactNode[][] }) {
  return (
    <div className="-mx-2 overflow-x-auto px-2">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
            {cols.map((c) => <th key={c} className="pr-4 pb-2 font-semibold">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0">
              {r.map((cell, j) => <td key={j} className={`py-2.5 pr-4 ${j === 0 ? 'font-medium' : ''}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: [T, string][]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-1 shadow-sm">
      {tabs.map(([id, label]) => (
        <button key={id} type="button" onClick={() => onChange(id)} className={`flex-shrink-0 cursor-pointer rounded-lg px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 ${value === id ? 'border border-border/80 bg-card font-bold text-foreground shadow-sm' : 'border border-transparent text-muted-foreground hover:text-foreground'}`}>{label}</button>
      ))}
    </div>
  )
}

export const inputCls = 'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground'
export const selectCls = 'h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-sm text-foreground'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

export const Status = ({ v }: { v: string }) => {
  const ok = ['Active', 'Healthy', 'Allowed', 'Success', 'Configured', 'Ready', 'Installed', 'Completed', 'Online', 'Granted', 'Up']
  const warn = ['Paused', 'Shadow', 'Pending', 'Running', 'Review', 'Degraded']
  const bad = ['Failed', 'Denied', 'Error', 'Down', 'Cancelled']
  return <Badge variant={ok.includes(v) ? 'success' : warn.includes(v) ? 'warning' : bad.includes(v) ? 'destructive' : 'secondary'}>{v}</Badge>
}

export const Mono = ({ children }: { children: ReactNode }) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{children}</code>

export function Bar({ label, value, max, text }: { label: string; value: number; max: number; text?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs"><span>{label}</span><span className="text-muted-foreground">{text ?? value}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((value / max) * 100)}%` }} /></div>
    </div>
  )
}
