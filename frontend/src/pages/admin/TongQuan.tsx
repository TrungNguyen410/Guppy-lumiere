import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Fish, ShoppingCart, Skull, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { THONG_TIN_TRANG_THAI } from '@/entities/don-hang/model'
import { NhanTrangThai } from '@/entities/don-hang/ui/NhanTrangThai'
import { layThongKe, type ThongKe } from '@/entities/quan-tri/api'
import { formatTien } from '@/shared/lib/formatTien'
import { Table } from '@/shared/ui/Table'
import { TieuDeQuanTri } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai } from '@/shared/ui/TrangThaiDuLieu'

interface OChiSoProps {
  icon: typeof Fish
  nhan: string
  giaTri: string
  phu: string
  mau: string
  thuTu: number
}

function OChiSo({ icon: Icon, nhan, giaTri, phu, mau, thuTu }: OChiSoProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: thuTu * 0.08 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.03] p-5">
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-25 blur-2xl" style={{ background: mau }} />
      <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${mau}22` }}>
        <Icon className="h-5 w-5" style={{ color: mau }} />
      </span>
      <p className="mt-4 text-xs text-slate-400">{nhan}</p>
      <p className="font-display text-2xl font-semibold">{giaTri}</p>
      <p className="mt-1 text-xs text-slate-400">{phu}</p>
    </motion.div>
  )
}

const dinhDangTrieu = (so: number) => `${(so / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tr`

function moTaTangTruong(phanTram: number | null): string {
  if (phanTram === null) return 'Hôm qua chưa có doanh thu'
  return `${phanTram >= 0 ? '▲' : '▼'} ${Math.abs(phanTram).toLocaleString('vi-VN')}% so với hôm qua`
}

/** Một chuỗi số theo thời gian nên chỉ cần vùng một màu, tiêu đề đã nói rõ nội dung. */
function BieuDoDoanhThu({ thongKe }: { thongKe: ThongKe }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-display font-semibold">Doanh thu 7 ngày</p>
          <p className="text-xs text-slate-500">Đơn vị: triệu đồng</p>
        </div>
        <p className="font-display text-2xl font-semibold">{dinhDangTrieu(thongKe.tongDoanhThu7Ngay)}</p>
      </div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={thongKe.doanhThu7Ngay} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
            <defs>
              <linearGradient id="vung-doanh-thu" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#22d3ee" stopOpacity={0.35} />
                <stop offset="1" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgb(255 255 255 / 0.06)" />
            <XAxis dataKey="nhan" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v: number) => String(v / 1_000_000)} />
            <Tooltip
              cursor={{ stroke: 'rgb(255 255 255 / 0.2)', strokeDasharray: '3 3' }}
              contentStyle={{ background: '#0c2340', border: '1px solid rgb(255 255 255 / 0.15)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#e2e8f0' }}
              formatter={(giaTri) => [formatTien(Number(giaTri)), 'Doanh thu']}
            />
            <Area type="linear" dataKey="doanhThu" stroke="#22d3ee" strokeWidth={2} fill="url(#vung-doanh-thu)" dot={{ r: 4, fill: '#030814', stroke: '#22d3ee', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#030814', stroke: '#22d3ee', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function DonTheoTrangThai({ thongKe }: { thongKe: ThongKe }) {
  const lonNhat = Math.max(1, ...thongKe.donTheoTrangThai.map((d) => d.soDon))
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <p className="font-display font-semibold">Đơn theo trạng thái</p>
      <div className="mt-5 space-y-3.5">
        {thongKe.donTheoTrangThai.map(({ trangThai, soDon }, i) => {
          const thongTin = THONG_TIN_TRANG_THAI[trangThai]
          return (
            <div key={trangThai} className="grid grid-cols-[110px_1fr_24px] items-center gap-3 text-sm" title={`${thongTin.nhan}: ${soDon} đơn`}>
              <span className="text-slate-300">{thongTin.nhan}</span>
              <div className="h-2.5 rounded-full bg-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(soDon / lonNhat) * 100}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.8 }} className="h-full rounded-full" style={{ background: thongTin.mau }} />
              </div>
              <span className="text-right font-semibold">{soDon}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DongBanChay({ thongKe }: { thongKe: ThongKe }) {
  const lonNhat = Math.max(1, ...thongKe.dongBanChay.map((d) => d.daBan))
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <p className="font-display font-semibold">Dòng cá bán chạy</p>
      <p className="text-xs text-slate-500">Số cá đã bán</p>
      <div className="mt-5 space-y-3">
        {thongKe.dongBanChay.map((d, i) => (
          <div key={d.tenDong} title={`${d.tenDong}: ${d.daBan}`}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-300">{d.tenDong}</span>
              <span className="font-semibold">{d.daBan}</span>
            </div>
            <div className="h-2 rounded-full bg-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(d.daBan / lonNhat) * 100}%` }} transition={{ delay: i * 0.08, duration: 0.8 }} className="h-full rounded-full bg-orchid" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TongQuan() {
  const thongKe = useQuery({ queryKey: ['thong-ke'], queryFn: layThongKe })
  if (thongKe.isPending) return <DangTai />
  if (thongKe.isError) return <BaoLoi loi={thongKe.error} thuLai={() => thongKe.refetch()} />
  const tk = thongKe.data
  const ngayHienThi = new Date(tk.ngay).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
  return (
    <div className="space-y-6">
      <TieuDeQuanTri nhanPhu={ngayHienThi} tieuDe="Tổng quan cửa hàng" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OChiSo thuTu={0} icon={TrendingUp} nhan="Doanh thu hôm nay" giaTri={formatTien(tk.doanhThuHomNay)} phu={moTaTangTruong(tk.tangTruongPhanTram)} mau="#22d3ee" />
        <OChiSo thuTu={1} icon={ShoppingCart} nhan="Đơn chờ xác nhận" giaTri={String(tk.donChoXacNhan)} phu="Cần xử lý trong 15 phút" mau="#fbbf24" />
        <OChiSo thuTu={2} icon={Fish} nhan="Cá tồn trong các lô" giaTri={tk.tongCaTon.toLocaleString('vi-VN')} phu={`${tk.soLoDangNuoi} lô đang nuôi`} mau="#c084fc" />
        <OChiSo thuTu={3} icon={Skull} nhan="Hao hụt tháng này" giaTri={`${tk.haoHutThangNay} con`} phu={`≈ ${tk.tiLeHaoHutPhanTram.toLocaleString('vi-VN')}% tổng đàn`} mau="#fb7185" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <BieuDoDoanhThu thongKe={tk} />
        <DonTheoTrangThai thongKe={tk} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        <DongBanChay thongKe={tk} />
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
          <p className="mb-4 font-display font-semibold">Đơn mới nhất</p>
          <Table
            dong={tk.donMoiNhat}
            khoaDong={(d) => d.maDon}
            cot={[
              { tieuDe: 'Mã đơn', hienThi: (d) => <span className="font-mono text-xs">{d.maDon}</span> },
              {
                tieuDe: 'Khách',
                hienThi: (d) => (
                  <>
                    {d.hoTen}
                    <span className="block text-xs text-slate-500">{d.thanhPho}</span>
                  </>
                ),
              },
              { tieuDe: 'Tổng', hienThi: (d) => <span className="font-medium">{formatTien(d.tongTien)}</span> },
              { tieuDe: 'Trạng thái', hienThi: (d) => <NhanTrangThai trangThai={d.trangThai} /> },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
