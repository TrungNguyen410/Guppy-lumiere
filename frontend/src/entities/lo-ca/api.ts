import { axiosClient } from '@/shared/api/axiosClient'
import type { ApiResponse, PageResponse } from '@/shared/types/ApiResponse'
import type { BienDongKho, LoCa, TaoLoCa } from './model'

export async function layDanhSachLoCa(tuKhoa?: string): Promise<LoCa[]> {
  const { data } = await axiosClient.get<ApiResponse<LoCa[]>>('/nv/lo-ca', { params: { tuKhoa: tuKhoa || undefined } })
  return data.duLieu
}

export async function layNhatKyKho(kichThuoc = 20): Promise<PageResponse<BienDongKho>> {
  const { data } = await axiosClient.get<ApiResponse<PageResponse<BienDongKho>>>('/nv/lo-ca/bien-dong', { params: { kichThuoc } })
  return data.duLieu
}

export async function taoLoCa(duLieu: TaoLoCa): Promise<LoCa> {
  const { data } = await axiosClient.post<ApiResponse<LoCa>>('/nv/lo-ca', duLieu)
  return data.duLieu
}

export async function nhapDe(id: number, duLieu: { soCaBot: number; ghiChu?: string }): Promise<LoCa> {
  const { data } = await axiosClient.post<ApiResponse<LoCa>>(`/nv/lo-ca/${id}/nhap-de`, duLieu)
  return data.duLieu
}

export async function phanGioi(id: number, duLieu: { soDuc: number; soCai: number; ghiChu?: string }): Promise<LoCa> {
  const { data } = await axiosClient.post<ApiResponse<LoCa>>(`/nv/lo-ca/${id}/phan-gioi`, duLieu)
  return data.duLieu
}

export async function ghiHaoHut(id: number, duLieu: { soDuc: number; soCai: number; soCaBot: number; ghiChu?: string }): Promise<LoCa> {
  const { data } = await axiosClient.put<ApiResponse<LoCa>>(`/nv/lo-ca/${id}/hao-hut`, duLieu)
  return data.duLieu
}
