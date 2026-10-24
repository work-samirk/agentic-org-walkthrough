import type { ReactElement } from 'react'
import { CEO, CFO, CMO, CHRO, COO, CBO, ABM, OrgChart, Observatory, SLA } from './dashboards'
import { IndustryPacks, KnowledgeBase, MySchedules, PromptTemplates, ReportSchedules, RpaSchedules, RpaScripts, Schemas, SOP, Voice } from './lists'
import { AuditLog, EnforceAudit, Scope } from './govern'
import { A2A, AiConfig, Billing, Credentials, Settings, Users } from './settings'

// every sidebar page the walkthrough does not build in full, keyed by its route slug
export const SCREENS: Record<string, () => ReactElement> = {
  'ceo-dashboard': CEO,
  'finance-dashboard': CFO,
  'marketing-dashboard': CMO,
  'chro-dashboard': CHRO,
  'coo-dashboard': COO,
  'cbo-dashboard': CBO,
  abm: ABM,
  'org-chart': OrgChart,
  'prompt-templates': PromptTemplates,
  'create-from-sop': SOP,
  'report-schedules': ReportSchedules,
  'my-schedules': MySchedules,
  voice: Voice,
  'rpa-scripts': RpaScripts,
  'rpa-schedules': RpaSchedules,
  'a2a-mcp': A2A,
  schemas: Schemas,
  'knowledge-base': KnowledgeBase,
  'industry-packs': IndustryPacks,
  observatory: Observatory,
  'scope-dashboard': Scope,
  'enforce-audit': EnforceAudit,
  'audit-log': AuditLog,
  'sla-monitor': SLA,
  billing: Billing,
  'user-management': Users,
  'ai-credentials': Credentials,
  'ai-configuration': AiConfig,
  settings: Settings,
}
