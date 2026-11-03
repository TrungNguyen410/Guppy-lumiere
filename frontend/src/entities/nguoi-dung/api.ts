import { axiosClient } from '@/shared/api/axiosClient'
import type { ApiResponse } from '@/shared/types/ApiResponse'
import type { DangKy, DiaChi, HoSo, LuuDiaChi, PhienDangNhap } from './model'

export async function dangNhap(tenDangNhap: string, matKhau: string): Promise<PhienDangNhap> {
  const { data } = await axiosClient.post<ApiResponse<PhienDangNhap>>('/auth/dang-nhap', { tenDangNhap, matKhau })
  return data.duLieu
}

export async function dangKy(duLieu: DangKy): Promise<PhienDangNhap> {
  const { data } = await axiosClient.post<ApiResponse<PhienDangNhap>>('/auth/dang-ky', duLieu)
  return data.duLieu
}

export async function layHoSo(): Promise<HoSo> {
  const { data } = await axiosClient.get<ApiResponse<HoSo>>('/khach-hang/ho-so')
  return data.duLieu
}

export async function capNhatHoSo(duLieu: { hoTen: string; soDienThoai: string }): Promise<HoSo> {
  const { data } = await axiosClient.put<ApiResponse<HoSo>>('/khach-hang/ho-so', duLieu)
  return data.duLieu
}

export async function laySoDiaChi(): Promise<DiaChi[]> {
  const { data } = await axiosClient.get<ApiResponse<DiaChi[]>>('/khach-hang/dia-chi')
  return data.duLieu
}

export async function themDiaChi(duLieu: LuuDiaChi): Promise<DiaChi> {
  const { data } = await axiosClient.post<ApiResponse<DiaChi>>('/khach-hang/dia-chi', duLieu)
  return data.duLieu
}

export async function suaDiaChi(id: number, duLieu: LuuDiaChi): Promise<DiaChi> {
  const { data } = await axiosClient.put<ApiResponse<DiaChi>>(`/khach-hang/dia-chi/${id}`, duLieu)
  return data.duLieu
}

export async function xoaDiaChi(id: number): Promise<void> {
  await axiosClient.delete(`/khach-hang/dia-chi/${id}`)
}
