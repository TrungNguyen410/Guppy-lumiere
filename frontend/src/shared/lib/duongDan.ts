/** Đường dẫn dùng chung để mọi tầng cùng tham chiếu, giữ nguyên URL của thiết kế. */
export const DUONG_DAN = {
  trangChu: '/',
  danhSachCa: '/ca-bay-mau',
  chiTietCa: (slug: string) => `/ca-bay-mau/${slug}`,
  gioHang: '/gio-hang',
  thanhToan: '/thanh-toan',
  traCuuDon: '/tra-cuu-don',
  dangNhap: '/dang-nhap',
  dangKy: '/dang-ky',
  taiKhoan: '/tai-khoan',
  quanTri: '/quan-tri',
  quanTriDon: '/quan-tri/don-hang',
  quanTriLo: '/quan-tri/lo-ca',
  quanTriSanPham: '/quan-tri/san-pham',
  quanTriKhuyenMai: '/quan-tri/khuyen-mai',
  quanTriTaiKhoan: '/quan-tri/tai-khoan',
} as const
