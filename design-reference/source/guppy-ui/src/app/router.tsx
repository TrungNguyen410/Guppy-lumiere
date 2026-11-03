import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Header } from '@/widgets/header/header'
import { Footer } from '@/widgets/footer/footer'
import { HomePage } from '@/pages/home/home-page'
import { CatalogPage } from '@/pages/catalog/catalog-page'
import { FishDetailPage } from '@/pages/fish-detail/fish-detail-page'
import { CartPage } from '@/pages/cart/cart-page'
import { CheckoutPage } from '@/pages/checkout/checkout-page'
import { OrderLookupPage } from '@/pages/order-lookup/order-lookup-page'
import { AuthPage } from '@/pages/auth/auth-page'
import { AdminLayout } from '@/pages/admin/admin-layout'
import { AdminDashboard } from '@/pages/admin/admin-dashboard'
import { AdminOrders } from '@/pages/admin/admin-orders'
import { AdminBatches } from '@/pages/admin/admin-batches'

function ShopLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <motion.main key={pathname} initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<ShopLayout />}>
        <Route index element={<HomePage />} />
        <Route path="ca-bay-mau" element={<CatalogPage />} />
        <Route path="ca-bay-mau/:slug" element={<FishDetailPage />} />
        <Route path="gio-hang" element={<CartPage />} />
        <Route path="thanh-toan" element={<CheckoutPage />} />
        <Route path="tra-cuu-don" element={<OrderLookupPage />} />
        <Route path="dang-nhap" element={<AuthPage />} />
      </Route>
      <Route path="quan-tri" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="don-hang" element={<AdminOrders />} />
        <Route path="lo-ca" element={<AdminBatches />} />
      </Route>
    </Routes>
  )
}
