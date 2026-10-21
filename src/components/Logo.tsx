export function LogoMark({ size = 32, calm = false }: { size?: number; calm?: boolean }) {
  const line = calm ? 3.5 : 5
  const ring = calm ? 2.5 : 3.5
  const k = calm ? 0.9 : 1
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={line} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 54 32 10 52 54" />
        <path d="M19.5 38h25" />
      </g>
      <g stroke="currentColor" strokeWidth={ring}>
        <circle cx="32" cy="38" r={8 * k} fill="var(--ao-coral)" />
      </g>
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <LogoMark size={30} />
      <span>AgenticOrg</span>
    </span>
  )
}
