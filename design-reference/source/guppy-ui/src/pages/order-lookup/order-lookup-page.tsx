import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Phone, CreditCard, SearchX, Ban, Video } from 'lucide-react'
import { PageHero } from '@/shared/ui/page-hero'
import { Button } from '@/shared/ui/button'
import { formatDate, formatVnd } from '@/shared/lib/format'
import { findOrder } from '@/entities/order/model/mock'
import { orderTotal, type Order } from '@/entities/order/model/types'
import { StatusBadge } from '@/entities/order/ui/status-badge'
import { StatusTimeline } from '@/entities/order/ui/status-timeline'
import { UNIT_LABEL } from '@/entities/fish/model/types'
import { LookupForm } from '@/features/order-lookup/lookup-form'

export function OrderLookupPage() {
  const [res, setRes] = useState<Order | null | undefined>(() => findOrder('GP24110931', '0901234567'))
  return (
    <>
      <PageHero eyebrow="Tra cứu đơn" title={<>Đơn cá của bạn <span className="text-iridescent">đang ở đâu?</span></>} desc="Nhập mã đơn và số điện thoại đã dùng khi đặt hàng. Không cần đăng nhập.">
        <LookupForm onSearch={(c, p) => setRes(findOrder(c, p) ?? null)} />
        <p className="mt-3 text-xs text-slate-500">Thử dữ liệu mẫu: GP24110927 / 0912345678 · GP24110899 / 0944777999</p>
      </PageHero>
      <div className="mx-auto max-w-5xl px-6">
        <AnimatePresence mode="wait">
          {res ? (
            <motion.div key={res.code} initial={{ opacity: 0, y: 30, rotateX: -10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -20 }}
              className="glass rounded-[32px] p-6 md:p-8" style={{ transformPerspective: 1200 }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Mã đơn</p>
                  <p className="font-display text-3xl font-semibold tracking-wider">{res.code}</p>
                  <p className="mt-1 text-xs text-slate-500">Đặt lúc {formatDate(res.createdAt)} · {res.guest ? 'Khách vãng lai' : 'Thành viên'}</p>
                </div>
                <StatusBadge status={res.status} />
              </div>
              <StatusTimeline order={res} />
              <div className="mt-10 grid gap-6 md:grid-cols-[1fr_280px]">
                <div className="space-y-2">
                  {res.lines.map((l) => (
                    <div key={l.fishName + l.unit} className="flex justify-between rounded-2xl bg-white/[.03] px-4 py-3 text-sm">
                      <span>{l.fishName} <span className="text-slate-500">· {UNIT_LABEL[l.unit]} × {l.qty}</span></span>
                      <span className="font-medium">{formatVnd(l.price * l.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 pt-2 text-sm text-slate-400"><span>Phí giao hỏa tốc</span><span>{res.shipping ? formatVnd(res.shipping) : 'Miễn phí'}</span></div>
                  <div className="flex justify-between px-4 text-lg"><span>Tổng</span><span className="font-display font-semibold text-iridescent">{formatVnd(orderTotal(res))}</span></div>
                </div>
                <div className="space-y-3 rounded-3xl bg-white/[.03] p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">{res.customer}</p>
                  <p className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-aqua" /> {res.phone}</p>
                  <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-aqua" /> {res.address}, {res.city}</p>
                  <p className="flex gap-2"><CreditCard className="h-4 w-4 shrink-0 text-aqua" /> {res.payment === 'COD' ? 'Thanh toán khi nhận' : 'Chuyển khoản'}</p>
                  {res.status === 'PENDING' && <Button variant="danger" size="sm" className="w-full"><Ban className="h-3.5 w-3.5" /> Hủy đơn</Button>}
                  {res.status === 'COMPLETED' && <Button variant="outline" size="sm" className="w-full"><Video className="h-3.5 w-3.5" /> Báo cá chết (24h)</Button>}
                </div>
              </div>
            </motion.div>
          ) : res === null ? (
            <motion.div key="nf" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass grid place-items-center rounded-[32px] py-16 text-center">
              <SearchX className="mb-3 h-12 w-12 text-coral" />
              <p className="font-display text-lg font-semibold">Không tìm thấy đơn hàng</p>
              <p className="mt-1 text-sm text-slate-400">Kiểm tra lại mã đơn và số điện thoại nhé.</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  )
}
