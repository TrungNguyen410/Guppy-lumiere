import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Landmark, MapPin, Phone, ShieldCheck, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { HUY_DUOC_O, LUONG_TRANG_THAI, THONG_TIN_THANH_TOAN, THONG_TIN_TRANG_THAI, type DonHang, type TrangThaiDon, type YeuCauBaoHanh } from '@/entities/don-hang/model'
import { tenNganLuaChon } from '@/entities/san-pham/model'
import { useDuyetDon } from '@/features/duyet-don/useDuyetDon'
import { formatNgayGio } from '@/shared/lib/formatNgay'
import { formatTien } from '@/shared/lib/formatTien'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Textarea, Truong } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { BaoLoi, DangTai, LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'

const CAC_COT: TrangThaiDon[] = [...LUONG_TRANG_THAI, 'BAO_HANH', 'DA_HUY']

function buocTiep(trangThai: TrangThaiDon): TrangThaiDon | undefined {
  const i = LUONG_TRANG_THAI.indexOf(trangThai)
  return i >= 0 ? LUONG_TRANG_THAI[i + 1] : undefined
}

function ModalXuLyBaoHanh({ yeuCau, khiDong, khiLuu, dangLuu, loi }: { yeuCau: YeuCauBaoHanh | null; khiDong: () => void; khiLuu: (ketQua: string) => void; dangLuu: boolean; loi: unknown }) {
  const [ketQua, setKetQua] = useState('')
  return (
    <Modal mo={yeuCau !== null} khiDoi={(mo) => !mo && khiDong()} tieuDe={`Bảo hành · ${yeuCau?.maDon ?? ''}`}>
      <div className="space-y-4">
        <p className="rounded-2xl bg-white/[.04] p-3 text-sm text-slate-300">{yeuCau?.moTa}</p>
        {/^https?:\/\//.test(yeuCau?.duongDanVideo ?? '') && (
          <a href={yeuCau?.duongDanVideo ?? undefined} target="_blank" rel="noopener noreferrer" className="block text-sm text-aqua hover:underline">
            Xem video mở hàng
          </a>
        )}
        <Truong nhan="Kết quả xử lý *">
          <Textarea maxLength={500} value={ketQua} onChange={(su) => setKetQua(su.target.value)} placeholder="Đã đổi 2 cá mới" />
        </Truong>
        <LoiThaoTac loi={loi} />
        <Button
          className="w-full"
          disabled={!ketQua.trim() || dangLuu}
          onClick={() => {
            khiLuu(ketQua.trim())
            setKetQua('')
          }}
        >
          Hoàn tất bảo hành
        </Button>
      </div>
    </Modal>
  )
}

/** Bảng kanban: mỗi cột một trạng thái; các nút theo đúng quy tắc chuyển trạng thái của backend. */
export function BangDonHang({ tuKhoa }: { tuKhoa: string }) {
  const { danhSach, baoHanh, chuyen, nhanTien, xuLy } = useDuyetDon(tuKhoa)
  const [dangXuLy, setDangXuLy] = useState<YeuCauBaoHanh | null>(null)

  if (danhSach.isPending) return <DangTai />
  if (danhSach.isError) return <BaoLoi loi={danhSach.error} thuLai={() => danhSach.refetch()} />

  const dangThaoTac = chuyen.isPending || nhanTien.isPending
  const yeuCauCuaDon = (don: DonHang) => baoHanh.data?.noiDung.find((y) => y.maDon === don.maDon)

  return (
    <>
      <div className="mb-3 empty:hidden">
        <LoiThaoTac loi={chuyen.error ?? nhanTien.error} />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {CAC_COT.map((cot) => {
          const thongTin = THONG_TIN_TRANG_THAI[cot]
          const donTrongCot = danhSach.data.noiDung.filter((d) => d.trangThai === cot)
          return (
            <section key={cot} aria-label={thongTin.nhan} className="w-72 shrink-0 rounded-3xl border border-white/5 bg-white/[.02] p-3">
              <div className="mb-3 flex items-center justify-between px-2 pt-1">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full" style={{ background: thongTin.mau, boxShadow: `0 0 10px ${thongTin.mau}` }} />
                  {thongTin.nhan}
                </p>
                <span className="rounded-full bg-white/5 px-2 text-xs text-slate-400">{donTrongCot.length}</span>
              </div>
              <div className="min-h-32 space-y-3">
                <AnimatePresence>
                  {donTrongCot.map((don) => {
                    const tiep = buocTiep(don.trangThai)
                    const huyDuoc = HUY_DUOC_O.includes(don.trangThai)
                    const canNhanTien = don.thanhToan?.phuongThuc === 'CHUYEN_KHOAN' && don.thanhToan.trangThai === 'CHUA_THANH_TOAN' && don.trangThai !== 'DA_HUY'
                    const yeuCau = don.trangThai === 'BAO_HANH' ? yeuCauCuaDon(don) : undefined
                    return (
                      <motion.article
                        key={don.maDon}
                        layout
                        layoutId={don.maDon}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="rounded-2xl border border-white/10 bg-deep/80 p-4 shadow-lg"
                        style={{ borderTop: `2px solid ${thongTin.mau}` }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-slate-300">{don.maDon}</span>
                          {don.khachVangLai ? <Badge mau="xam">Vãng lai</Badge> : <Badge mau="orchid">Thành viên</Badge>}
                        </div>
                        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium">
                          <UserRound className="h-3.5 w-3.5 text-slate-500" />
                          {don.hoTenNhan}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                          <Phone className="h-3 w-3" />
                          {don.sdtNhan}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {don.thanhPhoNhan}
                        </p>
                        <div className="mt-3 space-y-1 border-t border-white/5 pt-3 text-xs text-slate-300">
                          {don.chiTiet.map((dong) => (
                            <p key={`${dong.sanPhamId}-${dong.donVi}-${dong.gioiTinh}`} className="flex justify-between gap-2">
                              <span className="truncate">{dong.tenSanPham}</span>
                              <span className="shrink-0 text-slate-500">
                                {tenNganLuaChon(dong.donVi, dong.gioiTinh)}×{dong.soLuong}
                              </span>
                            </p>
                          ))}
                        </div>
                        <div className="mt-3">
                          <span className="block font-display font-semibold">{formatTien(don.tongTien)}</span>
                          <span className="text-[10px] text-slate-500">
                            {don.thanhToan?.phuongThuc === 'CHUYEN_KHOAN' ? 'Chuyển khoản' : 'COD'}
                            {don.thanhToan && ` · ${THONG_TIN_THANH_TOAN[don.thanhToan.trangThai]}`} · {formatNgayGio(don.taoLuc)}
                          </span>
                        </div>
                        {canNhanTien && (
                          <Button kieu="vien" coNut="nho" className="mt-3 w-full" disabled={dangThaoTac} onClick={() => nhanTien.mutate(don.id)}>
                            <Landmark className="h-3 w-3" /> Đã nhận tiền
                          </Button>
                        )}
                        {(tiep || huyDuoc) && (
                          <div className="mt-3 flex gap-2">
                            {tiep && (
                              <Button coNut="nho" className="flex-1" disabled={dangThaoTac} onClick={() => chuyen.mutate({ id: don.id, trangThai: tiep })}>
                                {THONG_TIN_TRANG_THAI[tiep].nhan} <ArrowRight className="h-3 w-3" />
                              </Button>
                            )}
                            {huyDuoc && (
                              <Button kieu="nguyHiem" coNut="nho" aria-label={`Hủy đơn ${don.maDon}`} title="Hủy đơn" disabled={dangThaoTac} onClick={() => chuyen.mutate({ id: don.id, trangThai: 'DA_HUY' })}>
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                        {yeuCau && (
                          <Button coNut="nho" className="mt-3 w-full" onClick={() => setDangXuLy(yeuCau)}>
                            <ShieldCheck className="h-3 w-3" /> Xử lý bảo hành
                          </Button>
                        )}
                      </motion.article>
                    )
                  })}
                </AnimatePresence>
              </div>
            </section>
          )
        })}
      </div>
      <ModalXuLyBaoHanh
        yeuCau={dangXuLy}
        khiDong={() => {
          setDangXuLy(null)
          xuLy.reset()
        }}
        dangLuu={xuLy.isPending}
        loi={xuLy.error}
        khiLuu={(ketQua) => {
          if (dangXuLy) xuLy.mutate({ id: dangXuLy.id, ketQua }, { onSuccess: () => setDangXuLy(null) })
        }}
      />
    </>
  )
}
