import { lazy, Suspense, useState } from 'react'
import { BANG_MAU_BE_CA } from '@/entities/san-pham/model'
import { CaSvg } from '@/entities/san-pham/ui/CaSvg'
import { canGiamHieuUng, hoTroWebGL } from '@/shared/lib/hieuUng'
import { BienLoi3D } from '@/shared/ui/BienLoi3D'

// Lazy load để thư viện 3D không nằm trong gói tải đầu tiên của trang
const CanhBeCa = lazy(() => import('@/widgets/be-ca/CanhBeCa'))

const VI_TRI_CA_TINH = [
  { trai: '56%', tren: '24%', rong: 300, duoi: 'DELTA' },
  { trai: '76%', tren: '48%', rong: 220, duoi: 'VOAN' },
  { trai: '48%', tren: '62%', rong: 170, duoi: 'TRON' },
  { trai: '82%', tren: '16%', rong: 150, duoi: 'DAN' },
] as const

/** Ảnh tĩnh của bể cá, dùng khi không có WebGL và trong lúc tải cảnh 3D. */
function AnhTinhBeCa() {
  return (
    <div role="img" aria-label="Bể cá bảy màu" className="relative h-full w-full overflow-hidden bg-[radial-gradient(90%_70%_at_70%_30%,#0c2340,#020b18_70%)]">
      {VI_TRI_CA_TINH.map((ca, i) => (
        <div key={ca.trai} className="absolute hidden md:block" style={{ left: ca.trai, top: ca.tren, width: ca.rong }}>
          <CaSvg bangMau={BANG_MAU_BE_CA[i]} duoi={ca.duoi} chuyenDong={false} className="w-full -scale-x-100" />
        </div>
      ))}
    </div>
  )
}

/** Hero bể cá: tự chọn cảnh 3D, cảnh 3D rút gọn trên máy yếu, hoặc ảnh tĩnh. */
export function BeCa3D() {
  const [dung3D] = useState(hoTroWebGL)
  const [rutGon] = useState(canGiamHieuUng)
  if (!dung3D) return <AnhTinhBeCa />
  return (
    <BienLoi3D duPhong={<AnhTinhBeCa />}>
      <Suspense fallback={<AnhTinhBeCa />}>
        <CanhBeCa rutGon={rutGon} />
      </Suspense>
    </BienLoi3D>
  )
}
