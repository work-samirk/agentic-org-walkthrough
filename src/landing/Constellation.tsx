import { useEffect, useMemo, useRef } from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { Player, type PlayerRef } from '@remotion/player'
import { ThreeCanvas } from '@remotion/three'
import * as THREE from 'three'
import { reduced } from './config'

// The AgenticOrg mark as a living network: nodes fly in and lock into the A, agents orbit it, work pulses along the lines.
const CORAL = '#ff7f63'
const SKY = '#6db1f5'
const VIOLET = '#8b9cf0'
const PAPER = '#f4f1ec'

type Hub = { p: [number, number, number]; c: string; r: number }
const HUBS: Hub[] = [
  { p: [0, 1.8, 0], c: PAPER, r: 0.17 },
  { p: [-0.47, 0.72, 0], c: PAPER, r: 0.09 },
  { p: [0.47, 0.72, 0], c: PAPER, r: 0.09 },
  { p: [-0.95, -0.35, 0], c: PAPER, r: 0.11 },
  { p: [0.95, -0.35, 0], c: PAPER, r: 0.11 },
  { p: [0, -0.35, 0], c: CORAL, r: 0.3 },
  { p: [-1.5, -1.6, 0], c: PAPER, r: 0.12 },
  { p: [1.5, -1.6, 0], c: PAPER, r: 0.12 },
]
const EDGES: [number, number][] = [[0, 1], [1, 3], [3, 6], [0, 2], [2, 4], [4, 7], [3, 5], [5, 4]]

function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

type Sat = { p: [number, number, number]; hub: number; c: string; r: number; speed: number }
const SATS: Sat[] = Array.from({ length: 44 }, (_, i) => {
  const a = rand(i + 1) * Math.PI * 2
  const rad = 2.3 + rand(i + 50) * 1.9
  const hub = Math.floor(rand(i + 90) * HUBS.length)
  return { p: [Math.cos(a) * rad, (rand(i + 20) - 0.5) * 4.6, Math.sin(a) * rad * 0.6], hub, c: [SKY, VIOLET, CORAL, PAPER][i % 4], r: 0.05 + rand(i + 7) * 0.05, speed: 0.4 + rand(i + 3) * 0.6 }
})

function halo() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,.45)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

const lerp3 = (a: number[], b: number[], t: number): [number, number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

function Scene({ light = false }: { light?: boolean }) {
  const f = useCurrentFrame()
  const { fps, width, height, durationInFrames } = useVideoConfig()
  const tex = useMemo(() => halo(), [])
  const paper = light ? '#1b1c24' : PAPER
  const col = (x: string) => (x === PAPER ? paper : x)
  const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending
  const halo_o = light ? 0.28 : 0.55
  const loop = (f / durationInFrames) * Math.PI * 2

  // every node: where it starts, where it settles
  const hubPos = HUBS.map((h, i) => {
    const s = [h.p[0] + (rand(i + 200) - 0.5) * 9, h.p[1] + (rand(i + 210) - 0.5) * 9, (rand(i + 220) - 0.5) * 6]
    const t = spring({ frame: f - i * 3, fps, config: { damping: 20, mass: 0.9 } })
    return { pos: lerp3(s, h.p, t), t }
  })
  const satPos = SATS.map((s, i) => {
    const t = spring({ frame: f - 30 - i * 1.4, fps, config: { damping: 22 } })
    const orbit = loop * s.speed
    const x = s.p[0] * Math.cos(orbit) - s.p[2] * Math.sin(orbit) * 0.4
    const z = s.p[2] * Math.cos(orbit) + s.p[0] * Math.sin(orbit) * 0.4
    const y = s.p[1] + Math.sin(loop * 2 + i) * 0.12
    const start = [s.p[0] * 3, s.p[1] * 3, s.p[2] * 3]
    return { pos: lerp3(start, [x, y, z], t), t }
  })

  const lineGeo = useMemo(() => new THREE.BufferGeometry(), [])
  const sats = new Float32Array(SATS.length * 6)
  SATS.forEach((s, i) => {
    const h = hubPos[s.hub].pos
    sats.set([...satPos[i].pos, ...h], i * 6)
  })
  lineGeo.setAttribute('position', new THREE.BufferAttribute(sats, 3))
  const hubLine = useMemo(() => new THREE.BufferGeometry(), [])
  const hl = new Float32Array(EDGES.length * 6)
  EDGES.forEach(([a, b], i) => hl.set([...hubPos[a].pos, ...hubPos[b].pos], i * 6))
  hubLine.setAttribute('position', new THREE.BufferAttribute(hl, 3))

  const drawn = interpolate(f, [40, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const sway = Math.sin(loop) * 0.38
  const tilt = Math.sin(loop * 2) * 0.06

  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0.2, 7.6], fov: 42 }} gl={{ alpha: true, antialias: true }}>
      <group rotation={[tilt, sway, 0]} position={[0, 0.1, 0]}>
        <lineSegments geometry={hubLine}><lineBasicMaterial color={paper} transparent opacity={0.85 * drawn} /></lineSegments>
        <lineSegments geometry={lineGeo}><lineBasicMaterial color={light ? '#6c7a96' : SKY} transparent opacity={(light ? 0.28 : 0.16) * drawn} /></lineSegments>

        {HUBS.map((h, i) => (
          <group key={i} position={hubPos[i].pos}>
            <mesh scale={hubPos[i].t}><sphereGeometry args={[h.r, 28, 28]} /><meshBasicMaterial color={col(h.c)} /></mesh>
            <sprite scale={[h.r * 7 * hubPos[i].t, h.r * 7 * hubPos[i].t, 1]}><spriteMaterial map={tex} color={col(h.c)} transparent opacity={halo_o} depthWrite={false} blending={blend} /></sprite>
          </group>
        ))}

        {SATS.map((s, i) => (
          <group key={i} position={satPos[i].pos}>
            <mesh scale={satPos[i].t}><sphereGeometry args={[s.r, 12, 12]} /><meshBasicMaterial color={col(s.c)} /></mesh>
            <sprite scale={[s.r * 8 * satPos[i].t, s.r * 8 * satPos[i].t, 1]}><spriteMaterial map={tex} color={col(s.c)} transparent opacity={light ? 0.25 : 0.5} depthWrite={false} blending={blend} /></sprite>
          </group>
        ))}

        {/* work travelling along the lines once the A has locked in */}
        {EDGES.map(([a, b], i) => {
          const k = (((f - 100 - i * 11) % 66) + 66) % 66
          if (f < 100) return null
          const t = k / 66
          const p = lerp3(hubPos[a].pos, hubPos[b].pos, t)
          return (
            <sprite key={i} position={p} scale={[0.5, 0.5, 1]}>
              <spriteMaterial map={tex} color={i % 2 ? CORAL : SKY} transparent opacity={Math.sin(t * Math.PI)} depthWrite={false} blending={blend} />
            </sprite>
          )
        })}
      </group>
    </ThreeCanvas>
  )
}

export default function Constellation({ className, light = true }: { className?: string; light?: boolean }) {
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
      <Player ref={ref} component={Scene} inputProps={{ light }} durationInFrames={360} compositionWidth={900} compositionHeight={900} fps={30} loop autoPlay={!reduced()} initialFrame={reduced() ? 150 : 0} style={{ width: '100%', aspectRatio: '1 / 1', background: 'transparent' }} acknowledgeRemotionLicense />
    </div>
  )
}
