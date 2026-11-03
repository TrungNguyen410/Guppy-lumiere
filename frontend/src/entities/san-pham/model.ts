import type { MauNhan } from '@/shared/ui/Badge'

export type KieuDuoi = 'DELTA' | 'TRON' | 'KIEM_DOI' | 'VOAN' | 'DAN' | 'THUONG'
export type HoaTiet = 'SOLID' | 'MOSAIC' | 'GRASS' | 'KOI'
export type DonViBan = 'CON_LE' | 'CAP' | 'BO_BA' | 'LO_CA_BOT'
export type GioiTinh = 'DUC' | 'CAI' | 'KHONG_AP_DUNG'
export type NhanSanPham = 'HOT' | 'MOI_VE' | 'HIEM' | 'GIAM_GIA'
export type LoaiSanPham = 'CA_GUPPY' | 'PHU_KIEN'
export type LoaiPhuKien = 'THUC_AN' | 'BE' | 'LOC' | 'THUOC'
export type SapXep = 'BAN_CHAY' | 'DANH_GIA' | 'GIA_TANG' | 'GIA_GIAM'

/** Khớp DongCaDto của backend. */
export interface DongCa {
  id: number
  ma: string
  ten: string
  xuatXu: string
  hoaTiet: HoaTiet
  mauThan: string
  mauDuoi1: string
  mauDuoi2: string
  mauNhan: string
}

/** Khớp SanPhamTomTatDto. */
export interface SanPhamTomTat {
  id: number
  loai: LoaiSanPham
  ten: string
  slug: string
  diemDanhGia: number
  daBan: number
  nhan: NhanSanPham[]
  giaThapNhat: number
  conHang: boolean
  dangBan: boolean
  dongCa: DongCa | null
  kieuDuoi: KieuDuoi | null
  donViBan: DonViBan[] | null
  loaiPhuKien: LoaiPhuKien | null
}

export interface GiaBan {
  donVi: DonViBan
  gioiTinh: GioiTinh
  gia: number
  conLai: number
}

export interface ThongSoNuoc {
  nhietDoMin: number
  nhietDoMax: number
  phMin: number
  phMax: number
  doCung: string
}

/** Khớp SanPhamChiTietDto. */
export interface SanPhamChiTiet {
  tomTat: SanPhamTomTat
  moTa: string | null
  soDanhGia: number
  bangGia: GiaBan[] | null
  mauSac: string | null
  thuanChung: boolean | null
  kichThuoc: string | null
  tuoiTuan: number | null
  soConMoiLo: number | null
  thongSoNuoc: ThongSoNuoc | null
  maLo: string[] | null
  tonKhoPhuKien: number | null
}

export interface DanhGia {
  id: number
  tenKhach: string
  soSao: number
  noiDung: string | null
  taoLuc: string
}

export interface BoLocSanPham {
  q?: string
  loai?: LoaiSanPham
  dong?: string[]
  gioiTinh?: GioiTinh[]
  kieuDuoi?: KieuDuoi[]
  donVi?: DonViBan[]
  giaMax?: number
  sapXep?: SapXep
  trang?: number
  kichThuoc?: number
}

/** Bảng màu để vẽ cá, độc lập với nguồn dữ liệu. */
export interface BangMau {
  than: string
  duoi1: string
  duoi2: string
  nhan: string
}

export const bangMauCua = (dong: DongCa): BangMau => ({ than: dong.mauThan, duoi1: dong.mauDuoi1, duoi2: dong.mauDuoi2, nhan: dong.mauNhan })

/** Màu của cá dẫn đầu và các chi tiết trang trí; không phải một dòng đang bán. */
export const BANG_MAU_TRANG_TRI: BangMau = { than: '#a5f3fc', duoi1: '#c084fc', duoi2: '#22d3ee', nhan: '#f0abfc' }

/** Bảng màu các dòng cá bơi trong bể 3D, không cần gọi API để hiện cảnh đầu trang. */
export const BANG_MAU_BE_CA: BangMau[] = [
  { than: '#fcd34d', duoi1: '#fbbf24', duoi2: '#f97316', nhan: '#fff7ed' },
  { than: '#f8fafc', duoi1: '#f43f5e', duoi2: '#0f172a', nhan: '#fb7185' },
  { than: '#fecaca', duoi1: '#ef4444', duoi2: '#7f1d1d', nhan: '#fca5a5' },
  { than: '#bae6fd', duoi1: '#38bdf8', duoi2: '#1e3a8a', nhan: '#0ea5e9' },
  { than: '#ffe4e6', duoi1: '#fb7185', duoi2: '#e11d48', nhan: '#ffffff' },
  { than: '#cbd5e1', duoi1: '#334155', duoi2: '#a855f7', nhan: '#94a3b8' },
  { than: '#e2e8f0', duoi1: '#2dd4bf', duoi2: '#134e4a', nhan: '#94a3b8' },
]

export const TEN_DUOI: Record<KieuDuoi, string> = {
  DELTA: 'Đuôi quạt',
  TRON: 'Đuôi tròn',
  KIEM_DOI: 'Đuôi kiếm đôi',
  VOAN: 'Đuôi voan',
  DAN: 'Đuôi đàn',
  THUONG: 'Đuôi thuổng',
}

export const TEN_PHU_KIEN: Record<LoaiPhuKien, string> = { THUC_AN: 'Thức ăn', BE: 'Bể cá', LOC: 'Máy lọc', THUOC: 'Thuốc' }

export const TEN_NHAN: Record<NhanSanPham, { ten: string; mau: MauNhan }> = {
  HOT: { ten: 'Hot', mau: 'coral' },
  MOI_VE: { ten: 'Mới về', mau: 'aqua' },
  HIEM: { ten: 'Hiếm', mau: 'orchid' },
  GIAM_GIA: { ten: 'Giảm giá', mau: 'kelp' },
}

/** Tên đầy đủ của lựa chọn, ví dụ "Cặp (1 đực + 1 cái)". */
export function tenLuaChon(donVi: DonViBan | null, gioiTinh: GioiTinh, soConMoiLo?: number | null): string {
  switch (donVi) {
    case null:
      return 'Phụ kiện'
    case 'CON_LE':
      return gioiTinh === 'CAI' ? 'Con lẻ – Cái' : 'Con lẻ – Đực'
    case 'CAP':
      return 'Cặp (1 đực + 1 cái)'
    case 'BO_BA':
      return 'Bộ ba (1 đực + 2 cái)'
    case 'LO_CA_BOT':
      return soConMoiLo ? `Lô cá bột · ${soConMoiLo} con` : 'Lô cá bột'
  }
}

/** Tên ngắn của lựa chọn, ví dụ "Cặp". */
export function tenNganLuaChon(donVi: DonViBan | null, gioiTinh: GioiTinh): string {
  switch (donVi) {
    case null:
      return 'Phụ kiện'
    case 'CON_LE':
      return gioiTinh === 'CAI' ? 'Cái' : 'Đực'
    case 'CAP':
      return 'Cặp'
    case 'BO_BA':
      return 'Bộ ba'
    case 'LO_CA_BOT':
      return 'Lô bột'
  }
}

/** Các nhãn đơn vị trên thẻ sản phẩm; con lẻ tách thành Đực và Cái như thiết kế. */
export function nhanDonViTrenThe(donViBan: DonViBan[] | null): string[] {
  const thuTu: DonViBan[] = ['CON_LE', 'CAP', 'BO_BA', 'LO_CA_BOT']
  return thuTu
    .filter((d) => donViBan?.includes(d))
    .flatMap((d) => (d === 'CON_LE' ? ['Đực', 'Cái'] : [tenNganLuaChon(d, 'KHONG_AP_DUNG')]))
}
