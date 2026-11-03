import { useFrame, type GroupProps } from '@react-three/fiber'
import { forwardRef, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { BangMau, KieuDuoi } from '../model'

/** Nửa bề rộng của vây đuôi theo vị trí u từ gốc (0) đến ngọn (1). */
const BIEN_DANG_DUOI: Record<KieuDuoi, (u: number) => number> = {
  DELTA: (u) => 0.08 + Math.pow(u, 0.9) * 0.68,
  TRON: (u) => 0.1 + Math.sin(Math.min(u, 0.999) * Math.PI * 0.82) * 0.78,
  VOAN: (u) => 0.1 + u * 0.8,
  THUONG: (u) => 0.1 + Math.sin(u * Math.PI) * 0.55,
  DAN: (u) => 0.1 + u * 0.35 + Math.pow(u, 5) * 0.9,
  KIEM_DOI: (u) => 0.1 + u * 0.25 + Math.pow(u, 8) * 0.6,
}

function taoVay(bienDang: (u: number) => number, dai: number, mau1: string, mau2: string, doRu = 0, soDoanDai = 28, soDoanNgang = 16) {
  const hinh = new THREE.PlaneGeometry(1, 1, soDoanDai, soDoanNgang)
  const viTri = hinh.attributes.position as THREE.BufferAttribute
  const mauDinh = new Float32Array(viTri.count * 4)
  const toaDo = new Float32Array(viTri.count * 2)
  const dau = new THREE.Color(mau1)
  const cuoi = new THREE.Color(mau2)
  const tam = new THREE.Color()
  for (let i = 0; i < viTri.count; i++) {
    const u = viTri.getX(i) + 0.5
    const v = viTri.getY(i) * 2
    viTri.setXYZ(i, -u * dai, v * bienDang(u) - doRu * u * u, 0)
    tam.copy(dau).lerp(cuoi, Math.pow(u, 1.3))
    const tiaVay = 0.82 + 0.18 * Math.cos(v * 26)
    mauDinh.set([tam.r * tiaVay, tam.g * tiaVay, tam.b * tiaVay, 0.95 - Math.pow(u, 3) * 0.35 - Math.pow(Math.abs(v), 6) * 0.3], i * 4)
    toaDo.set([u, v], i * 2)
  }
  hinh.setAttribute('color', new THREE.BufferAttribute(mauDinh, 4))
  hinh.setAttribute('toaDoVay', new THREE.BufferAttribute(toaDo, 2))
  hinh.userData.goc = Float32Array.from(viTri.array as Float32Array)
  hinh.computeVertexNormals()
  return hinh
}

function taoThan() {
  const hinh = new THREE.SphereGeometry(0.5, 48, 32)
  const viTri = hinh.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < viTri.count; i++) {
    const x = viTri.getX(i) * 1.5
    let y = viTri.getY(i) * 0.52
    let z = viTri.getZ(i) * 0.36
    const thon = x < 0 ? 1 + x * 0.55 : 1 - x * 0.12
    y *= thon
    z *= thon
    if (x > 0.45) y -= (x - 0.45) * 0.08
    viTri.setXYZ(i, x, y, z)
  }
  hinh.computeVertexNormals()
  return hinh
}

export type Ca3DProps = GroupProps & {
  bangMau: BangMau
  duoi: KieuDuoi
  tocDo?: number
  lech?: number
  doSang?: number
}

/** Cá 3D có đuôi uốn sóng, dùng chung cho bể cá và trang chi tiết. */
export const Ca3D = forwardRef<THREE.Group, Ca3DProps>(function Ca3D({ bangMau, duoi, tocDo = 1, lech = 0, doSang = 0.35, ...conLai }, ref) {
  const hinhDuoi = useMemo(() => taoVay(BIEN_DANG_DUOI[duoi], 1.15, bangMau.duoi1, bangMau.duoi2, duoi === 'VOAN' ? 0.45 : 0), [duoi, bangMau])
  const hinhVayLung = useMemo(() => taoVay((u) => 0.06 + u * 0.18, 0.55, bangMau.duoi1, bangMau.duoi2, 0, 10, 6), [bangMau])
  const hinhThan = useMemo(taoThan, [])
  const nhomDuoi = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * tocDo * 4 + lech
    for (const hinh of [hinhDuoi, hinhVayLung]) {
      const viTri = hinh.attributes.position as THREE.BufferAttribute
      const goc = hinh.userData.goc as Float32Array
      const toaDo = hinh.attributes.toaDoVay as THREE.BufferAttribute
      for (let i = 0; i < viTri.count; i++) {
        const u = toaDo.getX(i)
        const v = toaDo.getY(i)
        viTri.setZ(i, Math.sin(t - u * 3.2) * u * 0.28 + Math.sin(t * 1.7 + v * 2) * u * u * 0.06)
        viTri.setY(i, goc[i * 3 + 1] + Math.sin(t * 0.8 + u * 2) * u * 0.03)
      }
      viTri.needsUpdate = true
    }
    if (nhomDuoi.current) nhomDuoi.current.rotation.y = Math.sin(t) * 0.18
  })

  return (
    <group ref={ref} {...conLai}>
      <mesh geometry={hinhThan}>
        <meshPhysicalMaterial color={bangMau.than} roughness={0.25} metalness={0.15} clearcoat={1} clearcoatRoughness={0.15} iridescence={1} iridescenceIOR={1.4} sheen={0.4} sheenColor={bangMau.nhan} emissive={bangMau.than} emissiveIntensity={doSang * 0.5} />
      </mesh>
      {[1, -1].map((ben) => (
        <group key={ben} position={[0.52, 0.05, 0.12 * ben]}>
          <mesh>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color="#05070d" roughness={0.1} />
          </mesh>
          <mesh position={[0.03, 0.025, 0.04 * ben]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
        </group>
      ))}
      <group ref={nhomDuoi} position={[-0.62, 0, 0]}>
        <mesh geometry={hinhDuoi}>
          <meshPhysicalMaterial vertexColors transparent side={THREE.DoubleSide} depthWrite={false} roughness={0.35} iridescence={1} iridescenceIOR={1.6} emissive={bangMau.duoi1} emissiveIntensity={doSang} />
        </mesh>
      </group>
      <mesh geometry={hinhVayLung} position={[0.12, 0.2, 0]} rotation={[0, 0, -0.35]}>
        <meshPhysicalMaterial vertexColors transparent side={THREE.DoubleSide} depthWrite={false} emissive={bangMau.duoi1} emissiveIntensity={doSang * 0.8} />
      </mesh>
      <mesh geometry={hinhVayLung} position={[0.05, -0.2, 0]} rotation={[0, 0, -2.4]} scale={0.35}>
        <meshPhysicalMaterial vertexColors transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
})
