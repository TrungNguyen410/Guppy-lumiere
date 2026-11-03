import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate } from 'react-router-dom'
import { TrendingUp, ShoppingCart, Fish, Skull } from 'lucide-react'
import { ORDERS, REVENUE_7D, BATCHES } from '@/entities/order/model/mock'
import { STATUS_META, orderTotal, type OrderStatus } from '@/entities/order/model/types'
import { StatusBadge } from '@/entities/order/ui/status-badge'
import { formatVnd } from '@/shared/lib/format'
import { useRole } from './admin-layout'

function Kpi({ icon: I, label, value, delta, color, i }: { icon: typeof Fish; label: string; value: string; delta: string; color: string; i: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.03] p-5">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl" style={{ background: color, opacity: 0.25 }} />
      <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${color}22` }}><I className="h-5 w-5" style={{ color }} /></span>
      <p className="mt-4 text-xs text-slate-400">{label}</p>
      <p className="font-display text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{delta}</p>
    </motion.div>
  )
}

function RevenueChart() {
  const [hover, setHover] = useState<number | null>(null)
  const W = 600, H = 220, P = 30
  const max = 8
  const pts = REVENUE_7D.map((d, i) => [P + (i * (W - P * 2)) / (REVENUE_7D.length - 1), H - P - (d.value / max) * (H - P * 2)] as const)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const area = `${line} L${pts.at(-1)![0]},${H - P} L${pts[0][0]},${H - P} Z`
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <div className="flex items-end justify-between">
        <div><p className="font-display font-semibold">Doanh thu 7 ngày</p><p className="text-xs text-slate-500">Đơn vị: triệu đồng</p></div>
        <p className="font-display text-2xl font-semibold">30,4 tr</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" onMouseLeave={() => setHover(null)}>
        <defs><linearGradient id="rev" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity=".35" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" /></linearGradient></defs>
        {[0, 2, 4, 6, 8].map((v) => {
          const y = H - P - (v / max) * (H - P * 2)
          return <g key={v}><line x1={P} x2={W - P} y1={y} y2={y} stroke="rgba(255,255,255,.06)" /><text x={P - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#64748b">{v}</text></g>
        })}
        <motion.path d={area} fill="url(#rev)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
        <motion.path d={line} fill="none" stroke="#22d3ee" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }} />
        {pts.map((p, i) => (
          <g key={i} onMouseEnter={() => setHover(i)}>
            <rect x={p[0] - 30} y={0} width={60} height={H} fill="transparent" />
            <text x={p[0]} y={H - 8} fontSize="11" textAnchor="middle" fill="#94a3b8">{REVENUE_7D[i].day}</text>
            {hover === i && <line x1={p[0]} x2={p[0]} y1={P} y2={H - P} stroke="rgba(255,255,255,.2)" strokeDasharray="3 3" />}
            <circle cx={p[0]} cy={p[1]} r={hover === i ? 6 : 4} fill="#030814" stroke="#22d3ee" strokeWidth="2" />
            {hover === i && (
              <g><rect x={p[0] - 42} y={p[1] - 38} width="84" height="26" rx="8" fill="#0c2340" stroke="rgba(255,255,255,.15)" />
                <text x={p[0]} y={p[1] - 21} fontSize="11" textAnchor="middle" fill="#e2e8f0">{REVENUE_7D[i].value.toLocaleString('vi-VN')} triệu</text></g>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

function StatusBars() {
  const counts = (Object.keys(STATUS_META) as OrderStatus[]).map((s) => ({ s, n: ORDERS.filter((o) => o.status === s).length }))
  const max = Math.max(...counts.map((c) => c.n))
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <p className="font-display font-semibold">Đơn theo trạng thái</p>
      <div className="mt-5 space-y-3.5">
        {counts.map(({ s, n }, i) => (
          <div key={s} className="grid grid-cols-[110px_1fr_24px] items-center gap-3 text-sm" title={`${STATUS_META[s].label}: ${n} đơn`}>
            <span className="text-slate-300">{STATUS_META[s].label}</span>
            <div className="h-2.5 rounded-full bg-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(n / max) * 100}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.8 }}
                className="h-full rounded-full" style={{ background: STATUS_META[s].color }} />
            </div>
            <span className="text-right font-semibold">{n}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopStrains() {
  const data = [['Full Gold', 812], ['Blue Grass', 560], ['Galaxy Neon', 402], ['Koi Tricolor', 341], ['Moscow Blue', 233]] as const
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <p className="font-display font-semibold">Dòng cá bán chạy</p>
      <p className="text-xs text-slate-500">Số cá đã bán</p>
      <div className="mt-5 space-y-3">
        {data.map(([n, v], i) => (
          <div key={n} title={`${n}: ${v}`}>
            <div className="mb-1 flex justify-between text-sm"><span className="text-slate-300">{n}</span><span className="font-semibold">{v}</span></div>
            <div className="h-2 rounded-full bg-white/5"><motion.div initial={{ width: 0 }} animate={{ width: `${(v / 812) * 100}%` }} transition={{ delay: i * 0.08, duration: 0.8 }} className="h-full rounded-full bg-orchid" /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const role = useRole()
  if (role === 'STAFF') return <Navigate to="/quan-tri/don-hang" replace />
  const stock = BATCHES.reduce((s, b) => s + b.male + b.female + b.fry, 0)
  const dead = BATCHES.reduce((s, b) => s + b.dead, 0)
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[.3em] text-aqua">Chủ nhật, 01/11/2026</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Tổng quan cửa hàng</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi i={0} icon={TrendingUp} label="Doanh thu hôm nay" value="7.420.000đ" delta="▲ 19% so với hôm qua" color="#22d3ee" />
        <Kpi i={1} icon={ShoppingCart} label="Đơn chờ xác nhận" value={String(ORDERS.filter((o) => o.status === 'PENDING').length)} delta="Cần xử lý trong 15 phút" color="#fbbf24" />
        <Kpi i={2} icon={Fish} label="Cá tồn trong các lô" value={stock.toLocaleString('vi-VN')} delta={`${BATCHES.length} lô đang nuôi`} color="#c084fc" />
        <Kpi i={3} icon={Skull} label="Hao hụt tháng này" value={`${dead} con`} delta={`≈ ${((dead / (stock + dead)) * 100).toFixed(1)}% tổng đàn`} color="#fb7185" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <RevenueChart />
        <StatusBars />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        <TopStrains />
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
          <p className="mb-4 font-display font-semibold">Đơn mới nhất</p>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-slate-500"><th className="pb-3 font-medium">Mã đơn</th><th className="pb-3 font-medium">Khách</th><th className="pb-3 font-medium">Tổng</th><th className="pb-3 font-medium">Trạng thái</th></tr></thead>
            <tbody>
              {ORDERS.slice(0, 5).map((o) => (
                <tr key={o.code} className="border-t border-white/5">
                  <td className="py-3 font-mono text-xs">{o.code}</td>
                  <td className="py-3">{o.customer}<span className="block text-xs text-slate-500">{o.city}</span></td>
                  <td className="py-3 font-medium">{formatVnd(orderTotal(o))}</td>
                  <td className="py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
