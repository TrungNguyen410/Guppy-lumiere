import type { MauNhan } from '@/shared/ui/Badge'

export type GiaiDoanLo = 'CA_BOT' | 'DANG_PHAN_GIOI' | 'TRUONG_THANH'
export type LoaiBienDong = 'NHAP_DE' | 'PHAN_GIOI' | 'HAO_HUT' | 'BAN' | 'TRA_TON'

/** Khớp LoCaDto của backend. */
export interface LoCa {
  id: number
  maLo: string
  caGuppyId: number
  tenSanPham: string
  tenDong: string
  boMe: string | null
  beNuoi: string
  ngayNo: string
  soDuc: number
  soCai: number
  soCaBot: number
  tongCa: number
  haoHut: number
  giaiDoan: GiaiDoanLo
}

export interface BienDongKho {
  id: number
  thoiGian: string
  loCaId: number
  maLo: string
  loai: LoaiBienDong
  deltaDuc: number
  deltaCai: number
  deltaBot: number
  ghiChu: string | null
}

export interface TaoLoCa {
  maLo: string
  caGuppyId: number
  boMe?: string
  beNuoi: string
  ngayNo: string
  soDuc: number
  soCai: number
  soCaBot: number
}

export const THONG_TIN_GIAI_DOAN: Record<GiaiDoanLo, { nhan: string; mau: MauNhan }> = {
  CA_BOT: { nhan: 'Cá bột', mau: 'sun' },
  DANG_PHAN_GIOI: { nhan: 'Đang phân giới', mau: 'orchid' },
  TRUONG_THANH: { nhan: 'Trưởng thành', mau: 'kelp' },
}

export const THONG_TIN_BIEN_DONG: Record<LoaiBienDong, { nhan: string; mau: MauNhan }> = {
  NHAP_DE: { nhan: 'Nhập đẻ', mau: 'kelp' },
  PHAN_GIOI: { nhan: 'Phân giới', mau: 'orchid' },
  HAO_HUT: { nhan: 'Hao hụt', mau: 'coral' },
  BAN: { nhan: 'Bán', mau: 'aqua' },
  TRA_TON: { nhan: 'Trả tồn', mau: 'sun' },
}

/** Ví dụ: "-3 đực, -6 cái". */
export function moTaBienDong(b: BienDongKho): string {
  const dinhDang = (so: number, ten: string) => (so === 0 ? null : `${so > 0 ? '+' : '−'}${Math.abs(so)} ${ten}`)
  return [dinhDang(b.deltaDuc, 'đực'), dinhDang(b.deltaCai, 'cái'), dinhDang(b.deltaBot, 'bột')].filter(Boolean).join(', ') || '—'
}
