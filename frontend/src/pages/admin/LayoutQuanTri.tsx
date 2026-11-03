import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ClipboardList, Fish, Layers, LayoutDashboard, LogOut, Search, Store, Tag, Users } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { layDonChoNhanVien } from '@/entities/don-hang/api'
import { laNhanSu } from '@/entities/nguoi-dung/model'
import { usePhienStore } from '@/entities/nguoi-dung/phien'
import { KHOA_DON_NV } from '@/features/duyet-don/useDuyetDon'
import { cn } from '@/shared/lib/cn'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { Logo } from '@/shared/ui/Logo'

const MENU = [
  { den: DUONG_DAN.quanTri, nhan: 'Tổng quan', icon: LayoutDashboard, chiAdmin: true, chinhXac: true },
  { den: DUONG_DAN.quanTriDon, nhan: 'Đơn hàng', icon: ClipboardList, chiAdmin: false, chinhXac: false },
  { den: DUONG_DAN.quanTriLo, nhan: 'Lô cá nuôi', icon: Layers, chiAdmin: false, chinhXac: false },
  { den: DUONG_DAN.quanTriSanPham, nhan: 'Sản phẩm', icon: Fish, chiAdmin: true, chinhXac: false },
  { den: DUONG_DAN.quanTriKhuyenMai, nhan: 'Khuyến mãi', icon: Tag, chiAdmin: true, chinhXac: false },
  { den: DUONG_DAN.quanTriTaiKhoan, nhan: 'Tài khoản', icon: Users, chiAdmin: true, chinhXac: false },
]

/** Bố cục quản trị. Vai trò lấy từ JWT, backend vẫn kiểm tra quyền ở mọi API. */
export function LayoutQuanTri({ children }: { children: ReactNode }) {
  const phien = usePhienStore((s) => s.phien)
  const dangXuat = usePhienStore((s) => s.dangXuat)
  const queryClient = useQueryClient()
  const dieuHuong = useNavigate()
  const { pathname } = useLocation()
  const [tuKhoa, setTuKhoa] = useState('')
  const laAdmin = phien?.vaiTro === 'ADMIN'

  const donCho = useQuery({
    queryKey: [...KHOA_DON_NV, 'so-cho'],
    queryFn: () => layDonChoNhanVien({ trangThai: 'CHO_XAC_NHAN', kichThuoc: 1 }),
    enabled: laNhanSu(phien?.vaiTro),
    refetchInterval: 60_000,
  })
  const soDonCho = donCho.data?.tongPhanTu ?? 0

  if (!phien) return <Navigate to={DUONG_DAN.dangNhap} state={{ tu: pathname }} replace />
  if (!laNhanSu(phien.vaiTro)) return <Navigate to={DUONG_DAN.trangChu} replace />
  // Nhân viên không có trang Tổng quan và các trang chỉ dành cho admin
  const denTrangCuaAdmin = MENU.some((m) => m.chiAdmin && (m.chinhXac ? pathname === m.den : pathname.startsWith(m.den)))
  if (!laAdmin && denTrangCuaAdmin) return <Navigate to={DUONG_DAN.quanTriDon} replace />

  const timKiem = (su: FormEvent) => {
    su.preventDefault()
    const giaTri = tuKhoa.trim()
    // Mã lô bắt đầu bằng LO, còn lại tìm trong đơn hàng
    const dich = /^lo/i.test(giaTri) ? DUONG_DAN.quanTriLo : DUONG_DAN.quanTriDon
    dieuHuong(giaTri ? `${dich}?tuKhoa=${encodeURIComponent(giaTri)}` : dich)
  }

  return (
    <div className="flex min-h-screen">
      <aside className="glass-strong sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-y-0 border-l-0 p-5 lg:flex">
        <Logo />
        <p className="mt-8 mb-2 px-3 text-[10px] font-semibold tracking-[.25em] text-slate-500 uppercase">Quản lý</p>
        <nav aria-label="Menu quản trị" className="space-y-1">
          {MENU.filter((m) => laAdmin || !m.chiAdmin).map((m) => (
            <NavLink key={m.den} to={m.den} end={m.chinhXac} className={({ isActive }) => cn('relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition', isActive ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white')}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="menu-quan-tri" className="absolute inset-0 rounded-2xl border border-aqua/30 bg-[linear-gradient(90deg,rgb(34_211_238/0.18),rgb(192_132_252/0.08))]" />}
                  <m.icon className="relative h-4 w-4" />
                  <span className="relative">{m.nhan}</span>
                  {m.den === DUONG_DAN.quanTriDon && soDonCho > 0 && <span className="relative ml-auto rounded-full bg-sun/20 px-2 text-[10px] font-semibold text-sun">{soDonCho}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <Link to={DUONG_DAN.trangChu} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <Store className="h-4 w-4" /> Về cửa hàng
          </Link>
          <div className="flex items-center gap-3 rounded-2xl bg-white/[.04] p-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#22d3ee,#c084fc)] font-display text-sm font-bold text-abyss">{laAdmin ? 'AD' : 'NV'}</span>
            <div className="min-w-0 flex-1 text-xs">
              <p className="truncate font-semibold">{phien.hoTen}</p>
              <p className="truncate text-slate-500">{phien.email}</p>
            </div>
            <button
              type="button"
              aria-label="Đăng xuất"
              title="Đăng xuất"
              onClick={() => {
                dangXuat()
                queryClient.clear()
                dieuHuong(DUONG_DAN.dangNhap)
              }}
              className="cursor-pointer text-slate-500 hover:text-coral"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/5 bg-abyss/70 px-6 py-4 backdrop-blur-xl">
          <form onSubmit={timKiem} className="flex-1 md:max-w-sm">
            <label className="flex items-center gap-2 rounded-full bg-white/[.04] px-4 py-2.5 text-sm">
              <Search className="h-4 w-4 text-slate-500" />
              <input aria-label="Tìm kiếm" value={tuKhoa} onChange={(su) => setTuKhoa(su.target.value)} placeholder="Tìm mã đơn, SĐT, lô cá…" className="w-full bg-transparent outline-none placeholder:text-slate-500" />
            </label>
          </form>
          <Link to={DUONG_DAN.quanTriDon} aria-label={`${soDonCho} đơn chờ xác nhận`} title={`${soDonCho} đơn chờ xác nhận`} className="relative ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/5">
            <Bell className="h-4 w-4" />
            {soDonCho > 0 && <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-coral shadow-[0_0_8px_#fb7185]" />}
          </Link>
        </header>
        {/* Thanh bên ẩn dưới màn lg nên menu chuyển thành hàng cuộn ngang */}
        <nav aria-label="Menu quản trị trên di động" className="flex gap-2 overflow-x-auto border-b border-white/5 px-6 py-3 lg:hidden">
          {MENU.filter((m) => laAdmin || !m.chiAdmin).map((m) => (
            <NavLink key={m.den} to={m.den} end={m.chinhXac} className={({ isActive }) => cn('flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs', isActive ? 'border-aqua/40 bg-aqua/10 text-white' : 'border-white/10 text-slate-400')}>
              <m.icon className="h-3.5 w-3.5" />
              {m.nhan}
            </NavLink>
          ))}
          <Link to={DUONG_DAN.trangChu} className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400">
            <Store className="h-3.5 w-3.5" /> Cửa hàng
          </Link>
          <button
            type="button"
            onClick={() => {
              dangXuat()
              queryClient.clear()
              dieuHuong(DUONG_DAN.dangNhap)
            }}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400"
          >
            <LogOut className="h-3.5 w-3.5" /> Đăng xuất
          </button>
        </nav>
        <AnimatePresence mode="wait">
          <motion.main key={pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="p-6 md:p-8">
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}
