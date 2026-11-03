import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PartyPopper, Copy } from 'lucide-react'
import { PageHero } from '@/shared/ui/page-hero'
import { Button } from '@/shared/ui/button'
import { ROUTES } from '@/shared/config/routes'
import { formatVnd } from '@/shared/lib/format'
import { useCart } from '@/entities/cart/model/cart-store'
import { GuppySvg } from '@/entities/fish/ui/guppy-svg'
import { UNIT_SHORT } from '@/entities/fish/model/types'
import { STRAINS } from '@/entities/fish/model/mock'
import { CheckoutForm, type CheckoutData } from '@/features/checkout/checkout-form'
import { OrderSummary } from '@/pages/cart/cart-page'

function Steps({ step }: { step: number }) {
  const s = ['Giỏ hàng', 'Thông tin', 'Hoàn tất']
  return (
    <div className="mt-8 flex items-center gap-3">
      {s.map((t, i) => (
        <div key={t} className="flex items-center gap-3">
          <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${i <= step ? 'bg-[linear-gradient(135deg,#67e8f9,#c084fc)] text-abyss' : 'bg-white/5 text-slate-500'}`}>{i + 1}</span>
          <span className={`text-sm ${i <= step ? 'text-white' : 'text-slate-500'}`}>{t}</span>
          {i < s.length - 1 && <span className={`h-px w-10 md:w-20 ${i < step ? 'bg-aqua' : 'bg-white/10'}`} />}
        </div>
      ))}
    </div>
  )
}

function SuccessModal({ code, data }: { code: string; data: CheckoutData }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] grid place-items-center bg-abyss/80 p-6 backdrop-blur-md">
      {STRAINS.map((s, i) => (
        <motion.div key={s.id} className="pointer-events-none absolute w-20" initial={{ x: -600, y: (i - 4) * 70, opacity: 0 }}
          animate={{ x: 700, opacity: [0, 1, 1, 0] }} transition={{ duration: 4 + i * 0.3, delay: i * 0.15, repeat: Infinity }}>
          <GuppySvg palette={s.palette} tail="delta" className="w-full -scale-x-100" />
        </motion.div>
      ))}
      <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.4 }}
        className="glass-strong relative w-full max-w-md rounded-[32px] p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(135deg,#67e8f9,#c084fc,#fb7185)]"><PartyPopper className="h-8 w-8 text-abyss" /></span>
        <h2 className="mt-5 font-display text-2xl font-semibold">Đặt hàng thành công!</h2>
        <p className="mt-2 text-sm text-slate-400">Cảm ơn {data.name || 'bạn'}. Nhân viên sẽ gọi xác nhận trong 15 phút.</p>
        <div className="mt-6 rounded-2xl border border-dashed border-aqua/40 bg-aqua/5 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Mã đơn hàng</p>
          <p className="mt-1 flex items-center justify-center gap-2 font-display text-3xl font-semibold tracking-wider text-iridescent">{code} <Copy className="h-4 w-4 text-aqua" /></p>
          <p className="mt-1 text-xs text-slate-500">Dùng mã đơn + SĐT để tra cứu</p>
        </div>
        <div className="mt-6 flex gap-3">
          <Link to={ROUTES.lookup} className="flex-1"><Button className="w-full">Tra cứu đơn</Button></Link>
          <Link to={ROUTES.home} className="flex-1"><Button variant="glass" className="w-full">Về trang chủ</Button></Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function CheckoutPage() {
  const { items } = useCart()
  const [done, setDone] = useState<CheckoutData | null>(null)
  return (
    <>
      <PageHero eyebrow="Thanh toán" title={<>Chỉ còn <span className="text-iridescent">một bước</span></>} desc="Không cần tài khoản. Điền họ tên, số điện thoại và địa chỉ là xong.">
        <Steps step={done ? 2 : 1} />
      </PageHero>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_380px]">
        <CheckoutForm onSubmit={setDone} />
        <div className="space-y-4">
          <div className="glass rounded-[28px] p-5">
            <p className="mb-3 text-sm font-semibold">Sản phẩm ({items.length})</p>
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.fishId + it.unit} className="flex items-center gap-3">
                  <span className="relative grid h-12 w-16 place-items-center rounded-xl bg-white/5">
                    <GuppySvg palette={it.fish.strain.palette} tail={it.fish.tailType} animated={false} className="w-12" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-coral text-[10px] font-bold">{it.qty}</span>
                  </span>
                  <span className="flex-1 text-sm"><span className="line-clamp-1">{it.fish.name}</span><span className="text-xs text-slate-500">{UNIT_SHORT[it.unit]}</span></span>
                  <span className="text-sm font-medium">{formatVnd(it.total)}</span>
                </div>
              ))}
            </div>
          </div>
          <OrderSummary />
        </div>
      </div>
      <AnimatePresence>{done && <SuccessModal code="GP24110942" data={done} />}</AnimatePresence>
    </>
  )
}
