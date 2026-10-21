import type { SVGProps } from 'react'

// Own icon set: rounded line icons, 1.8 stroke, 24 grid. Closed shapes take a soft coral fill.
const paths = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  eye: (
    <>
      <path className="fill" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M2 12s3.5-7 10-7c2 0 3.70.6 5.10 1.40M22 12s-3.50 7-10 7c-2 0-3.70-.6-5.10-1.40" />
      <path d="M4 4l16 16" />
    </>
  ),
  mail: (
    <>
      <rect className="fill" x="3" y="5" width="18" height="14" rx="4" />
      <path d="M4 8l8 5.50L20 8" />
    </>
  ),
  lock: (
    <>
      <rect className="fill" x="5" y="11" width="14" height="10" rx="3.50" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  building: (
    <>
      <rect className="fill" x="4" y="3" width="16" height="18" rx="3.50" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4" />
    </>
  ),
  users: (
    <>
      <circle className="fill" cx="9" cy="8" r="3.20" />
      <path d="M3 20c0-3.30 2.70-6 6-6s6 2.70 6 6" />
      <circle cx="17" cy="9" r="2.30" />
      <path d="M17.50 14c2.30.3 4 2.20 4 5" />
    </>
  ),
  check: <path d="M5 12.50l4.50 4.50L19 7" />,
  alert: (
    <>
      <circle className="fill" cx="12" cy="12" r="9" />
      <path d="M12 7.50v5M12 16.50h.01" />
    </>
  ),
  shield: (
    <>
      <path className="fill" d="M12 3l7.50 3v5.50c0 4.50-3 8-7.50 9.50-4.50-1.50-7.50-5-7.50-9.50V6z" />
      <path d="M8.50 12l2.50 2.50 4.50-5" />
    </>
  ),
  clock: (
    <>
      <circle className="fill" cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  send: (
    <>
      <path className="fill" d="M21 3L3 10.50l7 2.50 2.50 7z" />
      <path d="M10 13l11-10" />
    </>
  ),
  plug: (
    <>
      <path className="fill" d="M6 8h12v3a6 6 0 0 1-12 0z" />
      <path d="M9 3v5M15 3v5M12 17v4" />
    </>
  ),
  spark: <path className="fill" d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  loop: <path d="M4 12a8 8 0 0 1 13.700-5.600L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.700 5.600L4 16M4 20v-4h4" />,
  code: <path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />,
  layers: (
    <>
      <path className="fill" d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  landmark: (
    <>
      <path className="fill" d="M3 10l9-6 9 6z" />
      <path d="M5 10v8M9.500 10v8M14.500 10v8M19 10v8M3 20h18" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect className="fill" x="3" y="14" width="4" height="6" rx="2" />
      <rect className="fill" x="17" y="14" width="4" height="6" rx="2" />
    </>
  ),
  briefcase: (
    <>
      <rect className="fill" x="3" y="7" width="18" height="13" rx="3.500" />
      <path d="M9 7V5.500A1.500 1.500 0 0 1 10.500 4h3A1.500 1.500 0 0 1 15 5.500V7M3 13h18" />
    </>
  ),
  dots: (
    <>
      <circle cx="6" cy="12" r="1.500" />
      <circle cx="12" cy="12" r="1.500" />
      <circle cx="18" cy="12" r="1.500" />
    </>
  ),
  search: (
    <>
      <circle className="fill" cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  chat: <path className="fill" d="M4 5h16v11H9l-5 4z" />,
  calendar: (
    <>
      <rect className="fill" x="3" y="5" width="18" height="16" rx="3.500" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  play: (
    <>
      <circle className="fill" cx="12" cy="12" r="9" />
      <path d="M10 8.500v7l6-3.500z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.50v2M12 19.50v2M2.50 12h2M19.50 12h2M5.30 5.30l1.40 1.40M17.30 17.30l1.40 1.40M5.30 18.70l1.40-1.40M17.30 6.70l1.40-1.40" />
    </>
  ),
  moon: <path d="M20 14.50A8 8 0 1 1 9.50 4 6.50 6.50 0 0 0 20 14.50z" />,
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}

export function GoogleMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.50c3.54 0 6.71 1.22 9.21 3.60l6.85-6.85C35.90 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.50 24 9.50z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.30-8.16 2.30-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export function MicrosoftMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  )
}
