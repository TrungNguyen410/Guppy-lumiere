import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { layNhanVien, suaNhanVien, taoNhanVien, xoaNhanVien, type NhanVien } from '@/entities/quan-tri/api'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Input, Truong } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { Table } from '@/shared/ui/Table'
import { TieuDeQuanTri } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai, LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'

const KHOA = ['nhan-vien']
const MAU_SDT = '0[0-9]{9}'

function FormNhanVien({ ban, khiDong }: { ban: NhanVien | null; khiDong: () => void }) {
  const queryClient = useQueryClient()
  const [hoTen, setHoTen] = useState(ban?.hoTen ?? '')
  const [email, setEmail] = useState(ban?.email ?? '')
  const [soDienThoai, setSoDienThoai] = useState(ban?.soDienThoai ?? '')
  const [matKhau, setMatKhau] = useState('')
  const [kichHoat, setKichHoat] = useState(ban?.kichHoat ?? true)
  const luu = useMutation({
    mutationFn: () => (ban ? suaNhanVien(ban.id, { hoTen, soDienThoai, kichHoat, matKhauMoi: matKhau || undefined }) : taoNhanVien({ hoTen, email, soDienThoai, matKhau })),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: KHOA })
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
      <Truong nhan="Họ và tên *">
        <Input required maxLength={120} value={hoTen} onChange={(su) => setHoTen(su.target.value)} />
      </Truong>
      <Truong nhan="Email *" goiY={ban ? 'không đổi được' : undefined}>
        <Input type="email" required disabled={Boolean(ban)} value={email} onChange={(su) => setEmail(su.target.value)} />
      </Truong>
      <Truong nhan="Số điện thoại *">
        <Input required pattern={MAU_SDT} title="Gồm 10 số, bắt đầu bằng 0" value={soDienThoai} onChange={(su) => setSoDienThoai(su.target.value)} />
      </Truong>
      <Truong nhan={ban ? 'Mật khẩu mới' : 'Mật khẩu *'} goiY={ban ? 'bỏ trống là giữ nguyên' : 'từ 8 ký tự'}>
        <Input type="password" required={!ban} minLength={8} maxLength={72} autoComplete="new-password" value={matKhau} onChange={(su) => setMatKhau(su.target.value)} />
      </Truong>
      {ban && (
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" className="accent-aqua" checked={kichHoat} onChange={(su) => setKichHoat(su.target.checked)} /> Đang hoạt động (bỏ chọn để khóa, có tác dụng ngay)
        </label>
      )}
      <LoiThaoTac loi={luu.error} />
      <Button type="submit" className="w-full" disabled={luu.isPending}>
        Lưu nhân viên
      </Button>
    </form>
  )
}

export function QuanLyTaiKhoan() {
  const queryClient = useQueryClient()
  const danhSach = useQuery({ queryKey: KHOA, queryFn: layNhanVien })
  const [moForm, setMoForm] = useState(false)
  const [dangSua, setDangSua] = useState<NhanVien | null>(null)
  const xoa = useMutation({ mutationFn: xoaNhanVien, onSuccess: () => queryClient.invalidateQueries({ queryKey: KHOA }) })
  return (
    <div>
      <TieuDeQuanTri nhanPhu="Nhân sự" tieuDe="Tài khoản nhân viên" moTa="Nhân viên xử lý đơn và kho; chỉ admin mới quản lý sản phẩm, khuyến mãi và thống kê.">
        <Button
          onClick={() => {
            setDangSua(null)
            setMoForm(true)
          }}
        >
          <Plus className="h-4 w-4" /> Thêm nhân viên
        </Button>
      </TieuDeQuanTri>
      <div className="mb-3 empty:hidden">
        <LoiThaoTac loi={xoa.error} />
      </div>
      {danhSach.isPending && <DangTai />}
      {danhSach.isError && <BaoLoi loi={danhSach.error} thuLai={() => danhSach.refetch()} />}
      {danhSach.data && (
        <div className="rounded-3xl border border-white/10 bg-white/[.03] p-6">
          <Table
            dong={danhSach.data}
            khoaDong={(n) => n.id}
            thongBaoTrong="Chưa có nhân viên nào."
            cot={[
              { tieuDe: 'Họ tên', hienThi: (n) => <span className="font-medium">{n.hoTen}</span> },
              { tieuDe: 'Email', hienThi: (n) => n.email },
              { tieuDe: 'Số điện thoại', hienThi: (n) => n.soDienThoai ?? '—' },
              { tieuDe: 'Trạng thái', hienThi: (n) => (n.kichHoat ? <Badge mau="kelp">Hoạt động</Badge> : <Badge mau="xam">Đã khóa</Badge>) },
              {
                tieuDe: 'Thao tác',
                hienThi: (n) => (
                  <span className="flex gap-2">
                    <Button
                      kieu="vien"
                      coNut="nho"
                      aria-label={`Sửa ${n.hoTen}`}
                      onClick={() => {
                        setDangSua(n)
                        setMoForm(true)
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button kieu="nguyHiem" coNut="nho" aria-label={`Xóa ${n.hoTen}`} disabled={xoa.isPending} onClick={() => xoa.mutate(n.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}
      <Modal mo={moForm} khiDoi={setMoForm} tieuDe={dangSua ? `Sửa ${dangSua.hoTen}` : 'Thêm nhân viên'}>
        <FormNhanVien key={dangSua?.id ?? 'moi'} ban={dangSua} khiDong={() => setMoForm(false)} />
      </Modal>
    </div>
  )
}
