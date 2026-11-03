import { motion } from 'framer-motion'
import { Plus, Baby, Split, Skull, Droplet } from 'lucide-react'
import { BATCHES } from '@/entities/order/model/mock'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'

const stageTone = { 'Cá bột': 'sun', 'Đang phân giới': 'orchid', 'Trưởng thành': 'kelp' } as const

export function AdminBatches() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.3em] text-aqua">Kho cá sống</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Lô cá nuôi</h1>
          <p className="mt-1 text-sm text-slate-400">Tồn kho nằm ở lô: nhập cá đẻ, phân đực/cái khi cá lớn, ghi hao hụt khi cá chết.</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Tạo lô mới</Button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {BATCHES.map((b, i) => {
          const total = b.male + b.female + b.fry
          const seg = [['Đực', b.male, '#22d3ee'], ['Cái', b.female, '#f472b6'], ['Cá bột', b.fry, '#fbbf24']] as const
          return (
            <motion.div key={b.code} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.03] p-5 transition hover:border-aqua/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-slate-400">{b.code}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{b.strain}</p>
                  <p className="text-xs text-slate-500">Bố mẹ {b.parents} · nở {new Date(b.bornAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <Badge tone={stageTone[b.stage]}>{b.stage}</Badge>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <p className="font-display text-4xl font-semibold">{total}<span className="ml-1 text-sm font-normal text-slate-400">con</span></p>
                <p className="flex items-center gap-1 text-xs text-slate-400"><Droplet className="h-3 w-3 text-aqua" />{b.tank}</p>
              </div>
              <div className="mt-3 flex h-2.5 gap-[2px] overflow-hidden rounded-full bg-white/5">
                {seg.filter((s) => s[1] > 0).map(([l, v, c]) => (
                  <motion.div key={l} title={`${l}: ${v}`} initial={{ width: 0 }} animate={{ width: `${(v / total) * 100}%` }} transition={{ duration: 0.9, delay: 0.3 }} style={{ background: c }} />
                ))}
              </div>
              <div className="mt-2 flex gap-4 text-xs text-slate-400">
                {seg.map(([l, v, c]) => <span key={l} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{l} <b className="text-slate-200">{v}</b></span>)}
                <span className="ml-auto flex items-center gap-1 text-coral"><Skull className="h-3 w-3" />{b.dead}</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <Button size="sm" variant="outline"><Baby className="h-3.5 w-3.5" /> Nhập đẻ</Button>
                <Button size="sm" variant="outline" disabled={!b.fry}><Split className="h-3.5 w-3.5" /> Phân giới</Button>
                <Button size="sm" variant="outline"><Skull className="h-3.5 w-3.5" /> Hao hụt</Button>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[.03] p-6">
        <p className="mb-4 font-display font-semibold">Nhật ký biến động kho (StockMovement)</p>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-500"><th className="pb-3 font-medium">Thời gian</th><th className="pb-3 font-medium">Lô</th><th className="pb-3 font-medium">Loại</th><th className="pb-3 font-medium">Số lượng</th><th className="pb-3 font-medium">Ghi chú</th></tr></thead>
          <tbody className="text-slate-300">
            {[
              ['01/11 11:05', 'LO-2410-GN', 'Bán', '−2 đực', 'Đơn GP24110931'],
              ['01/11 07:50', 'LO-2410-MB', 'Bán', '−3 đực, −6 cái', 'Đơn GP24110911'],
              ['31/10 18:20', 'LO-2411-FG2', 'Hao hụt', '−4 bột', 'Nhiệt độ giảm đêm'],
              ['31/10 09:00', 'LO-2410-GN', 'Phân giới', '+6 đực, +4 cái, −10 bột', 'Cá 9 tuần tuổi'],
              ['30/10 08:30', 'LO-2411-AL', 'Nhập đẻ', '+85 bột', 'Lứa 1 cặp AL-01 × AL-03'],
            ].map((r) => (
              <tr key={r[0] + r[1]} className="border-t border-white/5">
                <td className="py-3 text-xs text-slate-500">{r[0]}</td><td className="py-3 font-mono text-xs">{r[1]}</td>
                <td className="py-3"><Badge tone={r[2] === 'Hao hụt' ? 'coral' : r[2] === 'Nhập đẻ' ? 'kelp' : r[2] === 'Phân giới' ? 'orchid' : 'aqua'}>{r[2]}</Badge></td>
                <td className="py-3">{r[3]}</td><td className="py-3 text-slate-400">{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
