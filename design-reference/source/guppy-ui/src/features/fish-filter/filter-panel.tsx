import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { STRAINS } from '@/entities/fish/model/mock'
import { GuppySvg } from '@/entities/fish/ui/guppy-svg'
import { TAIL_LABEL, type SaleUnit, type TailType } from '@/entities/fish/model/types'
import { formatVnd } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { DEFAULT_FILTER, toggle, type FishFilter } from './model'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick}
      className={cn('flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs transition',
        active ? 'border-aqua/60 bg-aqua/10 text-white shadow-[0_0_18px_-4px_rgba(34,211,238,.6)]' : 'border-white/10 bg-white/[.02] text-slate-400 hover:border-white/25 hover:text-white')}>
      {children}
    </motion.button>
  )
}
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/5 pt-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[.2em] text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

const UNITS: [SaleUnit, string][] = [['MALE', 'Lẻ đực'], ['FEMALE', 'Lẻ cái'], ['PAIR', 'Cặp'], ['TRIO', 'Bộ ba'], ['FRY_LOT', 'Lô cá bột']]

export function FilterPanel({ value, onChange }: { value: FishFilter; onChange: (f: FishFilter) => void }) {
  const set = (p: Partial<FishFilter>) => onChange({ ...value, ...p })
  return (
    <aside className="glass sticky top-28 space-y-5 rounded-[28px] p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-display font-semibold"><SlidersHorizontal className="h-4 w-4 text-aqua" /> Bộ lọc</p>
        <button onClick={() => onChange({ ...DEFAULT_FILTER, q: value.q, sort: value.sort })} className="flex cursor-pointer items-center gap-1 text-xs text-slate-400 hover:text-coral"><RotateCcw className="h-3 w-3" /> Đặt lại</button>
      </div>
      <Group title="Dòng cá">
        {STRAINS.map((s) => (
          <Chip key={s.id} active={value.strains.includes(s.id)} onClick={() => set({ strains: toggle(value.strains, s.id) })}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: `linear-gradient(135deg, ${s.palette.tail1}, ${s.palette.tail2})` }} />{s.name}
          </Chip>
        ))}
      </Group>
      <Group title="Giới tính">
        <Chip active={value.genders.includes('male')} onClick={() => set({ genders: toggle(value.genders, 'male') })}>♂ Đực</Chip>
        <Chip active={value.genders.includes('female')} onClick={() => set({ genders: toggle(value.genders, 'female') })}>♀ Cái</Chip>
      </Group>
      <Group title="Kiểu đuôi">
        {(Object.keys(TAIL_LABEL) as TailType[]).map((t) => (
          <Chip key={t} active={value.tails.includes(t)} onClick={() => set({ tails: toggle(value.tails, t) })}>
            <GuppySvg palette={STRAINS[6].palette} tail={t} animated={false} className="h-4 w-7" />{TAIL_LABEL[t].split(' (')[0].replace('Đuôi ', '')}
          </Chip>
        ))}
      </Group>
      <Group title="Đơn vị bán">
        {UNITS.map(([u, l]) => <Chip key={u} active={value.units.includes(u)} onClick={() => set({ units: toggle(value.units, u) })}>{l}</Chip>)}
      </Group>
      <div className="border-t border-white/5 pt-5">
        <p className="mb-3 flex justify-between text-[11px] font-semibold uppercase tracking-[.2em] text-slate-500">Giá tối đa <span className="normal-case tracking-normal text-aqua">{formatVnd(value.maxPrice)}</span></p>
        <input type="range" min={30000} max={300000} step={5000} value={value.maxPrice} onChange={(e) => set({ maxPrice: +e.target.value })} className="w-full" />
      </div>
    </aside>
  )
}
