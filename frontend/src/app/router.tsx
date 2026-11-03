import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { createBrowserRouter, Outlet, useLocation, useOutlet } from 'react-router-dom'
import { ChiTietCa } from '@/pages/ChiTietCa'
import { DangKy } from '@/pages/DangKy'
import { DangNhap } from '@/pages/DangNhap'
import { DanhSachCa } from '@/pages/DanhSachCa'
import { GioHang } from '@/pages/GioHang'
import { TaiKhoan } from '@/pages/TaiKhoan'
import { ThanhToan } from '@/pages/ThanhToan'
import { TraCuuDon } from '@/pages/TraCuuDon'
import { TrangChu } from '@/pages/TrangChu'
import { LayoutQuanTri } from '@/pages/admin/LayoutQuanTri'
import { QuanLyDon } from '@/pages/admin/QuanLyDon'
import { QuanLyKhuyenMai } from '@/pages/admin/QuanLyKhuyenMai'
import { QuanLyLoCa } from '@/pages/admin/QuanLyLoCa'
import { QuanLySanPham } from '@/pages/admin/QuanLySanPham'
import { QuanLyTaiKhoan } from '@/pages/admin/QuanLyTaiKhoan'
import { TongQuan } from '@/pages/admin/TongQuan'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { Footer } from '@/widgets/Footer'
import { Header } from '@/widgets/Header'

function KhongTimThay() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-36 pb-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">Không tìm thấy trang</h1>
      <p className="mt-4 max-w-2xl text-slate-400">Đường dẫn này không tồn tại.</p>
    </section>
  )
}

/** Bố cục cửa hàng: Header, nội dung có hiệu ứng chuyển trang, Footer. */
function LayoutCuaHang() {
  const { pathname, hash } = useLocation()
  const noiDung = useOutlet()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // Liên kết có #muc: chờ chuyển trang xong rồi cuộn. Cuộn lần hai vì dữ liệu và cảnh 3D
  // tải sau làm trang đổi chiều cao, khiến trình duyệt hủy lần cuộn mượt đầu tiên khi mở thẳng link
  useEffect(() => {
    if (!hash) return
    const cuon = () => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    const cacHenGio = [setTimeout(cuon, 500), setTimeout(cuon, 1800)]
    return () => cacHenGio.forEach(clearTimeout)
  }, [hash, pathname])

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          // Không dùng filter: blur(0) còn lại sau hiệu ứng sẽ làm phần tử fixed bên trong định vị theo main
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {noiDung}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <LayoutCuaHang />,
    children: [
      { path: DUONG_DAN.trangChu, element: <TrangChu /> },
      { path: DUONG_DAN.danhSachCa, element: <DanhSachCa /> },
      { path: `${DUONG_DAN.danhSachCa}/:slug`, element: <ChiTietCa /> },
      { path: DUONG_DAN.gioHang, element: <GioHang /> },
      { path: DUONG_DAN.thanhToan, element: <ThanhToan /> },
      { path: DUONG_DAN.traCuuDon, element: <TraCuuDon /> },
      { path: DUONG_DAN.dangNhap, element: <DangNhap /> },
      { path: DUONG_DAN.dangKy, element: <DangKy /> },
      { path: DUONG_DAN.taiKhoan, element: <TaiKhoan /> },
      { path: '*', element: <KhongTimThay /> },
    ],
  },
  {
    path: DUONG_DAN.quanTri,
    element: (
      <LayoutQuanTri>
        <Outlet />
      </LayoutQuanTri>
    ),
    children: [
      { index: true, element: <TongQuan /> },
      { path: 'don-hang', element: <QuanLyDon /> },
      { path: 'lo-ca', element: <QuanLyLoCa /> },
      { path: 'san-pham', element: <QuanLySanPham /> },
      { path: 'khuyen-mai', element: <QuanLyKhuyenMai /> },
      { path: 'tai-khoan', element: <QuanLyTaiKhoan /> },
    ],
  },
])
