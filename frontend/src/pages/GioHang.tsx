import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Trash2, UserX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDoiSoLuong, useGioHang, useXoaDong } from '@/entities/gio-hang/api'
import type { DongGio } from '@/entities/gio-hang/model'
import { tenLuaChon } from '@/entities/san-pham/model'
import { AnhSanPham } from '@/entities/san-pham/ui/AnhSanPham'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { formatTien } from '@/shared/lib/formatTien'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { ChonSoLuong } from '@/shared/ui/ChonSoLuong'
import { DauTrang } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai, LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'
import { TomTatDon } from '@/widgets/TomTatDon'

function DongTrongGio({ dong }: { dong: DongGio }) {
  const doiSoLuong = useDoiSoLuong()
  const xoa = useXoaDong()
  const sp = dong.sanPham
  const duongDan = DUONG_DAN.chiTietCa(sp.slug)
  return (
    <motion.article layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} className="glass flex flex-wrap items-center gap-5 rounded-3xl p-4">
      <Link to={duongDan} aria-label={sp.ten} className="grid h-24 w-32 shrink-0 place-items-center rounded-2xl" style={{ background: `radial-gradient(circle at 30% 30%, ${sp.dongCa?.mauDuoi1 ?? '#22d3ee'}40, #071226 75%)` }}>
        <AnhSanPham sanPham={sp} className={sp.dongCa ? 'w-24' : 'h-12 w-12'} />
      </Link>
      <div className="min-w-40 flex-1">
        <Link to={duongDan} className="font-display font-semibold hover:text-aqua">
          {sp.ten}
        </Link>
        <p className="mt-1 text-sm text-slate-400">
          {tenLuaChon(dong.donVi, dong.gioiTinh)}
          {dong.donGia !== null && ` · ${formatTien(dong.donGia)}`}
        </p>
        {!dong.conBan && (
          <Badge mau="coral" className="mt-2">
            Đã ngừng bán, vui lòng xóa khỏi giỏ
          </Badge>
        )}
        {dong.conBan && dong.vuotTon && (
          <Badge mau="sun" className="mt-2">
            {dong.conLai > 0 ? `Chỉ còn ${dong.conLai}, vui lòng giảm số lượng` : 'Đã hết hàng, vui lòng xóa khỏi giỏ'}
          </Badge>
        )}
        <div className="mt-2 empty:hidden">
          <LoiThaoTac loi={doiSoLuong.error} />
        </div>
      </div>
      <ChonSoLuong giaTri={dong.soLuong} khiDoi={(soLuong) => doiSoLuong.mutate({ id: dong.id, soLuong })} toiDa={Math.max(dong.conLai, dong.soLuong)} khoa={doiSoLuong.isPending} />
      <p className="w-28 text-right font-display text-lg font-semibold">{formatTien(dong.thanhTien)}</p>
      <button type="button" aria-label={`Xóa ${sp.ten} khỏi giỏ`} disabled={xoa.isPending} onClick={() => xoa.mutate(dong.id)} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-slate-500 hover:bg-coral/10 hover:text-coral">
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.article>
  )
}

export function GioHang() {
  const gio = useGioHang()
  const coTheDat = Boolean(gio.data?.chiTiet.length) && !gio.data?.chiTiet.some((d) => !d.conBan || d.vuotTon)
  return (
    <>
      <DauTrang
        nhanPhu="Giỏ hàng"
        tieuDe={
          <>
            Túi cá <span className="text-iridescent">của bạn</span>
          </>
        }
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {gio.isPending && <DangTai />}
          {gio.isError && <BaoLoi loi={gio.error} thuLai={() => gio.refetch()} />}
          <AnimatePresence>{gio.data?.chiTiet.map((dong) => <DongTrongGio key={dong.id} dong={dong} />)}</AnimatePresence>
          {gio.data?.chiTiet.length === 0 && (
            <div className="glass grid place-items-center rounded-3xl py-20 text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-slate-600" />
              <p className="text-slate-400">Giỏ hàng đang trống, bể cá đang chờ bạn!</p>
              <Link to={DUONG_DAN.danhSachCa} className="mt-5">
                <Button>Chọn cá ngay</Button>
              </Link>
            </div>
          )}
          <p className="flex items-center gap-2 pt-2 text-sm text-slate-400">
            <UserX className="h-4 w-4 text-aqua" /> Không cần đăng nhập – khách vãng lai vẫn đặt hàng được.
          </p>
        </div>
        <TomTatDon
          tamTinh={gio.data?.tamTinh ?? 0}
          phiGiao={gio.data?.phiGiao ?? 0}
          hanhDong={
            coTheDat ? (
              <Link to={DUONG_DAN.thanhToan}>
                <Button coNut="lon" className="mt-6 w-full">
                  Tiến hành thanh toán <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button coNut="lon" className="mt-6 w-full" disabled>
                Tiến hành thanh toán <ArrowRight className="h-4 w-4" />
              </Button>
            )
          }
        />
      </div>
    </>
  )
}
