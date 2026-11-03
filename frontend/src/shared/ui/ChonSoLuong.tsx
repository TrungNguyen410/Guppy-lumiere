import { Minus, Plus } from 'lucide-react'

interface Props {
  giaTri: number
  khiDoi: (giaTri: number) => void
  toiDa?: number
  khoa?: boolean
}

export function ChonSoLuong({ giaTri, khiDoi, toiDa = 999, khoa = false }: Props) {
  return (
    <div className="flex h-11 items-center rounded-full border border-white/10 bg-white/[.03]">
      <button
        type="button"
        aria-label="Giảm số lượng"
        disabled={khoa || giaTri <= 1}
        onClick={() => khiDoi(giaTri - 1)}
        className="grid h-11 w-11 cursor-pointer place-items-center text-slate-300 hover:text-aqua disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center font-display font-semibold">{giaTri}</span>
      <button
        type="button"
        aria-label="Tăng số lượng"
        disabled={khoa || giaTri >= toiDa}
        onClick={() => khiDoi(giaTri + 1)}
        className="grid h-11 w-11 cursor-pointer place-items-center text-slate-300 hover:text-aqua disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
