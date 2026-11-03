import { MapPin, Phone, Truck, ShieldCheck, Clock } from 'lucide-react'
import { Logo } from '@/widgets/header/header'

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/10">
      <svg className="absolute -top-[60px] left-0 h-[60px] w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0 30 Q 180 0 360 30 T 720 30 T 1080 30 T 1440 30 V60 H0 Z" fill="rgba(12,35,64,.55)" />
      </svg>
      <div className="bg-lagoon/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-slate-400">Trại cá bảy màu thuần chủng. Tuyển chọn từng con, đóng túi oxy, giao hỏa tốc trong ngày.</p>
          </div>
          {[
            { t: 'Mua sắm', l: ['Cá lẻ đực / cái', 'Cặp & bộ ba', 'Lô cá bột', 'Đặt trước dòng hiếm'] },
            { t: 'Hỗ trợ', l: ['Tra cứu đơn hàng', 'Chính sách bảo hành 24h', 'Hướng dẫn thả cá', 'Câu hỏi thường gặp'] },
          ].map((c) => (
            <div key={c.t}>
              <p className="mb-4 font-display text-sm font-semibold">{c.t}</p>
              <ul className="space-y-2 text-sm text-slate-400">{c.l.map((x) => <li key={x} className="cursor-pointer hover:text-aqua">{x}</li>)}</ul>
            </div>
          ))}
          <div className="space-y-3 text-sm text-slate-400">
            <p className="mb-4 font-display text-sm font-semibold text-white">Liên hệ</p>
            <p className="flex gap-2"><MapPin className="h-4 w-4 text-aqua" /> 123 Nguyễn Văn Cừ, Q.5, TP.HCM</p>
            <p className="flex gap-2"><Phone className="h-4 w-4 text-aqua" /> 0909 000 777</p>
            <p className="flex gap-2"><Clock className="h-4 w-4 text-aqua" /> 8:00 – 21:00 mỗi ngày</p>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 text-xs text-slate-500">
            <span>© 2026 GuppyLumière · Đồ án XDPT Ứng dụng Hướng đối tượng</span>
            <span className="flex gap-5"><span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Hỏa tốc HCM · HN · ĐN</span><span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Bảo hành cá chết 24h</span></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
