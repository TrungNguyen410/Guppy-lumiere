import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'
import type { ReactNode } from 'react'
import { MUC_MIEN_PHI_GIAO } from '@/entities/gio-hang/model'
import { formatTien } from '@/shared/lib/formatTien'

interface Props {
  tamTinh: number
  phiGiao: number
  giamGia?: number
  hanhDong?: ReactNode
}

/** Khung tóm tắt tiền của đơn, dùng chung cho Giỏ hàng và Thanh toán. Số tiền đều do backend tính. */
export function TomTatDon({ tamTinh, phiGiao, giamGia = 0, hanhDong }: Props) {
  const tienDo = Math.min(100, (tamTinh / MUC_MIEN_PHI_GIAO) * 100)
  return (
    <div className="glass sticky top-28 rounded-[28px] p-6">
      <p className="font-display text-lg font-semibold">Tóm tắt đơn</p>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Tạm tính</span>
          <span>{formatTien(tamTinh)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Giao hỏa tốc</span>
          <span>{phiGiao ? formatTien(phiGiao) : <span className="text-kelp">Miễn phí</span>}</span>
        </div>
        {giamGia > 0 && (
          <div className="flex justify-between text-kelp">
            <span>Giảm giá</span>
            <span>−{formatTien(giamGia)}</span>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-2xl bg-white/[.03] p-3">
        <p className="flex items-center gap-2 text-xs text-slate-400">
          <Truck className="h-3.5 w-3.5 shrink-0 text-aqua" />
          {tienDo < 100 ? (
            <span>
              Mua thêm <b className="text-white">{formatTien(MUC_MIEN_PHI_GIAO - tamTinh)}</b> để miễn phí giao
            </span>
          ) : (
            'Bạn được miễn phí giao hàng!'
          )}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
          <motion.div animate={{ width: `${tienDo}%` }} className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#c084fc,#fb7185)]" />
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
        <span className="text-sm text-slate-400">Tổng cộng</span>
        <span className="text-iridescent font-display text-3xl font-semibold">{formatTien(tamTinh + phiGiao - giamGia)}</span>
      </div>
      {hanhDong}
    </div>
  )
}
