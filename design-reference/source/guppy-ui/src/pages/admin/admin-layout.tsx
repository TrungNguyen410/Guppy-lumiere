import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, ClipboardList, Layers, Fish, Users, Tag, Bell, Search, LogOut, Store } from 'lucide-react'
import { Logo } from '@/widgets/header/header'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/config/routes'

export type Role = 'ADMIN' | 'STAFF'
const RoleCtx = createContext<Role>('ADMIN')
export const useRole = () => useContext(RoleCtx)

const MENU = [
  { to: '/quan-tri', label: 'Tổng quan', icon: LayoutDashboard, admin: true, end: true },
  { to: '/quan-tri/don-hang', label: 'Đơn hàng', icon: ClipboardList, badge: 2 },
  { to: '/quan-tri/lo-ca', label: 'Lô cá nuôi', icon: Layers },
  { to: '#', label: 'Sản phẩm', icon: Fish, admin: true },
  { to: '#', label: 'Khuyến mãi', icon: Tag, admin: true },
  { to: '#', label: 'Tài khoản', icon: Users, admin: true },
]

export function AdminLayout() {
  const [role, setRole] = useState<Role>('ADMIN')
  const { pathname } = useLocation()
  return (
    <RoleCtx.Provider value={role}>
      <div className="flex min-h-screen">
        <aside className="glass-strong sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-y-0 border-l-0 p-5 lg:flex">
          <Logo />
          <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[.25em] text-slate-500">Quản lý</p>
          <nav className="space-y-1">
            {MENU.filter((m) => role === 'ADMIN' || !m.admin).map((m) => (
              <NavLink key={m.label} to={m.to} end={m.end}
                className={({ isActive }) => cn('relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition', isActive && m.to !== '#' ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white')}>
                {({ isActive }) => (
                  <>
                    {isActive && m.to !== '#' && <motion.span layoutId="adm-nav" className="absolute inset-0 rounded-2xl border border-aqua/30 bg-[linear-gradient(90deg,rgba(34,211,238,.18),rgba(192,132,252,.08))]" />}
                    <m.icon className="relative h-4 w-4" /><span className="relative">{m.label}</span>
                    {m.badge && <span className="relative ml-auto rounded-full bg-sun/20 px-2 text-[10px] font-semibold text-sun">{m.badge}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-2">
            <Link to={ROUTES.home} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><Store className="h-4 w-4" /> Về cửa hàng</Link>
            <div className="flex items-center gap-3 rounded-2xl bg-white/[.04] p-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#22d3ee,#c084fc)] font-display text-sm font-bold text-abyss">{role === 'ADMIN' ? 'AD' : 'NV'}</span>
              <div className="flex-1 text-xs"><p className="font-semibold">{role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên kho'}</p><p className="text-slate-500">{role === 'ADMIN' ? 'admin' : 'nhanvien'}</p></div>
              <LogOut className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/5 bg-abyss/70 px-6 py-4 backdrop-blur-xl">
            <label className="flex flex-1 items-center gap-2 rounded-full bg-white/[.04] px-4 py-2.5 text-sm md:max-w-sm"><Search className="h-4 w-4 text-slate-500" /><input placeholder="Tìm mã đơn, SĐT, lô cá…" className="w-full bg-transparent outline-none placeholder:text-slate-500" /></label>
            <div className="ml-auto flex items-center gap-1 rounded-full bg-white/5 p-1 text-xs">
              {(['ADMIN', 'STAFF'] as Role[]).map((r) => (
                <button key={r} onClick={() => setRole(r)} className={cn('relative cursor-pointer rounded-full px-3 py-1.5', role === r ? 'text-abyss' : 'text-slate-400')}>
                  {role === r && <motion.span layoutId="role" className="absolute inset-0 rounded-full bg-aqua" />}
                  <span className="relative font-medium">{r === 'ADMIN' ? 'Admin' : 'Nhân viên'}</span>
                </button>
              ))}
            </div>
            <button className="relative grid h-10 w-10 place-items-center rounded-full bg-white/5"><Bell className="h-4 w-4" /><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-coral shadow-[0_0_8px_#fb7185]" /></button>
          </header>
          <AnimatePresence mode="wait">
            <motion.main key={pathname + role} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="p-6 md:p-8">
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </RoleCtx.Provider>
  )
}
