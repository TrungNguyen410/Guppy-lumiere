import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface Props {
  children: ReactNode
  className?: string
  doNghieng?: number
}

/** Thẻ nghiêng 3D theo con trỏ, kèm vệt sáng (shine) chạy theo vị trí chuột. */
export function TiltCard({ children, className, doNghieng = 12 }: Props) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const xoayX = useSpring(useTransform(y, [0, 1], [doNghieng, -doNghieng]), { stiffness: 200, damping: 18 })
  const xoayY = useSpring(useTransform(x, [0, 1], [-doNghieng, doNghieng]), { stiffness: 200, damping: 18 })
  const vetSang = useTransform([x, y], ([vx, vy]) => `radial-gradient(400px circle at ${Number(vx) * 100}% ${Number(vy) * 100}%, rgb(255 255 255 / 0.14), transparent 45%)`)

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        onMouseMove={(su) => {
          const khung = su.currentTarget.getBoundingClientRect()
          x.set((su.clientX - khung.left) / khung.width)
          y.set((su.clientY - khung.top) / khung.height)
        }}
        onMouseLeave={() => {
          x.set(0.5)
          y.set(0.5)
        }}
        style={{ rotateX: xoayX, rotateY: xoayY, transformStyle: 'preserve-3d' }}
        className={cn('group relative h-full')}
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: vetSang }}
        />
      </motion.div>
    </div>
  )
}
