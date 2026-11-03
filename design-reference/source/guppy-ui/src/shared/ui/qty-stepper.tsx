import { Minus, Plus } from 'lucide-react'

export function QtyStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex h-11 items-center rounded-full border border-white/10 bg-white/[.03]">
      <button onClick={() => onChange(Math.max(1, value - 1))} className="grid h-11 w-11 cursor-pointer place-items-center text-slate-300 hover:text-aqua"><Minus className="h-4 w-4" /></button>
      <span className="w-8 text-center font-display font-semibold">{value}</span>
      <button onClick={() => onChange(value + 1)} className="grid h-11 w-11 cursor-pointer place-items-center text-slate-300 hover:text-aqua"><Plus className="h-4 w-4" /></button>
    </div>
  )
}
