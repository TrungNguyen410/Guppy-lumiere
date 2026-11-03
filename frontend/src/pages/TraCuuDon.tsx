import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Ban, CreditCard, Landmark, MapPin, Phone, SearchX, Video } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { khachHuyDon, traCuuDon } from '@/entities/don-hang/api'
import { THONG_TIN_THANH_TOAN, type DonHang } from '@/entities/don-hang/model'
import { NhanTrangThai } from '@/entities/don-hang/ui/NhanTrangThai'
import { usePhienStore } from '@/entities/nguoi-dung/phien'
import { tenLuaChon } from '@/entities/san-pham/model'
import { FormBaoHanh } from '@/features/bao-hanh/FormBaoHanh'
import { FormTraCuu } from '@/features/tra-cuu-don/FormTraCuu'
import { LoiApi } from '@/shared/api/axiosClient'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { formatNgayGio } from '@/shared/lib/formatNgay'
import { formatTien } from '@/shared/lib/formatTien'
import { Button } from '@/shared/ui/Button'
import { DauTrang } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai, LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'
import { ThanhTrangThaiDon } from '@/widgets/ThanhTrangThaiDon'

/** Đơn mẫu để xem ngay khi mở trang, giống ảnh thiết kế; có tham số trên URL thì dùng tham số đó. */
const MA_MAU = 'GP24110931'
const SDT_MAU = '0901234567'

function KetQuaDon({ don, sdt, lamMoi }: { don: DonHang; sdt: string; lamMoi: () => void }) {
  const phien = usePhienStore((s) => s.phien)
  const [dangBaoHanh, setDangBaoHanh] = useState(false)
  const huy = useMutation({ mutationFn: () => khachHuyDon(don.maDon, sdt), onSuccess: lamMoi })
  const thanhToan = don.thanhToan
  const choChuyenKhoan = thanhToan?.phuongThuc === 'CHUYEN_KHOAN' && thanhToan.trangThai === 'CHUA_THANH_TOAN' && don.trangThai !== 'DA_HUY'
  return (
    <motion.article key={don.maDon} initial={{ opacity: 0, y: 30, rotateX: -10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} className="glass rounded-[32px] p-6 md:p-8" style={{ transformPerspective: 1200 }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest text-slate-500 uppercase">Mã đơn</p>
          <p className="font-display text-3xl font-semibold tracking-wider">{don.maDon}</p>
          <p className="mt-1 text-xs text-slate-500">
            Đặt lúc {formatNgayGio(don.taoLuc)} · {don.khachVangLai ? 'Khách vãng lai' : 'Thành viên'}
          </p>
        </div>
        <NhanTrangThai trangThai={don.trangThai} />
      </div>
      <ThanhTrangThaiDon don={don} />
      <div className="mt-10 grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-2">
          {don.chiTiet.map((dong) => (
            <div key={`${dong.sanPhamId}-${dong.donVi}-${dong.gioiTinh}`} className="flex justify-between gap-3 rounded-2xl bg-white/[.03] px-4 py-3 text-sm">
              <span>
                {dong.tenSanPham}{' '}
                <span className="text-slate-500">
                  · {tenLuaChon(dong.donVi, dong.gioiTinh)} × {dong.soLuong}
                </span>
              </span>
              <span className="shrink-0 font-medium">{formatTien(dong.thanhTien)}</span>
            </div>
          ))}
          <div className="flex justify-between px-4 pt-2 text-sm text-slate-400">
            <span>Phí giao hỏa tốc</span>
            <span>{don.phiGiao ? formatTien(don.phiGiao) : 'Miễn phí'}</span>
          </div>
          {don.giamGia > 0 && (
            <div className="flex justify-between px-4 text-sm text-kelp">
              <span>Giảm giá</span>
              <span>−{formatTien(don.giamGia)}</span>
            </div>
          )}
          <div className="flex justify-between px-4 text-lg">
            <span>Tổng</span>
            <span className="text-iridescent font-display font-semibold">{formatTien(don.tongTien)}</span>
          </div>
        </div>
        <div className="space-y-3 rounded-3xl bg-white/[.03] p-5 text-sm text-slate-300">
          <p className="font-semibold text-white">{don.hoTenNhan}</p>
          <p className="flex gap-2">
            <Phone className="h-4 w-4 shrink-0 text-aqua" /> {don.sdtNhan}
          </p>
          <p className="flex gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-aqua" /> {don.diaChiNhan}, {don.thanhPhoNhan}
          </p>
          <p className="flex gap-2">
            <CreditCard className="h-4 w-4 shrink-0 text-aqua" />
            {thanhToan?.phuongThuc === 'COD' ? 'Thanh toán khi nhận' : 'Chuyển khoản'}
            {thanhToan && ` · ${THONG_TIN_THANH_TOAN[thanhToan.trangThai]}`}
          </p>
          {choChuyenKhoan && (
            <p className="flex gap-2 rounded-2xl bg-aqua/5 p-3 text-xs">
              <Landmark className="h-4 w-4 shrink-0 text-aqua" />
              <span>
                {thanhToan.nganHang} {thanhToan.soTaiKhoan}, {thanhToan.chuTaiKhoan}. Nội dung: <b className="text-sun">{thanhToan.noiDungChuyenKhoan}</b>
              </span>
            </p>
          )}
          {don.khachDuocHuy && (
            <Button kieu="nguyHiem" coNut="nho" className="w-full" disabled={huy.isPending} onClick={() => huy.mutate()}>
              <Ban className="h-3.5 w-3.5" /> Hủy đơn
            </Button>
          )}
          <LoiThaoTac loi={huy.error} />
          {don.conHanBaoHanh && phien?.vaiTro === 'KHACH_HANG' && (
            <Button kieu="vien" coNut="nho" className="w-full" onClick={() => setDangBaoHanh(true)}>
              <Video className="h-3.5 w-3.5" /> Báo cá chết (24h)
            </Button>
          )}
          {don.conHanBaoHanh && phien?.vaiTro !== 'KHACH_HANG' && (
            <p className="text-xs text-slate-400">
              <Link to={DUONG_DAN.dangNhap} className="text-aqua underline">
                Đăng nhập
              </Link>{' '}
              để gửi yêu cầu bảo hành cá chết trong 24h.
            </p>
          )}
          {don.khachVangLai && don.trangThai === 'HOAN_TAT' && <p className="text-xs text-slate-500">Bảo hành qua hệ thống dành cho thành viên. Khách vãng lai vui lòng gọi 0909 000 777 trong 24h.</p>}
        </div>
      </div>
      <FormBaoHanh maDon={dangBaoHanh ? don.maDon : null} khiDong={() => setDangBaoHanh(false)} khiXong={lamMoi} />
    </motion.article>
  )
}

export function TraCuuDon() {
  const [thamSo, setThamSo] = useSearchParams()
  const maDon = thamSo.get('maDon') ?? MA_MAU
  const sdt = thamSo.get('sdt') ?? SDT_MAU
  const don = useQuery({ queryKey: ['tra-cuu', maDon, sdt], queryFn: () => traCuuDon(maDon, sdt), retry: false })
  const khongThay = don.error instanceof LoiApi && don.error.maTrangThai === 404
  return (
    <>
      <DauTrang
        nhanPhu="Tra cứu đơn"
        tieuDe={
          <>
            Đơn cá của bạn <span className="text-iridescent">đang ở đâu?</span>
          </>
        }
        moTa="Nhập mã đơn và số điện thoại đã dùng khi đặt hàng. Không cần đăng nhập."
      >
        <FormTraCuu key={`${maDon}-${sdt}`} maBanDau={maDon} sdtBanDau={sdt} dangTim={don.isFetching} khiTim={(ma, so) => setThamSo({ maDon: ma, sdt: so })} />
        <p className="mt-3 text-xs text-slate-500">Thử dữ liệu mẫu: GP24110927 / 0912345678 · GP24110899 / 0944777999</p>
      </DauTrang>
      <div className="mx-auto max-w-5xl px-6">
        {don.isPending && <DangTai />}
        {don.data && <KetQuaDon don={don.data} sdt={sdt} lamMoi={() => don.refetch()} />}
        {khongThay && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass grid place-items-center rounded-[32px] py-16 text-center">
            <SearchX className="mb-3 h-12 w-12 text-coral" />
            <p className="font-display text-lg font-semibold">Không tìm thấy đơn hàng</p>
            <p className="mt-1 text-sm text-slate-400">Kiểm tra lại mã đơn và số điện thoại nhé.</p>
          </motion.div>
        )}
        {don.isError && !khongThay && <BaoLoi loi={don.error} thuLai={() => don.refetch()} />}
      </div>
    </>
  )
}
