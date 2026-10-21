import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { Dialog } from './Dialog'
import { STAGES } from './stages'

const R = 1.7

// Where each stage's region sits on the globe (object space) and where its dialog sits on the panel.
const FOCUS = [
  new THREE.Vector3(-0.8, 0.45, 0.6),
  new THREE.Vector3(0.0, 0.8, 0.6),
  new THREE.Vector3(0.7, 0.1, 0.7),
  new THREE.Vector3(0.5, -0.7, 0.5),
  new THREE.Vector3(-0.4, -0.2, 0.9),
].map((v) => v.normalize())

// x: 0 = hard left, 1 = hard right (card stays inside the panel). y: percent from top.
const CARD_POS = [
  { x: 0.14, y: 22 },
  { x: 0.86, y: 34 },
  { x: 0.14, y: 58 },
  { x: 0.86, y: 64 },
  { x: 0.5, y: 14 },
]

const N = 560

function fib(n: number) {
  const pts: THREE.Vector3[] = []
  const g = Math.PI * (3 - Math.sqrt(5))
  for (let k = 0; k < n; k++) {
    const y = 1 - (k / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = g * k
    pts.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r))
  }
  return pts
}

export function StageSphere({ i }: { i: number }) {
  const host = useRef<HTMLDivElement>(null)
  const stageRef = useRef(i)

  useEffect(() => {
    stageRef.current = i
  }, [i])

  useEffect(() => {
    const el = host.current!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    el.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-hidden', 'true')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50)
    camera.position.z = 8.6
    scene.add(new THREE.AmbientLight(0xffffff, 1.15))
    const key = new THREE.DirectionalLight(0xffffff, 2.1)
    key.position.set(3, 4, 5)
    scene.add(key)

    const globe = new THREE.Group()
    scene.add(globe)

    // a globe of flat connector blocks, each with one knob like a puzzle piece
    const dirs = fib(N)
    const tile = new RoundedBoxGeometry(1, 1, 0.34, 2, 0.12)
    const knob = new THREE.SphereGeometry(0.2, 12, 10)
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.05 })
    const tiles = new THREE.InstancedMesh(tile, mat, N)
    const knobs = new THREE.InstancedMesh(knob, mat, N)
    const size = R * 0.118
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 0, 1)
    const accent = [new THREE.Color('#F26B4E'), new THREE.Color('#4C9BF0'), new THREE.Color('#C8E85A')]
    const baseTint: number[] = []
    const kind: number[] = []
    for (let k = 0; k < N; k++) {
      const d = dirs[k]
      q.setFromUnitVectors(up, d)
      const spin = new THREE.Quaternion().setFromAxisAngle(d, Math.floor(Math.random() * 4) * (Math.PI / 2) + (Math.random() - 0.5) * 0.12)
      q.premultiply(spin)
      const s = size * (0.94 + Math.random() * 0.1)
      m.compose(d.clone().multiplyScalar(R), q, new THREE.Vector3(s, s, s))
      tiles.setMatrixAt(k, m)
      knobs.setMatrixAt(k, m.clone().multiply(new THREE.Matrix4().makeTranslation(0.5, 0, 0.08)))
      kind.push(Math.random() < 0.2 ? 1 + Math.floor(Math.random() * 3) : 0)
      baseTint.push(0.9 + Math.random() * 0.1)
    }
    globe.add(tiles, knobs)

    const target = new THREE.Quaternion()
    const tmpColor = new THREE.Color()
    const baseLight = new THREE.Color('#FFFFFF')
    const baseDark = new THREE.Color('#3A3A44')
    const base = new THREE.Color()
    const cur = new THREE.Color(STAGES[0].color)
    const c = new THREE.Color()
    let raf = 0
    let lastMode = ''

    function resize() {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    function frame(now: number) {
      const idx = stageRef.current
      const focus = FOCUS[idx]
      const mode = document.documentElement.dataset.mode ?? 'light'
      if (mode !== lastMode) {
        lastMode = mode
        base.copy(mode === 'dark' ? baseDark : baseLight)
      }
      cur.lerp(tmpColor.set(STAGES[idx].color), 0.08)

      // turn the active region to the front, with a slow sway
      target.setFromUnitVectors(focus, new THREE.Vector3(0, 0, 1))
      const sway = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(now / 2600) * 0.08, Math.sin(now / 3100) * 0.14, 0))
      globe.quaternion.slerp(target.clone().premultiply(sway), reduced ? 1 : 0.035)

      for (let k = 0; k < N; k++) {
        const glow = THREE.MathUtils.smoothstep(dirs[k].dot(focus), 0.82, 0.97)
        c.copy(base).multiplyScalar(baseTint[k])
        if (kind[k]) c.lerp(accent[kind[k] - 1], 0.45)
        c.lerp(cur, glow * 0.85)
        tiles.setColorAt(k, c)
        knobs.setColorAt(k, c)
      }
      if (tiles.instanceColor) tiles.instanceColor.needsUpdate = true
      if (knobs.instanceColor) knobs.instanceColor.needsUpdate = true

      renderer.render(scene, camera)
      if (!reduced) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    const still = reduced ? window.setInterval(() => frame(performance.now()), 600) : 0

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(still)
      ro.disconnect()
      tile.dispose()
      knob.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  const pos = CARD_POS[i]
  return (
    <div className="sphere" ref={host}>
      <Dialog i={i} x={pos.x} y={pos.y} />
    </div>
  )
}
