import { create } from 'zustand'
import { docToken, ghiToken } from '@/shared/lib/phien'
import type { PhienDangNhap } from './model'

interface TrangThaiPhien {
  phien: PhienDangNhap | null
  dangNhap: (phien: PhienDangNhap, ghiNho: boolean) => void
  dangXuat: () => void
  doiHoTen: (hoTen: string) => void
}

const KHOA_THONG_TIN = 'guppy-nguoi-dung'

/** Khôi phục thông tin người dùng đi kèm token khi tải lại trang. */
function docPhienDaLuu(): PhienDangNhap | null {
  const token = docToken()
  const luu = localStorage.getItem(KHOA_THONG_TIN)
  if (!token || !luu) return null
  try {
    return { ...(JSON.parse(luu) as Omit<PhienDangNhap, 'token'>), token }
  } catch {
    return null
  }
}

/** Phiên đăng nhập, đặt ở tầng entity để widget và feature dùng được mà không import ngược lên app. */
export const usePhienStore = create<TrangThaiPhien>((set, get) => ({
  phien: docPhienDaLuu(),
  dangNhap: (phien, ghiNho) => {
    const { token, ...thongTin } = phien
    ghiToken(token, ghiNho)
    localStorage.setItem(KHOA_THONG_TIN, JSON.stringify(thongTin))
    set({ phien })
  },
  dangXuat: () => {
    ghiToken(null)
    localStorage.removeItem(KHOA_THONG_TIN)
    set({ phien: null })
  },
  doiHoTen: (hoTen) => {
    const hienTai = get().phien
    if (!hienTai) return
    const { token, ...thongTin } = { ...hienTai, hoTen }
    localStorage.setItem(KHOA_THONG_TIN, JSON.stringify(thongTin))
    set({ phien: { ...thongTin, token } })
  },
}))
