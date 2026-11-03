import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Guppy3D } from '@/entities/fish/ui/guppy-3d'
import { STRAINS } from '@/entities/fish/model/mock'
import type { TailType } from '@/entities/fish/model/types'

const TAILS: TailType[] = ['delta', 'round', 'veil', 'spade', 'lyre', 'doubleSword', 'delta', 'veil']
const UP = new THREE.Vector3(1, 0, 0)

/* ---------- Cá bơi theo quỹ đạo Lissajous ---------- */
function SwimmingFish({ i }: { i: number }) {
  const ref = useRef<THREE.Group>(null)
  const strain = STRAINS[i % STRAINS.length]
  const p = useMemo(() => ({
    ax: 4.5 + (i % 3), ay: 1.2 + (i % 4) * 0.35, az: 2 + (i % 2),
    fx: 0.11 + i * 0.013, fy: 0.23 + (i % 5) * 0.03, fz: 0.17 + (i % 3) * 0.02,
    ph: i * 1.7, s: 0.55 + (i % 4) * 0.12, yOff: -0.4 + (i % 3) * 0.5,
  }), [i])
  const prev = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + p.ph
    const g = ref.current!
    prev.copy(g.position)
    g.position.set(Math.sin(t * p.fx) * p.ax, Math.sin(t * p.fy) * p.ay + p.yOff, Math.sin(t * p.fz) * p.az - 1.5)
    dir.subVectors(g.position, prev)
    if (dir.lengthSq() > 1e-8) {
      dir.y *= 0.5
      q.setFromUnitVectors(UP, dir.normalize())
      g.quaternion.slerp(q, 0.08)
    }
  })
  return <Guppy3D ref={ref} palette={strain.palette} tail={TAILS[i % TAILS.length]} scale={p.s} speed={1 + (i % 3) * 0.2} phase={i} />
}

/* ---------- Cá dẫn đầu bơi theo con trỏ chuột ---------- */
function LeaderFish() {
  const ref = useRef<THREE.Group>(null)
  const target = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  const { viewport } = useThree()
  useFrame(({ pointer, clock }) => {
    const g = ref.current!
    const t = clock.elapsedTime
    target.set((pointer.x * viewport.width) / 2.4 + Math.sin(t * 0.7) * 0.3, (pointer.y * viewport.height) / 2.4 + Math.sin(t * 1.3) * 0.2, 0.4)
    dir.subVectors(target, g.position)
    const dist = dir.length()
    g.position.addScaledVector(dir, Math.min(0.03, dist * 0.02) / Math.max(dist, 1e-4) * Math.min(dist, 1) * 1.2)
    if (dist > 0.15) {
      dir.normalize(); dir.y *= 0.6
      q.setFromUnitVectors(UP, dir.normalize())
      g.quaternion.slerp(q, 0.06)
    }
  })
  const s = STRAINS[6]
  return <Guppy3D ref={ref} palette={s.palette} tail="delta" scale={0.85} speed={1.6} glow={0.6} position={[3, 0.5, 0.4]} />
}

/* ---------- Rong rêu lắc lư (shader) ---------- */
const weedVS = /* glsl */ `
uniform float uTime; uniform float uSeed; varying vec2 vUv;
void main(){ vUv = uv; vec3 p = position;
  float h = uv.y; p.x += sin(uTime*1.2 + h*3.0 + uSeed) * h*h*0.45; p.z += cos(uTime*0.9 + h*2.0 + uSeed)*h*0.15;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`
const weedFS = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; varying vec2 vUv;
void main(){ float edge = 1.0 - smoothstep(0.35, 0.5, abs(vUv.x-0.5)*(1.0+vUv.y*0.6));
  vec3 c = mix(uA, uB, vUv.y); gl_FragColor = vec4(c + vec3(0.0,0.15,0.1)*pow(vUv.y,3.0), edge*0.92); }`

function Seaweed({ x, z, h, seed, tint }: { x: number; z: number; h: number; seed: number; tint: string }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSeed: { value: seed }, uA: { value: new THREE.Color('#062b25') }, uB: { value: new THREE.Color(tint) } }), [seed, tint])
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime })
  return (
    <mesh position={[x, -3.3 + h / 2, z]} rotation={[0, seed, 0]}>
      <planeGeometry args={[0.28, h, 1, 24]} />
      <shaderMaterial ref={mat} vertexShader={weedVS} fragmentShader={weedFS} uniforms={uniforms} transparent side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

/* ---------- Đáy cát với ánh sáng khúc xạ (caustics) ---------- */
const floorFS = /* glsl */ `
uniform float uTime; varying vec2 vUv;
float c(vec2 p){ float t=uTime*0.4; vec2 i=p; float s=0.0;
  for(int n=0;n<4;n++){ float fn=float(n); i = p + vec2(cos(t-i.x+fn)+sin(t+i.y), sin(t-i.y)+cos(t+i.x+fn)); s += 1.0/length(vec2(p.x/(sin(i.x+t)/0.01), p.y/(cos(i.y+t)/0.01))); }
  s/=4.0; return pow(1.17-sqrt(s),7.0); }
void main(){ vec2 p = vUv*18.0; float k = clamp(c(p),0.0,1.0);
  float fade = smoothstep(0.0,0.35,vUv.y)*smoothstep(1.0,0.6,vUv.y)*smoothstep(0.0,0.2,vUv.x)*smoothstep(1.0,0.8,vUv.x);
  vec3 sand = vec3(0.05,0.11,0.18); vec3 col = sand + vec3(0.25,0.75,0.85)*k*0.55;
  gl_FragColor = vec4(col, fade); }`
function Floor() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.35, -2]}>
      <planeGeometry args={[30, 14]} />
      <shaderMaterial ref={mat} uniforms={uniforms} transparent
        vertexShader="varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
        fragmentShader={floorFS} />
    </mesh>
  )
}

/* ---------- Tia sáng chiếu xuyên mặt nước ---------- */
function GodRays() {
  const rays = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ x: -6 + i * 2.1, r: -0.25 + (i % 3) * 0.12, w: 0.6 + (i % 3) * 0.5, o: 0.05 + (i % 2) * 0.04 })), [])
  const grp = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    grp.current?.children.forEach((m, i) => {
      ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = rays[i].o * (0.6 + 0.4 * Math.sin(clock.elapsedTime * 0.6 + i))
    })
  })
  return (
    <group ref={grp}>
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, 2, -4]} rotation={[0, 0, r.r]}>
          <planeGeometry args={[r.w, 14]} />
          <meshBasicMaterial color="#9be7ff" transparent opacity={r.o} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- Bọt khí (instanced) ---------- */
function BubbleColumn({ count = 70 }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({ x: (i % 2 ? 4.2 : -4.6) + Math.sin(i) * 0.3, z: -1 + Math.cos(i) * 0.4, sp: 0.6 + (i % 7) * 0.12, off: i * 0.37, s: 0.025 + (i % 5) * 0.012 })), [count])
  const m = useMemo(() => new THREE.Object3D(), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    data.forEach((b, i) => {
      const y = ((t * b.sp + b.off) % 7.5) - 3.4
      m.position.set(b.x + Math.sin(t * 2 + i) * 0.08, y, b.z)
      m.scale.setScalar(b.s * (1 + (y + 3.4) * 0.12))
      m.updateMatrix()
      ref.current!.setMatrixAt(i, m.matrix)
    })
    ref.current!.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshPhysicalMaterial color="#d6f6ff" transparent opacity={0.45} roughness={0} emissive="#7dd3fc" emissiveIntensity={0.5} />
    </instancedMesh>
  )
}

function Rocks() {
  const rocks = [[-5.2, -3.1, -1.5, 0.9], [-4.1, -3.2, -0.6, 0.5], [4.6, -3.0, -1.8, 1.1], [5.6, -3.2, -0.5, 0.55], [0.8, -3.25, -3.5, 0.7]]
  return (
    <>
      {rocks.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={[s * 1.3, s * 0.8, s]} rotation={[i, i * 2, 0]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#0f2236" roughness={0.9} flatShading />
        </mesh>
      ))}
    </>
  )
}

function CameraRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.03
    camera.position.y += (0.2 + pointer.y * 0.5 - camera.position.y) * 0.03
    camera.lookAt(0, -0.3, 0)
  })
  return null
}

function PointerLight() {
  const ref = useRef<THREE.PointLight>(null)
  const { viewport } = useThree()
  useFrame(({ pointer }) => ref.current?.position.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 3))
  return <pointLight ref={ref} color="#f0abfc" intensity={12} distance={9} />
}

export function AquariumScene({ fishCount = 9, interactive = true }: { fishCount?: number; interactive?: boolean }) {
  const weeds = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    x: (i < 13 ? -7 + (i % 13) * 0.32 : 3.4 + (i % 13) * 0.32) + Math.sin(i * 7) * 0.2, z: -1.5 - (i % 4) * 0.7,
    h: 2 + ((i * 37) % 10) / 4, seed: i * 1.3, tint: ['#34d399', '#10b981', '#2dd4bf', '#a3e635'][i % 4],
  })), [])
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 8], fov: 45 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
    >
      <color attach="background" args={['#020b18']} />
      <fog attach="fog" args={['#020b18', 7, 20]} />
      <ambientLight intensity={0.5} color="#7dd3fc" />
      <directionalLight position={[2, 8, 4]} intensity={2.2} color="#bae6fd" />
      <directionalLight position={[-6, 2, -3]} intensity={1.2} color="#c084fc" />
      {interactive && <PointerLight />}
      <GodRays />
      <Floor />
      <Rocks />
      {weeds.map((w, i) => <Seaweed key={i} {...w} />)}
      {Array.from({ length: fishCount }, (_, i) => <SwimmingFish key={i} i={i} />)}
      {interactive && <LeaderFish />}
      <BubbleColumn />
      <Sparkles count={160} scale={[16, 8, 8]} size={2.2} speed={0.25} opacity={0.5} color="#a5f3fc" />
      <CameraRig />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.3} mipmapBlur />
        <ChromaticAberration offset={new THREE.Vector2(0.0006, 0.0006)} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  )
}
