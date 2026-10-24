import { useId } from 'react'

const MARK_W = 124
const MARK_H = 76

export function LogoMark({ size = 32, gradient = false }: { size?: number; gradient?: boolean }) {
  const h = size * 0.8
  const id = useId()
  return (
    <svg className="logo-mark" width={(h * MARK_W) / MARK_H} height={h} viewBox="37.5 34.5 124 76" fill={gradient ? `url(#${id})` : 'currentColor'} aria-hidden="true">
      {gradient && (
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="37.5" y1="34.5" x2="161.5" y2="110.5">
            <stop offset="0" stopColor="#005656" />
            <stop offset="1" stopColor="#36cc8b" />
          </linearGradient>
        </defs>
      )}
      <path d="M159.004 57.6901L145.513 39.6384C143.399 36.8093 140.074 35.1433 136.542 35.1433L100.031 35.1433C98.5912 35.1433 97.7341 36.7495 98.5355 37.9454L123.189 74.7305C128.236 82.2618 125.925 92.4868 118.128 97.1141L101.672 106.881C100.273 107.711 100.862 109.857 102.488 109.857L135.697 109.857C139.615 109.857 143.156 107.524 144.702 103.924L160.206 67.8212C161.645 64.472 161.187 60.6098 159.004 57.6901Z" />
      <path d="M113.478 76.8985L86.035 39.3269C84.1145 36.6977 81.0542 35.1433 77.7983 35.1433L40.6623 35.1433C39.263 35.1433 38.3988 36.6698 39.1189 37.8695L56.4708 66.7816C57.9708 69.2809 58.0312 72.3886 56.6296 74.9443L38.9445 107.191C38.2867 108.391 39.1547 109.857 40.5228 109.857L77.5386 109.857C77.8503 109.857 78.1566 109.776 78.4277 109.622L110.343 91.4919C115.537 88.5408 117.002 81.723 113.478 76.8985Z" />
    </svg>
  )
}

export function Wordmark({ gradient = false }: { gradient?: boolean }) {
  return (
    <span className="wordmark">
      <LogoMark size={30} gradient={gradient} />
      <span>AgenticOrg</span>
    </span>
  )
}
