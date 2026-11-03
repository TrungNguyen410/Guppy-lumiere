import type { DonViBan, GioiTinh, SanPhamTomTat } from '@/entities/san-pham/model'

/** Khớp DongGioDto của backend. */
export interface DongGio {
  id: number
  sanPham: SanPhamTomTat
  donVi: DonViBan | null
  gioiTinh: GioiTinh
  soLuong: number
  donGia: number | null
  thanhTien: number
  conLai: number
  conBan: boolean
  vuotTon: boolean
}

/** Khớp GioHangDto. */
export interface GioHang {
  chiTiet: DongGio[]
  tongSoLuong: number
  tamTinh: number
  phiGiao: number
  tongCong: number
}

export interface ThemVaoGio {
  sanPhamId: number
  donVi?: DonViBan | null
  gioiTinh?: GioiTinh
  soLuong: number
}

/** Tạm tính từ mức này được miễn phí giao, trùng với quy tắc ở backend. */
export const MUC_MIEN_PHI_GIAO = 500_000
