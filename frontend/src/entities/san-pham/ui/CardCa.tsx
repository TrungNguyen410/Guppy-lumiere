import { Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { formatTien } from '@/shared/lib/formatTien'
import { Badge } from '@/shared/ui/Badge'
import { TiltCard } from '@/shared/ui/TiltCard'
import { nhanDonViTrenThe, TEN_DUOI, TEN_NHAN, TEN_PHU_KIEN, type SanPhamTomTat } from '../model'
import { AnhSanPham, nenSanPham } from './AnhSanPham'

/** Thẻ sản phẩm có hiệu ứng nghiêng và vệt sáng; dùng cho cả cá và phụ kiện. */
export function CardCa({ sanPham, hanhDong }: { sanPham: SanPhamTomTat; hanhDong?: ReactNode }) {
  const moTaNgan = sanPham.dongCa && sanPham.kieuDuoi ? `${sanPham.dongCa.ten} · ${TEN_DUOI[sanPham.kieuDuoi]}` : sanPham.loaiPhuKien ? TEN_PHU_KIEN[sanPham.loaiPhuKien] : ''
  const duongDan = DUONG_DAN.chiTietCa(sanPham.slug)
  return (
    <TiltCard className="h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[.07] to-white/[.02] p-4 backdrop-blur-xl">
        <Link to={duongDan} aria-label={sanPham.ten} className="relative block aspect-[4/3] overflow-hidden rounded-2xl" style={{ background: nenSanPham(sanPham) }}>
          <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(115deg,transparent_0_18px,rgb(255_255_255/0.07)_18px_20px)]" />
          <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-110" style={{ transform: 'translateZ(40px)' }}>
            <AnhSanPham sanPham={sanPham} className={sanPham.dongCa ? 'w-full drop-shadow-[0_10px_25px_rgb(0_0_0/0.5)]' : 'h-16 w-16'} />
          </div>
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {sanPham.nhan.map((n) => (
              <Badge key={n} mau={TEN_NHAN[n].mau} className="backdrop-blur-md">
                {TEN_NHAN[n].ten}
              </Badge>
            ))}
            {!sanPham.conHang && (
              <Badge mau="xam" className="backdrop-blur-md">
                Hết hàng
              </Badge>
            )}
          </div>
        </Link>
        <div className="mt-4 flex flex-1 flex-col" style={{ transform: 'translateZ(25px)' }}>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>{moTaNgan}</span>
            <span className="flex shrink-0 items-center gap-1 text-sun">
              <Star className="h-3 w-3 fill-sun" />
              {sanPham.diemDanhGia} <span className="text-slate-500">({sanPham.daBan})</span>
            </span>
          </div>
          <Link to={duongDan} className="mt-1 font-display text-base leading-snug font-semibold hover:text-aqua">
            {sanPham.ten}
          </Link>
          <div className="mt-2 flex flex-wrap gap-1">
            {nhanDonViTrenThe(sanPham.donViBan).map((nhan) => (
              <span key={nhan} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">
                {nhan}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              <p className="text-[10px] tracking-wider text-slate-500 uppercase">Chỉ từ</p>
              <p className="text-iridescent font-display text-xl font-semibold">{formatTien(sanPham.giaThapNhat)}</p>
            </div>
            {hanhDong}
          </div>
        </div>
      </article>
    </TiltCard>
  )
}
