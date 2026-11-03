import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X, Phone, MapPin, UserRound } from 'lucide-react'
import { ORDERS } from '@/entities/order/model/mock'
import { STATUS_FLOW, STATUS_META, orderTotal, type Order, type OrderStatus } from '@/entities/order/model/types'
import { UNIT_SHORT } from '@/entities/fish/model/types'
import { formatDate, formatVnd } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'

const COLUMNS: OrderStatus[] = [...STATUS_FLOW, 'CANCELLED']

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(ORDERS)
  const move = (code: string, status: OrderStatus) => setOrders((os) => os.map((o) => (o.code === code ? { ...o, status } : o)))
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.3em] text-aqua">Xử lý đơn</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Bảng đơn hàng</h1>
          <p className="mt-1 text-sm text-slate-400">Chờ xác nhận → Đã xác nhận → Đang đóng gói → Đang giao → Hoàn tất. Đơn chỉ hủy được trước khi giao.</p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const m = STATUS_META[col]
          const list = orders.filter((o) => o.status === col)
          return (
            <div key={col} className="w-72 shrink-0 rounded-3xl border border-white/5 bg-white/[.02] p-3">
              <div className="mb-3 flex items-center justify-between px-2 pt-1">
                <p className="flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 rounded-full" style={{ background: m.color, boxShadow: `0 0 10px ${m.color}` }} />{m.label}</p>
                <span className="rounded-full bg-white/5 px-2 text-xs text-slate-400">{list.length}</span>
              </div>
              <div className="min-h-32 space-y-3">
                <AnimatePresence>
                  {list.map((o) => {
                    const next = STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1]
                    const canCancel = ['PENDING', 'CONFIRMED', 'PACKING'].includes(o.status)
                    return (
                      <motion.div key={o.code} layout layoutId={o.code} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="rounded-2xl border border-white/10 bg-deep/80 p-4 shadow-lg" style={{ borderTop: `2px solid ${m.color}` }}>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-slate-300">{o.code}</span>
                          {o.guest ? <Badge tone="slate">Vãng lai</Badge> : <Badge tone="orchid">Thành viên</Badge>}
                        </div>
                        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium"><UserRound className="h-3.5 w-3.5 text-slate-500" />{o.customer}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><Phone className="h-3 w-3" />{o.phone}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="h-3 w-3" />{o.city}</p>
                        <div className="mt-3 space-y-1 border-t border-white/5 pt-3 text-xs text-slate-300">
                          {o.lines.map((l) => <p key={l.fishName + l.unit} className="flex justify-between"><span className="truncate">{l.fishName}</span><span className="text-slate-500">{UNIT_SHORT[l.unit]}×{l.qty}</span></p>)}
                        </div>
                        <div className="mt-3">
                          <span className="block font-display font-semibold">{formatVnd(orderTotal(o))}</span>
                          <span className="text-[10px] text-slate-500">{o.payment === 'COD' ? 'COD' : 'Chuyển khoản'} · {formatDate(o.createdAt)}</span>
                        </div>
                        {(next || canCancel) && (
                          <div className="mt-3 flex gap-2">
                            {next && <Button size="sm" className="flex-1" onClick={() => move(o.code, next)}>{STATUS_META[next].label} <ArrowRight className="h-3 w-3" /></Button>}
                            {canCancel && <Button size="sm" variant="danger" onClick={() => move(o.code, 'CANCELLED')}><X className="h-3 w-3" /></Button>}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
