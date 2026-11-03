import { lazy, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MousePointer2, Thermometer, Droplets, PackageCheck, Truck, ShieldCheck, ClipboardCheck, Sparkles } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { SectionTitle } from '@/shared/ui/section-title'
import { TiltCard } from '@/shared/ui/tilt-card'
import { ROUTES } from '@/shared/config/routes'
import { FISHES, STRAINS } from '@/entities/fish/model/mock'
import { FishCard } from '@/entities/fish/ui/fish-card'
import { GuppySvg } from '@/entities/fish/ui/guppy-svg'
import { QuickAddButton } from '@/features/add-to-cart/quick-add-button'
import type { Palette } from '@/entities/fish/model/types'

const AquariumScene = lazy(() => import('@/widgets/aquarium-scene/aquarium-scene').then((m) => ({ default: m.AquariumScene })))

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 160])
  const op = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const sc = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const words = ['Đại', 'dương', 'thu', 'nhỏ']
  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden">
      <motion.div style={{ scale: sc }} className="absolute inset-0">
        <Suspense fallback={<div className="h-full w-full bg-abyss" />}><AquariumScene /></Suspense>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,20,.85)_0%,rgba(3,8,20,.35)_45%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-abyss to-transparent" />
      <motion.div style={{ y, opacity: op }} className="pointer-events-none relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs text-slate-200">
          <Sparkles className="h-3.5 w-3.5 text-sun" /> Bộ sưu tập Đông 2026 · 8 dòng thuần chủng mới
        </motion.span>
        <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[88px]">
          {words.map((w, i) => (
            <motion.span key={w} initial={{ opacity: 0, y: 60, rotateX: -80 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="mr-4 inline-block" style={{ transformOrigin: 'bottom' }}>{w}</motion.span>
          ))}
          <br />
          <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.9 }} className="text-iridescent inline-block">trong bể nhà bạn.</motion.span>
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-6 max-w-lg text-base text-slate-300 md:text-lg">
          Cá bảy màu tuyển chọn từ trại giống, bán theo con lẻ, cặp, bộ ba hoặc lô cá bột. Đặt hàng không cần tài khoản, giao hỏa tốc trong 2 giờ.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35 }} className="pointer-events-auto mt-9 flex flex-wrap gap-3">
          <Link to={ROUTES.catalog}><Button size="lg">Khám phá đàn cá <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to={ROUTES.lookup}><Button size="lg" variant="glass">Tra cứu đơn hàng</Button></Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="mt-14 flex gap-10">
          {[['40+', 'dòng cá'], ['2h', 'giao hỏa tốc'], ['24h', 'bảo hành cá chết']].map(([n, l]) => (
            <div key={l}><p className="font-display text-3xl font-semibold">{n}</p><p className="text-xs uppercase tracking-wider text-slate-400">{l}</p></div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="glass absolute bottom-8 right-8 hidden items-center gap-3 rounded-2xl px-4 py-3 text-xs text-slate-300 md:flex">
        <MousePointer2 className="h-4 w-4 animate-bounce text-aqua" /> Di chuột để dẫn đường cho chú cá Galaxy Neon
      </motion.div>
    </section>
  )
}

function Marquee() {
  const items = [...STRAINS, ...STRAINS]
  return (
    <div className="relative -mt-6 overflow-hidden border-y border-white/5 bg-white/[.02] py-5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="flex w-max gap-12">
        {items.map((s, i) => (
          <span key={i} className="flex items-center gap-3 font-display text-2xl font-medium text-slate-500">
            <GuppySvg palette={s.palette} tail="delta" pattern={s.pattern} className="h-8 w-14" animated={false} />
            {s.name}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function StrainOrbit() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <SectionTitle eyebrow="Dòng cá" title={<>Mỗi dòng là một <span className="text-iridescent">bảng màu sống</span></>} desc="Chọn theo dòng để xem các kiểu đuôi, giới tính và lô cá hiện có trong trại." />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STRAINS.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }}>
            <Link to={`${ROUTES.catalog}?dong=${s.id}`}>
              <TiltCard intensity={16}>
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 p-5" style={{ background: `linear-gradient(160deg, ${s.palette.tail1}33, #071226 65%)` }}>
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl" style={{ background: s.palette.tail1, opacity: 0.35 }} />
                  <GuppySvg palette={s.palette} tail={(['delta', 'round', 'veil', 'lyre'] as const)[i % 4]} pattern={s.pattern} className="relative h-24 w-full" />
                  <p className="relative mt-3 font-display font-semibold">{s.name}</p>
                  <p className="relative text-xs text-slate-400">Xuất xứ {s.origin}</p>
                </div>
              </TiltCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Featured() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow="Nổi bật tuần này" title="Được săn đón nhất" />
        <Link to={ROUTES.catalog} className="mb-10 flex items-center gap-2 text-sm text-aqua hover:gap-3 transition-all">Xem tất cả <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FISHES.slice(0, 4).map((f) => <FishCard key={f.id} fish={f} action={<QuickAddButton fish={f} />} />)}
      </div>
    </section>
  )
}

const gold: Palette = STRAINS[0].palette
const blue: Palette = STRAINS[3].palette
function School({ n, palettes }: { n: number; palettes: Palette[] }) {
  return (
    <div className="relative h-28">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="animate-float absolute" style={{ left: `${10 + ((i * 27) % 70)}%`, top: `${10 + ((i * 41) % 55)}%`, animationDelay: `${i * 0.4}s`, width: n > 4 ? 46 : 84 }}>
          <GuppySvg palette={palettes[i % palettes.length]} tail="delta" className="w-full" />
        </div>
      ))}
    </div>
  )
}
function SaleUnits() {
  const female: Palette = { ...gold, tail1: '#fde68a', tail2: '#d6d3d1' }
  const units = [
    { t: 'Con lẻ', d: 'Đã phân đực / cái, chọn đúng con bạn thích.', n: 1, p: [gold], price: 'từ 35.000đ' },
    { t: 'Cặp', d: '1 đực + 1 cái cùng dòng, sẵn sàng sinh sản.', n: 2, p: [gold, female], price: 'từ 75.000đ' },
    { t: 'Bộ ba', d: '1 đực + 2 cái – tỉ lệ vàng cho người nhân giống.', n: 3, p: [gold, female, female], price: 'từ 105.000đ' },
    { t: 'Lô cá bột', d: '10–20 cá con chưa phân giới tính, tự tuyển chọn.', n: 9, p: [gold, blue], price: 'từ 120.000đ' },
  ]
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <SectionTitle eyebrow="Đơn vị bán" title={<>Mua theo cách <span className="text-iridescent">bạn muốn</span></>} />
      <div className="grid gap-5 md:grid-cols-4">
        {units.map((u, i) => (
          <motion.div key={u.t} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[.03] p-6 transition hover:border-aqua/40 hover:bg-white/[.06]">
            <span className="absolute right-5 top-5 font-display text-5xl font-bold text-white/5">0{i + 1}</span>
            <School n={u.n} palettes={u.p} />
            <p className="mt-4 font-display text-xl font-semibold">{u.t}</p>
            <p className="mt-1 text-sm text-slate-400">{u.d}</p>
            <p className="mt-4 text-sm font-medium text-aqua">{u.price}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Gauge({ label, icon: Icon, min, max, lo, hi, unit, color }: { label: string; icon: typeof Thermometer; min: number; max: number; lo: number; hi: number; unit: string; color: string }) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm text-slate-300"><Icon className="h-4 w-4" style={{ color }} />{label}</p>
        <p className="font-display text-2xl font-semibold">{lo}–{hi}<span className="text-sm text-slate-400"> {unit}</span></p>
      </div>
      <div className="relative mt-6 h-3 rounded-full bg-white/5">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct(hi) - pct(lo)}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute h-full rounded-full" style={{ left: `${pct(lo)}%`, background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 20px ${color}` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500"><span>{min}{unit}</span><span>Vùng lý tưởng</span><span>{max}{unit}</span></div>
    </div>
  )
}

function WaterCare() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,.10),rgba(192,132,252,.08))] p-8 md:p-14">
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-aqua/20 blur-3xl" />
        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Chăm sóc" title={<>Nước chuẩn,<br /> cá rực màu.</>} desc="Mỗi trang cá đều ghi thông số nước khuyến nghị. Giữ nhiệt độ và pH trong vùng lý tưởng để cá lên màu đẹp và sinh sản đều." />
          </div>
          <div className="space-y-4">
            <Gauge label="Nhiệt độ" icon={Thermometer} min={15} max={35} lo={22} hi={28} unit="°C" color="#fb7185" />
            <Gauge label="Độ pH" icon={Droplets} min={5} max={9} lo={6.8} hi={7.8} unit="" color="#22d3ee" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Journey() {
  const steps = [
    { i: ClipboardCheck, t: 'Đặt hàng', d: 'Chỉ cần họ tên, SĐT, địa chỉ. Không cần tài khoản.' },
    { i: PackageCheck, t: 'Đóng túi oxy', d: 'Cá được cách ly, bơm oxy, túi 2 lớp chống sốc.' },
    { i: Truck, t: 'Giao hỏa tốc', d: 'Trong ngày tại TP.HCM, Hà Nội, Đà Nẵng.' },
    { i: ShieldCheck, t: 'Bảo hành 24h', d: 'Cá chết khi nhận? Gửi video mở hàng, đổi mới.' },
  ]
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <SectionTitle eyebrow="Hành trình" title="Từ trại cá đến bể nhà bạn" />
      <div className="relative grid gap-6 md:grid-cols-4">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-aqua via-orchid to-coral md:block" />
        {steps.map((s, i) => (
          <motion.div key={s.t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-deep shadow-[0_0_30px_rgba(34,211,238,.25)]">
              <s.i className="h-7 w-7 text-aqua" />
            </div>
            <p className="mt-5 font-display font-semibold">{s.t}</p>
            <p className="mt-1 text-sm text-slate-400">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <StrainOrbit />
      <Featured />
      <SaleUnits />
      <WaterCare />
      <Journey />
    </>
  )
}
