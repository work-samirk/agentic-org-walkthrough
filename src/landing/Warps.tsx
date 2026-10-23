import { useEffect, useLayoutEffect, useMemo, useRef, type CSSProperties } from 'react'
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { Player, type PlayerRef } from '@remotion/player'
import { ThreeCanvas } from '@remotion/three'
import * as THREE from 'three'
import { reduced } from './config'

// Glass "warp" orbs, after Siri's: a near-black glass sphere, a bright bent streak of light across it,
// a colour-fringed rim. WarpTree shows the org as four orbs (CXO above three teams);
// WarpSolo shows one orb that hands over from the CXO to each team and back.
const W = 760
const H = 740
const CXO_C = '#b9c7ff'
export const CORAL = '#ff7f63'
const SKY = '#6db1f5'
const VIOLET = '#9b82f5'
export const PAPER = '#f4f1ec'
export const FONT = "'Timeless Sans', system-ui, sans-serif"

const VERT = `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`
const FRAG = `
varying vec3 vN;
uniform vec3 uColor; uniform float uAng; uniform float uAmp; uniform float uTime; uniform float uFull;
float pow2(float x){ return x * x; }
void main(){
  vec3 N = normalize(vN);
  float nv = clamp(N.z, 0.0, 1.0);
  float fres = pow(1.0 - nv, 2.6);
  float low = smoothstep(0.25, -0.9, N.y);
  vec3 col = vec3(0.012, 0.014, 0.022) + uColor * (0.07 + 0.22 * uAmp) * low * nv + uColor * 0.035;
  float c = cos(uAng), s = sin(uAng);
  float d = N.y * c - N.x * s;
  float along = N.x * c + N.y * s;
  float warp = 0.10 * sin(along * 3.0 + uTime * 1.4);
  float w = 0.055 + 0.05 * uAmp;
  vec3 g;
  for (int k = 0; k < 3; k++) {
    float off = (float(k) - 1.0) * 0.02;
    float x = (d - 0.02 + warp + off) / w;
    float v = exp(-x * x);
    if (k == 0) g.r = v; else if (k == 1) g.g = v; else g.b = v;
  }
  float taper = 0.3 + 0.7 * smoothstep(-0.7, 0.9, along);
  vec3 tint = mix(vec3(1.0, 0.95, 0.88), uColor * 1.3 + 0.35, 0.4);
  col += g * tint * taper * (1.0 + 0.9 * uAmp) * pow(nv, 0.35);
  vec3 rim = mix(uColor, vec3(0.45, 0.6, 1.0), smoothstep(-0.8, 0.8, -N.x)) * fres * (0.85 + 0.7 * uAmp);
  col += rim * (1.0 - 0.45 * uFull);
  float edge = 1.0 - nv;
  vec3 body = uColor * (0.2 + 0.3 * uAmp) * (0.4 + 0.6 * pow(edge, 1.2) + 0.3 * low);
  vec3 soft = mix(uColor, vec3(1.0, 0.93, 0.85), 0.35) * pow(edge, 1.8) * (0.95 + 0.6 * uAmp);
  col += (body + soft) * uFull;
  if (uFull > 0.0) {
    vec3 hot = mix(uColor, vec3(1.0, 0.95, 0.88), 0.55);
    float rr = 1.0 - sqrt(max(0.0, 1.0 - nv * nv));
    float ringCore = exp(-pow2((rr - 0.025) / 0.02));
    float ringSoft = exp(-pow2((rr - 0.06) / 0.08));
    float up = smoothstep(-0.2, 0.7, N.y);
    float arc = exp(-pow2((rr - 0.10) / 0.012)) * (0.3 + 0.7 * up);
    float arc2 = exp(-pow2((rr - 0.17) / 0.009)) * (0.15 + 0.45 * (1.0 - up));
    vec3 c = vec3(0.006, 0.007, 0.012);
    c += hot * ringCore * (1.5 + uAmp) + uColor * ringSoft * (0.5 + 0.4 * uAmp);
    c += hot * arc * 0.9 + uColor * arc2;
    float cr = cos(uAng), sr = sin(uAng);
    vec3 Nr = vec3(cr * N.x - sr * N.z, N.y, sr * N.x + cr * N.z);
    float lon = atan(Nr.x, Nr.z);
    vec3 m1 = normalize(vec3(0.22, 0.93, 0.30));
    vec3 m2 = normalize(vec3(-0.35, 0.88, -0.18));
    float b1 = dot(Nr, m1) + 0.05 * sin(lon * 2.0);
    float b2 = dot(Nr, m2);
    float wd = 0.06 + 0.04 * uAmp;
    vec3 gg;
    for (int k = 0; k < 3; k++) {
      float off = (float(k) - 1.0) * 0.018;
      float x = (b1 + off) / wd;
      float v = exp(-x * x);
      if (k == 0) gg.r = v; else if (k == 1) gg.g = v; else gg.b = v;
    }
    float hotspot = 0.3 + 0.7 * pow(0.5 + 0.5 * cos(lon - 0.6), 1.4);
    float thin = exp(-pow2(b2 / 0.022)) * (0.25 + 0.75 * pow(0.5 + 0.5 * cos(lon + 2.4), 1.2));
    float halo = exp(-pow2(b1 / (wd * 4.5)));
    c += uColor * halo * (0.28 + 0.2 * uAmp) * nv * nv;
    c += gg * tint * hotspot * (1.3 + uAmp) * pow(nv, 0.3);
    c += hot * thin * 0.7 * pow(nv, 0.3);
    c = 1.0 - exp(-c * 1.5);
    col = mix(col, c, uFull);
  } else {
    col = 1.0 - exp(-col * 1.5);
  }
  gl_FragColor = vec4(col, 1.0);
}`

function glowTex() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,.9)')
  grad.addColorStop(0.45, 'rgba(255,255,255,.22)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

type OrbProps = { px: number; py: number; r: number; color: THREE.Color; ang: number; amp: number; time: number; scale?: number; glow?: THREE.Texture; full?: number }
function Orb({ px, py, r, color, ang, amp, time, scale = 1, glow, full = 0 }: OrbProps) {
  const mat = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: { uColor: { value: new THREE.Color() }, uAng: { value: 0 }, uAmp: { value: 0 }, uTime: { value: 0 }, uFull: { value: 0 } } }),
    [],
  )
  useLayoutEffect(() => {
    mat.uniforms.uColor.value.copy(color)
    mat.uniforms.uAng.value = ang
    mat.uniforms.uAmp.value = amp
    mat.uniforms.uTime.value = time
    mat.uniforms.uFull.value = full
  })
  return (
    <group position={[px - W / 2, H / 2 - py, 0]} scale={scale}>
      {glow && (
        <sprite scale={[r * (3 + amp * 0.8), r * (3 + amp * 0.8), 1]} position={[0, 0, -5]}>
          <spriteMaterial map={glow} color={color} transparent opacity={(0.14 + amp * 0.2) * (1 + full * 1.6)} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      )}
      <mesh>
        <sphereGeometry args={[r, 64, 64]} />
        <primitive object={mat} attach="material" />
      </mesh>
    </group>
  )
}

export const clamp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
export const ease = Easing.inOut(Easing.cubic)

export const chip: CSSProperties = {
  position: 'absolute',
  boxSizing: 'border-box',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,.16)',
  background: 'linear-gradient(180deg, rgba(255,255,255,.13), rgba(255,255,255,.04))',
  backdropFilter: 'blur(14px) saturate(1.5)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.5)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.28), 0 14px 32px rgba(2,6,20,.45)',
  color: PAPER,
  fontFamily: FONT,
  textAlign: 'center',
}

function Pill({ text, color, check }: { text: string; color: string; check?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, lineHeight: 1, padding: '4px 9px', borderRadius: 99, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)', color: PAPER, whiteSpace: 'nowrap' }}>
      {check ? <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6.4l2.6 2.6L10 3.4" fill="none" stroke={PAPER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <i style={{ width: 7, height: 7, borderRadius: 9, background: color, boxShadow: `0 0 8px ${color}` }} />}
      {text}
    </span>
  )
}

export type P = [number, number]
function curve(a: P, b: P) {
  const my = (a[1] + b[1]) / 2
  const at = (t: number): P => {
    const u = 1 - t
    return [u * u * u * a[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * b[1]]
  }
  return { d: `M${a[0]},${a[1]} C${a[0]},${my} ${b[0]},${my} ${b[0]},${b[1]}`, at }
}

function Thread({ a, b, color, draw, f, start, up }: { a: P; b: P; color: string; draw: number; f: number; start: number; up?: boolean }) {
  const c = curve(a, b)
  const t = ease(clamp(f, start, start + 24))
  const live = t > 0 && t < 1
  const col = up ? PAPER : color
  const p = live ? c.at(up ? 1 - t : t) : null
  return (
    <g>
      <path d={c.d} pathLength={1} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={1.5} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {live && <path d={c.d} fill="none" stroke={col} strokeWidth={2} opacity={0.45} />}
      {p && (
        <g transform={`translate(${p[0]} ${p[1]})`}>
          <circle r={16} fill={col} opacity={0.2} />
          <circle r={9} fill={col} opacity={0.35} />
          <circle r={5} fill={col} />
        </g>
      )}
    </g>
  )
}

/* ---- four orbs: the org ---------------------------------------------------- */
const LOOP_T = 300
const TEAMS = [
  { label: 'Sales', lead: 'Aarav', role: 'Sales Representative', c: CORAL, x: 127 },
  { label: 'Operations', lead: 'Meera', role: 'Operations Analyst', c: SKY, x: 380 },
  { label: 'Finance', lead: 'Rohan', role: 'Financial Analyst', c: VIOLET, x: 633 },
]
const TREE = { cx: 380, cy: 196, cr: 98, ty: 540, tr: 68 }

function TreeScene() {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const glow = useMemo(() => glowTex(), [])
  const enter = (d: number) => spring({ frame: f - d, fps, config: { damping: 18, stiffness: 110, mass: 0.8 } })
  const out = 1 - clamp(f, 284, LOOP_T - 2)
  const time = f / fps

  const down = (i: number) => 50 + i * 7
  const arrive = (i: number) => down(i) + 24
  const up = (i: number) => 176 + i * 6
  const back = (i: number) => up(i) + 24
  const ask = 232
  const click = 262
  const approved = f >= click + 4

  const teamAmp = (i: number) => clamp(f, arrive(i), arrive(i) + 10) * (1 - 0.7 * clamp(f, up(i), up(i) + 12))
  const cxoAmp = Math.max(0.25 + 0.25 * clamp(f, down(0), down(0) + 20) * (1 - clamp(f, 180, 200)), clamp(f, back(0), back(0) + 14) * (1 - 0.5 * clamp(f, click + 6, click + 26)), 0)
  const cxoStatus = f < down(0) ? 'Ready' : f < back(2) ? 'Delegating' : f < ask ? 'Merging' : !approved ? 'Needs you' : 'Done'
  const log =
    f < 34 ? '' : f < down(0) ? 'You set a goal: prepare the Q3 board pack' : f < arrive(2) ? 'CXO agent split it across three teams' : f < up(0) ? 'Six virtual employees are working' : f < ask ? 'Every output passed its policy checks' : !approved ? 'Waiting for your approval' : 'Approved by you. Saved to the audit trail'

  const cxoP: P = [TREE.cx, TREE.cy + TREE.cr + 40]
  const teamP = (x: number): P => [x, TREE.ty - TREE.tr - 4]
  const col = (hex: string) => new THREE.Color(hex)

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ transform: `translateY(${Math.sin((f / LOOP_T) * Math.PI * 2) * 4}px)` }}>
        <ThreeCanvas width={W} height={H} orthographic camera={{ position: [0, 0, 500], zoom: 1, near: 0.1, far: 2000 }} gl={{ alpha: true, antialias: true }}>
          <Orb px={TREE.cx} py={TREE.cy} r={TREE.cr} color={col(CXO_C)} ang={0.12 + 0.35 * Math.sin(f / 38)} amp={cxoAmp} time={time} scale={enter(2)} glow={glow} />
          {TEAMS.map((t, i) => (
            <Orb key={t.label} px={t.x} py={TREE.ty} r={TREE.tr} color={col(t.c)} ang={0.1 + i * 0.18 + 0.4 * Math.sin(f / 34 + i * 1.7)} amp={teamAmp(i)} time={time + i} scale={enter(14 + i * 6)} glow={glow} />
          ))}
        </ThreeCanvas>

        <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <path d={`M${TREE.cx},50 L${TREE.cx},${TREE.cy - TREE.cr}`} stroke="rgba(255,255,255,.2)" strokeWidth={1.5} strokeDasharray="4 5" opacity={clamp(f, 30, 42)} />
          {TEAMS.map((t, i) => (
            <g key={t.label}>
              <Thread a={cxoP} b={teamP(t.x)} color={t.c} draw={ease(clamp(f, 24 + i * 5, 48 + i * 5))} f={f} start={down(i)} />
              <Thread a={cxoP} b={teamP(t.x)} color={t.c} draw={0} f={f} start={up(i)} up />
            </g>
          ))}
        </svg>

        {/* the person with the goal */}
        <div style={{ ...chip, left: TREE.cx - 190, top: 6, width: 380, height: 44, borderRadius: 99, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', fontSize: 14, textAlign: 'left', opacity: clamp(f, 30, 42) }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 13, color: '#0b1226', background: `radial-gradient(circle at 30% 25%, #fff, ${PAPER} 62%)` }}>Y</span>
          <span style={{ flex: 1, color: 'rgba(244,241,236,.86)', whiteSpace: 'nowrap' }}>{f < ask ? 'Goal: prepare the Q3 board pack' : approved ? 'Q3 board pack approved' : 'Q3 board pack is ready'}</span>
          {f >= ask && !approved && <span style={{ fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 99, background: PAPER, color: '#0b1226', transform: `scale(${f > click - 4 ? 0.93 : 1})`, boxShadow: `0 0 0 ${3 + 3 * Math.sin(f / 4)}px rgba(255,127,99,.28)` }}>Approve</span>}
          {approved && <Pill text="Approved" color={PAPER} check />}
        </div>

        {/* labels */}
        <div style={{ ...chip, left: TREE.cx - 105, top: TREE.cy + TREE.cr - 4, width: 210, padding: '10px 0 11px', opacity: Math.min(1, enter(8) * 1.4) }}>
          <div style={{ fontSize: 19, fontWeight: 600 }}>Ananya</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: CXO_C, margin: '1px 0 7px' }}>Chief of Staff</div>
          <Pill text={cxoStatus} color={cxoStatus === 'Needs you' ? CORAL : CXO_C} check={cxoStatus === 'Done'} />
        </div>
        {TEAMS.map((t, i) => {
          const st = f < arrive(i) ? 'Standby' : f < up(i) ? 'Working' : f < back(i) + 4 ? 'Reporting' : 'Done'
          return (
            <div key={t.label}>
              <div style={{ position: 'absolute', left: t.x - 80, top: TREE.ty - TREE.tr - 30, width: 160, textAlign: 'center', fontFamily: FONT, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: t.c, opacity: enter(14 + i * 6) }}>{t.label}</div>
              <div style={{ ...chip, left: t.x - 92, top: TREE.ty + TREE.tr - 4, width: 184, padding: '9px 0 10px', opacity: Math.min(1, enter(18 + i * 6) * 1.4) }}>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{t.lead}</div>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: t.c, margin: '1px 0 6px' }}>{t.role}</div>
                <Pill text={st} color={t.c} check={st === 'Done'} />
              </div>
            </div>
          )
        })}
        <div style={{ position: 'absolute', left: 0, width: W, top: 700, textAlign: 'center', fontFamily: "'Timeless Sans', system-ui, sans-serif", fontSize: 13, color: 'rgba(244,241,236,.7)', opacity: log ? 1 : 0 }}>
          <i style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 9, background: CORAL, marginRight: 9, verticalAlign: 'middle' }} />
          {log}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/* ---- one orb that hands over ------------------------------------------------ */
export const SEG = 120
export const STEPS = [
  { who: 'Ananya', role: 'Business Analyst Agent', c: CXO_C, tag: 'CXO', tasks: ['Splitting the Q3 board pack across three teams', 'Briefing the Sales, Ops and Finance heads', 'Checking every action against policy'] },
  { who: 'Aarav', role: 'Lead Generation Agent', c: CORAL, tag: 'Sales', tasks: ['Qualifying 42 leads and drafting outreach', 'Updating the pipeline forecast', 'Scheduling 14 follow-ups'] },
  { who: 'Meera', role: 'Customer Support Agent', c: SKY, tag: 'Ops', tasks: ['Triaging 31 tickets and chasing two vendors', 'Watching every SLA target', 'Closing incident 412 in 6 minutes'] },
  { who: 'Rohan', role: 'Reconciliation Agent', c: VIOLET, tag: 'Finance', tasks: ['Matching 847 bank transactions to invoices', 'Flagging 3 breaks for review', 'Verifying payroll with zero errors'] },
  { who: 'Ananya', role: 'Business Analyst Agent', c: CXO_C, tag: 'CXO', tasks: ['Merged the results from three teams', 'Every output passed its policy checks', 'Board pack is ready and waits for your approval'] },
]

export const CMDS: string[][][] = [
  [['plan.split("Q3 board pack")', '3 goals: sales, ops, finance'], ['assign(team="sales")', 'brief sent'], ['policy.check(approvals)', '2 gates, 1 human'], ['merge(results)', 'board pack ready']],
  [['crm.qualify(leads=42)', '11 hot, 9 warm'], ['draft_outreach(hot)', '11 emails drafted'], ['pipeline.update()', 'forecast +38L'], ['follow_up.schedule()', '14 reminders set']],
  [['tickets.triage(31)', '31 routed, 0 mis-routes'], ['vendor.chase(2)', 'reminders sent'], ['sla.watch()', 'all within target'], ['incident.close(412)', 'resolved in 6m']],
  [['recon.run(847)', '99.7% matched'], ['flag(breaks)', '3 sent to review'], ['invoice.match(INV-4899)', '3-way match passed'], ['payroll.verify()', 'zero errors']],
]
// places around and over the orb; none of them reach the name and task line below it
export const BOX_W = 290
export const BOX_H = 105
export const SLOTS: P[] = [[14, 40], [456, 40], [14, 200], [456, 200], [14, 360], [456, 360], [235, 22], [235, 205], [235, 385]]
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function Term({ at, color, lines, age, life }: { at: P; color: string; lines: string[]; age: number; life: number }) {
  const typed = Math.floor(age * 0.6)
  const cmd = '$ ' + lines[0]
  const showCmd = cmd.slice(0, typed)
  const doneCmd = typed >= cmd.length
  const res = doneCmd ? lines[1].slice(0, Math.floor((typed - cmd.length) * 0.9)) : ''
  const caret = Math.floor(age / 8) % 2 === 0
  const o = Math.min(clamp(age, 0, 6), 1 - clamp(age, life - 8, life))
  return (
    <div style={{ position: 'absolute', left: at[0], top: at[1], minWidth: 240, padding: '11px 15px', borderRadius: 10, background: 'rgba(5,6,9,.9)', border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 12px 30px rgba(0,0,0,.5)', fontFamily: "'Timeless Sans', system-ui, sans-serif", fontSize: 15, lineHeight: '22px', color: PAPER, opacity: o, transform: `translateY(${(1 - o) * 8}px)`, whiteSpace: 'pre' }}>
      <div style={{ display: 'flex', gap: 5, marginBottom: 7 }}>
        {[0, 1, 2].map((i) => <i key={i} style={{ width: 7, height: 7, borderRadius: 9, background: i === 0 ? color : 'rgba(255,255,255,.18)' }} />)}
      </div>
      <div><span style={{ color }}>{showCmd.slice(0, 2)}</span>{showCmd.slice(2)}{!doneCmd && caret && <span style={{ background: PAPER, color: PAPER }}>_</span>}</div>
      {doneCmd && <div style={{ color: 'rgba(244,241,236,.6)' }}>{'> '}{res}{caret && res.length < lines[1].length + 0 && <span style={{ background: PAPER, color: PAPER }}>_</span>}{res.length >= lines[1].length && caret && <span style={{ background: PAPER, color: PAPER }}>_</span>}</div>}
    </div>
  )
}

type Step = { who: string; role: string; c: string; tag: string; tasks: string[] }
function makeScene(steps: Step[], cmds: string[][][], seg: number) {
  const n = steps.length
  return function Scene() {
  const f = useCurrentFrame()
  const glow = useMemo(() => glowTex(), [])
  const time = f / 30
  const idx = Math.min(n - 1, Math.floor(f / seg))
  const local = f - idx * seg
  const prev = steps[Math.max(0, idx - 1)]
  const cur = steps[idx]
  const k = idx === 0 ? 1 : ease(clamp(local, 0, 20))
  const color = new THREE.Color(prev.c).lerp(new THREE.Color(cur.c), k)
  // the orb turns on its own axis like a planet, with a short extra turn at each hand-over
  const spin = f * 0.03 + ease(clamp(local, 0, 34)) * 1.6 + idx * 1.6
  const amp = 0.35 + 0.55 * Math.sin(Math.min(1, local / seg) * Math.PI)
  const out = 1 - clamp(f, seg * n - 8, seg * n - 2)
  const intro = spring({ frame: f, fps: 30, config: { damping: 18, stiffness: 100, mass: 0.9 } })
  const text = clamp(local, 12, 26)
  const last = idx === n - 1
  const agent = Math.min(idx, cmds.length - 1)
  // at most three boxes per turn, each in a place that no other box of the turn uses
  const placed: P[] = []
  const boxes = [0, 1, 2].map((b) => {
    const seed = idx * 10 + b
    const start = [6, 34, 66][b] + Math.floor(rnd(seed) * 18)
    const life = 100 + Math.floor(rnd(seed + 1) * 26)
    const first = Math.floor(rnd(seed + 2) * SLOTS.length)
    let slot = SLOTS[first]
    for (let j = 0; j < SLOTS.length; j++) {
      const c = SLOTS[(first + j) % SLOTS.length]
      if (placed.every((q) => Math.abs(c[0] - q[0]) >= BOX_W || Math.abs(c[1] - q[1]) >= BOX_H)) {
        slot = c
        break
      }
    }
    placed.push(slot)
    const age = local - start
    if (age < 0 || age > life) return null
    return <Term key={b} at={slot} color={cur.c} lines={cmds[agent][b]} age={age} life={life} />
  })
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <ThreeCanvas width={W} height={H} orthographic camera={{ position: [0, 0, 500], zoom: 1, near: 0.1, far: 2000 }} gl={{ alpha: true, antialias: true }}>
        <Orb px={380} py={320} r={170} color={color} ang={spin} amp={amp} time={time} scale={intro} glow={glow} full={1} />
      </ThreeCanvas>

      <div style={{ position: 'absolute', left: 0, width: W, top: 508, textAlign: 'center', color: PAPER, fontFamily: FONT, opacity: text, transform: `translateY(${(1 - text) * 10}px)` }}>
        <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{cur.who}</div>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '0.01em', color: cur.c, margin: '4px 0 12px', filter: 'brightness(1.25)' }}>{cur.role}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
          {cur.tasks.map((t, i) => {
            const o = clamp(local, 14 + i * 9, 26 + i * 9)
            const ask = last && i === 2
            return (
              <div key={t} style={{ ...chip, position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 99, fontSize: 15, opacity: o, transform: `translateY(${(1 - o) * 8}px)` }}>
                <i style={{ width: 8, height: 8, borderRadius: 9, background: ask ? CORAL : cur.c, boxShadow: `0 0 10px ${ask ? CORAL : cur.c}` }} />
                {t}
                {ask && <span style={{ fontSize: 13, fontWeight: 600, padding: '5px 13px', borderRadius: 99, background: PAPER, color: '#0b1226', boxShadow: `0 0 0 ${3 + 3 * Math.sin(f / 4)}px rgba(255,127,99,.28)` }}>Approve</span>}
              </div>
            )
          })}
        </div>
      </div>

      {boxes}
    </AbsoluteFill>
  )
}
}

const SoloScene = makeScene(STEPS, [...CMDS, CMDS[0]], SEG)


function Frame({ component, loop, still, className, label }: { component: React.ComponentType; loop: number; still: number; className?: string; label: string }) {
  const ref = useRef<PlayerRef>(null)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!box.current) return
    let on = false
    const go = () => (on && !document.hidden ? ref.current?.play() : ref.current?.pause())
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; go() }, { threshold: 0.05 })
    io.observe(box.current)
    // a tab opened in the background or put to sleep starts again when it is shown
    document.addEventListener('visibilitychange', go)
    const kick = window.setTimeout(go, 600)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', go); window.clearTimeout(kick) }
  }, [])
  return (
    <div ref={box} className={className} role="img" aria-label={label}>
      <Player ref={ref} component={component} durationInFrames={loop} compositionWidth={W} compositionHeight={H} fps={30} loop autoPlay={!reduced()} initialFrame={reduced() ? still : 0} style={{ width: '100%', aspectRatio: `${W} / ${H}`, background: 'transparent' }} acknowledgeRemotionLicense />
    </div>
  )
}

export function WarpTree({ className }: { className?: string }) {
  return <Frame component={TreeScene} loop={LOOP_T} still={240} className={className} label="Four glowing orbs show a CXO agent delegating to sales, operations and finance teams, then a person approving the result." />
}

export function WarpSolo({ className }: { className?: string }) {
  return <Frame component={SoloScene} loop={SEG * 5} still={300} className={className} label="One glowing orb hands work from the CXO agent to the sales, operations and finance heads, then back to the CXO for your approval." />
}
