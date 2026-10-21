import type { IconName } from '../components/Icon'

export type StageInfo = { key: string; label: string; title: string; line: string; icon: IconName; color: string }

// The ladder: connect, create, run safely, learn, approve. Colour roles follow the system:
// sky = agent working, lime = safe / done, coral = needs a person.
export const STAGES: StageInfo[] = [
  { key: 'connect', label: 'Connect', title: 'Connect your tools', line: 'Gmail, your bank and Zoho plug in once.', icon: 'plug', color: '#4C9BF0' },
  { key: 'create', label: 'Create', title: 'Describe an agent', line: 'Say the job in plain words. It builds the steps.', icon: 'spark', color: '#4C9BF0' },
  { key: 'shadow', label: 'Shadow', title: 'Run it in Shadow Mode', line: 'It works on sample data. Nothing real is touched.', icon: 'shield', color: '#C8E85A' },
  { key: 'learn', label: 'Learn', title: 'It learns from your fixes', line: 'Each correction makes the next run better.', icon: 'loop', color: '#4C9BF0' },
  { key: 'approve', label: 'Approve', title: 'You approve, then it goes live', line: 'A person signs off before anything reaches the real world.', icon: 'users', color: '#F26B4E' },
]
