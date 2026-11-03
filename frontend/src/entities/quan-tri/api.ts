import { axiosClient } from '@/shared/api/axiosClient'
import type { ApiResponse, PageResponse } from '@/shared/types/ApiResponse'
import type { TrangThaiDon } from '@/entities/don-hang/model'
import type { BoLocSanPham, DongCa, HoaTiet, LoaiPhuKien, SanPhamChiTiet, SanPhamTomTat, DonViBan, GioiTinh, KieuDuoi, NhanSanPham } from '@/entities/san-pham/model'

export interface DiemDoanhThu {
  ngay: string
  nhan: string
  doanhThu: number
}

/** Khớp ThongKeDto của backend. */
export interface ThongKe {
  ngay: string
  doanhThuHomNay: number
  doanhThuHomQua: number
  tangTruongPhanTram: number | null
  doanhThu7Ngay: DiemDoanhThu[]
  tongDoanhThu7Ngay: number
  donChoXacNhan: number
  donTheoTrangThai: { trangThai: TrangThaiDon; soDon: number }[]
  tongCaTon: number
  soLoDangNuoi: number
  haoHutThangNay: number
  tiLeHaoHutPhanTram: number
  dongBanChay: { tenDong: string; daBan: number }[]
  donMoiNhat: { maDon: string; hoTen: string; thanhPho: string; tongTien: number; trangThai: TrangThaiDon; taoLuc: string }[]
}

export async function layThongKe(): Promise<ThongKe> {
  const { data } = await axiosClient.get<ApiResponse<ThongKe>>('/admin/thong-ke')
  return data.duLieu
}

export interface LuuCaGuppy {
  loai: 'CA_GUPPY'
  ten: string
  moTa?: string
  nhan: NhanSanPham[]
  dongCaId: number
  kieuDuoi: KieuDuoi
  mauSac: string
  thuanChung: boolean
  kichThuoc: string
  tuoiTuan: number
  soConMoiLo: number
  nhietDoMin: number
  nhietDoMax: number
  phMin: number
  phMax: number
  doCung: string
  bangGia: { donVi: DonViBan; gioiTinh?: GioiTinh; gia: number }[]
}

export interface LuuPhuKien {
  loai: 'PHU_KIEN'
  ten: string
  moTa?: string
  nhan: NhanSanPham[]
  loaiPhuKien: LoaiPhuKien
  gia: number
  tonKho: number
}

export type LuuSanPham = LuuCaGuppy | LuuPhuKien

export async function laySanPhamQuanTri(boLoc: BoLocSanPham): Promise<PageResponse<SanPhamTomTat>> {
  const { data } = await axiosClient.get<ApiResponse<PageResponse<SanPhamTomTat>>>('/admin/san-pham', { params: boLoc })
  return data.duLieu
}

export async function layChiTietQuanTri(id: number): Promise<SanPhamChiTiet> {
  const { data } = await axiosClient.get<ApiResponse<SanPhamChiTiet>>(`/admin/san-pham/${id}`)
  return data.duLieu
}

export async function taoSanPham(duLieu: LuuSanPham): Promise<void> {
  await axiosClient.post('/admin/san-pham', duLieu)
}

export async function suaSanPham(id: number, duLieu: LuuSanPham): Promise<void> {
  await axiosClient.put(`/admin/san-pham/${id}`, duLieu)
}

export async function ngungBanSanPham(id: number): Promise<void> {
  await axiosClient.delete(`/admin/san-pham/${id}`)
}

export async function moBanSanPham(id: number): Promise<void> {
  await axiosClient.put(`/admin/san-pham/${id}/mo-ban`)
}

export type LuuDongCa = Omit<DongCa, 'id' | 'hoaTiet'> & { hoaTiet: HoaTiet }

export async function taoDongCa(duLieu: LuuDongCa): Promise<void> {
  await axiosClient.post('/admin/dong-ca', duLieu)
}

export async function suaDongCa(id: number, duLieu: LuuDongCa): Promise<void> {
  await axiosClient.put(`/admin/dong-ca/${id}`, duLieu)
}

export async function xoaDongCa(id: number): Promise<void> {
  await axiosClient.delete(`/admin/dong-ca/${id}`)
}

export interface MaGiamGia {
  id: number
  ma: string
  phanTram: number
  ngayBatDau: string
  ngayHetHan: string
  soLuotToiDa: number | null
  soLuotDaDung: number
  kichHoat: boolean
}

export type LuuMaGiamGia = Omit<MaGiamGia, 'id' | 'soLuotDaDung'>

export async function layMaGiamGia(): Promise<MaGiamGia[]> {
  const { data } = await axiosClient.get<ApiResponse<MaGiamGia[]>>('/admin/ma-giam-gia')
  return data.duLieu
}

export async function taoMaGiamGia(duLieu: LuuMaGiamGia): Promise<void> {
  await axiosClient.post('/admin/ma-giam-gia', duLieu)
}

export async function suaMaGiamGia(id: number, duLieu: LuuMaGiamGia): Promise<void> {
  await axiosClient.put(`/admin/ma-giam-gia/${id}`, duLieu)
}

export async function xoaMaGiamGia(id: number): Promise<void> {
  await axiosClient.delete(`/admin/ma-giam-gia/${id}`)
}

export interface NhanVien {
  id: number
  hoTen: string
  email: string
  soDienThoai: string | null
  kichHoat: boolean
}

export async function layNhanVien(): Promise<NhanVien[]> {
  const { data } = await axiosClient.get<ApiResponse<NhanVien[]>>('/admin/nhan-vien')
  return data.duLieu
}

export async function taoNhanVien(duLieu: { hoTen: string; email: string; soDienThoai: string; matKhau: string }): Promise<void> {
  await axiosClient.post('/admin/nhan-vien', duLieu)
}

export async function suaNhanVien(id: number, duLieu: { hoTen: string; soDienThoai: string; kichHoat: boolean; matKhauMoi?: string }): Promise<void> {
  await axiosClient.put(`/admin/nhan-vien/${id}`, duLieu)
}

export async function xoaNhanVien(id: number): Promise<void> {
  await axiosClient.delete(`/admin/nhan-vien/${id}`)
}
