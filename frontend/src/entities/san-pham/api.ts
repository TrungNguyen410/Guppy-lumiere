import { useQuery } from '@tanstack/react-query'
import qs from './thamSoUrl'
import { axiosClient } from '@/shared/api/axiosClient'
import type { ApiResponse, PageResponse } from '@/shared/types/ApiResponse'
import type { BoLocSanPham, DanhGia, DongCa, SanPhamChiTiet, SanPhamTomTat } from './model'

export async function layDanhSachSanPham(boLoc: BoLocSanPham): Promise<PageResponse<SanPhamTomTat>> {
  const { data } = await axiosClient.get<ApiResponse<PageResponse<SanPhamTomTat>>>(`/san-pham?${qs(boLoc)}`)
  return data.duLieu
}

export async function laySanPhamTheoSlug(slug: string): Promise<SanPhamChiTiet> {
  const { data } = await axiosClient.get<ApiResponse<SanPhamChiTiet>>(`/san-pham/slug/${encodeURIComponent(slug)}`)
  return data.duLieu
}

export async function laySanPhamTheoId(id: number): Promise<SanPhamChiTiet> {
  const { data } = await axiosClient.get<ApiResponse<SanPhamChiTiet>>(`/san-pham/${id}`)
  return data.duLieu
}

export async function layDongCa(): Promise<DongCa[]> {
  const { data } = await axiosClient.get<ApiResponse<DongCa[]>>('/dong-ca')
  return data.duLieu
}

export async function layDanhGia(sanPhamId: number): Promise<PageResponse<DanhGia>> {
  const { data } = await axiosClient.get<ApiResponse<PageResponse<DanhGia>>>(`/san-pham/${sanPhamId}/danh-gia`)
  return data.duLieu
}

export const useDanhSachSanPham = (boLoc: BoLocSanPham) =>
  useQuery({ queryKey: ['san-pham', boLoc], queryFn: () => layDanhSachSanPham(boLoc) })

export const useChiTietSanPham = (slug: string) =>
  useQuery({ queryKey: ['san-pham', 'slug', slug], queryFn: () => laySanPhamTheoSlug(slug) })

export const useDongCa = () => useQuery({ queryKey: ['dong-ca'], queryFn: layDongCa, staleTime: 5 * 60_000 })

export const useDanhGia = (sanPhamId: number | undefined) =>
  useQuery({ queryKey: ['danh-gia', sanPhamId], queryFn: () => layDanhGia(sanPhamId!), enabled: sanPhamId != null })
