import { motion } from 'framer-motion'

export function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: React.ReactNode; desc?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[.3em] text-aqua">{eyebrow}</p>
      <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight tracking-tight">{title}</h2>
      {desc && <p className="mt-4 max-w-2xl text-slate-400">{desc}</p>}
    </motion.div>
  )
}
