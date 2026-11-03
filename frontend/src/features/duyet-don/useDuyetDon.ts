import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chuyenTrangThaiDon, layBaoHanhChoXuLy, layDonChoNhanVien, xacNhanDaNhanTien, xuLyBaoHanh } from '@/entities/don-hang/api'
import type { TrangThaiDon } from '@/entities/don-hang/model'

export const KHOA_DON_NV = ['nv-don-hang']

/** Dữ liệu và thao tác của nhân viên trên bảng đơn; mọi thao tác xong đều tải lại để cột luôn đúng. */
export function useDuyetDon(tuKhoa: string) {
  const queryClient = useQueryClient()
  const lamMoi = () => queryClient.invalidateQueries({ queryKey: KHOA_DON_NV })

  const danhSach = useQuery({ queryKey: [...KHOA_DON_NV, tuKhoa], queryFn: () => layDonChoNhanVien({ tuKhoa: tuKhoa || undefined, kichThuoc: 100 }) })
  const baoHanh = useQuery({ queryKey: [...KHOA_DON_NV, 'bao-hanh'], queryFn: layBaoHanhChoXuLy })

  const chuyen = useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: TrangThaiDon }) => chuyenTrangThaiDon(id, trangThai),
    onSuccess: lamMoi,
  })
  const nhanTien = useMutation({ mutationFn: (id: number) => xacNhanDaNhanTien(id), onSuccess: lamMoi })
  const xuLy = useMutation({
    mutationFn: ({ id, ketQua }: { id: number; ketQua: string }) => xuLyBaoHanh(id, ketQua),
    onSuccess: lamMoi,
  })

  return { danhSach, baoHanh, chuyen, nhanTien, xuLy }
}
