import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronRight, Droplets, Gem, Hash, Ruler, ShieldCheck, ShoppingBag, Star, Thermometer, Truck, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useThemVaoGio } from '@/entities/gio-hang/api'
import { useChiTietSanPham, useDanhGia, useDanhSachSanPham } from '@/entities/san-pham/api'
import { TEN_DUOI, TEN_NHAN, TEN_PHU_KIEN, tenLuaChon, type GiaBan, type SanPhamChiTiet } from '@/entities/san-pham/model'
import { AnhSanPham, nenSanPham } from '@/entities/san-pham/ui/AnhSanPham'
import { CardCa } from '@/entities/san-pham/ui/CardCa'
import { cn } from '@/shared/lib/cn'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { formatNgay } from '@/shared/lib/formatNgay'
import { formatTien } from '@/shared/lib/formatTien'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { ChonSoLuong } from '@/shared/ui/ChonSoLuong'
import { BaoLoi, DangTai, LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'
import { CaXoay3D } from '@/widgets/CaXoay3D'

interface ThanhDoProps {
  icon: typeof Thermometer
  nhan: string
  min: number
  max: number
  thap: number
  cao: number
  donVi: string
  mau: string
}

function ThanhDo({ icon: Icon, nhan, min, max, thap, cao, donVi, mau }: ThanhDoProps) {
  const phanTram = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-slate-300">
          <Icon className="h-4 w-4" style={{ color: mau }} />
          {nhan}
        </span>
        <span className="font-display font-semibold">
          {thap} – {cao}
          {donVi}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-white/5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${phanTram(cao) - phanTram(thap)}%` }} transition={{ duration: 1, delay: 0.4 }} className="absolute h-full rounded-full" style={{ left: `${phanTram(thap)}%`, background: mau, boxShadow: `0 0 14px ${mau}` }} />
      </div>
    </div>
  )
}

const khoaGia = (g: GiaBan) => `${g.donVi}-${g.gioiTinh}`

/** Khối mua hàng, dùng chung cho cá (chọn đơn vị) và phụ kiện (chỉ chọn số lượng). */
function KhoiMua({ chiTiet }: { chiTiet: SanPhamChiTiet }) {
  const sanPham = chiTiet.tomTat
  const dieuHuong = useNavigate()
  const them = useThemVaoGio()
  const bangGia = chiTiet.bangGia ?? []
  // Mặc định chọn đơn vị đầu tiên còn hàng
  const [khoaChon, setKhoaChon] = useState(() => {
    const dauTien = bangGia.find((g) => g.conLai > 0) ?? bangGia[0]
    return dauTien ? khoaGia(dauTien) : ''
  })
  const [soLuong, setSoLuong] = useState(1)
  const [daThem, setDaThem] = useState(false)
  const dangChon = bangGia.find((g) => khoaGia(g) === khoaChon)
  const laPhuKien = sanPham.loai === 'PHU_KIEN'
  const conLai = laPhuKien ? (chiTiet.tonKhoPhuKien ?? 0) : (dangChon?.conLai ?? 0)
  const donGia = laPhuKien ? sanPham.giaThapNhat : (dangChon?.gia ?? 0)
  const hetHang = conLai === 0

  const themVaoGio = (sau?: () => void) =>
    them.mutate(
      { sanPhamId: sanPham.id, donVi: dangChon?.donVi, gioiTinh: dangChon?.gioiTinh, soLuong },
      {
        onSuccess: () => {
          setDaThem(true)
          setTimeout(() => setDaThem(false), 2500)
          sau?.()
        },
      },
    )

  return (
    <>
      {!laPhuKien && (
        <>
          <p className="mt-8 mb-3 text-[11px] font-semibold tracking-[.2em] text-slate-500 uppercase">Chọn đơn vị bán</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {bangGia.map((g) => {
              const chon = khoaChon === khoaGia(g)
              return (
                <button
                  key={khoaGia(g)}
                  type="button"
                  aria-pressed={chon}
                  onClick={() => {
                    setKhoaChon(khoaGia(g))
                    setSoLuong(1)
                  }}
                  className={cn('relative cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition', chon ? 'border-transparent' : 'border-white/10 bg-white/[.02] hover:border-white/25')}
                >
                  {chon && <motion.span layoutId="vien-don-vi" className="border-iridescent absolute inset-0 rounded-2xl" transition={{ type: 'spring', bounce: 0.2 }} />}
                  <span className="relative block text-sm font-medium">{tenLuaChon(g.donVi, g.gioiTinh, chiTiet.soConMoiLo)}</span>
                  <span className="relative mt-1 flex items-center justify-between">
                    <span className="font-display text-lg font-semibold">{formatTien(g.gia)}</span>
                    <span className={cn('text-[11px]', g.conLai > 0 ? 'text-kelp' : 'text-slate-500')}>{g.conLai > 0 ? `Còn ${g.conLai}` : 'Hết hàng'}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ChonSoLuong giaTri={soLuong} khiDoi={setSoLuong} toiDa={Math.max(1, conLai)} khoa={hetHang} />
        <Button coNut="lon" className="flex-1" disabled={hetHang || them.isPending} onClick={() => themVaoGio()}>
          <ShoppingBag className="h-4 w-4" />
          {hetHang ? 'Hết hàng' : 'Thêm vào giỏ'}
        </Button>
        <Button coNut="lon" kieu="kinh" disabled={hetHang || them.isPending} onClick={() => themVaoGio(() => dieuHuong(DUONG_DAN.thanhToan))}>
          <Zap className="h-4 w-4 text-sun" /> Mua ngay
        </Button>
      </div>
      <p className="mt-3 text-sm text-slate-400">
        Tạm tính: <span className="text-iridescent font-display text-lg font-semibold">{formatTien(donGia * soLuong)}</span>
      </p>
      <div className="mt-3 empty:hidden">
        <LoiThaoTac loi={them.error} />
      </div>
      <AnimatePresence>
        {daThem && (
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-kelp" role="status">
            ✓ Đã thêm {soLuong} vào giỏ.{' '}
            <Link to={DUONG_DAN.gioHang} className="underline">
              Xem giỏ hàng
            </Link>
          </motion.p>
        )}
      </AnimatePresence>
    </>
  )
}

function KhoiDanhGia({ sanPhamId }: { sanPhamId: number }) {
  const danhGia = useDanhGia(sanPhamId)
  if (!danhGia.data?.noiDung.length) return null
  return (
    <section className="pt-16">
      <h2 className="mb-6 font-display text-2xl font-semibold">Khách đã mua nói gì</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {danhGia.data.noiDung.map((dg) => (
          <article key={dg.id} className="rounded-3xl border border-white/10 bg-white/[.03] p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{dg.tenKhach}</p>
              <span className="flex gap-0.5" role="img" aria-label={`${dg.soSao} trên 5 sao`}>
                {[1, 2, 3, 4, 5].map((sao) => (
                  <Star key={sao} className={cn('h-3.5 w-3.5 text-sun', sao <= dg.soSao ? 'fill-sun' : 'opacity-30')} />
                ))}
              </span>
            </div>
            {dg.noiDung && <p className="mt-2 text-sm text-slate-300">{dg.noiDung}</p>}
            <p className="mt-2 text-xs text-slate-500">{formatNgay(dg.taoLuc)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ChiTietCa() {
  const { slug = '' } = useParams()
  const chiTiet = useChiTietSanPham(slug)
  const lienQuan = useDanhSachSanPham({ loai: chiTiet.data?.tomTat.loai, kichThuoc: 5 })

  useEffect(() => {
    if (chiTiet.data) document.title = `${chiTiet.data.tomTat.ten} – Guppy Lumière`
    return () => {
      document.title = 'Guppy Lumière – Cá bảy màu thuần chủng'
    }
  }, [chiTiet.data])

  if (chiTiet.isPending) {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32">
        <DangTai />
      </div>
    )
  }
  if (chiTiet.isError) {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32">
        <BaoLoi loi={chiTiet.error} />
      </div>
    )
  }

  const { tomTat: sanPham, thongSoNuoc } = chiTiet.data
  const mauChu = sanPham.dongCa?.mauDuoi1 ?? '#22d3ee'
  const thongTinNgan = [
    { icon: Ruler, nhan: 'Kích thước', giaTri: chiTiet.data.kichThuoc },
    { icon: CalendarDays, nhan: 'Tuổi', giaTri: chiTiet.data.tuoiTuan != null ? `${chiTiet.data.tuoiTuan} tuần` : null },
    { icon: Hash, nhan: 'Mã lô', giaTri: chiTiet.data.maLo?.[0] ?? null },
  ].filter((m) => m.giaTri)

  return (
    <div className="relative mx-auto max-w-7xl px-6 pt-32">
      <div className="pointer-events-none absolute top-20 left-0 -z-10 h-[600px] w-full max-w-[600px] rounded-full blur-3xl" style={{ background: `radial-gradient(closest-side, ${mauChu}33, transparent)` }} />
      <nav aria-label="Vị trí trang" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
        <Link to={DUONG_DAN.trangChu} className="hover:text-white">
          Trang chủ
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={DUONG_DAN.danhSachCa} className="hover:text-white">
          Cá bảy màu
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-300">{sanPham.ten}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          {sanPham.dongCa && sanPham.kieuDuoi ? (
            <CaXoay3D dongCa={sanPham.dongCa} duoi={sanPham.kieuDuoi} />
          ) : (
            <div className="grid aspect-square place-items-center rounded-[36px] border border-white/10" style={{ background: nenSanPham(sanPham) }}>
              <AnhSanPham sanPham={sanPham} className="h-40 w-40" />
            </div>
          )}
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {sanPham.dongCa && <Badge mau="xam">{sanPham.dongCa.ten}</Badge>}
            {sanPham.kieuDuoi && <Badge mau="xam">{TEN_DUOI[sanPham.kieuDuoi]}</Badge>}
            {sanPham.loaiPhuKien && <Badge mau="xam">{TEN_PHU_KIEN[sanPham.loaiPhuKien]}</Badge>}
            {chiTiet.data.thuanChung && <Badge mau="xam">Thuần chủng</Badge>}
            {sanPham.nhan.map((n) => (
              <Badge key={n} mau={TEN_NHAN[n].mau}>
                {TEN_NHAN[n].ten}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight md:text-5xl">{sanPham.ten}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1 text-sun" role="img" aria-label={`${sanPham.diemDanhGia} trên 5 sao`}>
              {[1, 2, 3, 4, 5].map((sao) => (
                <Star key={sao} className={cn('h-4 w-4', sao <= Math.round(sanPham.diemDanhGia) ? 'fill-sun' : 'opacity-30')} />
              ))}
            </span>
            <span>
              {sanPham.diemDanhGia} · {sanPham.daBan} đã bán
            </span>
          </div>
          {chiTiet.data.moTa && <p className="mt-5 leading-relaxed text-slate-300">{chiTiet.data.moTa}</p>}

          <KhoiMua key={sanPham.id} chiTiet={chiTiet.data} />

          {thongTinNgan.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-3">
              {thongTinNgan.map(({ icon: Icon, nhan, giaTri }) => (
                <div key={nhan} className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                  <Icon className="h-4 w-4 text-aqua" />
                  <p className="mt-2 text-[11px] text-slate-500">{nhan}</p>
                  <p className="text-sm font-semibold">{giaTri}</p>
                </div>
              ))}
            </div>
          )}

          {thongSoNuoc && (
            <div className="mt-4 space-y-5 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgb(34_211_238/0.06),rgb(251_113_133/0.05))] p-6">
              <p className="flex items-center gap-2 font-display font-semibold">
                <Gem className="h-4 w-4 text-orchid" /> Thông số nước khuyến nghị
              </p>
              <ThanhDo icon={Thermometer} nhan="Nhiệt độ" min={15} max={35} thap={thongSoNuoc.nhietDoMin} cao={thongSoNuoc.nhietDoMax} donVi="°C" mau="#fb7185" />
              <ThanhDo icon={Droplets} nhan="Độ pH" min={5} max={9} thap={thongSoNuoc.phMin} cao={thongSoNuoc.phMax} donVi="" mau="#22d3ee" />
              <p className="text-xs text-slate-400">Độ cứng: {thongSoNuoc.doCung} · Thay 20–30% nước mỗi tuần · Thả cá sau khi ngâm túi 15 phút cân bằng nhiệt.</p>
            </div>
          )}
          <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <p className="flex items-center gap-2 rounded-2xl bg-white/[.03] p-3">
              <Truck className="h-4 w-4 shrink-0 text-aqua" /> Hỏa tốc HCM · HN · ĐN – 50.000đ
            </p>
            <p className="flex items-center gap-2 rounded-2xl bg-white/[.03] p-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-kelp" /> Bảo hành cá chết trong 24h
            </p>
          </div>
        </div>
      </div>

      <KhoiDanhGia sanPhamId={sanPham.id} />

      <section className="pt-24">
        <h2 className="mb-8 font-display text-2xl font-semibold">Có thể bạn cũng thích</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lienQuan.data?.noiDung
            .filter((sp) => sp.id !== sanPham.id)
            .slice(0, 4)
            .map((sp) => (
              <CardCa key={sp.id} sanPham={sp} />
            ))}
        </div>
      </section>
    </div>
  )
}
