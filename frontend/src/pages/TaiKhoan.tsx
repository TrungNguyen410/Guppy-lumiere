import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LogOut, MapPin, MessageSquareText, Package, Pencil, ShieldCheck, Star, Trash2, UserRound, Video } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { layBaoHanhCuaToi, layLichSuDon } from '@/entities/don-hang/api'
import { NhanTrangThai } from '@/entities/don-hang/ui/NhanTrangThai'
import { capNhatHoSo, layHoSo, laySoDiaChi, suaDiaChi, themDiaChi, xoaDiaChi } from '@/entities/nguoi-dung/api'
import { laNhanSu, THANH_PHO_GIAO, type DiaChi, type LuuDiaChi } from '@/entities/nguoi-dung/model'
import { usePhienStore } from '@/entities/nguoi-dung/phien'
import { tenLuaChon } from '@/entities/san-pham/model'
import { FormBaoHanh } from '@/features/bao-hanh/FormBaoHanh'
import { FormDanhGia, type MucDanhGia } from '@/features/danh-gia/FormDanhGia'
import { cn } from '@/shared/lib/cn'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { formatNgayGio } from '@/shared/lib/formatNgay'
import { formatTien } from '@/shared/lib/formatTien'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Input, Select, Truong } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { DauTrang } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai, LoiThaoTac, Trong } from '@/shared/ui/TrangThaiDuLieu'

const MAU_SDT = '0[0-9]{9}'

function TabHoSo() {
  const queryClient = useQueryClient()
  const doiHoTen = usePhienStore((s) => s.doiHoTen)
  const hoSo = useQuery({ queryKey: ['ho-so'], queryFn: layHoSo })
  const [nhap, setNhap] = useState<{ hoTen: string; soDienThoai: string } | null>(null)
  const luu = useMutation({
    mutationFn: capNhatHoSo,
    onSuccess: async (moi) => {
      doiHoTen(moi.hoTen)
      await queryClient.invalidateQueries({ queryKey: ['ho-so'] })
      setNhap(null)
    },
  })
  if (hoSo.isPending) return <DangTai />
  if (hoSo.isError) return <BaoLoi loi={hoSo.error} thuLai={() => hoSo.refetch()} />
  const giaTri = nhap ?? { hoTen: hoSo.data.hoTen, soDienThoai: hoSo.data.soDienThoai ?? '' }
  return (
    <form
      className="glass max-w-xl space-y-4 rounded-[28px] p-6"
      onSubmit={(su) => {
        su.preventDefault()
        luu.mutate(giaTri)
      }}
    >
      <Truong nhan="Email" goiY="không đổi được">
        <Input value={hoSo.data.email} disabled className="opacity-60" />
      </Truong>
      <Truong nhan="Họ và tên *">
        <Input required maxLength={120} value={giaTri.hoTen} onChange={(su) => setNhap({ ...giaTri, hoTen: su.target.value })} />
      </Truong>
      <Truong nhan="Số điện thoại *">
        <Input required pattern={MAU_SDT} title="Gồm 10 số, bắt đầu bằng 0" value={giaTri.soDienThoai} onChange={(su) => setNhap({ ...giaTri, soDienThoai: su.target.value })} />
      </Truong>
      <LoiThaoTac loi={luu.error} />
      {luu.isSuccess && !nhap && <p className="text-sm text-kelp">Đã lưu hồ sơ.</p>}
      <Button type="submit" disabled={!nhap || luu.isPending}>
        Lưu thay đổi
      </Button>
    </form>
  )
}

const DIA_CHI_TRONG: LuuDiaChi = { hoTenNhan: '', soDienThoai: '', diaChi: '', thanhPho: THANH_PHO_GIAO[0], macDinh: false }

function ModalDiaChi({ dangSua, mo, khiDong }: { dangSua: DiaChi | null; mo: boolean; khiDong: () => void }) {
  const queryClient = useQueryClient()
  const [d, setD] = useState<LuuDiaChi>(dangSua ?? DIA_CHI_TRONG)
  const luu = useMutation({
    mutationFn: () => (dangSua ? suaDiaChi(dangSua.id, d) : themDiaChi(d)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dia-chi'] })
      khiDong()
    },
  })
  const gui = (su: FormEvent) => {
    su.preventDefault()
    luu.mutate()
  }
  return (
    <Modal mo={mo} khiDoi={(m) => !m && khiDong()} tieuDe={dangSua ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}>
      <form className="space-y-4" onSubmit={gui}>
        <Truong nhan="Người nhận *">
          <Input required maxLength={120} value={d.hoTenNhan} onChange={(su) => setD({ ...d, hoTenNhan: su.target.value })} />
        </Truong>
        <Truong nhan="Số điện thoại *">
          <Input required pattern={MAU_SDT} title="Gồm 10 số, bắt đầu bằng 0" value={d.soDienThoai} onChange={(su) => setD({ ...d, soDienThoai: su.target.value })} />
        </Truong>
        <Truong nhan="Địa chỉ *">
          <Input required maxLength={255} value={d.diaChi} onChange={(su) => setD({ ...d, diaChi: su.target.value })} />
        </Truong>
        <Truong nhan="Thành phố *" goiY="cá sống chỉ giao 3 thành phố">
          <Select value={d.thanhPho} onChange={(su) => setD({ ...d, thanhPho: su.target.value })}>
            {THANH_PHO_GIAO.map((tp) => (
              <option key={tp}>{tp}</option>
            ))}
          </Select>
        </Truong>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" className="accent-aqua" checked={d.macDinh} onChange={(su) => setD({ ...d, macDinh: su.target.checked })} /> Đặt làm mặc định
        </label>
        <LoiThaoTac loi={luu.error} />
        <Button type="submit" className="w-full" disabled={luu.isPending}>
          Lưu địa chỉ
        </Button>
      </form>
    </Modal>
  )
}

function TabDiaChi() {
  const queryClient = useQueryClient()
  const diaChi = useQuery({ queryKey: ['dia-chi'], queryFn: laySoDiaChi })
  const [moForm, setMoForm] = useState(false)
  const [dangSua, setDangSua] = useState<DiaChi | null>(null)
  const xoa = useMutation({ mutationFn: xoaDiaChi, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dia-chi'] }) })
  if (diaChi.isPending) return <DangTai />
  if (diaChi.isError) return <BaoLoi loi={diaChi.error} thuLai={() => diaChi.refetch()} />
  return (
    <div className="space-y-4">
      <Button
        onClick={() => {
          setDangSua(null)
          setMoForm(true)
        }}
      >
        Thêm địa chỉ
      </Button>
      <LoiThaoTac loi={xoa.error} />
      {diaChi.data.length === 0 && <Trong noiDung="Bạn chưa lưu địa chỉ nào." />}
      <div className="grid gap-4 md:grid-cols-2">
        {diaChi.data.map((d) => (
          <article key={d.id} className="glass rounded-3xl p-5 text-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold">{d.hoTenNhan}</p>
              {d.macDinh && <Badge mau="kelp">Mặc định</Badge>}
            </div>
            <p className="mt-2 text-slate-400">{d.soDienThoai}</p>
            <p className="text-slate-400">
              {d.diaChi}, {d.thanhPho}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                kieu="vien"
                coNut="nho"
                onClick={() => {
                  setDangSua(d)
                  setMoForm(true)
                }}
              >
                <Pencil className="h-3 w-3" /> Sửa
              </Button>
              <Button kieu="nguyHiem" coNut="nho" disabled={xoa.isPending} onClick={() => xoa.mutate(d.id)}>
                <Trash2 className="h-3 w-3" /> Xóa
              </Button>
            </div>
          </article>
        ))}
      </div>
      {moForm && <ModalDiaChi key={dangSua?.id ?? 'moi'} dangSua={dangSua} mo={moForm} khiDong={() => setMoForm(false)} />}
    </div>
  )
}

function TabDonHang() {
  const queryClient = useQueryClient()
  const don = useQuery({ queryKey: ['lich-su-don'], queryFn: layLichSuDon })
  const [danhGia, setDanhGia] = useState<MucDanhGia | null>(null)
  const [maBaoHanh, setMaBaoHanh] = useState<string | null>(null)
  if (don.isPending) return <DangTai />
  if (don.isError) return <BaoLoi loi={don.error} thuLai={() => don.refetch()} />
  if (don.data.noiDung.length === 0) {
    return (
      <Trong noiDung="Bạn chưa có đơn hàng nào.">
        <Link to={DUONG_DAN.danhSachCa}>
          <Button>Chọn cá ngay</Button>
        </Link>
      </Trong>
    )
  }
  return (
    <div className="space-y-4">
      {don.data.noiDung.map((d) => (
        <article key={d.maDon} className="glass rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link to={`${DUONG_DAN.traCuuDon}?maDon=${d.maDon}&sdt=${d.sdtNhan}`} className="font-display font-semibold hover:text-aqua">
                {d.maDon}
              </Link>
              <p className="text-xs text-slate-500">{formatNgayGio(d.taoLuc)}</p>
            </div>
            <NhanTrangThai trangThai={d.trangThai} />
          </div>
          <div className="mt-4 space-y-2">
            {d.chiTiet.map((dong) => (
              <div key={`${dong.sanPhamId}-${dong.donVi}-${dong.gioiTinh}`} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  {dong.tenSanPham}{' '}
                  <span className="text-slate-500">
                    · {tenLuaChon(dong.donVi, dong.gioiTinh)} × {dong.soLuong}
                  </span>
                </span>
                {d.trangThai === 'HOAN_TAT' && (
                  <Button kieu="vien" coNut="nho" onClick={() => setDanhGia({ maDon: d.maDon, sanPhamId: dong.sanPhamId, tenSanPham: dong.tenSanPham })}>
                    <Star className="h-3 w-3" /> Đánh giá
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
            <p className="text-iridescent font-display text-lg font-semibold">{formatTien(d.tongTien)}</p>
            {d.conHanBaoHanh && (
              <Button kieu="vien" coNut="nho" onClick={() => setMaBaoHanh(d.maDon)}>
                <Video className="h-3 w-3" /> Báo cá chết (24h)
              </Button>
            )}
          </div>
        </article>
      ))}
      <FormDanhGia muc={danhGia} khiDong={() => setDanhGia(null)} />
      <FormBaoHanh maDon={maBaoHanh} khiDong={() => setMaBaoHanh(null)} khiXong={() => queryClient.invalidateQueries({ queryKey: ['lich-su-don'] })} />
    </div>
  )
}

function TabBaoHanh() {
  const baoHanh = useQuery({ queryKey: ['bao-hanh'], queryFn: layBaoHanhCuaToi })
  if (baoHanh.isPending) return <DangTai />
  if (baoHanh.isError) return <BaoLoi loi={baoHanh.error} thuLai={() => baoHanh.refetch()} />
  if (baoHanh.data.noiDung.length === 0) return <Trong noiDung="Bạn chưa có yêu cầu bảo hành nào." />
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {baoHanh.data.noiDung.map((y) => (
        <article key={y.id} className="glass rounded-3xl p-5 text-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="font-display font-semibold">{y.maDon}</p>
            {y.xuLyLuc ? <Badge mau="kelp">Đã xử lý</Badge> : <Badge mau="sun">Đang chờ</Badge>}
          </div>
          <p className="mt-2 text-slate-300">{y.moTa}</p>
          {y.ketQua && (
            <p className="mt-2 flex gap-2 text-kelp">
              <MessageSquareText className="h-4 w-4 shrink-0" />
              {y.ketQua}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">Gửi lúc {formatNgayGio(y.taoLuc)}</p>
        </article>
      ))}
    </div>
  )
}

const CAC_TAB = [
  { ma: 'don', nhan: 'Đơn hàng', icon: Package },
  { ma: 'ho-so', nhan: 'Hồ sơ', icon: UserRound },
  { ma: 'dia-chi', nhan: 'Sổ địa chỉ', icon: MapPin },
  { ma: 'bao-hanh', nhan: 'Bảo hành', icon: ShieldCheck },
] as const

export function TaiKhoan() {
  const phien = usePhienStore((s) => s.phien)
  const dangXuat = usePhienStore((s) => s.dangXuat)
  const queryClient = useQueryClient()
  const dieuHuong = useNavigate()
  const viTri = useLocation()
  const [tab, setTab] = useState<(typeof CAC_TAB)[number]['ma']>('don')

  if (!phien) return <Navigate to={DUONG_DAN.dangNhap} state={{ tu: viTri.pathname }} replace />
  if (laNhanSu(phien.vaiTro)) return <Navigate to={DUONG_DAN.quanTri} replace />

  return (
    <>
      <DauTrang
        nhanPhu="Tài khoản"
        tieuDe={
          <>
            Chào <span className="text-iridescent">{phien.hoTen}</span>
          </>
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {CAC_TAB.map(({ ma, nhan, icon: Icon }) => (
            <button key={ma} type="button" aria-pressed={tab === ma} onClick={() => setTab(ma)} className={cn('flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition', tab === ma ? 'border-aqua/60 bg-aqua/10 text-white' : 'border-white/10 text-slate-400 hover:text-white')}>
              <Icon className="h-4 w-4" /> {nhan}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              dangXuat()
              queryClient.clear()
              dieuHuong(DUONG_DAN.trangChu)
            }}
            className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-slate-400 hover:text-coral"
          >
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      </DauTrang>
      <div className="mx-auto max-w-7xl px-6">
        {tab === 'don' && <TabDonHang />}
        {tab === 'ho-so' && <TabHoSo />}
        {tab === 'dia-chi' && <TabDiaChi />}
        {tab === 'bao-hanh' && <TabBaoHanh />}
      </div>
    </>
  )
}
