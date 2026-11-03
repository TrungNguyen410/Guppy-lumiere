import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Fish, LayoutDashboard, PackageSearch, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useGioHang } from '@/entities/gio-hang/api'
import { laNhanSu } from '@/entities/nguoi-dung/model'
import { usePhienStore } from '@/entities/nguoi-dung/phien'
import { cn } from '@/shared/lib/cn'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { Logo } from '@/shared/ui/Logo'

const MENU = [
  { den: DUONG_DAN.trangChu, nhan: 'Trang chủ' },
  { den: DUONG_DAN.danhSachCa, nhan: 'Cá bảy màu' },
  { den: DUONG_DAN.traCuuDon, nhan: 'Tra cứu đơn' },
]

const NUT_TRON = 'grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full text-slate-300 hover:bg-white/5 hover:text-white'

export function Header() {
  const phien = usePhienStore((s) => s.phien)
  const gio = useGioHang()
  const soLuong = gio.data?.tongSoLuong ?? 0
  const { scrollY } = useScroll()
  const [daCuon, setDaCuon] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setDaCuon(v > 30))

  return (
    <motion.header initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className={cn('mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full px-2 py-2.5 sm:px-4 transition-all duration-500 md:px-6', daCuon ? 'glass-strong shadow-[0_10px_40px_-10px_rgb(0_0_0/0.7)]' : 'bg-transparent')}>
        <Logo />
        <nav aria-label="Menu chính" className="hidden items-center gap-1 rounded-full bg-white/[.03] p-1 md:flex">
          {MENU.map((muc) => (
            <NavLink
              key={muc.den}
              to={muc.den}
              end
              className={({ isActive }) => cn('relative rounded-full px-4 py-2 text-sm transition-colors', isActive ? 'text-abyss' : 'text-slate-300 hover:text-white')}
            >
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="vien-menu" className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,#67e8f9,#c4b5fd)]" transition={{ type: 'spring', bounce: 0.25 }} />}
                  <span className="relative font-medium">{muc.nhan}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <Link to={DUONG_DAN.danhSachCa} aria-label="Cá bảy màu" className={cn(NUT_TRON, 'md:hidden')}>
            <Fish className="h-5 w-5" />
          </Link>
          <Link to={DUONG_DAN.traCuuDon} aria-label="Tra cứu đơn" className={cn(NUT_TRON, 'md:hidden')}>
            <PackageSearch className="h-5 w-5" />
          </Link>
          {laNhanSu(phien?.vaiTro) && (
            <Link to={DUONG_DAN.quanTri} title="Trang quản trị" aria-label="Trang quản trị" className={cn(NUT_TRON, 'hidden sm:grid')}>
              <LayoutDashboard className="h-5 w-5" />
            </Link>
          )}
          <Link to={phien ? (laNhanSu(phien.vaiTro) ? DUONG_DAN.quanTri : DUONG_DAN.taiKhoan) : DUONG_DAN.dangNhap} aria-label="Tài khoản" title={phien?.hoTen ?? 'Đăng nhập'} className={NUT_TRON}>
            <User className="h-5 w-5" />
          </Link>
          <Link to={DUONG_DAN.gioHang} aria-label={`Giỏ hàng, ${soLuong} sản phẩm`} className="relative flex h-10 items-center gap-1.5 rounded-full bg-white/[.06] pr-2.5 pl-2.5 text-sm font-medium hover:bg-white/10 sm:gap-2 sm:pr-4 sm:pl-3">
            <ShoppingBag className="h-5 w-5 text-aqua" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            <motion.span key={soLuong} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[11px] font-bold text-white shadow-[0_0_12px_#fb7185]">
              {soLuong}
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
