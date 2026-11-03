import { axiosClient } from '@/shared/api/axiosClient'
import type { ApiResponse, PageResponse } from '@/shared/types/ApiResponse'
import type { DatHang, DonHang, KetQuaApMa, TrangThaiDon, ThanhToan, YeuCauBaoHanh } from './model'

export async function datHang(duLieu: DatHang): Promise<DonHang> {
  const { data } = await axiosClient.post<ApiResponse<DonHang>>('/don-hang', duLieu)
  return data.duLieu
}

export async function traCuuDon(maDon: string, sdt: string): Promise<DonHang> {
  const { data } = await axiosClient.get<ApiResponse<DonHang>>('/don-hang/tra-cuu', { params: { maDon, sdt } })
  return data.duLieu
}

export async function khachHuyDon(maDon: string, soDienThoai: string): Promise<DonHang> {
  const { data } = await axiosClient.put<ApiResponse<DonHang>>(`/don-hang/${encodeURIComponent(maDon)}/huy`, { soDienThoai })
  return data.duLieu
}

export async function kiemTraMaGiamGia(ma: string, tamTinh: number): Promise<KetQuaApMa> {
  const { data } = await axiosClient.get<ApiResponse<KetQuaApMa>>('/ma-giam-gia/kiem-tra', { params: { ma, tamTinh } })
  return data.duLieu
}

export async function layDonChoNhanVien(thamSo: { trangThai?: TrangThaiDon; tuKhoa?: string; kichThuoc?: number }): Promise<PageResponse<DonHang>> {
  const { data } = await axiosClient.get<ApiResponse<PageResponse<DonHang>>>('/nv/don-hang', { params: thamSo })
  return data.duLieu
}

export async function chuyenTrangThaiDon(id: number, trangThai: TrangThaiDon): Promise<DonHang> {
  const { data } = await axiosClient.put<ApiResponse<DonHang>>(`/nv/don-hang/${id}/trang-thai`, { trangThai })
  return data.duLieu
}

export async function xacNhanDaNhanTien(id: number): Promise<ThanhToan> {
  const { data } = await axiosClient.put<ApiResponse<ThanhToan>>(`/nv/don-hang/${id}/thanh-toan`)
  return data.duLieu
}

export async function layLichSuDon(): Promise<PageResponse<DonHang>> {
  const { data } = await axiosClient.get<ApiResponse<PageResponse<DonHang>>>('/khach-hang/don-hang', { params: { kichThuoc: 50 } })
  return data.duLieu
}

export async function guiDanhGia(duLieu: { maDon: string; sanPhamId: number; soSao: number; noiDung?: string }): Promise<void> {
  await axiosClient.post('/danh-gia', duLieu)
}

export async function guiBaoHanh(duLieu: { maDon: string; moTa: string; duongDanVideo?: string }): Promise<YeuCauBaoHanh> {
  const { data } = await axiosClient.post<ApiResponse<YeuCauBaoHanh>>('/bao-hanh', duLieu)
  return data.duLieu
}

export async function layBaoHanhCuaToi(): Promise<PageResponse<YeuCauBaoHanh>> {
  const { data } = await axiosClient.get<ApiResponse<PageResponse<YeuCauBaoHanh>>>('/khach-hang/bao-hanh', { params: { kichThuoc: 50 } })
  return data.duLieu
}

export async function layBaoHanhChoXuLy(): Promise<PageResponse<YeuCauBaoHanh>> {
  const { data } = await axiosClient.get<ApiResponse<PageResponse<YeuCauBaoHanh>>>('/nv/bao-hanh', { params: { chuaXuLy: true, kichThuoc: 100 } })
  return data.duLieu
}

export async function xuLyBaoHanh(id: number, ketQua: string): Promise<YeuCauBaoHanh> {
  const { data } = await axiosClient.put<ApiResponse<YeuCauBaoHanh>>(`/nv/bao-hanh/${id}/xu-ly`, { ketQua })
  return data.duLieu
}
