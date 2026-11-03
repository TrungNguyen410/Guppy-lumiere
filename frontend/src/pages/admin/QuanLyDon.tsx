import { useSearchParams } from 'react-router-dom'
import { TieuDeQuanTri } from '@/shared/ui/TieuDe'
import { BangDonHang } from '@/widgets/BangDonHang'

export function QuanLyDon() {
  const [thamSo] = useSearchParams()
  const tuKhoa = thamSo.get('tuKhoa') ?? ''
  return (
    <div>
      <TieuDeQuanTri
        nhanPhu="Xử lý đơn"
        tieuDe="Bảng đơn hàng"
        moTa={tuKhoa ? `Kết quả tìm kiếm cho "${tuKhoa}".` : 'Chờ xác nhận → Đã xác nhận → Đang đóng gói → Đang giao → Hoàn tất. Hủy được ở Chờ xác nhận, Đã xác nhận và Đang giao.'}
      />
      <BangDonHang tuKhoa={tuKhoa} />
    </div>
  )
}
