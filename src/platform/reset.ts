// The demo starts fresh on every login: the tour runs again from the first stop and the checklist is empty.
export const PLATFORM_KEY = 'ao-platform-v3'

export function resetDemoState() {
  try {
    sessionStorage.removeItem(PLATFORM_KEY)
  } catch {
    /* private mode: nothing was stored anyway */
  }
}
