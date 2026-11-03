import { motion } from 'framer-motion'
import { Check, ShieldCheck, X } from 'lucide-react'
import { LUONG_TRANG_THAI, THONG_TIN_TRANG_THAI, type DonHang, type TrangThaiDon } from '@/entities/don-hang/model'
import { BANG_MAU_TRANG_TRI } from '@/entities/san-pham/model'
import { CaSvg } from '@/entities/san-pham/ui/CaSvg'
import { formatNgayGio } from '@/shared/lib/formatNgay'

/** Bước đã đi tới trên luồng chính. Đơn bị hủy dừng ở bước cuối cùng đã qua; đơn bảo hành coi như đã hoàn tất. */
function buocHienTai(don: DonHang): number {
  if (don.trangThai === 'BAO_HANH') return LUONG_TRANG_THAI.length - 1
  const cacBuoc = don.lichSu.map((l) => LUONG_TRANG_THAI.indexOf(l.trangThai)).filter((b) => b >= 0)
  return Math.max(0, ...cacBuoc)
}

/** Thanh trạng thái đơn: chú cá bơi tới bước hiện tại. */
export function ThanhTrangThaiDon({ don }: { don: DonHang }) {
  const daHuy = don.trangThai === 'DA_HUY'
  const buoc = buocHienTai(don)
  const tiLe = (buoc / (LUONG_TRANG_THAI.length - 1)) * 100
  const thoiDiem = (trangThai: TrangThaiDon) => don.lichSu.find((l) => l.trangThai === trangThai)?.thoiDiem
  const lanCuoi = (trangThai: TrangThaiDon) => don.lichSu.filter((l) => l.trangThai === trangThai).at(-1)
  return (
    <div className="relative px-2 pt-14">
      <div className="absolute top-[74px] right-6 left-6 h-1 rounded-full bg-white/5" />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `calc((100% - 48px) * ${tiLe / 100})` }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
        className="absolute top-[74px] left-6 h-1 rounded-full bg-[linear-gradient(90deg,#fbbf24,#22d3ee,#c084fc,#fb7185,#34d399)] shadow-[0_0_14px_rgb(34_211_238/0.7)]"
      />
      {!daHuy && (
        <motion.div initial={{ left: '24px' }} animate={{ left: `calc(24px + (100% - 48px) * ${tiLe / 100})` }} transition={{ duration: 1.6, ease: 'easeInOut' }} className="absolute top-1 w-16 -translate-x-1/2">
          <CaSvg bangMau={BANG_MAU_TRANG_TRI} duoi="DELTA" className="w-full -scale-x-100 drop-shadow-[0_0_12px_rgb(192_132_252/0.8)]" />
        </motion.div>
      )}
      <ol className="relative flex justify-between">
        {LUONG_TRANG_THAI.map((trangThai, i) => {
          const daQua = i <= buoc && (!daHuy || thoiDiem(trangThai) !== undefined)
          const thongTin = THONG_TIN_TRANG_THAI[trangThai]
          const luc = thoiDiem(trangThai)
          return (
            <li key={trangThai} className="flex w-20 flex-col items-center text-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="grid h-9 w-9 place-items-center rounded-full border-2"
                style={{ borderColor: daQua ? thongTin.mau : 'rgb(255 255 255 / 0.1)', background: daQua ? `${thongTin.mau}22` : '#071226', boxShadow: daQua ? `0 0 16px ${thongTin.mau}` : undefined }}
              >
                {daQua ? <Check className="h-4 w-4" style={{ color: thongTin.mau }} /> : <span className="h-1.5 w-1.5 rounded-full bg-white/20" />}
              </motion.span>
              <p className={`mt-2 text-xs font-medium ${daQua ? 'text-white' : 'text-slate-500'}`}>{thongTin.nhan}</p>
              <p className="text-[10px] text-slate-500">{luc ? formatNgayGio(luc) : '—'}</p>
            </li>
          )
        })}
      </ol>
      {daHuy && (
        <p className="mt-5 flex items-center gap-2 rounded-2xl border border-coral/30 bg-coral/10 p-3 text-sm text-coral">
          <X className="h-4 w-4 shrink-0" /> Đơn hàng đã bị hủy lúc {formatNgayGio(lanCuoi('DA_HUY')?.thoiDiem ?? don.taoLuc)}
        </p>
      )}
      {don.trangThai === 'BAO_HANH' && (
        <p className="mt-5 flex items-center gap-2 rounded-2xl border border-sun/30 bg-sun/10 p-3 text-sm text-sun">
          <ShieldCheck className="h-4 w-4 shrink-0" /> Đơn đang được xử lý bảo hành từ {formatNgayGio(lanCuoi('BAO_HANH')?.thoiDiem ?? don.taoLuc)}
        </p>
      )}
    </div>
  )
}
