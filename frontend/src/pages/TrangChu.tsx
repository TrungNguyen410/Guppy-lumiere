import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ClipboardCheck, Droplets, MousePointer2, PackageCheck, ShieldCheck, Sparkles, Thermometer, Truck } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDanhSachSanPham, useDongCa } from '@/entities/san-pham/api'
import { BANG_MAU_BE_CA, bangMauCua, type BangMau, type KieuDuoi } from '@/entities/san-pham/model'
import { CardCa } from '@/entities/san-pham/ui/CardCa'
import { CaSvg } from '@/entities/san-pham/ui/CaSvg'
import { NutThemNhanh } from '@/features/them-vao-gio/NutThemNhanh'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { Button } from '@/shared/ui/Button'
import { TieuDeKhuVuc } from '@/shared/ui/TieuDe'
import { TiltCard } from '@/shared/ui/TiltCard'
import { BeCa3D } from '@/widgets/BeCa3D'

const TU_TIEU_DE = ['Đại', 'dương', 'thu', 'nhỏ']

function Hero({ soDong }: { soDong: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const dichY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const doMo = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const phongTo = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  return (
    <section ref={ref} className="relative h-[100svh] min-h-[800px] overflow-hidden md:min-h-[680px]">
      <motion.div style={{ scale: phongTo }} className="absolute inset-0">
        <BeCa3D />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-abyss/25 md:bg-transparent md:bg-[linear-gradient(90deg,rgb(3_8_20/0.85)_0%,rgb(3_8_20/0.35)_45%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-abyss to-transparent" />
      <motion.div style={{ y: dichY, opacity: doMo }} className="pointer-events-none relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pt-24">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs text-slate-200">
          <Sparkles className="h-3.5 w-3.5 text-sun" /> Bộ sưu tập Đông 2026 · {soDong} dòng thuần chủng
        </motion.span>
        <h1 className="font-display text-5xl leading-[1.02] font-semibold tracking-tight md:text-7xl lg:text-[88px]">
          {TU_TIEU_DE.map((tu, i) => (
            <motion.span key={tu} initial={{ opacity: 0, y: 60, rotateX: -80 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.4 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="mr-4 inline-block" style={{ transformOrigin: 'bottom' }}>
              {tu}
            </motion.span>
          ))}
          <br />
          <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.9 }} className="text-iridescent inline-block">
            trong bể nhà bạn.
          </motion.span>
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-6 max-w-lg text-base text-slate-300 md:text-lg">
          Cá bảy màu tuyển chọn từ trại giống, bán theo con lẻ, cặp, bộ ba hoặc lô cá bột. Đặt hàng không cần tài khoản, giao hỏa tốc trong 2 giờ.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35 }} className="pointer-events-auto mt-9 flex flex-wrap gap-3">
          <Link to={DUONG_DAN.danhSachCa}>
            <Button coNut="lon">
              Khám phá đàn cá <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={DUONG_DAN.traCuuDon}>
            <Button coNut="lon" kieu="kinh">
              Tra cứu đơn hàng
            </Button>
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="mt-14 flex gap-10">
          {[
            [String(soDong), 'dòng cá'],
            ['2h', 'giao hỏa tốc'],
            ['24h', 'bảo hành cá chết'],
          ].map(([so, nhan]) => (
            <div key={nhan}>
              <p className="font-display text-3xl font-semibold">{so}</p>
              <p className="text-xs tracking-wider text-slate-400 uppercase">{nhan}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="glass absolute right-8 bottom-8 hidden items-center gap-3 rounded-2xl px-4 py-3 text-xs text-slate-300 md:flex">
        <MousePointer2 className="h-4 w-4 animate-bounce text-aqua" /> Di chuột để dẫn đường cho chú cá dẫn đầu
      </motion.div>
    </section>
  )
}

function DaiDongCa() {
  const dongCa = useDongCa()
  if (!dongCa.data) return null
  const lapLai = [...dongCa.data, ...dongCa.data, ...dongCa.data]
  return (
    <div className="relative -mt-6 overflow-hidden border-y border-white/5 bg-white/[.02] py-5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <motion.div animate={{ x: ['0%', '-33.333%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="flex w-max gap-12">
        {lapLai.map((d, i) => (
          <span key={`${d.ma}-${i}`} className="flex items-center gap-3 font-display text-2xl font-medium text-slate-500">
            <CaSvg bangMau={bangMauCua(d)} duoi="DELTA" hoaTiet={d.hoaTiet} className="h-8 w-14" chuyenDong={false} />
            {d.ten}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const DUOI_THEO_THU_TU: KieuDuoi[] = ['DELTA', 'TRON', 'VOAN', 'DAN']

function KhuDongCa() {
  const dongCa = useDongCa()
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <TieuDeKhuVuc
        nhanPhu="Dòng cá"
        tieuDe={
          <>
            Mỗi dòng là một <span className="text-iridescent">bảng màu sống</span>
          </>
        }
        moTa="Chọn theo dòng để xem các kiểu đuôi, giới tính và lô cá hiện có trong trại."
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {dongCa.data?.map((d, i) => (
          <motion.div key={d.ma} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }}>
            <Link to={`${DUONG_DAN.danhSachCa}?dong=${d.ma}`}>
              <TiltCard doNghieng={16}>
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 p-5" style={{ background: `linear-gradient(160deg, ${d.mauDuoi1}33, #071226 65%)` }}>
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-35 blur-2xl" style={{ background: d.mauDuoi1 }} />
                  <CaSvg bangMau={bangMauCua(d)} duoi={DUOI_THEO_THU_TU[i % DUOI_THEO_THU_TU.length]} hoaTiet={d.hoaTiet} className="relative h-24 w-full" />
                  <p className="relative mt-3 font-display font-semibold">{d.ten}</p>
                  <p className="relative text-xs text-slate-400">Xuất xứ {d.xuatXu}</p>
                </div>
              </TiltCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function KhuNoiBat() {
  const sanPham = useDanhSachSanPham({ loai: 'CA_GUPPY', kichThuoc: 4 })
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <TieuDeKhuVuc nhanPhu="Nổi bật tuần này" tieuDe="Được săn đón nhất" />
        <Link to={DUONG_DAN.danhSachCa} className="mb-10 flex items-center gap-2 text-sm text-aqua transition-all hover:gap-3">
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sanPham.data?.noiDung.map((sp) => (
          <CardCa key={sp.id} sanPham={sp} hanhDong={<NutThemNhanh sanPham={sp} />} />
        ))}
      </div>
    </section>
  )
}

const VANG = BANG_MAU_BE_CA[0]
const VANG_NHAT: BangMau = { ...VANG, duoi1: '#fde68a', duoi2: '#d6d3d1' }
const XANH = BANG_MAU_BE_CA[3]

const CAC_DON_VI = [
  { ten: 'Con lẻ', moTa: 'Đã phân đực / cái, chọn đúng con bạn thích.', soCa: 1, mau: [VANG], link: 'CON_LE' },
  { ten: 'Cặp', moTa: '1 đực + 1 cái cùng dòng, sẵn sàng sinh sản.', soCa: 2, mau: [VANG, VANG_NHAT], link: 'CAP' },
  { ten: 'Bộ ba', moTa: '1 đực + 2 cái – tỉ lệ vàng cho người nhân giống.', soCa: 3, mau: [VANG, VANG_NHAT, VANG_NHAT], link: 'BO_BA' },
  { ten: 'Lô cá bột', moTa: '10–20 cá con chưa phân giới tính, tự tuyển chọn.', soCa: 9, mau: [VANG, XANH], link: 'LO_CA_BOT' },
]

function DanCa({ soCa, cacMau }: { soCa: number; cacMau: BangMau[] }) {
  return (
    <div className="relative h-28">
      {Array.from({ length: soCa }, (_, i) => (
        <div key={i} className="troi-nhe absolute" style={{ left: `${10 + ((i * 27) % 70)}%`, top: `${10 + ((i * 41) % 55)}%`, animationDelay: `${i * 0.4}s`, width: soCa > 4 ? 46 : 84 }}>
          <CaSvg bangMau={cacMau[i % cacMau.length]} duoi="DELTA" className="w-full" />
        </div>
      ))}
    </div>
  )
}

function KhuDonVi() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28">
      <TieuDeKhuVuc
        nhanPhu="Đơn vị bán"
        tieuDe={
          <>
            Mua theo cách <span className="text-iridescent">bạn muốn</span>
          </>
        }
      />
      <div className="grid gap-5 md:grid-cols-4">
        {CAC_DON_VI.map((dv, i) => (
          <motion.div key={dv.ten} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <Link to={`${DUONG_DAN.danhSachCa}?donVi=${dv.link}`} className="group relative block h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[.03] p-6 transition hover:border-aqua/40 hover:bg-white/[.06]">
              <span className="absolute top-5 right-5 font-display text-5xl font-bold text-white/5">0{i + 1}</span>
              <DanCa soCa={dv.soCa} cacMau={dv.mau} />
              <p className="mt-4 font-display text-xl font-semibold">{dv.ten}</p>
              <p className="mt-1 text-sm text-slate-400">{dv.moTa}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

interface DoProps {
  nhan: string
  icon: typeof Thermometer
  min: number
  max: number
  thap: number
  cao: number
  donVi: string
  mau: string
}

function DongHoNuoc({ nhan, icon: Icon, min, max, thap, cao, donVi, mau }: DoProps) {
  const phanTram = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm text-slate-300">
          <Icon className="h-4 w-4" style={{ color: mau }} />
          {nhan}
        </p>
        <p className="font-display text-2xl font-semibold">
          {thap}–{cao}
          <span className="text-sm text-slate-400"> {donVi}</span>
        </p>
      </div>
      <div className="relative mt-6 h-3 rounded-full bg-white/5">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${phanTram(cao) - phanTram(thap)}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }} className="absolute h-full rounded-full" style={{ left: `${phanTram(thap)}%`, background: `linear-gradient(90deg, ${mau}aa, ${mau})`, boxShadow: `0 0 20px ${mau}` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500">
        <span>
          {min}
          {donVi}
        </span>
        <span>Vùng lý tưởng</span>
        <span>
          {max}
          {donVi}
        </span>
      </div>
    </div>
  )
}

function KhuChamSoc() {
  return (
    <section id="cham-soc" className="mx-auto max-w-7xl scroll-mt-28 px-6 pt-28">
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,rgb(34_211_238/0.1),rgb(192_132_252/0.08))] p-8 md:p-14">
        <div className="absolute top-0 -right-20 h-80 w-80 rounded-full bg-aqua/20 blur-3xl" />
        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <TieuDeKhuVuc
            nhanPhu="Chăm sóc"
            tieuDe={
              <>
                Nước chuẩn,
                <br /> cá rực màu.
              </>
            }
            moTa="Mỗi trang cá đều ghi thông số nước khuyến nghị. Khi nhận cá, ngâm túi 15 phút để cân bằng nhiệt rồi mới thả. Giữ nhiệt độ và pH trong vùng lý tưởng để cá lên màu đẹp."
          />
          <div className="space-y-4">
            <DongHoNuoc nhan="Nhiệt độ" icon={Thermometer} min={15} max={35} thap={22} cao={28} donVi="°C" mau="#fb7185" />
            <DongHoNuoc nhan="Độ pH" icon={Droplets} min={5} max={9} thap={6.8} cao={7.8} donVi="" mau="#22d3ee" />
          </div>
        </div>
      </div>
    </section>
  )
}

const CAC_BUOC = [
  { icon: ClipboardCheck, ten: 'Đặt hàng', moTa: 'Chỉ cần họ tên, SĐT, địa chỉ. Không cần tài khoản.' },
  { icon: PackageCheck, ten: 'Đóng túi oxy', moTa: 'Cá được cách ly, bơm oxy, túi 2 lớp chống sốc.' },
  { icon: Truck, ten: 'Giao hỏa tốc', moTa: 'Trong ngày tại TP.HCM, Hà Nội, Đà Nẵng.' },
  { icon: ShieldCheck, ten: 'Bảo hành 24h', moTa: 'Thành viên gặp cá chết khi nhận? Gửi yêu cầu kèm video mở hàng.' },
]

function KhuHanhTrinh() {
  return (
    <section id="hanh-trinh" className="mx-auto max-w-7xl scroll-mt-28 px-6 pt-28">
      <TieuDeKhuVuc nhanPhu="Hành trình" tieuDe="Từ trại cá đến bể nhà bạn" />
      <div className="relative grid gap-6 md:grid-cols-4">
        <div className="absolute top-8 right-0 left-0 hidden h-px bg-gradient-to-r from-aqua via-orchid to-coral md:block" />
        {CAC_BUOC.map((b, i) => (
          <motion.div key={b.ten} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-deep shadow-[0_0_30px_rgb(34_211_238/0.25)]">
              <b.icon className="h-7 w-7 text-aqua" />
            </div>
            <p className="mt-5 font-display font-semibold">{b.ten}</p>
            <p className="mt-1 text-sm text-slate-400">{b.moTa}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function TrangChu() {
  const dongCa = useDongCa()
  return (
    <>
      <Hero soDong={dongCa.data?.length ?? 7} />
      <DaiDongCa />
      <KhuDongCa />
      <KhuNoiBat />
      <KhuDonVi />
      <KhuChamSoc />
      <KhuHanhTrinh />
    </>
  )
}
