import { Fish } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DUONG_DAN } from '@/shared/lib/duongDan'

export function Logo() {
  return (
    <Link to={DUONG_DAN.trangChu} className="group flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-[conic-gradient(from_200deg,#22d3ee,#c084fc,#fb7185,#fbbf24,#22d3ee)] shadow-[0_0_25px_rgb(34_211_238/0.5)] transition-transform duration-500 group-hover:rotate-[20deg]">
        <span className="absolute inset-[2px] rounded-[14px] bg-abyss" />
        <Fish className="relative h-5 w-5 text-aqua" />
      </span>
      <span className="leading-none max-[430px]:hidden">
        <span className="block font-display text-base font-semibold tracking-tight">
          Guppy<span className="text-iridescent">Lumière</span>
        </span>
        {/* Màn hình hẹp bỏ dòng phụ để còn chỗ cho nút giỏ hàng trên Header */}
        <span className="hidden text-[10px] tracking-[.2em] whitespace-nowrap text-slate-500 uppercase sm:inline">Cá bảy màu thuần chủng</span>
      </span>
    </Link>
  )
}
