import { Droplets, Filter, Package, Pill, Wheat } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { bangMauCua, type LoaiPhuKien, type SanPhamTomTat } from '../model'
import { CaSvg } from './CaSvg'

const ICON_PHU_KIEN: Record<LoaiPhuKien, typeof Package> = { THUC_AN: Wheat, BE: Droplets, LOC: Filter, THUOC: Pill }

interface Props {
  sanPham: SanPhamTomTat
  className?: string
  chuyenDong?: boolean
}

/** Hình của sản phẩm: cá thì vẽ SVG theo dòng, phụ kiện thì dùng icon theo loại. */
export function AnhSanPham({ sanPham, className, chuyenDong = true }: Props) {
  if (sanPham.dongCa && sanPham.kieuDuoi) {
    return <CaSvg bangMau={bangMauCua(sanPham.dongCa)} duoi={sanPham.kieuDuoi} hoaTiet={sanPham.dongCa.hoaTiet} className={className} chuyenDong={chuyenDong} />
  }
  const Icon = sanPham.loaiPhuKien ? ICON_PHU_KIEN[sanPham.loaiPhuKien] : Package
  return <Icon aria-hidden="true" className={cn('text-aqua', className)} strokeWidth={1.25} />
}

/** Nền màu phía sau hình sản phẩm, theo màu đuôi của dòng cá. */
export function nenSanPham(sanPham: SanPhamTomTat): string {
  const dong = sanPham.dongCa
  if (!dong) return 'radial-gradient(120% 90% at 30% 20%, #22d3ee33, transparent 60%), radial-gradient(100% 100% at 80% 90%, #c084fc33, #071226 70%)'
  return `radial-gradient(120% 90% at 30% 20%, ${dong.mauDuoi1}40, transparent 60%), radial-gradient(100% 100% at 80% 90%, ${dong.mauDuoi2}55, #071226 70%)`
}
