import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Banknote, Landmark, Check, Copy } from 'lucide-react'
import { Input, Label, Textarea } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/cn'
import type { PaymentMethod } from '@/entities/order/model/types'

export interface CheckoutData { name: string; phone: string; address: string; city: string; note: string; payment: PaymentMethod }

const CITIES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng']

function QrMock() {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21)
    const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || (x > a + 1 && x < a + 5 && y > b + 1 && y < b + 5))
    if (finder(0, 0) || finder(14, 0) || finder(0, 14)) return true
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) return false
    return ((x * 7 + y * 13 + x * y) % 5) < 2
  })
  return (
    <div className="grid h-36 w-36 shrink-0 grid-cols-[repeat(21,1fr)] rounded-xl bg-white p-2">
      {cells.map((c, i) => <span key={i} className={c ? 'bg-abyss' : ''} />)}
    </div>
  )
}

export function CheckoutForm({ onSubmit }: { onSubmit: (d: CheckoutData) => void }) {
  const [d, setD] = useState<CheckoutData>({ name: '', phone: '', address: '', city: CITIES[0], note: '', payment: 'COD' })
  const set = (p: Partial<CheckoutData>) => setD({ ...d, ...p })
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(d) }} className="space-y-6">
      <div className="glass rounded-[28px] p-6">
        <p className="mb-5 flex items-center gap-3 font-display text-lg font-semibold"><span className="grid h-7 w-7 place-items-center rounded-full bg-aqua/15 text-sm text-aqua">1</span> Thông tin nhận cá</p>
        <div className="grid gap-4 md:grid-cols-2">
          <label><Label>Họ và tên *</Label><Input required value={d.name} onChange={(e) => set({ name: e.target.value })} placeholder="Nguyễn Văn A" /></label>
          <label><Label hint="dùng để tra cứu đơn">Số điện thoại *</Label><Input required pattern="0\d{9}" value={d.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="09xx xxx xxx" /></label>
          <label className="md:col-span-2"><Label>Địa chỉ *</Label><Input required value={d.address} onChange={(e) => set({ address: e.target.value })} placeholder="Số nhà, đường, phường/xã, quận/huyện" /></label>
          <div className="md:col-span-2">
            <Label hint="cá sống chỉ giao hỏa tốc 3 thành phố">Tỉnh / Thành phố *</Label>
            <div className="grid grid-cols-3 gap-2">
              {CITIES.map((c) => (
                <button type="button" key={c} onClick={() => set({ city: c })}
                  className={cn('cursor-pointer rounded-2xl border px-3 py-3 text-sm transition', d.city === c ? 'border-aqua/60 bg-aqua/10 text-white' : 'border-white/10 text-slate-400 hover:border-white/25')}>{c}</button>
              ))}
            </div>
          </div>
          <label className="md:col-span-2"><Label hint="không bắt buộc">Ghi chú</Label><Textarea value={d.note} onChange={(e) => set({ note: e.target.value })} placeholder="Giao giờ hành chính, gọi trước 15 phút…" /></label>
        </div>
      </div>

      <div className="glass rounded-[28px] p-6">
        <p className="mb-5 flex items-center gap-3 font-display text-lg font-semibold"><span className="grid h-7 w-7 place-items-center rounded-full bg-aqua/15 text-sm text-aqua">2</span> Phương thức thanh toán</p>
        <div className="grid gap-3 md:grid-cols-2">
          {([['COD', Banknote, 'Thanh toán khi nhận (COD)', 'Kiểm tra cá còn khỏe rồi mới trả tiền'], ['BANK_TRANSFER', Landmark, 'Chuyển khoản ngân hàng', 'Quét mã QR, xác nhận tự động']] as const).map(([k, I, t, s]) => (
            <button type="button" key={k} onClick={() => set({ payment: k })}
              className={cn('relative flex cursor-pointer items-start gap-4 rounded-2xl border p-4 text-left transition', d.payment === k ? 'border-transparent bg-white/[.05]' : 'border-white/10 hover:border-white/25')}>
              {d.payment === k && <motion.span layoutId="pay-ring" className="border-iridescent absolute inset-0 rounded-2xl" />}
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5"><I className="h-5 w-5 text-aqua" /></span>
              <span className="relative"><span className="block text-sm font-semibold">{t}</span><span className="text-xs text-slate-400">{s}</span></span>
              {d.payment === k && <Check className="relative ml-auto h-5 w-5 text-aqua" />}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {d.payment === 'BANK_TRANSFER' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-4 flex flex-wrap items-center gap-6 rounded-2xl border border-dashed border-aqua/30 bg-aqua/5 p-5">
                <QrMock />
                <div className="space-y-1.5 text-sm">
                  <p className="text-slate-400">Ngân hàng: <b className="text-white">Vietcombank</b></p>
                  <p className="text-slate-400">Số tài khoản: <b className="text-white">0071 000 777 999</b> <Copy className="inline h-3.5 w-3.5 cursor-pointer text-aqua" /></p>
                  <p className="text-slate-400">Chủ TK: <b className="text-white">GUPPY LUMIERE</b></p>
                  <p className="text-slate-400">Nội dung: <b className="text-sun">Mã đơn + SĐT</b></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button type="submit" size="lg" className="w-full">Đặt hàng ngay</Button>
    </form>
  )
}
