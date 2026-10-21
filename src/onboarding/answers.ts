const KEY = 'ao-welcome'
export type Answers = Partial<Record<'role' | 'size' | 'source' | 'intent', string>>

export function loadAnswers(): Answers {
  try {
    const a: Answers = JSON.parse(sessionStorage.getItem(KEY) ?? '{}')
    const preset = sessionStorage.getItem('ao-preset-role')
    if (!a.role && preset) a.role = preset
    return a
  } catch {
    return {}
  }
}

export function saveAnswers(a: Answers) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a))
  } catch {
    /* ignore */
  }
}
