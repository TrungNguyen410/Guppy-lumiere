import { motion } from 'framer-motion'
import { Check, Copy, PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { DonHang, KetQuaApMa } from '@/entities/don-hang/model'
import { useGioHang } from '@/entities/gio-hang/api'
import { BANG_MAU_BE_CA, tenNganLuaChon } from '@/entities/san-pham/model'
import { AnhSanPham } from '@/entities/san-pham/ui/AnhSanPham'
import { CaSvg } from '@/entities/san-pham/ui/CaSvg'
import { FormDatHang } from '@/features/dat-hang/FormDatHang'
import { MaQrMinhHoa } from '@/features/dat-hang/MaQrMinhHoa'
import { chepVanBan } from '@/shared/lib/chepVanBan'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { formatTien } from '@/shared/lib/formatTien'
import { Button } from '@/shared/ui/Button'
import { DauTrang } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai, Trong } from '@/shared/ui/TrangThaiDuLieu'
import { TomTatDon } from '@/widgets/TomTatDon'

function CacBuoc({ buoc }: { buoc: number }) {
  return (
    <ol className="mt-8 flex items-center gap-1.5 sm:gap-3">
      {['Giỏ hàng', 'Thông tin', 'Hoàn tất'].map((ten, i, tatCa) => (
        <li key={ten} className="flex items-center gap-1.5 sm:gap-3">
          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold sm:h-8 sm:w-8 ${i <= buoc ? 'bg-[linear-gradient(135deg,#67e8f9,#c084fc)] text-abyss' : 'bg-white/5 text-slate-500'}`}>{i + 1}</span>
          <span className={`text-xs whitespace-nowrap sm:text-sm ${i <= buoc ? 'text-white' : 'text-slate-500'}`}>{ten}</span>
          {i < tatCa.length - 1 && <span className={`h-px w-3 sm:w-10 md:w-20 ${i < buoc ? 'bg-aqua' : 'bg-white/10'}`} />}
        </li>
      ))}
    </ol>
  )
}

function ThanhCong({ don }: { don: DonHang }) {
  const [daChep, setDaChep] = useState(false)
  const chuyenKhoan = don.thanhToan?.phuongThuc === 'CHUYEN_KHOAN' ? don.thanhToan : null
  const chepMa = async () => {
    if (!(await chepVanBan(don.maDon))) return
    setDaChep(true)
    setTimeout(() => setDaChep(false), 1500)
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="dialog" aria-modal="true" aria-label="Đặt hàng thành công" className="fixed inset-0 z-[60] overflow-x-hidden overflow-y-auto bg-abyss/80 backdrop-blur-md">
      {/* min-h-full thay cho căn giữa trực tiếp: hộp cao hơn màn hình vẫn cuộn được tới mép trên */}
      <div className="relative flex min-h-full items-center justify-center p-6">
        {BANG_MAU_BE_CA.map((mau, i) => (
          <motion.div key={mau.than} className="pointer-events-none absolute top-1/2 left-1/2 w-20" initial={{ x: -700, y: (i - 3) * 70, opacity: 0 }} animate={{ x: 700, opacity: [0, 1, 1, 0] }} transition={{ duration: 4 + i * 0.3, delay: i * 0.15, repeat: Infinity }}>
            <CaSvg bangMau={mau} duoi="DELTA" className="w-full -scale-x-100" />
          </motion.div>
        ))}
        <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.4 }} className="glass-strong relative w-full max-w-md rounded-[32px] p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(135deg,#67e8f9,#c084fc,#fb7185)]">
          <PartyPopper className="h-8 w-8 text-abyss" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold">Đặt hàng thành công!</h2>
        <p className="mt-2 text-sm text-slate-400">Cảm ơn {don.hoTenNhan}. Nhân viên sẽ gọi xác nhận trong 15 phút.</p>
        <div className="mt-6 rounded-2xl border border-dashed border-aqua/40 bg-aqua/5 p-4">
          <p className="text-xs tracking-widest text-slate-400 uppercase">Mã đơn hàng</p>
          <p className="text-iridescent mt-1 font-display text-3xl font-semibold tracking-wider">{don.maDon}</p>
          <button type="button" onClick={chepMa} className="mt-1 inline-flex cursor-pointer items-center gap-1 text-xs text-aqua hover:underline">
            {daChep ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {daChep ? 'Đã chép' : 'Chép mã'}
          </button>
          <p className="mt-1 text-xs text-slate-500">Dùng mã đơn + SĐT để tra cứu</p>
        </div>
        {chuyenKhoan && (
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-aqua/30 bg-aqua/5 p-4 text-left text-sm">
            <MaQrMinhHoa />
            <div className="min-w-40 flex-1 space-y-1">
              <p className="text-slate-400">
                Ngân hàng: <b className="text-white">{chuyenKhoan.nganHang}</b>
              </p>
              <p className="text-slate-400">
                Số TK: <b className="text-white">{chuyenKhoan.soTaiKhoan}</b>
              </p>
              <p className="text-slate-400">
                Chủ TK: <b className="text-white">{chuyenKhoan.chuTaiKhoan}</b>
              </p>
              <p className="text-slate-400">
                Số tiền: <b className="text-white">{formatTien(chuyenKhoan.soTien)}</b>
              </p>
              <p className="text-slate-400">
                Nội dung: <b className="text-sun">{chuyenKhoan.noiDungChuyenKhoan}</b>
              </p>
              <p className="text-xs text-slate-500">Mã QR và cổng thanh toán chỉ minh họa cho đồ án.</p>
            </div>
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <Link to={`${DUONG_DAN.traCuuDon}?maDon=${don.maDon}&sdt=${don.sdtNhan}`} className="flex-1">
            <Button className="w-full">Tra cứu đơn</Button>
          </Link>
          <Link to={DUONG_DAN.trangChu} className="flex-1">
            <Button kieu="kinh" className="w-full">
              Về trang chủ
            </Button>
          </Link>
        </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function ThanhToan() {
  const gio = useGioHang()
  const [donVuaDat, setDonVuaDat] = useState<DonHang | null>(null)
  const [apMa, setApMa] = useState<KetQuaApMa | null>(null)
  const chiTiet = gio.data?.chiTiet ?? []
  const coTheDat = chiTiet.length > 0 && !chiTiet.some((d) => !d.conBan || d.vuotTon)

  return (
    <>
      <DauTrang
        nhanPhu="Thanh toán"
        tieuDe={
          <>
            Chỉ còn <span className="text-iridescent">một bước</span>
          </>
        }
        moTa="Không cần tài khoản. Điền họ tên, số điện thoại và địa chỉ là xong."
      >
        <CacBuoc buoc={donVuaDat ? 2 : 1} />
      </DauTrang>
      <div className="mx-auto max-w-7xl px-6">
        {gio.isPending && <DangTai />}
        {gio.isError && <BaoLoi loi={gio.error} thuLai={() => gio.refetch()} />}
        {gio.data && chiTiet.length === 0 && !donVuaDat && (
          <Trong noiDung="Giỏ hàng đang trống, chưa có gì để thanh toán.">
            <Link to={DUONG_DAN.danhSachCa}>
              <Button>Chọn cá ngay</Button>
            </Link>
          </Trong>
        )}
        {/* Đặt xong thì giỏ đã trống: ẩn biểu mẫu để không hiện tổng tiền âm phía sau hộp thành công */}
        {gio.data && chiTiet.length > 0 && !donVuaDat && (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <FormDatHang tamTinh={gio.data.tamTinh} coTheDat={coTheDat} khiApMa={setApMa} khiThanhCong={setDonVuaDat} />
            <div className="space-y-4">
              <div className="glass rounded-[28px] p-5">
                <p className="mb-3 text-sm font-semibold">Sản phẩm ({chiTiet.length})</p>
                <div className="space-y-3">
                  {chiTiet.map((d) => (
                    <div key={d.id} className="flex items-center gap-3">
                      <span className="relative grid h-12 w-16 place-items-center rounded-xl bg-white/5">
                        <AnhSanPham sanPham={d.sanPham} chuyenDong={false} className={d.sanPham.dongCa ? 'w-12' : 'h-6 w-6'} />
                        <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-coral text-[10px] font-bold">{d.soLuong}</span>
                      </span>
                      <span className="min-w-0 flex-1 text-sm">
                        <span className="line-clamp-1">{d.sanPham.ten}</span>
                        <span className="text-xs text-slate-500">{tenNganLuaChon(d.donVi, d.gioiTinh)}</span>
                      </span>
                      <span className="text-sm font-medium">{formatTien(d.thanhTien)}</span>
                    </div>
                  ))}
                </div>
                {!coTheDat && chiTiet.length > 0 && (
                  <p className="mt-3 text-xs text-sun">
                    Có sản phẩm đã hết hoặc vượt số còn lại.{' '}
                    <Link to={DUONG_DAN.gioHang} className="underline">
                      Chỉnh lại giỏ hàng
                    </Link>
                  </p>
                )}
              </div>
              <TomTatDon tamTinh={gio.data.tamTinh} phiGiao={gio.data.phiGiao} giamGia={apMa?.tienGiam} />
            </div>
          </div>
        )}
      </div>
      {donVuaDat && <ThanhCong don={donVuaDat} />}
    </>
  )
}
