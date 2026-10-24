import type { IconName } from '../components/Icon'

export type Option = { id: string; label: string; icon?: IconName }
export type Question = {
  key: 'role' | 'size' | 'source' | 'intent'
  title: string
  why: string
  cols: number
  options: Option[]
}

// The welcome questions from the onboarding PRD (6.3.3). The fourth question (what to do first) was removed on 23 Oct 2026: every new user now gets the same tour. Organisation type and industry were dropped on 21 Oct 2026. Every one can be skipped.
export const QUESTIONS: Question[] = [
  {
    key: 'role',
    title: 'What best describes your role?',
    why: 'So the examples we show match your work.',
    cols: 4,
    options: [
      { id: 'founder', label: 'Founder', icon: 'spark' },
      { id: 'eng', label: 'Engineering', icon: 'code' },
      { id: 'product', label: 'Product and design', icon: 'layers' },
      { id: 'finance', label: 'Finance and compliance', icon: 'landmark' },
      { id: 'ops', label: 'Operations and support', icon: 'headset' },
      { id: 'sales', label: 'Sales and marketing', icon: 'send' },
      { id: 'hr', label: 'HR', icon: 'users' },
      { id: 'other', label: 'Other', icon: 'dots' },
    ],
  },
  {
    key: 'size',
    title: 'How big is your organisation?',
    why: 'Bigger teams see approval and access settings first.',
    cols: 3,
    options: [
      { id: '1', label: 'Just me' },
      { id: '2-10', label: '2 to 10 people' },
      { id: '11-50', label: '11 to 50 people' },
      { id: '51-200', label: '51 to 200 people' },
      { id: '201-1000', label: '201 to 1,000 people' },
      { id: '1000+', label: 'More than 1,000 people' },
    ],
  },
  {
    key: 'source',
    title: 'How did you hear about us?',
    why: 'It helps us see which events and channels are worth it.',
    cols: 4,
    options: [
      { id: 'search', label: 'Search', icon: 'search' },
      { id: 'social', label: 'Social media', icon: 'chat' },
      { id: 'friend', label: 'A friend or colleague', icon: 'users' },
      { id: 'event', label: 'An event', icon: 'calendar' },
      { id: 'pine', label: 'Pine Labs', icon: 'building' },
      { id: 'newsletter', label: 'A newsletter or blog', icon: 'mail' },
      { id: 'video', label: 'A video or podcast', icon: 'play' },
      { id: 'other', label: 'Other', icon: 'dots' },
    ],
  },
]
