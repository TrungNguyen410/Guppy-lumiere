import { motion } from 'framer-motion'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import { useDongCa } from '@/entities/san-pham/api'
import { BANG_MAU_TRANG_TRI, TEN_DUOI, type BoLocSanPham, type KieuDuoi } from '@/entities/san-pham/model'
import { CaSvg } from '@/entities/san-pham/ui/CaSvg'
import { GIA_TOI_DA_MAC_DINH } from '@/features/loc-san-pham/useBoLocUrl'
import { cn } from '@/shared/lib/cn'
import { formatTien } from '@/shared/lib/formatTien'

function Chip({ dangChon, khiBam, children }: { dangChon: boolean; khiBam: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-pressed={dangChon}
      whileTap={{ scale: 0.92 }}
      onClick={khiBam}
      className={cn('flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs transition', dangChon ? 'border-aqua/60 bg-aqua/10 text-white shadow-[0_0_18px_-4px_rgb(34_211_238/0.6)]' : 'border-white/10 bg-white/[.02] text-slate-400 hover:border-white/25 hover:text-white')}
    >
      {children}
    </motion.button>
  )
}

function Nhom({ tieuDe, children }: { tieuDe: string; children: ReactNode }) {
  return (
    <div className="border-t border-white/5 pt-5">
      <p className="mb-3 text-[11px] font-semibold tracking-[.2em] text-slate-500 uppercase">{tieuDe}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

const CAC_DON_VI = [
  ['CON_LE', 'Con lẻ'],
  ['CAP', 'Cặp'],
  ['BO_BA', 'Bộ ba'],
  ['LO_CA_BOT', 'Lô cá bột'],
] as const

interface Props {
  boLoc: BoLocSanPham
  datGiaTri: (khoa: string, giaTri: string | undefined) => void
  batTat: (khoa: string, giaTri: string) => void
  datLai: () => void
}

export function BoLocCa({ boLoc, datGiaTri, batTat, datLai }: Props) {
  const dongCa = useDongCa()
  const giaMax = boLoc.giaMax ?? GIA_TOI_DA_MAC_DINH
  return (
    <aside aria-label="Bộ lọc" className="glass sticky top-28 space-y-5 rounded-[28px] p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-display font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-aqua" /> Bộ lọc
        </p>
        <button type="button" onClick={datLai} className="flex cursor-pointer items-center gap-1 text-xs text-slate-400 hover:text-coral">
          <RotateCcw className="h-3 w-3" /> Đặt lại
        </button>
      </div>
      <div className="flex gap-2">
        <Chip dangChon={!boLoc.loai} khiBam={() => datGiaTri('loai', undefined)}>
          Tất cả
        </Chip>
        <Chip dangChon={boLoc.loai === 'CA_GUPPY'} khiBam={() => datGiaTri('loai', 'CA_GUPPY')}>
          Cá
        </Chip>
        <Chip dangChon={boLoc.loai === 'PHU_KIEN'} khiBam={() => datGiaTri('loai', 'PHU_KIEN')}>
          Phụ kiện
        </Chip>
      </div>
      <Nhom tieuDe="Dòng cá">
        {dongCa.data?.map((d) => (
          <Chip key={d.ma} dangChon={boLoc.dong?.includes(d.ma) ?? false} khiBam={() => batTat('dong', d.ma)}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: `linear-gradient(135deg, ${d.mauDuoi1}, ${d.mauDuoi2})` }} />
            {d.ten}
          </Chip>
        ))}
      </Nhom>
      <Nhom tieuDe="Giới tính">
        <Chip dangChon={boLoc.gioiTinh?.includes('DUC') ?? false} khiBam={() => batTat('gioiTinh', 'DUC')}>
          ♂ Đực
        </Chip>
        <Chip dangChon={boLoc.gioiTinh?.includes('CAI') ?? false} khiBam={() => batTat('gioiTinh', 'CAI')}>
          ♀ Cái
        </Chip>
      </Nhom>
      <Nhom tieuDe="Kiểu đuôi">
        {(Object.keys(TEN_DUOI) as KieuDuoi[]).map((duoi) => (
          <Chip key={duoi} dangChon={boLoc.kieuDuoi?.includes(duoi) ?? false} khiBam={() => batTat('kieuDuoi', duoi)}>
            <CaSvg bangMau={BANG_MAU_TRANG_TRI} duoi={duoi} chuyenDong={false} className="h-4 w-7" />
            {TEN_DUOI[duoi].replace('Đuôi ', '')}
          </Chip>
        ))}
      </Nhom>
      <Nhom tieuDe="Đơn vị bán">
        {CAC_DON_VI.map(([ma, nhan]) => (
          <Chip key={ma} dangChon={boLoc.donVi?.includes(ma) ?? false} khiBam={() => batTat('donVi', ma)}>
            {nhan}
          </Chip>
        ))}
      </Nhom>
      <div className="border-t border-white/5 pt-5">
        <label>
          <span className="mb-3 flex justify-between text-[11px] font-semibold tracking-[.2em] text-slate-500 uppercase">
            Giá tối đa <span className="tracking-normal text-aqua normal-case">{formatTien(giaMax)}</span>
          </span>
          <input
            type="range"
            min={30_000}
            max={GIA_TOI_DA_MAC_DINH}
            step={5_000}
            value={giaMax}
            onChange={(su) => {
              const giaTri = Number(su.target.value)
              datGiaTri('giaMax', giaTri >= GIA_TOI_DA_MAC_DINH ? undefined : String(giaTri))
            }}
            className="w-full"
          />
        </label>
      </div>
    </aside>
  )
}
