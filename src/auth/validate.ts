export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
export const passwordOk = (v: string) => v.length >= 8 && /[A-Z]/.test(v) && /[0-9]|[^A-Za-z0-9]/.test(v)
