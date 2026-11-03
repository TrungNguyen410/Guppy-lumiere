import { Clock, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { Logo } from '@/shared/ui/Logo'

const CAC_COT = [
  {
    tieuDe: 'Mua sắm',
    lienKet: [
      { nhan: 'Cá lẻ đực / cái', den: `${DUONG_DAN.danhSachCa}?donVi=CON_LE` },
      { nhan: 'Cặp & bộ ba', den: `${DUONG_DAN.danhSachCa}?donVi=CAP&donVi=BO_BA` },
      { nhan: 'Lô cá bột', den: `${DUONG_DAN.danhSachCa}?donVi=LO_CA_BOT` },
      { nhan: 'Thức ăn & phụ kiện', den: `${DUONG_DAN.danhSachCa}?loai=PHU_KIEN` },
    ],
  },
  {
    tieuDe: 'Hỗ trợ',
    lienKet: [
      { nhan: 'Tra cứu đơn hàng', den: DUONG_DAN.traCuuDon },
      { nhan: 'Chính sách bảo hành 24h', den: `${DUONG_DAN.trangChu}#hanh-trinh` },
      { nhan: 'Hướng dẫn thả cá', den: `${DUONG_DAN.trangChu}#cham-soc` },
      { nhan: 'Tài khoản của tôi', den: DUONG_DAN.taiKhoan },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/10">
      <svg aria-hidden="true" className="absolute -top-[60px] left-0 h-[60px] w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0 30 Q 180 0 360 30 T 720 30 T 1080 30 T 1440 30 V60 H0 Z" fill="rgb(12 35 64 / 0.55)" />
      </svg>
      <div className="bg-lagoon/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-slate-400">Trại cá bảy màu thuần chủng. Tuyển chọn từng con, đóng túi oxy, giao hỏa tốc trong ngày.</p>
          </div>
          {CAC_COT.map((cot) => (
            <div key={cot.tieuDe}>
              <p className="mb-4 font-display text-sm font-semibold">{cot.tieuDe}</p>
              <ul className="space-y-2 text-sm text-slate-400">
                {cot.lienKet.map((lk) => (
                  <li key={lk.nhan}>
                    <Link to={lk.den} className="hover:text-aqua">
                      {lk.nhan}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="space-y-3 text-sm text-slate-400">
            <p className="mb-4 font-display text-sm font-semibold text-white">Liên hệ</p>
            <p className="flex gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-aqua" /> 123 Nguyễn Văn Cừ, Q.5, TP.HCM
            </p>
            <p className="flex gap-2">
              <Phone className="h-4 w-4 shrink-0 text-aqua" /> 0909 000 777
            </p>
            <p className="flex gap-2">
              <Clock className="h-4 w-4 shrink-0 text-aqua" /> 8:00 – 21:00 mỗi ngày
            </p>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 text-xs text-slate-500">
            <span>© 2026 GuppyLumière · Đồ án XDPT Ứng dụng Hướng đối tượng</span>
            <span className="flex gap-5">
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Hỏa tốc HCM · HN · ĐN
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Bảo hành cá chết 24h
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
