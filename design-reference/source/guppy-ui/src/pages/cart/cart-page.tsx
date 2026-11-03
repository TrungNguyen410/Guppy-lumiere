import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, ArrowRight, Truck, UserX, ShoppingBag } from 'lucide-react'
import { PageHero } from '@/shared/ui/page-hero'
import { Button } from '@/shared/ui/button'
import { QtyStepper } from '@/shared/ui/qty-stepper'
import { Badge } from '@/shared/ui/badge'
import { formatVnd } from '@/shared/lib/format'
import { ROUTES } from '@/shared/config/routes'
import { shippingFee, useCart } from '@/entities/cart/model/cart-store'
import { GuppySvg } from '@/entities/fish/ui/guppy-svg'
import { UNIT_LABEL } from '@/entities/fish/model/types'

export function OrderSummary({ cta }: { cta?: React.ReactNode }) {
  const { subtotal } = useCart()
  const ship = shippingFee(subtotal)
  const progress = Math.min(100, (subtotal / 500000) * 100)
  return (
    <div className="glass sticky top-28 rounded-[28px] p-6">
      <p className="font-display text-lg font-semibold">Tóm tắt đơn</p>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between text-slate-300"><span>Tạm tính</span><span>{formatVnd(subtotal)}</span></div>
        <div className="flex justify-between text-slate-300"><span>Giao hỏa tốc</span><span>{ship ? formatVnd(ship) : <span className="text-kelp">Miễn phí</span>}</span></div>
      </div>
      <div className="mt-4 rounded-2xl bg-white/[.03] p-3">
        <p className="flex items-center gap-2 text-xs text-slate-400"><Truck className="h-3.5 w-3.5 text-aqua" />
          {progress < 100 ? <>Mua thêm <b className="text-white">{formatVnd(500000 - subtotal)}</b> để miễn phí giao</> : 'Bạn được miễn phí giao hàng!'}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
          <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#c084fc,#fb7185)]" />
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
        <span className="text-sm text-slate-400">Tổng cộng</span>
        <span className="font-display text-3xl font-semibold text-iridescent">{formatVnd(subtotal + ship)}</span>
      </div>
      {cta}
    </div>
  )
}

export function CartPage() {
  const { items, dispatch } = useCart()
  return (
    <>
      <PageHero eyebrow="Giỏ hàng" title={<>Túi cá <span className="text-iridescent">của bạn</span></>} />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((it) => (
              <motion.div key={it.fishId + it.unit} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                className="glass flex flex-wrap items-center gap-5 rounded-3xl p-4">
                <Link to={ROUTES.fish(it.fish.slug)} className="grid h-24 w-32 shrink-0 place-items-center rounded-2xl"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${it.fish.strain.palette.tail1}40, #071226 75%)` }}>
                  <GuppySvg palette={it.fish.strain.palette} tail={it.fish.tailType} pattern={it.fish.strain.pattern} className="w-24" />
                </Link>
                <div className="min-w-40 flex-1">
                  <Link to={ROUTES.fish(it.fish.slug)} className="font-display font-semibold hover:text-aqua">{it.fish.name}</Link>
                  <p className="mt-1 text-sm text-slate-400">{UNIT_LABEL[it.unit]} · {formatVnd(it.price)}</p>
                  {it.preorder && <Badge tone="sun" className="mt-2">Đặt trước – không trừ kho</Badge>}
                </div>
                <QtyStepper value={it.qty} onChange={(q) => dispatch({ type: 'qty', fishId: it.fishId, unit: it.unit, qty: q })} />
                <p className="w-28 text-right font-display text-lg font-semibold">{formatVnd(it.total)}</p>
                <button onClick={() => dispatch({ type: 'remove', fishId: it.fishId, unit: it.unit })} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-slate-500 hover:bg-coral/10 hover:text-coral"><Trash2 className="h-4 w-4" /></button>
              </motion.div>
            ))}
          </AnimatePresence>
          {!items.length && (
            <div className="glass grid place-items-center rounded-3xl py-20 text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-slate-600" />
              <p className="text-slate-400">Giỏ hàng đang trống, bể cá đang chờ bạn!</p>
              <Link to={ROUTES.catalog} className="mt-5"><Button>Chọn cá ngay</Button></Link>
            </div>
          )}
          <p className="flex items-center gap-2 pt-2 text-sm text-slate-400"><UserX className="h-4 w-4 text-aqua" /> Không cần đăng nhập – khách vãng lai vẫn đặt hàng được.</p>
        </div>
        <OrderSummary cta={<Link to={ROUTES.checkout}><Button size="lg" className="mt-6 w-full" disabled={!items.length}>Tiến hành thanh toán <ArrowRight className="h-4 w-4" /></Button></Link>} />
      </div>
    </>
  )
}
