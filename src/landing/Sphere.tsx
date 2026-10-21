import { useEffect, useMemo, useRef } from 'react'
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { Player, type PlayerRef } from '@remotion/player'
import { ThreeCanvas } from '@remotion/three'
import * as THREE from 'three'
import { reduced } from './config'

// A governed sphere: a globe of agents with three rings, one per gate, and a pulse travelling each ring.
const CORAL = '#ff7f63'
const SKY = '#6db1f5'
const VIOLET = '#8b6ef0'

function glow() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.3, 'rgba(255,255,255,.4)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

const N = 190
const POINTS = Array.from({ length: N }, (_, i) => {
  const y = 1 - (i / (N - 1)) * 2
  const r = Math.sqrt(1 - y * y)
  const th = Math.PI * (3 - Math.sqrt(5)) * i
  return [Math.cos(th) * r * 2, y * 2, Math.sin(th) * r * 2] as [number, number, number]
})

const RINGS = [
  { rx: 2.9, rz: 2.9, tilt: 0.5, c: CORAL, d: '#e0553a', label: 'confidence_check()' },
  { rx: 3.25, rz: 3.25, tilt: -0.75, c: SKY, d: '#2f6fd0', label: 'human_approval()' },
  { rx: 3.6, rz: 3.6, tilt: 1.2, c: VIOLET, d: '#6a4fe0', label: 'audit_trail.log()' },
]

function labelTex(text: string, color: string) {
  const c = document.createElement('canvas')
  c.width = 640
  c.height = 150
  const g = c.getContext('2d')!
  g.fillStyle = 'rgba(5,6,9,.94)'
  g.strokeStyle = 'rgba(255,255,255,.16)'
  g.lineWidth = 3
  g.beginPath()
  g.roundRect(6, 8, 628, 134, 22)
  g.fill()
  g.stroke()
  ;[0, 1, 2].forEach((i) => {
    g.fillStyle = i === 0 ? color : 'rgba(255,255,255,.2)'
    g.beginPath()
    g.arc(36 + i * 24, 38, 8, 0, Math.PI * 2)
    g.fill()
  })
  g.font = '500 50px "JetBrains Mono", ui-monospace, monospace'
  g.textBaseline = 'middle'
  g.fillStyle = color
  g.fillText('$', 30, 96)
  g.fillStyle = '#f4f1ec'
  g.fillText(text, 76, 96)
  return new THREE.CanvasTexture(c)
}

function Scene({ light = true, labels = false }: { light?: boolean; labels?: boolean }) {
  const f = useCurrentFrame()
  const { width, height, durationInFrames } = useVideoConfig()
  const tex = useMemo(() => glow(), [])
  const tags = useMemo(() => RINGS.map((r) => labelTex(r.label, r.d)), [])
  const t = (f / durationInFrames) * Math.PI * 2
  const intro = interpolate(f, [0, 40], [0, 1], { extrapolateRight: 'clamp' })
  const ink = light ? '#1b1c24' : '#f4f1ec'
  const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 10.5], fov: 40 }} gl={{ alpha: true, antialias: true }}>
      <group rotation={[0.35, t, 0]} scale={0.9 + intro * 0.1}>
        {POINTS.map((p, i) => {
          const hot = i % 9 === 0
          const pulse = 0.5 + 0.5 * Math.sin(t * 3 + i)
          const c = hot ? (i % 18 === 0 ? CORAL : SKY) : ink
          const s = hot ? 0.07 + pulse * 0.05 : 0.04
          return (
            <group key={i} position={p}>
              <mesh scale={intro}><sphereGeometry args={[s, 10, 10]} /><meshBasicMaterial color={c} transparent opacity={hot ? 1 : light ? 0.45 : 0.6} /></mesh>
              {hot && <sprite scale={[s * 9 * intro, s * 9 * intro, 1]}><spriteMaterial map={tex} color={c} transparent opacity={light ? 0.35 : 0.6} depthWrite={false} blending={blend} /></sprite>}
            </group>
          )
        })}
        <mesh><sphereGeometry args={[1.96, 48, 48]} /><meshBasicMaterial color={light ? '#dfe7fb' : '#1c2540'} transparent opacity={light ? 0.35 : 0.5} /></mesh>
      </group>
      {RINGS.map((r, i) => {
        const a = t * (1 + i * 0.5) + i * 2
        const x = Math.cos(a) * r.rx
        const z = Math.sin(a) * r.rz
        return (
          <group key={i} rotation={[0.2, t * 0.3 * (i % 2 ? -1 : 1), 0]}>
            <group position={[x, z * Math.sin(r.tilt), z * Math.cos(r.tilt)]}>
              <mesh><sphereGeometry args={[0.16, 16, 16]} /><meshBasicMaterial color={light ? r.d : r.c} /></mesh>
              {labels && <sprite scale={[0.3, 0.07, 1]} position={[0, 0.9, 0.3]}><spriteMaterial map={tags[i]} transparent depthTest={false} sizeAttenuation={false} /></sprite>}
              <sprite scale={[1.1, 1.1, 1]}><spriteMaterial map={tex} color={r.c} transparent opacity={light ? 0.5 : 0.8} depthWrite={false} blending={blend} /></sprite>
            </group>
          </group>
        )
      })}
    </ThreeCanvas>
  )
}

export default function Sphere({ className, light = true, labels = false }: { className?: string; light?: boolean; labels?: boolean }) {
  const ref = useRef<PlayerRef>(null)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!box.current) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? ref.current?.play() : ref.current?.pause()), { threshold: 0.05 })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={box} className={className} aria-hidden="true">
      <Player ref={ref} component={Scene} inputProps={{ light, labels }} durationInFrames={300} compositionWidth={900} compositionHeight={900} fps={30} loop autoPlay={!reduced()} initialFrame={reduced() ? 60 : 0} style={{ width: '100%', aspectRatio: '1 / 1', background: 'transparent' }} acknowledgeRemotionLicense />
    </div>
  )
}
