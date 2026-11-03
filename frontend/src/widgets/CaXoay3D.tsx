import { Move3d } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { bangMauCua, type DongCa, type KieuDuoi } from '@/entities/san-pham/model'
import { CaSvg } from '@/entities/san-pham/ui/CaSvg'
import { hoTroWebGL } from '@/shared/lib/hieuUng'
import { BienLoi3D } from '@/shared/ui/BienLoi3D'

const CanhCaXoay = lazy(() => import('@/widgets/be-ca/CanhCaXoay'))

/** Khung xem cá 3D xoay 360° ở trang chi tiết; không có WebGL thì hiện cá SVG. */
export function CaXoay3D({ dongCa, duoi }: { dongCa: DongCa; duoi: KieuDuoi }) {
  const [dung3D] = useState(hoTroWebGL)
  const bangMau = bangMauCua(dongCa)
  const anhTinh = (
    <div className="grid h-full w-full place-items-center p-12">
      <CaSvg bangMau={bangMau} duoi={duoi} hoaTiet={dongCa.hoaTiet} className="w-full" />
    </div>
  )
  return (
    <div className="relative aspect-square overflow-hidden rounded-[36px] border border-white/10" style={{ background: `radial-gradient(80% 70% at 50% 40%, ${bangMau.duoi1}30, transparent 70%), linear-gradient(180deg,#0c2340,#030814)` }}>
      <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(0deg,transparent_0_40px,rgb(255_255_255/0.03)_40px_41px),repeating-linear-gradient(90deg,transparent_0_40px,rgb(255_255_255/0.03)_40px_41px)]" />
      {dung3D ? (
        <BienLoi3D duPhong={anhTinh}>
          <Suspense fallback={anhTinh}>
            <CanhCaXoay bangMau={bangMau} duoi={duoi} />
          </Suspense>
        </BienLoi3D>
      ) : (
        anhTinh
      )}
      {dung3D && (
        <div className="glass absolute top-4 left-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-slate-200">
          <Move3d className="h-3.5 w-3.5 text-aqua" /> Kéo để xoay 360°
        </div>
      )}
      <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
        <div className="glass flex items-center gap-2 rounded-full p-1.5">
          {[bangMau.than, bangMau.duoi1, bangMau.duoi2, bangMau.nhan].map((mau, i) => (
            <span key={i} className="h-6 w-6 rounded-full border border-white/20" style={{ background: mau }} />
          ))}
        </div>
        <span className="glass rounded-full px-3 py-1.5 text-xs text-slate-300">Mô hình 3D minh họa</span>
      </div>
    </div>
  )
}
