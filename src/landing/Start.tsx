import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, GoogleMark, MicrosoftMark } from '../components/Icon'
import { Wordmark } from '../components/Logo'
import { FREE_LINE, presetRole } from './config'

const TOOLS = ['Gmail', 'Slack', 'Stripe', 'Zoho Books', 'Jira', 'HubSpot', 'Tally', 'Darwinbox']
const FAQ = [
  ['What can I build?', 'Any job you can describe in plain English. Examples are chasing unpaid invoices, qualifying leads, triaging support tickets, keeping a repository tidy and handling an inbox.'],
  ['Where can my agent run?', 'In the AgenticOrg dashboard, on Telegram, or inside your own app through the SDKs and the API.'],
  ['Can I sell an agent I build?', 'Yes. You can offer an agent to your own customers. Ask us for the details of how that works for your program.'],
  ['How is this different from building with LangGraph or another framework?', 'A framework gives you the parts. AgenticOrg also runs the agent, tests it in Shadow Mode, holds risky actions for approval and keeps an audit trail, so you do not have to build those yourself.'],
  ['What if the agent gets it wrong?', 'It starts in Shadow Mode, so mistakes happen on sample data. After that it asks a person when its confidence is below the floor you set, and you can roll it back or stop it.'],
  ['Is it free?', 'It is free to start and needs no credit card. You can try the whole first-agent walkthrough on sample data.'],
]

export function ToolsStrip() {
  return (
    <div className="lp-strip" aria-label="Works with the tools you already use">
      <p>Works with the tools you already use</p>
      <div className="lp-strip-track" aria-hidden="true">{[...TOOLS, ...TOOLS, ...TOOLS].map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  )
}

export function Proof() {
  return (
    <section id="proof" className="lp-sec" aria-labelledby="lp-h-proof">
      <div className="lp-wrap lp-split">
        <div className="lp-copy">
          <h2 id="lp-h-proof">Connect the tools you already use.</h2>
          <p className="lp-lead">Agents use connectors with permissions you set, in the cloud or in your own VPC.</p>
          <ul className="lp-tools">{TOOLS.map((t) => <li key={t}>{t}</li>)}<li className="more">and more</li></ul>
        </div>
        <div className="lp-audit" role="img" aria-label="A sample audit trail">
          <p className="lp-audit-h"><b>Audit trail</b></p>
          <ol>
            <li><time>09:02</time><span><b>Anika</b> read yesterday's sales file</span></li>
            <li><time>09:02</time><span><b>Anika</b> drafted the summary, 93% sure</span></li>
            <li className="you"><time>09:04</time><span><b>You</b> approved sending it</span></li>
            <li><time>09:04</time><span><b>System</b> sent to 2 people and logged it</span></li>
          </ol>
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="lp-sec lp-soft" aria-labelledby="lp-h-faq">
      <div className="lp-wrap lp-faqw">
        <div className="lp-head"><h2 id="lp-h-faq">Things people ask first.</h2></div>
        <div className="lp-faq">
          {FAQ.map(([q, a], i) => (
            <details key={q} open={open === i}><summary onClick={(e) => { e.preventDefault(); setOpen(open === i ? -1 : i) }}>{q}<Icon name="dots" size={18} /></summary><p>{a}</p></details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function StartBlock() {
  return (
    <section id="start" className="lp-sec lp-final ao-field" aria-labelledby="lp-h-start">
      <div className="lp-wrap lp-final-in">
        <h2 id="lp-h-start">Start free. Keep the final say.</h2>
        <div className="lp-sso c">
          <Link to="/signup" className="lp-btn ink big"><GoogleMark size={18} />Continue With Google</Link>
          <Link to="/signup" className="lp-btn line big"><MicrosoftMark size={18} />Continue With Microsoft</Link>
          <Link to="/signup" className="lp-link">or use email</Link>
        </div>
        <p className="lp-fine c">{FREE_LINE}</p>
        <p className="lp-two"><Link to="/app" onClick={() => presetRole('founder')}>Explore the live demo</Link></p>
      </div>
    </section>
  )
}

const pickHead = (id: string) => () => window.dispatchEvent(new CustomEvent('ao-head', { detail: id }))
const COLS: { h: string; items: { l: string; href: string; ext?: boolean; head?: string }[] }[] = [
  { h: 'Platform', items: [{ l: 'Dashboard', href: '/app' }, { l: 'Agents', href: '/app/agents' }, { l: 'Workflows', href: '/app/workflows' }, { l: 'Connectors', href: '/app/connectors' }, { l: 'Observatory', href: '/app' }] },
  { h: 'Solutions', items: [{ l: 'For CFOs', href: '/#heads', head: 'CFO' }, { l: 'For CHROs', href: '/#heads', head: 'CHRO' }, { l: 'For CMOs', href: '/#heads', head: 'CMO' }, { l: 'For COOs', href: '/#heads', head: 'COO' }] },
  { h: 'Resources', items: [{ l: 'How It Works', href: '/#steps' }, { l: 'Pricing', href: '/pricing' }, { l: 'ROI Calculator', href: '/#roi' }, { l: 'Live Demo', href: '/#live' }, { l: 'Blog', href: '#' }, { l: 'GitHub', href: 'https://github.com/mishrasanjeev/agentic-org', ext: true }] },
  { h: 'Developers', items: [{ l: 'SDKs & APIs', href: '/#developers' }, { l: 'Python SDK (PyPI)', href: 'https://pypi.org/project/agenticorg/', ext: true }, { l: 'TypeScript SDK (npm)', href: 'https://www.npmjs.com/package/agenticorg-sdk', ext: true }, { l: 'MCP Server', href: 'https://www.npmjs.com/package/agenticorg-mcp-server', ext: true }, { l: 'API Keys', href: '/signup' }] },
]

export function Footer() {
  return (
    <footer className="lp-foot lp-dark ft">
      <div className="lp-wrap">
        <div className="ft-grid">
          <div className="ft-brand">
            <Wordmark />
            <p>Enterprise AI Agent Platform.<br />Deploy. Automate. Govern.</p>
          </div>
          {COLS.map((c) => (
            <nav key={c.h} aria-label={c.h}>
              <h4>{c.h}</h4>
              <ul>
                {c.items.map((i) => (
                  <li key={i.l}>
                    {i.ext ? <a href={i.href} target="_blank" rel="noopener noreferrer">{i.l}</a> : i.href.startsWith('/app') || i.href === '/pricing' || i.href === '/signup' ? <Link to={i.href}>{i.l}</Link> : <a href={i.href} onClick={i.head ? pickHead(i.head) : undefined}>{i.l}</a>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Company">
            <h4>Company</h4>
            <ul>
              <li><a href="mailto:sanjeev@agenticorg.ai">Contact</a></li>
              <li><span>AgenticOrg</span></li>
              <li><span>Bengaluru, India</span></li>
            </ul>
          </nav>
        </div>
        <div className="ft-base">
          <p>© 2026 AgenticOrg. All rights reserved.</p>
          <div><a href="#">Privacy</a><a href="#">Terms</a><span>agenticorg.ai</span></div>
        </div>
      </div>
    </footer>
  )
}
