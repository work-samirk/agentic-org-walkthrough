import { useNavigate, useParams } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { NAV_LABELS } from '../data'
import { EmptyState } from '../ui/EmptyState'

export function Placeholder() {
  const { slug = '' } = useParams()
  const nav = useNavigate()
  const title = NAV_LABELS[slug] ?? slug.replace(/-/g, ' ')
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" data-tour="page-title">{title}</h2>
      <EmptyState
        illustration="general"
        title="This page is not part of the walkthrough"
        description="The walkthrough covers Dashboard, Agents, Workflows, Connectors and Agent Templates."
        action={{ label: 'Back to Dashboard', onClick: () => nav('/app'), icon: LayoutDashboard }}
      />
    </div>
  )
}
