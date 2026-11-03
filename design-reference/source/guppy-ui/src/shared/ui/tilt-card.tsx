import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/** Thẻ nghiêng 3D theo con trỏ chuột (perspective + rotateX/Y) */
export function TiltCard({ children, className, intensity = 12 }: { children: ReactNode; className?: string; intensity?: number }) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rx = useSpring(useTransform(y, [0, 1], [intensity, -intensity]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(x, [0, 1], [-intensity, intensity]), { stiffness: 200, damping: 18 })
  const glareX = useTransform(x, (v) => `${v * 100}%`)
  const glareY = useTransform(y, (v) => `${v * 100}%`)
  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          x.set((e.clientX - r.left) / r.width)
          y.set((e.clientY - r.top) / r.height)
        }}
        onMouseLeave={() => { x.set(0.5); y.set(0.5) }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className={cn('group relative h-full')}
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform([glareX, glareY], ([gx, gy]) =>
              `radial-gradient(400px circle at ${gx} ${gy}, rgba(255,255,255,.14), transparent 45%)`),
            borderRadius: 28,
          }}
        />
      </motion.div>
    </div>
  )
}
