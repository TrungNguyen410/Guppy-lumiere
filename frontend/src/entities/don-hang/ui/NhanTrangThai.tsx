import { Badge } from '@/shared/ui/Badge'
import { THONG_TIN_TRANG_THAI, type TrangThaiDon } from '../model'

export function NhanTrangThai({ trangThai }: { trangThai: TrangThaiDon }) {
  const thongTin = THONG_TIN_TRANG_THAI[trangThai]
  return (
    <Badge mau={thongTin.mauNhan}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: thongTin.mau, boxShadow: `0 0 8px ${thongTin.mau}` }} />
      {thongTin.nhan}
    </Badge>
  )
}
