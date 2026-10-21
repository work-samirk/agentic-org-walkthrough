const KEY = 'ao-welcome'
export type Answers = Partial<Record<'role' | 'size' | 'source' | 'intent', string>>

export function loadAnswers(): Answers {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}')
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
