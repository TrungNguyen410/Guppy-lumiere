import { motion } from 'framer-motion'
import { AuthCard } from '@/features/auth/auth-card'
import { GuppySvg } from '@/entities/fish/ui/guppy-svg'
import { STRAINS } from '@/entities/fish/model/mock'
import { Bubbles } from '@/shared/ui/bubbles'

export function AuthPage() {
  const orbit = STRAINS.slice(0, 6)
  return (
    <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pt-28 lg:grid-cols-2">
      <Bubbles count={16} />
      <div className="relative hidden aspect-square lg:block" style={{ perspective: 1200 }}>
        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,.25),rgba(192,132,252,.12)_50%,transparent_70%)] blur-xl" />
        <div className="absolute inset-[30%] grid place-items-center rounded-full border border-white/10 bg-white/[.03] backdrop-blur-xl">
          <div className="text-center">
            <p className="font-display text-5xl font-semibold text-iridescent">Guppy</p>
            <p className="mt-1 text-xs uppercase tracking-[.4em] text-slate-400">Lumière Club</p>
          </div>
        </div>
        <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute inset-0" style={{ rotateX: 58, transformStyle: 'preserve-3d' }}>
          {orbit.map((s, i) => {
            const a = (i / orbit.length) * Math.PI * 2
            return (
              <div key={s.id} className="absolute w-28" style={{ left: `${50 + Math.cos(a) * 42}%`, top: `${50 + Math.sin(a) * 42}%`, transform: `translate(-50%,-50%) rotate(${(a * 180) / Math.PI + 90}deg)` }}>
                <GuppySvg palette={s.palette} tail={(['delta', 'veil', 'round', 'lyre', 'spade', 'doubleSword'] as const)[i]} pattern={s.pattern} className="w-full -scale-x-100" />
              </div>
            )
          })}
        </motion.div>
        <div className="absolute inset-0 rounded-full border border-dashed border-white/10" />
      </div>
      <div className="flex justify-center lg:justify-end"><AuthCard /></div>
    </div>
  )
}
