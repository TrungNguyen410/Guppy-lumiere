import type { DonViBan, GioiTinh } from '@/entities/san-pham/model'
import type { MauNhan } from '@/shared/ui/Badge'

export type TrangThaiDon = 'CHO_XAC_NHAN' | 'DA_XAC_NHAN' | 'DANG_DONG_GOI' | 'DANG_GIAO' | 'HOAN_TAT' | 'DA_HUY' | 'BAO_HANH'
export type PhuongThucThanhToan = 'COD' | 'CHUYEN_KHOAN'
export type TrangThaiThanhToan = 'CHUA_THANH_TOAN' | 'DA_THANH_TOAN' | 'DA_HOAN_TIEN'

export interface ChiTietDon {
  sanPhamId: number
  tenSanPham: string
  donVi: DonViBan | null
  gioiTinh: GioiTinh
  soLuong: number
  donGia: number
  thanhTien: number
}

export interface LichSuTrangThai {
  trangThai: TrangThaiDon
  thoiDiem: string
  ghiChu: string | null
}

export interface ThanhToan {
  phuongThuc: PhuongThucThanhToan
  trangThai: TrangThaiThanhToan
  soTien: number
  daTraLuc: string | null
  noiDungChuyenKhoan: string | null
  nganHang: string | null
  soTaiKhoan: string | null
  chuTaiKhoan: string | null
}

/** Khớp DonHangDto của backend. */
export interface DonHang {
  id: number
  maDon: string
  khachVangLai: boolean
  hoTenNhan: string
  sdtNhan: string
  diaChiNhan: string
  thanhPhoNhan: string
  ghiChu: string | null
  trangThai: TrangThaiDon
  khachDuocHuy: boolean
  tamTinh: number
  phiGiao: number
  giamGia: number
  tongTien: number
  chiTiet: ChiTietDon[]
  lichSu: LichSuTrangThai[]
  thanhToan: ThanhToan | null
  taoLuc: string
  hoanTatLuc: string | null
  conHanBaoHanh: boolean
}

export interface DatHang {
  hoTen: string
  soDienThoai: string
  diaChi: string
  thanhPho: string
  ghiChu?: string
  phuongThuc: PhuongThucThanhToan
  maGiamGia?: string
}

export interface KetQuaApMa {
  ma: string
  phanTram: number
  tienGiam: number
}

export interface YeuCauBaoHanh {
  id: number
  maDon: string
  trangThaiDon: TrangThaiDon
  tenKhach: string
  soDienThoai: string
  moTa: string
  duongDanVideo: string | null
  ketQua: string | null
  xuLyLuc: string | null
  taoLuc: string
}

/** Năm bước chính hiển thị trên thanh trạng thái và các cột của bảng đơn. */
export const LUONG_TRANG_THAI: TrangThaiDon[] = ['CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_DONG_GOI', 'DANG_GIAO', 'HOAN_TAT']

export const THONG_TIN_TRANG_THAI: Record<TrangThaiDon, { nhan: string; mau: string; mauNhan: MauNhan }> = {
  CHO_XAC_NHAN: { nhan: 'Chờ xác nhận', mau: '#fbbf24', mauNhan: 'sun' },
  DA_XAC_NHAN: { nhan: 'Đã xác nhận', mau: '#22d3ee', mauNhan: 'aqua' },
  DANG_DONG_GOI: { nhan: 'Đang đóng gói', mau: '#c084fc', mauNhan: 'orchid' },
  DANG_GIAO: { nhan: 'Đang giao', mau: '#fb7185', mauNhan: 'coral' },
  HOAN_TAT: { nhan: 'Hoàn tất', mau: '#34d399', mauNhan: 'kelp' },
  DA_HUY: { nhan: 'Đã hủy', mau: '#64748b', mauNhan: 'xam' },
  BAO_HANH: { nhan: 'Bảo hành', mau: '#f472b6', mauNhan: 'coral' },
}

/** Theo đề bài: đơn hủy được ở ba trạng thái này, không hủy được khi đang đóng gói. */
export const HUY_DUOC_O: TrangThaiDon[] = ['CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_GIAO']

export const THONG_TIN_THANH_TOAN: Record<TrangThaiThanhToan, string> = {
  CHUA_THANH_TOAN: 'Chưa thanh toán',
  DA_THANH_TOAN: 'Đã thanh toán',
  DA_HOAN_TIEN: 'Đã hoàn tiền',
}
