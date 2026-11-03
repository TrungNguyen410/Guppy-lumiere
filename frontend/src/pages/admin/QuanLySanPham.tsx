import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useDongCa } from '@/entities/san-pham/api'
import { layChiTietQuanTri, moBanSanPham, ngungBanSanPham, laySanPhamQuanTri, suaDongCa, suaSanPham, taoDongCa, taoSanPham, xoaDongCa, type LuuDongCa, type LuuSanPham } from '@/entities/quan-tri/api'
import { TEN_DUOI, TEN_NHAN, TEN_PHU_KIEN, type DongCa, type DonViBan, type GioiTinh, type HoaTiet, type KieuDuoi, type LoaiPhuKien, type NhanSanPham, type SanPhamChiTiet, type SanPhamTomTat } from '@/entities/san-pham/model'
import { formatTien } from '@/shared/lib/formatTien'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Input, Select, Textarea, Truong } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { PhanTrang } from '@/shared/ui/PhanTrang'
import { Table } from '@/shared/ui/Table'
import { TieuDeQuanTri } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai, LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'

const CAC_MUC_GIA: { khoa: string; nhan: string; donVi: DonViBan; gioiTinh?: GioiTinh }[] = [
  { khoa: 'DUC', nhan: 'Con lẻ đực', donVi: 'CON_LE', gioiTinh: 'DUC' },
  { khoa: 'CAI', nhan: 'Con lẻ cái', donVi: 'CON_LE', gioiTinh: 'CAI' },
  { khoa: 'CAP', nhan: 'Cặp', donVi: 'CAP' },
  { khoa: 'BO_BA', nhan: 'Bộ ba', donVi: 'BO_BA' },
  { khoa: 'LO_CA_BOT', nhan: 'Lô cá bột', donVi: 'LO_CA_BOT' },
]

const KHOA_QUAN_TRI = ['quan-tri-san-pham']

function useLamMoiSanPham() {
  const queryClient = useQueryClient()
  return async () => {
    await queryClient.invalidateQueries({ queryKey: KHOA_QUAN_TRI })
    await queryClient.invalidateQueries({ queryKey: ['san-pham'] })
    await queryClient.invalidateQueries({ queryKey: ['dong-ca'] })
  }
}

function FormSanPham({ ban, khiDong }: { ban: SanPhamChiTiet | null; khiDong: () => void }) {
  const lamMoi = useLamMoiSanPham()
  const dongCa = useDongCa()
  const sp = ban?.tomTat
  const nuoc = ban?.thongSoNuoc
  const [loai, setLoai] = useState<'CA_GUPPY' | 'PHU_KIEN'>(sp?.loai ?? 'CA_GUPPY')
  const [ten, setTen] = useState(sp?.ten ?? '')
  const [moTa, setMoTa] = useState(ban?.moTa ?? '')
  const [nhan, setNhan] = useState<NhanSanPham[]>(sp?.nhan ?? [])
  const [dongCaId, setDongCaId] = useState(String(sp?.dongCa?.id ?? ''))
  const [kieuDuoi, setKieuDuoi] = useState<KieuDuoi>(sp?.kieuDuoi ?? 'DELTA')
  const [mauSac, setMauSac] = useState(ban?.mauSac ?? '')
  const [thuanChung, setThuanChung] = useState(ban?.thuanChung ?? true)
  const [kichThuoc, setKichThuoc] = useState(ban?.kichThuoc ?? '')
  const [tuoiTuan, setTuoiTuan] = useState(ban?.tuoiTuan ?? 12)
  const [soConMoiLo, setSoConMoiLo] = useState(ban?.soConMoiLo ?? 10)
  const [nhietDoMin, setNhietDoMin] = useState(nuoc?.nhietDoMin ?? 22)
  const [nhietDoMax, setNhietDoMax] = useState(nuoc?.nhietDoMax ?? 28)
  const [phMin, setPhMin] = useState(nuoc?.phMin ?? 6.8)
  const [phMax, setPhMax] = useState(nuoc?.phMax ?? 7.8)
  const [doCung, setDoCung] = useState(nuoc?.doCung ?? '8–12 dGH')
  const [loaiPhuKien, setLoaiPhuKien] = useState<LoaiPhuKien>(sp?.loaiPhuKien ?? 'THUC_AN')
  const [giaPhuKien, setGiaPhuKien] = useState(sp?.loai === 'PHU_KIEN' ? sp.giaThapNhat : 0)
  const [tonKho, setTonKho] = useState(ban?.tonKhoPhuKien ?? 0)
  const [bangGia, setBangGia] = useState<Record<string, string>>(() => {
    const dauVao: Record<string, string> = {}
    ban?.bangGia?.forEach((g) => {
      dauVao[g.donVi === 'CON_LE' ? g.gioiTinh : g.donVi] = String(g.gia)
    })
    return dauVao
  })

  const duLieu = (): LuuSanPham => {
    if (loai === 'PHU_KIEN') return { loai, ten, moTa: moTa || undefined, nhan, loaiPhuKien, gia: giaPhuKien, tonKho }
    return {
      loai,
      ten,
      moTa: moTa || undefined,
      nhan,
      dongCaId: Number(dongCaId),
      kieuDuoi,
      mauSac,
      thuanChung,
      kichThuoc,
      tuoiTuan,
      soConMoiLo,
      nhietDoMin,
      nhietDoMax,
      phMin,
      phMax,
      doCung,
      bangGia: CAC_MUC_GIA.filter((m) => Number(bangGia[m.khoa]) > 0).map((m) => ({ donVi: m.donVi, gioiTinh: m.gioiTinh, gia: Number(bangGia[m.khoa]) })),
    }
  }

  const luu = useMutation({
    mutationFn: () => (sp ? suaSanPham(sp.id, duLieu()) : taoSanPham(duLieu())),
    onSuccess: async () => {
      await lamMoi()
      khiDong()
    },
  })

  const batTatNhan = (n: NhanSanPham) => setNhan((cu) => (cu.includes(n) ? cu.filter((x) => x !== n) : [...cu, n]))
  const gui = (su: FormEvent) => {
    su.preventDefault()
    luu.mutate()
  }

  return (
    <form className="max-h-[70vh] space-y-4 overflow-y-auto pr-1" onSubmit={gui}>
      {!sp && (
        <div className="grid grid-cols-2 gap-2">
          {(['CA_GUPPY', 'PHU_KIEN'] as const).map((l) => (
            <Button key={l} kieu={loai === l ? 'chinh' : 'vien'} onClick={() => setLoai(l)}>
              {l === 'CA_GUPPY' ? 'Cá' : 'Phụ kiện'}
            </Button>
          ))}
        </div>
      )}
      <Truong nhan="Tên sản phẩm *">
        <Input required maxLength={160} value={ten} onChange={(su) => setTen(su.target.value)} />
      </Truong>
      <Truong nhan="Mô tả">
        <Textarea value={moTa} onChange={(su) => setMoTa(su.target.value)} />
      </Truong>
      <fieldset>
        <legend className="mb-1.5 text-xs font-medium text-slate-300">Nhãn</legend>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          {(Object.keys(TEN_NHAN) as NhanSanPham[]).map((n) => (
            <label key={n} className="flex items-center gap-1.5">
              <input type="checkbox" className="accent-aqua" checked={nhan.includes(n)} onChange={() => batTatNhan(n)} /> {TEN_NHAN[n].ten}
            </label>
          ))}
        </div>
      </fieldset>
      {loai === 'CA_GUPPY' ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Truong nhan="Dòng cá *">
              <Select required value={dongCaId} onChange={(su) => setDongCaId(su.target.value)}>
                <option value="">Chọn dòng</option>
                {dongCa.data?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.ten}
                  </option>
                ))}
              </Select>
            </Truong>
            <Truong nhan="Kiểu đuôi *">
              <Select value={kieuDuoi} onChange={(su) => setKieuDuoi(su.target.value as KieuDuoi)}>
                {(Object.keys(TEN_DUOI) as KieuDuoi[]).map((d) => (
                  <option key={d} value={d}>
                    {TEN_DUOI[d]}
                  </option>
                ))}
              </Select>
            </Truong>
            <Truong nhan="Màu sắc *">
              <Input required maxLength={80} value={mauSac} onChange={(su) => setMauSac(su.target.value)} />
            </Truong>
            <Truong nhan="Kích thước *">
              <Input required maxLength={20} value={kichThuoc} onChange={(su) => setKichThuoc(su.target.value)} placeholder="3–4 cm" />
            </Truong>
            <Truong nhan="Tuổi (tuần)">
              <Input type="number" min={0} value={tuoiTuan} onChange={(su) => setTuoiTuan(Number(su.target.value))} />
            </Truong>
            <Truong nhan="Số con mỗi lô bột">
              <Input type="number" min={1} value={soConMoiLo} onChange={(su) => setSoConMoiLo(Number(su.target.value))} />
            </Truong>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="accent-aqua" checked={thuanChung} onChange={(su) => setThuanChung(su.target.checked)} /> Thuần chủng
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Truong nhan="Nhiệt độ thấp nhất" goiY="22–28°C">
              <Input type="number" step="0.1" min={22} max={28} value={nhietDoMin} onChange={(su) => setNhietDoMin(Number(su.target.value))} />
            </Truong>
            <Truong nhan="Nhiệt độ cao nhất" goiY="22–28°C">
              <Input type="number" step="0.1" min={22} max={28} value={nhietDoMax} onChange={(su) => setNhietDoMax(Number(su.target.value))} />
            </Truong>
            <Truong nhan="pH thấp nhất" goiY="6.8–7.8">
              <Input type="number" step="0.1" min={6.8} max={7.8} value={phMin} onChange={(su) => setPhMin(Number(su.target.value))} />
            </Truong>
            <Truong nhan="pH cao nhất" goiY="6.8–7.8">
              <Input type="number" step="0.1" min={6.8} max={7.8} value={phMax} onChange={(su) => setPhMax(Number(su.target.value))} />
            </Truong>
          </div>
          <Truong nhan="Độ cứng nước *">
            <Input required maxLength={20} value={doCung} onChange={(su) => setDoCung(su.target.value)} />
          </Truong>
          <fieldset>
            <legend className="mb-1.5 text-xs font-medium text-slate-300">Bảng giá (để trống là không bán đơn vị đó)</legend>
            <div className="grid grid-cols-2 gap-3">
              {CAC_MUC_GIA.map((m) => (
                <Truong key={m.khoa} nhan={m.nhan}>
                  <Input type="number" min={1} value={bangGia[m.khoa] ?? ''} onChange={(su) => setBangGia({ ...bangGia, [m.khoa]: su.target.value })} placeholder="đ" />
                </Truong>
              ))}
            </div>
          </fieldset>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <Truong nhan="Loại *">
            <Select value={loaiPhuKien} onChange={(su) => setLoaiPhuKien(su.target.value as LoaiPhuKien)}>
              {(Object.keys(TEN_PHU_KIEN) as LoaiPhuKien[]).map((l) => (
                <option key={l} value={l}>
                  {TEN_PHU_KIEN[l]}
                </option>
              ))}
            </Select>
          </Truong>
          <Truong nhan="Giá *">
            <Input type="number" required min={1} value={giaPhuKien || ''} onChange={(su) => setGiaPhuKien(Number(su.target.value))} />
          </Truong>
          <Truong nhan="Tồn kho *">
            <Input type="number" required min={0} value={tonKho} onChange={(su) => setTonKho(Number(su.target.value))} />
          </Truong>
        </div>
      )}
      <LoiThaoTac loi={luu.error} />
      <Button type="submit" className="w-full" disabled={luu.isPending}>
        {luu.isPending ? 'Đang lưu…' : 'Lưu sản phẩm'}
      </Button>
    </form>
  )
}

const DONG_TRONG: LuuDongCa = { ma: '', ten: '', xuatXu: '', hoaTiet: 'SOLID', mauThan: '#e2e8f0', mauDuoi1: '#22d3ee', mauDuoi2: '#0c2340', mauNhan: '#94a3b8' }
const CAC_MAU_DONG = [
  ['mauThan', 'Thân'],
  ['mauDuoi1', 'Đuôi 1'],
  ['mauDuoi2', 'Đuôi 2'],
  ['mauNhan', 'Nhấn'],
] as const

function FormDongCa({ ban, khiDong }: { ban: DongCa | null; khiDong: () => void }) {
  const lamMoi = useLamMoiSanPham()
  const [d, setD] = useState<LuuDongCa>(ban ?? DONG_TRONG)
  const luu = useMutation({
    mutationFn: () => (ban ? suaDongCa(ban.id, d) : taoDongCa(d)),
    onSuccess: async () => {
      await lamMoi()
      khiDong()
    },
  })
  return (
    <form
      className="space-y-4"
      onSubmit={(su) => {
        su.preventDefault()
        luu.mutate()
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Truong nhan="Mã *" goiY={ban ? 'không đổi được' : 'dùng trên URL'}>
          <Input required disabled={Boolean(ban)} pattern="[a-z0-9\-]{1,40}" title="Chữ thường, số và dấu gạch ngang" value={d.ma} onChange={(su) => setD({ ...d, ma: su.target.value })} />
        </Truong>
        <Truong nhan="Tên *">
          <Input required maxLength={80} value={d.ten} onChange={(su) => setD({ ...d, ten: su.target.value })} />
        </Truong>
        <Truong nhan="Xuất xứ *">
          <Input required maxLength={80} value={d.xuatXu} onChange={(su) => setD({ ...d, xuatXu: su.target.value })} />
        </Truong>
        <Truong nhan="Họa tiết *">
          <Select value={d.hoaTiet} onChange={(su) => setD({ ...d, hoaTiet: su.target.value as HoaTiet })}>
            <option value="SOLID">Đồng màu</option>
            <option value="MOSAIC">Mosaic</option>
            <option value="GRASS">Grass</option>
            <option value="KOI">Koi</option>
          </Select>
        </Truong>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {CAC_MAU_DONG.map(([khoa, nhan]) => (
          <Truong key={khoa} nhan={nhan}>
            <input type="color" aria-label={`Màu ${nhan}`} value={d[khoa]} onChange={(su) => setD({ ...d, [khoa]: su.target.value })} className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent p-1" />
          </Truong>
        ))}
      </div>
      <LoiThaoTac loi={luu.error} />
      <Button type="submit" className="w-full" disabled={luu.isPending}>
        Lưu dòng cá
      </Button>
    </form>
  )
}

function BangDongCa() {
  const lamMoi = useLamMoiSanPham()
  const dongCa = useDongCa()
  const [moForm, setMoForm] = useState(false)
  const [dangSua, setDangSua] = useState<DongCa | null>(null)
  const xoa = useMutation({ mutationFn: xoaDongCa, onSuccess: lamMoi })
  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-white/[.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display font-semibold">Dòng cá</p>
        <Button
          kieu="vien"
          coNut="nho"
          onClick={() => {
            setDangSua(null)
            setMoForm(true)
          }}
        >
          <Plus className="h-3.5 w-3.5" /> Thêm dòng
        </Button>
      </div>
      <div className="mb-3 empty:hidden">
        <LoiThaoTac loi={xoa.error} />
      </div>
      <Table
        dong={dongCa.data ?? []}
        khoaDong={(d) => d.id}
        cot={[
          {
            tieuDe: 'Dòng',
            hienThi: (d) => (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: `linear-gradient(135deg, ${d.mauDuoi1}, ${d.mauDuoi2})` }} />
                {d.ten}
              </span>
            ),
          },
          { tieuDe: 'Mã', hienThi: (d) => <span className="font-mono text-xs">{d.ma}</span> },
          { tieuDe: 'Xuất xứ', hienThi: (d) => d.xuatXu },
          {
            tieuDe: 'Thao tác',
            hienThi: (d) => (
              <span className="flex gap-2">
                <Button
                  kieu="vien"
                  coNut="nho"
                  aria-label={`Sửa ${d.ten}`}
                  onClick={() => {
                    setDangSua(d)
                    setMoForm(true)
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button kieu="nguyHiem" coNut="nho" aria-label={`Xóa ${d.ten}`} disabled={xoa.isPending} onClick={() => xoa.mutate(d.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </span>
            ),
          },
        ]}
      />
      <Modal mo={moForm} khiDoi={setMoForm} tieuDe={dangSua ? `Sửa ${dangSua.ten}` : 'Thêm dòng cá'}>
        <FormDongCa key={dangSua?.id ?? 'moi'} ban={dangSua} khiDong={() => setMoForm(false)} />
      </Modal>
    </div>
  )
}

export function QuanLySanPham() {
  const lamMoi = useLamMoiSanPham()
  const [tuKhoa, setTuKhoa] = useState('')
  const [trang, setTrang] = useState(0)
  const sanPham = useQuery({ queryKey: [...KHOA_QUAN_TRI, tuKhoa, trang], queryFn: () => laySanPhamQuanTri({ q: tuKhoa || undefined, trang, kichThuoc: 10 }), placeholderData: keepPreviousData })
  const [moForm, setMoForm] = useState(false)
  const [chiTiet, setChiTiet] = useState<SanPhamChiTiet | null>(null)
  const moSua = useMutation({
    mutationFn: layChiTietQuanTri,
    onSuccess: (ct) => {
      setChiTiet(ct)
      setMoForm(true)
    },
  })
  const doiTrangThaiBan = useMutation({
    mutationFn: (sp: SanPhamTomTat) => (sp.dangBan ? ngungBanSanPham(sp.id) : moBanSanPham(sp.id)),
    onSuccess: lamMoi,
  })
  return (
    <div>
      <TieuDeQuanTri nhanPhu="Danh mục" tieuDe="Sản phẩm" moTa="Xóa sản phẩm là ngừng bán, vì đơn cũ và lô cá vẫn tham chiếu đến sản phẩm.">
        <Button
          onClick={() => {
            setChiTiet(null)
            setMoForm(true)
          }}
        >
          <Plus className="h-4 w-4" /> Thêm sản phẩm
        </Button>
      </TieuDeQuanTri>
      <label className="glass mb-5 flex max-w-md items-center gap-3 rounded-full px-5 py-3">
        <Search className="h-4 w-4 text-aqua" />
        <input
          aria-label="Tìm sản phẩm"
          value={tuKhoa}
          onChange={(su) => {
            setTuKhoa(su.target.value)
            setTrang(0)
          }}
          placeholder="Tìm theo tên sản phẩm"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
      </label>
      {sanPham.isPending && <DangTai />}
      {sanPham.isError && <BaoLoi loi={sanPham.error} thuLai={() => sanPham.refetch()} />}
      <div className="mb-3 empty:hidden">
        <LoiThaoTac loi={doiTrangThaiBan.error ?? moSua.error} />
      </div>
      {sanPham.data && (
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
          <Table
            dong={sanPham.data.noiDung}
            khoaDong={(sp) => sp.id}
            thongBaoTrong="Không có sản phẩm nào."
            cot={[
              { tieuDe: 'Sản phẩm', hienThi: (sp) => <span className="font-medium">{sp.ten}</span> },
              { tieuDe: 'Loại', hienThi: (sp) => (sp.dongCa ? sp.dongCa.ten : sp.loaiPhuKien ? TEN_PHU_KIEN[sp.loaiPhuKien] : '') },
              { tieuDe: 'Giá từ', hienThi: (sp) => formatTien(sp.giaThapNhat) },
              { tieuDe: 'Đã bán', hienThi: (sp) => sp.daBan },
              {
                tieuDe: 'Trạng thái',
                hienThi: (sp) => (!sp.dangBan ? <Badge mau="xam">Ngừng bán</Badge> : sp.conHang ? <Badge mau="kelp">Còn hàng</Badge> : <Badge mau="sun">Hết hàng</Badge>),
              },
              {
                tieuDe: 'Thao tác',
                hienThi: (sp) => (
                  <span className="flex gap-2">
                    <Button kieu="vien" coNut="nho" aria-label={`Sửa ${sp.ten}`} disabled={moSua.isPending} onClick={() => moSua.mutate(sp.id)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button kieu={sp.dangBan ? 'nguyHiem' : 'vien'} coNut="nho" disabled={doiTrangThaiBan.isPending} onClick={() => doiTrangThaiBan.mutate(sp)}>
                      {sp.dangBan ? 'Ngừng bán' : 'Mở bán'}
                    </Button>
                  </span>
                ),
              },
            ]}
          />
          <PhanTrang trang={sanPham.data.trang} tongTrang={sanPham.data.tongTrang} khiDoi={setTrang} />
        </div>
      )}
      <BangDongCa />
      <Modal mo={moForm} khiDoi={setMoForm} tieuDe={chiTiet ? `Sửa ${chiTiet.tomTat.ten}` : 'Thêm sản phẩm'}>
        <FormSanPham key={chiTiet?.tomTat.id ?? 'moi'} ban={chiTiet} khiDong={() => setMoForm(false)} />
      </Modal>
    </div>
  )
}
