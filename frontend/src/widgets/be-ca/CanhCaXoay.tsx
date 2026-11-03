import { ContactShadows, Environment, Float, Lightformer, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { BangMau, KieuDuoi } from '@/entities/san-pham/model'
import { Ca3D } from '@/entities/san-pham/ui/Ca3D'

export default function CanhCaXoay({ bangMau, duoi }: { bangMau: BangMau; duoi: KieuDuoi }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.3, 5.2], fov: 40 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={2.5} />
      <pointLight position={[-3, -1, 2]} intensity={20} color={bangMau.duoi1} />
      <Environment resolution={256}>
        <Lightformer form="ring" intensity={1.2} color="#67e8f9" position={[0, 3, -3]} scale={4} />
        <Lightformer intensity={0.8} color="#f0abfc" position={[-4, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer intensity={0.8} color="#fde68a" position={[4, 1, 1]} scale={[2, 6, 1]} />
      </Environment>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        <Ca3D bangMau={bangMau} duoi={duoi} scale={1.05} position={[0.5, 0, 0]} tocDo={1.2} doSang={0.45} />
      </Float>
      <Sparkles count={60} scale={[5, 3, 3]} size={3} speed={0.4} color="#a5f3fc" opacity={0.6} />
      <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={6} blur={2.6} far={3} color={bangMau.duoi2} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.7} />
    </Canvas>
  )
}
