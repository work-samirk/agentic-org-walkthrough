import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingV2 } from './landing/LandingV2'
import { Pricing } from './landing/Pricing'
import { SignIn } from './auth/SignIn'
import { CreateOrg } from './auth/CreateOrg'
import { JoinOrg } from './auth/JoinOrg'
import { Requested } from './auth/Requested'
import { Forgot } from './auth/Forgot'
import { Welcome } from './onboarding/Welcome'

// visual feedback toolbar for refining the UI with Claude; dev only, syncs to the agentation MCP server
const Agentation = import.meta.env.DEV ? lazy(() => import('agentation').then((m) => ({ default: m.Agentation }))) : null

const PlatformProvider = lazy(() => import('./platform/state').then((m) => ({ default: m.PlatformProvider })))
const Shell = lazy(() => import('./platform/Shell').then((m) => ({ default: m.Shell })))
const Dashboard = lazy(() => import('./platform/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Agents = lazy(() => import('./platform/pages/Agents').then((m) => ({ default: m.Agents })))
const AgentCreate = lazy(() => import('./platform/pages/AgentCreate').then((m) => ({ default: m.AgentCreate })))
const AgentDetail = lazy(() => import('./platform/pages/AgentDetail').then((m) => ({ default: m.AgentDetail })))
const Workflows = lazy(() => import('./platform/pages/Workflows').then((m) => ({ default: m.Workflows })))
const Connectors = lazy(() => import('./platform/pages/Connectors').then((m) => ({ default: m.Connectors })))
const Templates = lazy(() => import('./platform/pages/Templates').then((m) => ({ default: m.Templates })))
const Placeholder = lazy(() => import('./platform/pages/Placeholder').then((m) => ({ default: m.Placeholder })))
const Approvals = lazy(() => import('./platform/pages/Approvals').then((m) => ({ default: m.Approvals })))
const WorkflowRun = lazy(() => import('./platform/pages/WorkflowRun').then((m) => ({ default: m.WorkflowRun })))
const WorkflowView = lazy(() => import('./platform/pages/WorkflowView').then((m) => ({ default: m.WorkflowView })))

export default function App() {
  return (
    <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<LandingV2 />} />
      <Route path="/v2" element={<Navigate to="/" replace />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<CreateOrg />} />
      <Route path="/join" element={<JoinOrg />} />
      <Route path="/join/requested" element={<Requested />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/welcome" element={<Navigate to="/welcome/1" replace />} />
      <Route path="/welcome/:step" element={<Welcome />} />
      <Route path="/home" element={<Navigate to="/app" replace />} />
      <Route path="/app" element={<PlatformProvider><Shell /></PlatformProvider>}>
        <Route index element={<Dashboard />} />
        <Route path="agents" element={<Agents />} />
        <Route path="agents/new" element={<AgentCreate />} />
        <Route path="agents/:id" element={<AgentDetail />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="workflows/:id" element={<WorkflowView />} />
        <Route path="workflows/:id/runs/:run" element={<WorkflowRun />} />
        <Route path="connectors" element={<Connectors />} />
        <Route path="templates" element={<Templates />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="p/:slug" element={<Placeholder />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    {Agentation && window.self === window.top && <Agentation endpoint="http://localhost:4747" />}
    </Suspense>
  )
}
