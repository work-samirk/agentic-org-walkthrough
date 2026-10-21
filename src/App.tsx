import { Navigate, Route, Routes } from 'react-router-dom'
import { SignIn } from './auth/SignIn'
import { CreateOrg } from './auth/CreateOrg'
import { JoinOrg } from './auth/JoinOrg'
import { Requested } from './auth/Requested'
import { Forgot } from './auth/Forgot'
import { Welcome } from './onboarding/Welcome'
import { PlatformProvider } from './platform/state'
import { Shell } from './platform/Shell'
import { Dashboard } from './platform/pages/Dashboard'
import { Agents } from './platform/pages/Agents'
import { AgentCreate } from './platform/pages/AgentCreate'
import { AgentDetail } from './platform/pages/AgentDetail'
import { Workflows } from './platform/pages/Workflows'
import { Connectors } from './platform/pages/Connectors'
import { Templates } from './platform/pages/Templates'
import { Placeholder } from './platform/pages/Placeholder'
import { Approvals } from './platform/pages/Approvals'
import { WorkflowRun } from './platform/pages/WorkflowRun'
import { WorkflowView } from './platform/pages/WorkflowView'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
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
  )
}
