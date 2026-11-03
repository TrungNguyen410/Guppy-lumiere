import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function PageHero({ eyebrow, title, desc, children }: { eyebrow: string; title: ReactNode; desc?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,.18),transparent)] blur-2xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-3 text-xs font-semibold uppercase tracking-[.3em] text-aqua">{eyebrow}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl font-semibold tracking-tight md:text-6xl">{title}</motion.h1>
        {desc && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 max-w-2xl text-slate-400">{desc}</motion.p>}
        {children}
      </div>
    </section>
  )
}
