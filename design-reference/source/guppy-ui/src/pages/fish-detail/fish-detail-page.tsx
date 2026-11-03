import { lazy, Suspense, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Star, Thermometer, Droplets, Ruler, CalendarDays, Hash, Move3d, ShoppingBag, Zap, Truck, ShieldCheck, Gem } from 'lucide-react'
import { findFish, FISHES } from '@/entities/fish/model/mock'
import { TAIL_LABEL, UNIT_LABEL, type SaleUnit } from '@/entities/fish/model/types'
import { FishCard } from '@/entities/fish/ui/fish-card'
import { useCart } from '@/entities/cart/model/cart-store'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { QtyStepper } from '@/shared/ui/qty-stepper'
import { formatVnd } from '@/shared/lib/format'
import { ROUTES } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'

const FishViewer = lazy(() => import('@/widgets/fish-viewer/fish-viewer').then((m) => ({ default: m.FishViewer })))

function RangeBar({ icon: Icon, label, min, max, lo, hi, unit, color }: { icon: typeof Thermometer; label: string; min: number; max: number; lo: number; hi: number; unit: string; color: string }) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-slate-300"><Icon className="h-4 w-4" style={{ color }} />{label}</span>
        <span className="font-display font-semibold">{lo} – {hi}{unit}</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct(hi) - pct(lo)}%` }} transition={{ duration: 1, delay: 0.4 }}
          className="absolute h-full rounded-full" style={{ left: `${pct(lo)}%`, background: color, boxShadow: `0 0 14px ${color}` }} />
      </div>
    </div>
  )
}

export function FishDetailPage() {
  const { slug = '' } = useParams()
  const fish = findFish(slug) ?? FISHES[0]
  const units = Object.keys(fish.prices) as SaleUnit[]
  const [unit, setUnit] = useState<SaleUnit>(units[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { dispatch } = useCart()
  const nav = useNavigate()
  const p = fish.strain.palette
  const outOfStock = fish.stock.male + fish.stock.female + fish.stock.fry === 0
  const stockOf = (u: SaleUnit) => ({ MALE: fish.stock.male, FEMALE: fish.stock.female, PAIR: Math.min(fish.stock.male, fish.stock.female), TRIO: Math.min(fish.stock.male, Math.floor(fish.stock.female / 2)), FRY_LOT: Math.floor(fish.stock.fry / fish.fryLotSize) })[u]
  const add = () => { dispatch({ type: 'add', line: { fishId: fish.id, unit, qty } }); setAdded(true); setTimeout(() => setAdded(false), 1800) }

  return (
    <div className="relative mx-auto max-w-7xl px-6 pt-32">
      <div className="pointer-events-none absolute left-0 top-20 -z-10 h-[600px] w-[600px] rounded-full blur-3xl" style={{ background: `radial-gradient(closest-side, ${p.tail1}33, transparent)` }} />
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
        <Link to={ROUTES.home} className="hover:text-white">Trang chủ</Link><ChevronRight className="h-3 w-3" />
        <Link to={ROUTES.catalog} className="hover:text-white">Cá bảy màu</Link><ChevronRight className="h-3 w-3" />
        <span className="text-slate-300">{fish.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        {/* 3D viewer */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-[36px] border border-white/10"
            style={{ background: `radial-gradient(80% 70% at 50% 40%, ${p.tail1}30, transparent 70%), linear-gradient(180deg,#0c2340,#030814)` }}>
            <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(0deg,transparent_0_40px,rgba(255,255,255,.03)_40px_41px),repeating-linear-gradient(90deg,transparent_0_40px,rgba(255,255,255,.03)_40px_41px)]" />
            <Suspense fallback={null}><FishViewer fish={fish} /></Suspense>
            <div className="glass absolute left-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-slate-200"><Move3d className="h-3.5 w-3.5 text-aqua" /> Kéo để xoay 360°</div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="glass flex items-center gap-2 rounded-full p-1.5">
                {[p.body, p.tail1, p.tail2, p.accent].map((c) => <span key={c} className="h-6 w-6 rounded-full border border-white/20" style={{ background: c }} />)}
              </div>
              <span className="glass rounded-full px-3 py-1.5 text-xs text-slate-300">Mô hình 3D minh họa</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="slate">{fish.strain.name}</Badge>
            <Badge tone="slate">{TAIL_LABEL[fish.tailType]}</Badge>
            {fish.tags.map((t) => <Badge key={t} tone={t === 'Hiếm' ? 'orchid' : t === 'Đặt trước' ? 'sun' : 'coral'}>{t}</Badge>)}
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{fish.name}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1 text-sun">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={cn('h-4 w-4', i < Math.round(fish.rating) ? 'fill-sun' : 'opacity-30')} />)}</span>
            <span>{fish.rating} · {fish.sold} đã bán</span>
          </div>
          <p className="mt-5 leading-relaxed text-slate-300">{fish.description}</p>

          <p className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-[.2em] text-slate-500">Chọn đơn vị bán</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {units.map((u) => {
              const s = stockOf(u)
              return (
                <button key={u} onClick={() => setUnit(u)}
                  className={cn('relative cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition',
                    unit === u ? 'border-transparent' : 'border-white/10 bg-white/[.02] hover:border-white/25')}>
                  {unit === u && <motion.span layoutId="unit-ring" className="border-iridescent absolute inset-0 rounded-2xl" transition={{ type: 'spring', bounce: 0.2 }} />}
                  <span className="relative block text-sm font-medium">{UNIT_LABEL[u]}{u === 'FRY_LOT' && ` · ${fish.fryLotSize} con`}</span>
                  <span className="relative mt-1 flex items-center justify-between">
                    <span className="font-display text-lg font-semibold">{formatVnd(fish.prices[u]!)}</span>
                    <span className={cn('text-[11px]', s > 0 ? 'text-kelp' : 'text-sun')}>{s > 0 ? `Còn ${s}` : 'Đặt trước'}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} />
            <Button size="lg" className="flex-1" onClick={add}><ShoppingBag className="h-4 w-4" />{outOfStock ? 'Đặt trước' : 'Thêm vào giỏ'}</Button>
            <Button size="lg" variant="glass" onClick={() => { add(); nav(ROUTES.checkout) }}><Zap className="h-4 w-4 text-sun" /> Mua ngay</Button>
          </div>
          <p className="mt-3 text-sm text-slate-400">Tạm tính: <span className="font-display text-lg font-semibold text-iridescent">{formatVnd(fish.prices[unit]! * qty)}</span></p>
          <AnimatePresence>
            {added && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-kelp">
                ✓ Đã thêm {qty} × {UNIT_LABEL[unit]} vào giỏ. <Link to={ROUTES.cart} className="underline">Xem giỏ hàng</Link>
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[[Ruler, 'Kích thước', fish.sizeCm], [CalendarDays, 'Tuổi', `${fish.ageWeeks} tuần`], [Hash, 'Mã lô', fish.batchCode]].map(([I, l, v]) => {
              const Icon = I as typeof Ruler
              return (
                <div key={l as string} className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                  <Icon className="h-4 w-4 text-aqua" /><p className="mt-2 text-[11px] text-slate-500">{l as string}</p><p className="text-sm font-semibold">{v as string}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-4 space-y-5 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,.06),rgba(251,113,133,.05))] p-6">
            <p className="flex items-center gap-2 font-display font-semibold"><Gem className="h-4 w-4 text-orchid" /> Thông số nước khuyến nghị</p>
            <RangeBar icon={Thermometer} label="Nhiệt độ" min={15} max={35} lo={fish.water.tempMin} hi={fish.water.tempMax} unit="°C" color="#fb7185" />
            <RangeBar icon={Droplets} label="Độ pH" min={5} max={9} lo={fish.water.phMin} hi={fish.water.phMax} unit="" color="#22d3ee" />
            <p className="text-xs text-slate-400">Độ cứng: {fish.water.hardness} · Thay 20–30% nước mỗi tuần · Thả cá sau khi ngâm túi 15 phút cân bằng nhiệt.</p>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <p className="flex items-center gap-2 rounded-2xl bg-white/[.03] p-3"><Truck className="h-4 w-4 text-aqua" /> Hỏa tốc HCM · HN · ĐN – 50.000đ</p>
            <p className="flex items-center gap-2 rounded-2xl bg-white/[.03] p-3"><ShieldCheck className="h-4 w-4 text-kelp" /> Bảo hành cá chết trong 24h</p>
          </div>
        </div>
      </div>

      <section className="pt-24">
        <h2 className="mb-8 font-display text-2xl font-semibold">Có thể bạn cũng thích</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FISHES.filter((f) => f.id !== fish.id).slice(0, 4).map((f) => <FishCard key={f.id} fish={f} />)}
        </div>
      </section>
    </div>
  )
}
