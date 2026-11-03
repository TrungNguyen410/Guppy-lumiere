import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { TiltCard } from '@/shared/ui/tilt-card'
import { Badge } from '@/shared/ui/badge'
import { formatVnd } from '@/shared/lib/format'
import { ROUTES } from '@/shared/config/routes'
import { GuppySvg } from './guppy-svg'
import { minPrice, TAIL_LABEL, UNIT_SHORT, type Fish, type SaleUnit } from '../model/types'
import type { ReactNode } from 'react'

const tagTone = { Hot: 'coral', 'Mới về': 'aqua', Hiếm: 'orchid', 'Đặt trước': 'sun', 'Giảm giá': 'kelp' } as const

export function FishCard({ fish, action }: { fish: Fish; action?: ReactNode }) {
  const p = fish.strain.palette
  return (
    <TiltCard className="h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[.07] to-white/[.02] p-4 backdrop-blur-xl">
        <Link to={ROUTES.fish(fish.slug)} className="relative block aspect-[4/3] overflow-hidden rounded-2xl"
          style={{ background: `radial-gradient(120% 90% at 30% 20%, ${p.tail1}40, transparent 60%), radial-gradient(100% 100% at 80% 90%, ${p.tail2}55, #071226 70%)` }}>
          <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(115deg,transparent_0_18px,rgba(255,255,255,.07)_18px_20px)]" />
          <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-110" style={{ transform: 'translateZ(40px)' }}>
            <GuppySvg palette={p} tail={fish.tailType} pattern={fish.strain.pattern} className="w-full drop-shadow-[0_10px_25px_rgba(0,0,0,.5)]" />
          </div>
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {fish.tags.map((t) => <Badge key={t} tone={tagTone[t]} className="backdrop-blur-md">{t}</Badge>)}
          </div>
        </Link>
        <div className="mt-4 flex flex-1 flex-col" style={{ transform: 'translateZ(25px)' }}>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{fish.strain.name} · {TAIL_LABEL[fish.tailType].split(' (')[0]}</span>
            <span className="flex items-center gap-1 text-sun"><Star className="h-3 w-3 fill-sun" />{fish.rating} <span className="text-slate-500">({fish.sold})</span></span>
          </div>
          <Link to={ROUTES.fish(fish.slug)} className="mt-1 font-display text-base font-semibold leading-snug hover:text-aqua">{fish.name}</Link>
          <div className="mt-2 flex flex-wrap gap-1">
            {(Object.keys(fish.prices) as SaleUnit[]).map((u) => (
              <span key={u} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">{UNIT_SHORT[u]}</span>
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Chỉ từ</p>
              <p className="font-display text-xl font-semibold text-iridescent">{formatVnd(minPrice(fish))}</p>
            </div>
            {action}
          </div>
        </div>
      </div>
    </TiltCard>
  )
}
