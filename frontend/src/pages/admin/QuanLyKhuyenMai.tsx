import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { layMaGiamGia, suaMaGiamGia, taoMaGiamGia, xoaMaGiamGia, type LuuMaGiamGia, type MaGiamGia } from '@/entities/quan-tri/api'
import { formatNgay } from '@/shared/lib/formatNgay'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Input, Truong } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { Table } from '@/shared/ui/Table'
import { TieuDeQuanTri } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai, LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'

const KHOA = ['ma-giam-gia']
const MA_TRONG: LuuMaGiamGia = { ma: '', phanTram: 10, ngayBatDau: '', ngayHetHan: '', soLuotToiDa: null, kichHoat: true }

function FormMa({ ban, khiDong }: { ban: MaGiamGia | null; khiDong: () => void }) {
  const queryClient = useQueryClient()
  const [m, setM] = useState<LuuMaGiamGia>(ban ?? MA_TRONG)
  const luu = useMutation({
    mutationFn: () => (ban ? suaMaGiamGia(ban.id, m) : taoMaGiamGia(m)),
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
      <div className="grid grid-cols-2 gap-3">
        <Truong nhan="Mã *" goiY={ban ? 'không đổi được' : undefined}>
          <Input required disabled={Boolean(ban)} pattern="[A-Za-z0-9\-]{1,30}" title="Chữ, số và dấu gạch ngang" className="uppercase" value={m.ma} onChange={(su) => setM({ ...m, ma: su.target.value })} />
        </Truong>
        <Truong nhan="Phần trăm giảm *">
          <Input type="number" required min={1} max={100} value={m.phanTram} onChange={(su) => setM({ ...m, phanTram: Number(su.target.value) })} />
        </Truong>
        <Truong nhan="Bắt đầu *">
          <Input type="datetime-local" required value={m.ngayBatDau.slice(0, 16)} onChange={(su) => setM({ ...m, ngayBatDau: su.target.value })} />
        </Truong>
        <Truong nhan="Hết hạn *">
          <Input type="datetime-local" required value={m.ngayHetHan.slice(0, 16)} onChange={(su) => setM({ ...m, ngayHetHan: su.target.value })} />
        </Truong>
      </div>
      <Truong nhan="Số lượt tối đa" goiY="bỏ trống là không giới hạn">
        <Input type="number" min={1} value={m.soLuotToiDa ?? ''} onChange={(su) => setM({ ...m, soLuotToiDa: su.target.value ? Number(su.target.value) : null })} />
      </Truong>
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" className="accent-aqua" checked={m.kichHoat} onChange={(su) => setM({ ...m, kichHoat: su.target.checked })} /> Đang hoạt động
      </label>
      <LoiThaoTac loi={luu.error} />
      <Button type="submit" className="w-full" disabled={luu.isPending}>
        Lưu mã giảm giá
      </Button>
    </form>
  )
}

export function QuanLyKhuyenMai() {
  const queryClient = useQueryClient()
  const danhSach = useQuery({ queryKey: KHOA, queryFn: layMaGiamGia })
  const [moForm, setMoForm] = useState(false)
  const [dangSua, setDangSua] = useState<MaGiamGia | null>(null)
  const xoa = useMutation({ mutationFn: xoaMaGiamGia, onSuccess: () => queryClient.invalidateQueries({ queryKey: KHOA }) })
  return (
    <div>
      <TieuDeQuanTri nhanPhu="Marketing" tieuDe="Khuyến mãi" moTa="Mã giảm giá theo phần trăm, có hạn dùng và có thể giới hạn số lượt.">
        <Button
          onClick={() => {
            setDangSua(null)
            setMoForm(true)
          }}
        >
          <Plus className="h-4 w-4" /> Thêm mã
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
            khoaDong={(m) => m.id}
            thongBaoTrong="Chưa có mã giảm giá nào."
            cot={[
              { tieuDe: 'Mã', hienThi: (m) => <span className="font-mono text-sm">{m.ma}</span> },
              { tieuDe: 'Giảm', hienThi: (m) => `${m.phanTram}%` },
              { tieuDe: 'Thời hạn', hienThi: (m) => `${formatNgay(m.ngayBatDau)} – ${formatNgay(m.ngayHetHan)}` },
              { tieuDe: 'Đã dùng', hienThi: (m) => (m.soLuotToiDa ? `${m.soLuotDaDung} / ${m.soLuotToiDa}` : m.soLuotDaDung) },
              {
                tieuDe: 'Trạng thái',
                hienThi: (m) => {
                  if (!m.kichHoat) return <Badge mau="xam">Đang tắt</Badge>
                  return new Date(m.ngayHetHan) < new Date() ? <Badge mau="coral">Hết hạn</Badge> : <Badge mau="kelp">Hoạt động</Badge>
                },
              },
              {
                tieuDe: 'Thao tác',
                hienThi: (m) => (
                  <span className="flex gap-2">
                    <Button
                      kieu="vien"
                      coNut="nho"
                      aria-label={`Sửa ${m.ma}`}
                      onClick={() => {
                        setDangSua(m)
                        setMoForm(true)
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button kieu="nguyHiem" coNut="nho" aria-label={`Xóa ${m.ma}`} disabled={xoa.isPending} onClick={() => xoa.mutate(m.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}
      <Modal mo={moForm} khiDoi={setMoForm} tieuDe={dangSua ? `Sửa ${dangSua.ma}` : 'Thêm mã giảm giá'}>
        <FormMa key={dangSua?.id ?? 'moi'} ban={dangSua} khiDong={() => setMoForm(false)} />
      </Modal>
    </div>
  )
}
