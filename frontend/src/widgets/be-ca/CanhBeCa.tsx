import { Sparkles } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { BANG_MAU_BE_CA, BANG_MAU_TRANG_TRI, type KieuDuoi } from '@/entities/san-pham/model'
import { Ca3D } from '@/entities/san-pham/ui/Ca3D'

const CAC_DUOI: KieuDuoi[] = ['DELTA', 'TRON', 'VOAN', 'THUONG', 'DAN', 'KIEM_DOI', 'DELTA', 'VOAN']
const HUONG_DAU_CA = new THREE.Vector3(1, 0, 0)
const LECH_SAC_MAU = new THREE.Vector2(0.0006, 0.0006)

/** Cá tự bơi theo quỹ đạo Lissajous, mỗi con một dòng và một kiểu đuôi. */
function CaTuBoi({ thuTu }: { thuTu: number }) {
  const ref = useRef<THREE.Group>(null)
  const quyDao = useMemo(
    () => ({
      ax: 4.5 + (thuTu % 3),
      ay: 1.2 + (thuTu % 4) * 0.35,
      az: 2 + (thuTu % 2),
      fx: 0.11 + thuTu * 0.013,
      fy: 0.23 + (thuTu % 5) * 0.03,
      fz: 0.17 + (thuTu % 3) * 0.02,
      lechPha: thuTu * 1.7,
      tiLe: 0.55 + (thuTu % 4) * 0.12,
      lechY: -0.4 + (thuTu % 3) * 0.5,
    }),
    [thuTu],
  )
  const truoc = useMemo(() => new THREE.Vector3(), [])
  const huong = useMemo(() => new THREE.Vector3(), [])
  const quay = useMemo(() => new THREE.Quaternion(), [])
  useFrame(({ clock, size }) => {
    const ca = ref.current
    if (!ca) return
    const t = clock.elapsedTime + quyDao.lechPha
    truoc.copy(ca.position)
    // Màn hình dọc: thu hẹp đường bơi để cá không ở ngoài khung hình phần lớn thời gian
    const bienDoX = size.width < size.height ? Math.min(quyDao.ax, 2.2) : quyDao.ax
    ca.position.set(Math.sin(t * quyDao.fx) * bienDoX,Math.sin(t * quyDao.fy) * quyDao.ay + quyDao.lechY, Math.sin(t * quyDao.fz) * quyDao.az - 1.5)
    huong.subVectors(ca.position, truoc)
    if (huong.lengthSq() > 1e-8) {
      huong.y *= 0.5
      quay.setFromUnitVectors(HUONG_DAU_CA, huong.normalize())
      ca.quaternion.slerp(quay, 0.08)
    }
  })
  return <Ca3D ref={ref} bangMau={BANG_MAU_BE_CA[thuTu % BANG_MAU_BE_CA.length]} duoi={CAC_DUOI[thuTu % CAC_DUOI.length]} scale={quyDao.tiLe} tocDo={1 + (thuTu % 3) * 0.2} lech={thuTu} />
}

/** Cá dẫn đầu bơi theo con trỏ chuột. */
function CaDanDau() {
  const ref = useRef<THREE.Group>(null)
  const dich = useMemo(() => new THREE.Vector3(), [])
  const huong = useMemo(() => new THREE.Vector3(), [])
  const quay = useMemo(() => new THREE.Quaternion(), [])
  const { viewport } = useThree()
  useFrame(({ pointer, clock }) => {
    const ca = ref.current
    if (!ca) return
    const t = clock.elapsedTime
    dich.set((pointer.x * viewport.width) / 2.4 + Math.sin(t * 0.7) * 0.3, (pointer.y * viewport.height) / 2.4 + Math.sin(t * 1.3) * 0.2, 0.4)
    huong.subVectors(dich, ca.position)
    const khoangCach = huong.length()
    ca.position.addScaledVector(huong, (Math.min(0.03, khoangCach * 0.02) / Math.max(khoangCach, 1e-4)) * Math.min(khoangCach, 1) * 1.2)
    if (khoangCach > 0.15) {
      huong.normalize()
      huong.y *= 0.6
      quay.setFromUnitVectors(HUONG_DAU_CA, huong.normalize())
      ca.quaternion.slerp(quay, 0.06)
    }
  })
  return <Ca3D ref={ref} bangMau={BANG_MAU_TRANG_TRI} duoi="DELTA" scale={0.85} tocDo={1.6} doSang={0.6} position={[3, 0.5, 0.4]} />
}

const SHADER_RONG_DINH = /* glsl */ `
uniform float uThoiGian; uniform float uLech; varying vec2 vUv;
void main(){ vUv = uv; vec3 p = position;
  float cao = uv.y;
  p.x += sin(uThoiGian*1.2 + cao*3.0 + uLech) * cao*cao*0.45;
  p.z += cos(uThoiGian*0.9 + cao*2.0 + uLech) * cao*0.15;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`

const SHADER_RONG_MAU = /* glsl */ `
uniform vec3 uGoc; uniform vec3 uNgon; varying vec2 vUv;
void main(){ float vien = 1.0 - smoothstep(0.35, 0.5, abs(vUv.x-0.5)*(1.0+vUv.y*0.6));
  vec3 mau = mix(uGoc, uNgon, vUv.y);
  gl_FragColor = vec4(mau + vec3(0.0,0.15,0.1)*pow(vUv.y,3.0), vien*0.92); }`

/** Rong lắc bằng shader để hàng chục cây vẫn nhẹ. */
function Rong({ x, z, cao, lech, mau }: { x: number; z: number; cao: number; lech: number; mau: string }) {
  const vatLieu = useRef<THREE.ShaderMaterial>(null)
  const dongBo = useMemo(() => ({ uThoiGian: { value: 0 }, uLech: { value: lech }, uGoc: { value: new THREE.Color('#062b25') }, uNgon: { value: new THREE.Color(mau) } }), [lech, mau])
  useFrame(({ clock }) => {
    if (vatLieu.current) vatLieu.current.uniforms.uThoiGian.value = clock.elapsedTime
  })
  return (
    <mesh position={[x, -3.3 + cao / 2, z]} rotation={[0, lech, 0]}>
      <planeGeometry args={[0.28, cao, 1, 24]} />
      <shaderMaterial ref={vatLieu} vertexShader={SHADER_RONG_DINH} fragmentShader={SHADER_RONG_MAU} uniforms={dongBo} transparent side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

const SHADER_DAY_MAU = /* glsl */ `
uniform float uThoiGian; varying vec2 vUv;
float causticsTai(vec2 p){ float t=uThoiGian*0.4; vec2 i=p; float s=0.0;
  for(int n=0;n<4;n++){ float fn=float(n);
    i = p + vec2(cos(t-i.x+fn)+sin(t+i.y), sin(t-i.y)+cos(t+i.x+fn));
    s += 1.0/length(vec2(p.x/(sin(i.x+t)/0.01), p.y/(cos(i.y+t)/0.01))); }
  s/=4.0; return pow(1.17-sqrt(s),7.0); }
void main(){ vec2 p = vUv*18.0; float k = clamp(causticsTai(p),0.0,1.0);
  float mo = smoothstep(0.0,0.35,vUv.y)*smoothstep(1.0,0.6,vUv.y)*smoothstep(0.0,0.2,vUv.x)*smoothstep(1.0,0.8,vUv.x);
  vec3 cat = vec3(0.05,0.11,0.18);
  gl_FragColor = vec4(cat + vec3(0.25,0.75,0.85)*k*0.55, mo); }`

/** Đáy cát có ánh sáng khúc xạ (caustics). */
function DayCat() {
  const vatLieu = useRef<THREE.ShaderMaterial>(null)
  const dongBo = useMemo(() => ({ uThoiGian: { value: 0 } }), [])
  useFrame(({ clock }) => {
    if (vatLieu.current) vatLieu.current.uniforms.uThoiGian.value = clock.elapsedTime
  })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.35, -2]}>
      <planeGeometry args={[30, 14]} />
      <shaderMaterial ref={vatLieu} uniforms={dongBo} transparent vertexShader="varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}" fragmentShader={SHADER_DAY_MAU} />
    </mesh>
  )
}

/** Tia sáng xuyên mặt nước, độ sáng dao động chậm. */
function TiaSang() {
  const tia = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ x: -6 + i * 2.1, nghieng: -0.25 + (i % 3) * 0.12, rong: 0.6 + (i % 3) * 0.5, sang: 0.05 + (i % 2) * 0.04 })), [])
  const nhom = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    nhom.current?.children.forEach((m, i) => {
      ;((m as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = tia[i].sang * (0.6 + 0.4 * Math.sin(clock.elapsedTime * 0.6 + i))
    })
  })
  return (
    <group ref={nhom}>
      {tia.map((t) => (
        <mesh key={t.x} position={[t.x, 2, -4]} rotation={[0, 0, t.nghieng]}>
          <planeGeometry args={[t.rong, 14]} />
          <meshBasicMaterial color="#9be7ff" transparent opacity={t.sang} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

/** Bọt khí dùng instancing: một lệnh vẽ cho hàng chục quả bóng. */
function CotBotKhi({ soLuong }: { soLuong: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const duLieu = useMemo(() => Array.from({ length: soLuong }, (_, i) => ({ x: (i % 2 ? 4.2 : -4.6) + Math.sin(i) * 0.3, z: -1 + Math.cos(i) * 0.4, toc: 0.6 + (i % 7) * 0.12, lech: i * 0.37, co: 0.025 + (i % 5) * 0.012 })), [soLuong])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useFrame(({ clock }) => {
    const luoi = ref.current
    if (!luoi) return
    const t = clock.elapsedTime
    duLieu.forEach((b, i) => {
      const y = ((t * b.toc + b.lech) % 7.5) - 3.4
      dummy.position.set(b.x + Math.sin(t * 2 + i) * 0.08, y, b.z)
      dummy.scale.setScalar(b.co * (1 + (y + 3.4) * 0.12))
      dummy.updateMatrix()
      luoi.setMatrixAt(i, dummy.matrix)
    })
    luoi.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, soLuong]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshPhysicalMaterial color="#d6f6ff" transparent opacity={0.45} roughness={0} emissive="#7dd3fc" emissiveIntensity={0.5} />
    </instancedMesh>
  )
}

const CAC_DA = [
  [-5.2, -3.1, -1.5, 0.9],
  [-4.1, -3.2, -0.6, 0.5],
  [4.6, -3.0, -1.8, 1.1],
  [5.6, -3.2, -0.5, 0.55],
  [0.8, -3.25, -3.5, 0.7],
]

function Da() {
  return (
    <>
      {CAC_DA.map(([x, y, z, co], i) => (
        <mesh key={x} position={[x, y, z]} scale={[co * 1.3, co * 0.8, co]} rotation={[i, i * 2, 0]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#0f2236" roughness={0.9} flatShading />
        </mesh>
      ))}
    </>
  )
}

/** Camera nghiêng nhẹ theo chuột. */
function DieuKhienCamera() {
  useFrame(({ camera, pointer, size }) => {
    // Màn hình dọc nhìn thấy ít chiều ngang: lùi camera để đàn cá vẫn nằm trong khung hình
    const tiLe = size.width / size.height
    camera.position.z = tiLe < 1 ? 8 + (1 - tiLe) * 9 : 8
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.03
    camera.position.y += (0.2 + pointer.y * 0.5 - camera.position.y) * 0.03
    camera.lookAt(0, -0.3, 0)
  })
  return null
}

function DenTheoChuot() {
  const ref = useRef<THREE.PointLight>(null)
  const { viewport } = useThree()
  useFrame(({ pointer }) => ref.current?.position.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 3))
  return <pointLight ref={ref} color="#f0abfc" intensity={12} distance={9} />
}

const CAC_MAU_RONG = ['#34d399', '#10b981', '#2dd4bf', '#a3e635']

/** Rong trồng sát hai mép bể; màn hình dọc thì dồn vào trong để vẫn nhìn thấy. */
function NhomRong({ children }: { children: ReactNode }) {
  const { size } = useThree()
  return <group scale={[size.width < size.height ? 0.5 : 1, 1, 1]}>{children}</group>
}

export default function CanhBeCa({ rutGon }: { rutGon: boolean }) {
  const soCa = rutGon ? 4 : 9
  const soRong = rutGon ? 10 : 26
  const cacRong = useMemo(
    () =>
      Array.from({ length: soRong }, (_, i) => ({
        x: (i < soRong / 2 ? -7 + (i % 13) * 0.32 : 3.4 + (i % 13) * 0.32) + Math.sin(i * 7) * 0.2,
        z: -1.5 - (i % 4) * 0.7,
        cao: 2 + ((i * 37) % 10) / 4,
        lech: i * 1.3,
        mau: CAC_MAU_RONG[i % CAC_MAU_RONG.length],
      })),
    [soRong],
  )
  return (
    <Canvas
      dpr={rutGon ? 1 : [1, 1.75]}
      camera={{ position: [0, 0.2, 8], fov: 45 }}
      gl={{ antialias: !rutGon, alpha: false, powerPreference: 'high-performance' }}
      // Lấy sự kiện từ gốc trang: chữ hero phủ lên canvas nhưng cá vẫn bơi theo chuột
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
    >
      <color attach="background" args={['#020b18']} />
      <fog attach="fog" args={['#020b18', rutGon ? 11 : 7, rutGon ? 24 : 20]} />
      <ambientLight intensity={0.5} color="#7dd3fc" />
      <directionalLight position={[2, 8, 4]} intensity={2.2} color="#bae6fd" />
      <directionalLight position={[-6, 2, -3]} intensity={1.2} color="#c084fc" />
      {!rutGon && <DenTheoChuot />}
      <TiaSang />
      <DayCat />
      <Da />
      <NhomRong>
        {cacRong.map((r) => (
          <Rong key={r.lech} {...r} />
        ))}
      </NhomRong>
      {Array.from({ length: soCa }, (_, i) => (
        <CaTuBoi key={i} thuTu={i} />
      ))}
      <CaDanDau />
      <CotBotKhi soLuong={rutGon ? 24 : 70} />
      <Sparkles count={rutGon ? 40 : 160} scale={[16, 8, 8]} size={2.2} speed={0.25} opacity={0.5} color="#a5f3fc" />
      <DieuKhienCamera />
      {!rutGon && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.3} mipmapBlur />
          <ChromaticAberration offset={LECH_SAC_MAU} radialModulation={false} modulationOffset={0} />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
