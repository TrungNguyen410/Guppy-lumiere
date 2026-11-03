import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosClient } from '@/shared/api/axiosClient'
import type { ApiResponse } from '@/shared/types/ApiResponse'
import type { GioHang, ThemVaoGio } from './model'

const KHOA_GIO = ['gio-hang']

async function layGio(): Promise<GioHang> {
  const { data } = await axiosClient.get<ApiResponse<GioHang>>('/gio-hang')
  return data.duLieu
}

export async function gopGioSauDangNhap(): Promise<GioHang> {
  const { data } = await axiosClient.post<ApiResponse<GioHang>>('/gio-hang/gop')
  return data.duLieu
}

export const useGioHang = () => useQuery({ queryKey: KHOA_GIO, queryFn: layGio })

/** Mọi thao tác trả về giỏ mới nhất nên ghi thẳng vào cache, Header cập nhật số lượng ngay. */
function useThaoTacGio<T>(thaoTac: (bien: T) => Promise<{ data: ApiResponse<GioHang> }>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (bien: T) => (await thaoTac(bien)).data.duLieu,
    onSuccess: (gio) => queryClient.setQueryData(KHOA_GIO, gio),
  })
}

export const useThemVaoGio = () => useThaoTacGio((dong: ThemVaoGio) => axiosClient.post<ApiResponse<GioHang>>('/gio-hang', dong))

export const useDoiSoLuong = () =>
  useThaoTacGio(({ id, soLuong }: { id: number; soLuong: number }) => axiosClient.put<ApiResponse<GioHang>>(`/gio-hang/${id}`, { soLuong }))

export const useXoaDong = () => useThaoTacGio((id: number) => axiosClient.delete<ApiResponse<GioHang>>(`/gio-hang/${id}`))
