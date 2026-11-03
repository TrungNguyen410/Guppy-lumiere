import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Check, Loader2, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useThemVaoGio } from '@/entities/gio-hang/api'
import { laySanPhamTheoId } from '@/entities/san-pham/api'
import type { SanPhamTomTat } from '@/entities/san-pham/model'

/**
 * Thêm nhanh đơn vị rẻ nhất còn hàng. Danh sách không kèm bảng giá nên đọc chi tiết khi bấm,
 * nhờ vậy lựa chọn luôn đúng với tồn kho mới nhất.
 */
export function NutThemNhanh({ sanPham }: { sanPham: SanPhamTomTat }) {
  const themVaoGio = useThemVaoGio()
  const [ketQua, setKetQua] = useState<'thanh-cong' | 'loi' | null>(null)
  const thaoTac = useMutation({
    mutationFn: async () => {
      if (sanPham.loai === 'PHU_KIEN') {
        return themVaoGio.mutateAsync({ sanPhamId: sanPham.id, soLuong: 1 })
      }
      const chiTiet = await laySanPhamTheoId(sanPham.id)
      const reNhat = chiTiet.bangGia?.filter((g) => g.conLai > 0).sort((a, b) => a.gia - b.gia)[0]
      if (!reNhat) throw new Error('Sản phẩm đã hết hàng')
      return themVaoGio.mutateAsync({ sanPhamId: sanPham.id, donVi: reNhat.donVi, gioiTinh: reNhat.gioiTinh, soLuong: 1 })
    },
    onSuccess: () => hienKetQua('thanh-cong'),
    onError: () => hienKetQua('loi'),
  })

  function hienKetQua(kq: 'thanh-cong' | 'loi') {
    setKetQua(kq)
    setTimeout(() => setKetQua(null), 1200)
  }

  const nhan = !sanPham.conHang ? 'Đã hết hàng' : ketQua === 'loi' ? 'Không thêm được, vui lòng xem chi tiết' : 'Thêm vào giỏ'
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      title={nhan}
      aria-label={nhan}
      disabled={!sanPham.conHang || thaoTac.isPending}
      onClick={() => thaoTac.mutate()}
      className="grid h-11 w-11 cursor-pointer place-items-center rounded-2xl bg-[linear-gradient(135deg,#67e8f9,#c084fc)] text-abyss shadow-[0_0_20px_rgb(34_211_238/0.45)] transition hover:rotate-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:rotate-0"
    >
      {thaoTac.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : ketQua === 'thanh-cong' ? <Check className="h-5 w-5" /> : ketQua === 'loi' ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
    </motion.button>
  )
}
