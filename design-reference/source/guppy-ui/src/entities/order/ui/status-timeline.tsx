import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { GuppySvg } from '@/entities/fish/ui/guppy-svg'
import { STRAINS } from '@/entities/fish/model/mock'
import { formatDate } from '@/shared/lib/format'
import { STATUS_FLOW, STATUS_META, type Order } from '../model/types'

/** Dòng thời gian trạng thái – chú cá bơi tới bước hiện tại */
export function StatusTimeline({ order }: { order: Order }) {
  const cancelled = order.status === 'CANCELLED'
  const idx = cancelled ? 0 : STATUS_FLOW.indexOf(order.status)
  const pct = (idx / (STATUS_FLOW.length - 1)) * 100
  const at = (s: string) => order.history.find((h) => h.status === s)?.at
  return (
    <div className="relative px-2 pt-14">
      <div className="absolute left-6 right-6 top-[74px] h-1 rounded-full bg-white/5" />
      <motion.div initial={{ width: 0 }} animate={{ width: `calc((100% - 48px) * ${pct / 100})` }} transition={{ duration: 1.6, ease: 'easeInOut' }}
        className="absolute left-6 top-[74px] h-1 rounded-full bg-[linear-gradient(90deg,#fbbf24,#22d3ee,#c084fc,#fb7185,#34d399)] shadow-[0_0_14px_rgba(34,211,238,.7)]" />
      {!cancelled && (
        <motion.div initial={{ left: '24px' }} animate={{ left: `calc(24px + (100% - 48px) * ${pct / 100})` }} transition={{ duration: 1.6, ease: 'easeInOut' }}
          className="absolute top-1 w-16 -translate-x-1/2">
          <GuppySvg palette={STRAINS[6].palette} tail="delta" className="w-full -scale-x-100 drop-shadow-[0_0_12px_rgba(192,132,252,.8)]" />
        </motion.div>
      )}
      <div className="relative flex justify-between">
        {STATUS_FLOW.map((s, i) => {
          const done = !cancelled && i <= idx
          const m = STATUS_META[s]
          return (
            <div key={s} className="flex w-20 flex-col items-center text-center">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.15 }}
                className="grid h-9 w-9 place-items-center rounded-full border-2"
                style={{ borderColor: done ? m.color : 'rgba(255,255,255,.1)', background: done ? `${m.color}22` : '#071226', boxShadow: done ? `0 0 16px ${m.color}` : undefined }}>
                {done ? <Check className="h-4 w-4" style={{ color: m.color }} /> : <span className="h-1.5 w-1.5 rounded-full bg-white/20" />}
              </motion.span>
              <p className={`mt-2 text-xs font-medium ${done ? 'text-white' : 'text-slate-500'}`}>{m.label}</p>
              <p className="text-[10px] text-slate-500">{at(s) ? formatDate(at(s)!) : '—'}</p>
            </div>
          )
        })}
      </div>
      {cancelled && (
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-coral/30 bg-coral/10 p-3 text-sm text-coral"><X className="h-4 w-4" /> Đơn hàng đã bị hủy lúc {formatDate(at('CANCELLED')!)}</div>
      )}
    </div>
  )
}
