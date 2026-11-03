import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  trang: number
  tongTrang: number
  khiDoi: (trang: number) => void
}

export function PhanTrang({ trang, tongTrang, khiDoi }: Props) {
  if (tongTrang <= 1) return null
  return (
    <nav aria-label="Phân trang" className="mt-8 flex items-center justify-center gap-3 text-sm">
      <button
        type="button"
        aria-label="Trang trước"
        disabled={trang === 0}
        onClick={() => khiDoi(trang - 1)}
        className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/10 hover:border-aqua/60 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-slate-400">
        Trang <b className="text-white">{trang + 1}</b> / {tongTrang}
      </span>
      <button
        type="button"
        aria-label="Trang sau"
        disabled={trang + 1 >= tongTrang}
        onClick={() => khiDoi(trang + 1)}
        className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/10 hover:border-aqua/60 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
