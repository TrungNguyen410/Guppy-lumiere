import { useFrame, type ThreeElements } from '@react-three/fiber'
import { forwardRef, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Palette, TailType } from '../model/types'

/** Biên dạng nửa bề rộng của vây đuôi theo chiều dài u ∈ [0,1] */
const PROFILE: Record<TailType, (u: number) => number> = {
  delta: (u) => 0.08 + Math.pow(u, 0.9) * 0.68,
  round: (u) => 0.1 + Math.sin(Math.min(u, 0.999) * Math.PI * 0.82) * 0.78,
  veil: (u) => 0.1 + u * 0.8,
  spade: (u) => 0.1 + Math.sin(u * Math.PI) * 0.55,
  lyre: (u) => 0.1 + u * 0.35 + Math.pow(u, 5) * 0.9,
  doubleSword: (u) => 0.1 + u * 0.25 + Math.pow(u, 8) * 0.6,
}

function makeFin(profile: (u: number) => number, length: number, c1: string, c2: string, droop = 0, segU = 28, segV = 16) {
  const g = new THREE.PlaneGeometry(1, 1, segU, segV)
  const pos = g.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 4)
  const a = new THREE.Color(c1)
  const b = new THREE.Color(c2)
  const tmp = new THREE.Color()
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) + 0.5 // 0..1
    const v = pos.getY(i) * 2 // -1..1
    const w = profile(u)
    pos.setXYZ(i, -u * length, v * w - droop * u * u, 0)
    tmp.copy(a).lerp(b, Math.pow(u, 1.3))
    const ray = 0.82 + 0.18 * Math.cos(v * 26)
    colors.set([tmp.r * ray, tmp.g * ray, tmp.b * ray, 0.95 - Math.pow(u, 3) * 0.35 - Math.pow(Math.abs(v), 6) * 0.3], i * 4)
    uv.set([u, v], i * 2)
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 4))
  g.setAttribute('aUV', new THREE.BufferAttribute(uv, 2))
  g.userData.base = Float32Array.from(pos.array as Float32Array)
  g.computeVertexNormals()
  return g
}

function makeBody() {
  const g = new THREE.SphereGeometry(0.5, 48, 32)
  const p = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i) * 1.5
    let y = p.getY(i) * 0.52
    let z = p.getZ(i) * 0.36
    const taper = x < 0 ? 1 + x * 0.55 : 1 - x * 0.12
    y *= taper; z *= taper
    if (x > 0.45) y -= (x - 0.45) * 0.08 // mõm hơi chúc
    x *= 1
    p.setXYZ(i, x, y, z)
  }
  g.computeVertexNormals()
  return g
}

export interface Guppy3DProps {
  palette: Palette
  tail: TailType
  speed?: number
  phase?: number
  glow?: number
}

export const Guppy3D = forwardRef<THREE.Group, Guppy3DProps & Omit<ThreeElements['group'], 'ref'>>(function Guppy3D(
  { palette, tail, speed = 1, phase = 0, glow = 0.35, ...rest }, ref,
) {
  const tailGeo = useMemo(() => makeFin(PROFILE[tail], 1.15, palette.tail1, palette.tail2, tail === 'veil' ? 0.45 : 0), [tail, palette])
  const dorsalGeo = useMemo(() => makeFin((u) => 0.06 + u * 0.18, 0.55, palette.tail1, palette.tail2, 0, 10, 6), [palette])
  const bodyGeo = useMemo(makeBody, [])
  const tailGroup = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed * 4 + phase
    for (const geo of [tailGeo, dorsalGeo]) {
      const pos = geo.attributes.position as THREE.BufferAttribute
      const base = geo.userData.base as Float32Array
      const uv = geo.attributes.aUV as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++) {
        const u = uv.getX(i)
        const v = uv.getY(i)
        pos.setZ(i, Math.sin(t - u * 3.2) * u * 0.28 + Math.sin(t * 1.7 + v * 2) * u * u * 0.06)
        pos.setY(i, base[i * 3 + 1] + Math.sin(t * 0.8 + u * 2) * u * 0.03)
      }
      pos.needsUpdate = true
    }
    if (tailGroup.current) tailGroup.current.rotation.y = Math.sin(t) * 0.18
  })

  return (
    <group ref={ref} {...rest}>
      <mesh geometry={bodyGeo} castShadow>
        <meshPhysicalMaterial color={palette.body} roughness={0.25} metalness={0.15} clearcoat={1} clearcoatRoughness={0.15}
          iridescence={1} iridescenceIOR={1.4} sheen={0.4} sheenColor={palette.accent}
          emissive={palette.body} emissiveIntensity={glow * 0.5} />
      </mesh>
      {/* mắt */}
      {[1, -1].map((s) => (
        <group key={s} position={[0.52, 0.05, 0.12 * s]}>
          <mesh><sphereGeometry args={[0.065, 16, 16]} /><meshStandardMaterial color="#05070d" roughness={0.1} /></mesh>
          <mesh position={[0.03, 0.025, 0.04 * s]}><sphereGeometry args={[0.018, 8, 8]} /><meshBasicMaterial color="#fff" /></mesh>
        </group>
      ))}
      <group ref={tailGroup} position={[-0.62, 0, 0]}>
        <mesh geometry={tailGeo}>
          <meshPhysicalMaterial vertexColors transparent side={THREE.DoubleSide} depthWrite={false} roughness={0.35}
            iridescence={1} iridescenceIOR={1.6} emissive={palette.tail1} emissiveIntensity={glow} />
        </mesh>
      </group>
      <mesh geometry={dorsalGeo} position={[0.12, 0.2, 0]} rotation={[0, 0, -0.35]}>
        <meshPhysicalMaterial vertexColors transparent side={THREE.DoubleSide} depthWrite={false} emissive={palette.tail1} emissiveIntensity={glow * 0.8} />
      </mesh>
      {/* vây bụng */}
      <mesh position={[0.05, -0.2, 0]} rotation={[0, 0, -2.4]} scale={0.35} geometry={dorsalGeo}>
        <meshPhysicalMaterial vertexColors transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
})
