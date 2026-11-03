/** Khớp với ApiResponse<T> của backend. */
export interface ApiResponse<T> {
  thanhCong: boolean
  thongBao: string
  duLieu: T
}

/** Khớp với PageResponse<T> của backend. */
export interface PageResponse<T> {
  noiDung: T[]
  trang: number
  kichThuoc: number
  tongPhanTu: number
  tongTrang: number
}
