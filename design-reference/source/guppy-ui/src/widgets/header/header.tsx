import { Link, NavLink } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { Fish, PackageSearch, ShoppingBag, User, LayoutDashboard } from 'lucide-react'
import { ROUTES } from '@/shared/config/routes'
import { useCart } from '@/entities/cart/model/cart-store'
import { cn } from '@/shared/lib/cn'

const NAV = [
  { to: ROUTES.home, label: 'Trang chủ' },
  { to: ROUTES.catalog, label: 'Cá bảy màu' },
  { to: ROUTES.lookup, label: 'Tra cứu đơn' },
]

export function Logo() {
  return (
    <Link to={ROUTES.home} className="group flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-[conic-gradient(from_200deg,#22d3ee,#c084fc,#fb7185,#fbbf24,#22d3ee)] shadow-[0_0_25px_rgba(34,211,238,.5)] transition-transform duration-500 group-hover:rotate-[20deg]">
        <span className="absolute inset-[2px] rounded-[14px] bg-abyss" />
        <Fish className="relative h-5 w-5 text-aqua" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-base font-semibold tracking-tight">Guppy<span className="text-iridescent">Lumière</span></span>
        <span className="whitespace-nowrap text-[10px] uppercase tracking-[.2em] text-slate-500">Cá bảy màu thuần chủng</span>
      </span>
    </Link>
  )
}

export function Header() {
  const { count } = useCart()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 30))
  return (
    <motion.header initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className={cn('mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-6',
        scrolled ? 'glass-strong shadow-[0_10px_40px_-10px_rgba(0,0,0,.7)]' : 'bg-transparent')}>
        <Logo />
        <nav className="hidden items-center gap-1 rounded-full bg-white/[.03] p-1 md:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end
              className={({ isActive }) => cn('relative rounded-full px-4 py-2 text-sm transition-colors', isActive ? 'text-abyss' : 'text-slate-300 hover:text-white')}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,#67e8f9,#c4b5fd)]" transition={{ type: 'spring', bounce: 0.25 }} />}
                  <span className="relative font-medium">{n.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Link to={ROUTES.lookup} className="grid h-10 w-10 place-items-center rounded-full text-slate-300 hover:bg-white/5 hover:text-white md:hidden"><PackageSearch className="h-5 w-5" /></Link>
          <Link to={ROUTES.admin} title="Trang quản trị" className="hidden h-10 w-10 place-items-center rounded-full text-slate-300 hover:bg-white/5 hover:text-white sm:grid"><LayoutDashboard className="h-5 w-5" /></Link>
          <Link to={ROUTES.auth} className="grid h-10 w-10 place-items-center rounded-full text-slate-300 hover:bg-white/5 hover:text-white"><User className="h-5 w-5" /></Link>
          <Link to={ROUTES.cart} className="relative flex h-10 items-center gap-2 rounded-full bg-white/[.06] pl-3 pr-4 text-sm font-medium hover:bg-white/10">
            <ShoppingBag className="h-5 w-5 text-aqua" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            <motion.span key={count} initial={{ scale: 1.6 }} animate={{ scale: 1 }}
              className="grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[11px] font-bold text-white shadow-[0_0_12px_#fb7185]">{count}</motion.span>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
