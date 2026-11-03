import axios, { AxiosError } from 'axios'
import { docToken, laySessionId } from '@/shared/lib/phien'
import type { ApiResponse } from '@/shared/types/ApiResponse'

/** Lỗi đã chuẩn hóa để giao diện hiển thị trực tiếp. */
export class LoiApi extends Error {
  readonly maTrangThai: number
  readonly chiTiet: unknown

  constructor(thongBao: string, maTrangThai: number, chiTiet?: unknown) {
    super(thongBao)
    this.name = 'LoiApi'
    this.maTrangThai = maTrangThai
    this.chiTiet = chiTiet
  }
}

let xuLyHetPhien: () => void = () => undefined

export function datXuLyHetPhien(xuLy: () => void): void {
  xuLyHetPhien = xuLy
}

export const axiosClient = axios.create({ baseURL: '/api', timeout: 15_000 })

axiosClient.interceptors.request.use((cauHinh) => {
  const token = docToken()
  if (token) cauHinh.headers.Authorization = `Bearer ${token}`
  cauHinh.headers['X-Session-Id'] = laySessionId()
  return cauHinh
})

axiosClient.interceptors.response.use(
  (phanHoi) => phanHoi,
  (loi: AxiosError<ApiResponse<unknown>>) => {
    const maTrangThai = loi.response?.status ?? 0
    if (maTrangThai === 401 && docToken()) xuLyHetPhien()
    const thongBao =
      loi.response?.data?.thongBao ??
      (maTrangThai === 0 ? 'Không kết nối được máy chủ' : 'Có lỗi xảy ra, vui lòng thử lại')
    return Promise.reject(new LoiApi(thongBao, maTrangThai, loi.response?.data?.duLieu))
  },
)
