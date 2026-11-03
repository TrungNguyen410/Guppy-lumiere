import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface TieuDeProps {
  nhanPhu: string
  tieuDe: ReactNode
  moTa?: string
  children?: ReactNode
}

/** Phần đầu trang của mọi trang con trong cửa hàng. */
export function DauTrang({ nhanPhu, tieuDe, moTa, children }: TieuDeProps) {
  return (
    <section className="relative overflow-hidden pt-36 pb-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(34_211_238/0.18),transparent)] blur-2xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-3 text-xs font-semibold tracking-[.3em] text-aqua uppercase">
          {nhanPhu}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
          {tieuDe}
        </motion.h1>
        {moTa && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 max-w-2xl text-slate-400">
            {moTa}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  )
}

/** Tiêu đề của một khu vực trong trang, hiện dần khi cuộn đến. */
export function TieuDeKhuVuc({ nhanPhu, tieuDe, moTa }: Omit<TieuDeProps, 'children'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10"
    >
      <p className="mb-3 text-xs font-semibold tracking-[.3em] text-aqua uppercase">{nhanPhu}</p>
      <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{tieuDe}</h2>
      {moTa && <p className="mt-4 max-w-2xl text-slate-400">{moTa}</p>}
    </motion.div>
  )
}

/** Tiêu đề của trang quản trị. */
export function TieuDeQuanTri({ nhanPhu, tieuDe, moTa, children }: TieuDeProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs tracking-[.3em] text-aqua uppercase">{nhanPhu}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">{tieuDe}</h1>
        {moTa && <p className="mt-1 text-sm text-slate-400">{moTa}</p>}
      </div>
      {children}
    </div>
  )
}
