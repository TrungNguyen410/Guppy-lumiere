export type VaiTro = 'KHACH_HANG' | 'NHAN_VIEN' | 'ADMIN'

/** Khớp PhienDangNhapDto của backend. */
export interface PhienDangNhap {
  token: string
  hoTen: string
  email: string
  vaiTro: VaiTro
}

export interface DangKy {
  hoTen: string
  email: string
  soDienThoai: string
  matKhau: string
}

export interface HoSo {
  id: number
  hoTen: string
  email: string
  soDienThoai: string | null
}

export interface DiaChi {
  id: number
  hoTenNhan: string
  soDienThoai: string
  diaChi: string
  thanhPho: string
  macDinh: boolean
}

export type LuuDiaChi = Omit<DiaChi, 'id'>

export const THANH_PHO_GIAO = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'] as const

export const laNhanSu = (vaiTro?: VaiTro) => vaiTro === 'NHAN_VIEN' || vaiTro === 'ADMIN'
