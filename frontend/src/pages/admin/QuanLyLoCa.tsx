import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Baby, Droplet, Plus, Skull, Split } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { layDanhSachLoCa, layNhatKyKho } from '@/entities/lo-ca/api'
import { moTaBienDong, THONG_TIN_BIEN_DONG, THONG_TIN_GIAI_DOAN, type LoCa } from '@/entities/lo-ca/model'
import { KHOA_LO, ModalTaoLo, ModalThaoTacLo, type ThaoTacLo } from '@/features/quan-ly-lo/ModalLo'
import { formatNgay, formatNgayGio } from '@/shared/lib/formatNgay'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Table } from '@/shared/ui/Table'
import { TieuDeQuanTri } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai, Trong } from '@/shared/ui/TrangThaiDuLieu'

function TheLoCa({ lo, thuTu, khiThaoTac }: { lo: LoCa; thuTu: number; khiThaoTac: (t: ThaoTacLo) => void }) {
  const cacPhan = [
    { nhan: 'Đực', so: lo.soDuc, mau: '#22d3ee' },
    { nhan: 'Cái', so: lo.soCai, mau: '#f472b6' },
    { nhan: 'Cá bột', so: lo.soCaBot, mau: '#fbbf24' },
  ]
  const giaiDoan = THONG_TIN_GIAI_DOAN[lo.giaiDoan]
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: thuTu * 0.05 }} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.03] p-5 transition hover:border-aqua/30">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-slate-400">{lo.maLo}</p>
          <p className="mt-1 font-display text-lg font-semibold">{lo.tenDong}</p>
          <p className="text-xs text-slate-500">
            {lo.boMe ? `Bố mẹ ${lo.boMe} · ` : ''}nở {formatNgay(lo.ngayNo)}
          </p>
        </div>
        <Badge mau={giaiDoan.mau}>{giaiDoan.nhan}</Badge>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <p className="font-display text-4xl font-semibold">
          {lo.tongCa}
          <span className="ml-1 text-sm font-normal text-slate-400">con</span>
        </p>
        <p className="flex items-center gap-1 text-xs text-slate-400">
          <Droplet className="h-3 w-3 text-aqua" />
          {lo.beNuoi}
        </p>
      </div>
      <div className="mt-3 flex h-2.5 gap-[2px] overflow-hidden rounded-full bg-white/5">
        {cacPhan
          .filter((p) => p.so > 0)
          .map((p) => (
            <motion.div key={p.nhan} title={`${p.nhan}: ${p.so}`} initial={{ width: 0 }} animate={{ width: `${(p.so / lo.tongCa) * 100}%` }} transition={{ duration: 0.9, delay: 0.3 }} style={{ background: p.mau }} />
          ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
        {cacPhan.map((p) => (
          <span key={p.nhan} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.mau }} />
            {p.nhan} <b className="text-slate-200">{p.so}</b>
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1 text-coral" title="Tổng số cá đã chết">
          <Skull className="h-3 w-3" />
          {lo.haoHut}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Button kieu="vien" coNut="nho" onClick={() => khiThaoTac({ loai: 'nhap-de', lo })}>
          <Baby className="h-3.5 w-3.5" /> Nhập đẻ
        </Button>
        <Button kieu="vien" coNut="nho" disabled={lo.soCaBot === 0} onClick={() => khiThaoTac({ loai: 'phan-gioi', lo })}>
          <Split className="h-3.5 w-3.5" /> Phân giới
        </Button>
        <Button kieu="vien" coNut="nho" disabled={lo.tongCa === 0} onClick={() => khiThaoTac({ loai: 'hao-hut', lo })}>
          <Skull className="h-3.5 w-3.5" /> Hao hụt
        </Button>
      </div>
    </motion.article>
  )
}

export function QuanLyLoCa() {
  const [thamSo] = useSearchParams()
  const tuKhoa = thamSo.get('tuKhoa') ?? ''
  const cacLo = useQuery({ queryKey: [...KHOA_LO, tuKhoa], queryFn: () => layDanhSachLoCa(tuKhoa) })
  const nhatKy = useQuery({ queryKey: [...KHOA_LO, 'nhat-ky'], queryFn: () => layNhatKyKho() })
  const [thaoTac, setThaoTac] = useState<ThaoTacLo | null>(null)
  const [moTao, setMoTao] = useState(false)
  return (
    <div>
      <TieuDeQuanTri nhanPhu="Kho cá sống" tieuDe="Lô cá nuôi" moTa={tuKhoa ? `Kết quả tìm kiếm cho "${tuKhoa}".` : 'Tồn kho nằm ở lô: nhập cá đẻ, phân đực/cái khi cá lớn, ghi hao hụt khi cá chết.'}>
        <Button onClick={() => setMoTao(true)}>
          <Plus className="h-4 w-4" /> Tạo lô mới
        </Button>
      </TieuDeQuanTri>
      {cacLo.isPending && <DangTai />}
      {cacLo.isError && <BaoLoi loi={cacLo.error} thuLai={() => cacLo.refetch()} />}
      {cacLo.data?.length === 0 && <Trong noiDung="Không có lô cá nào." />}
      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {cacLo.data?.map((lo, i) => (
          <TheLoCa key={lo.id} lo={lo} thuTu={i} khiThaoTac={setThaoTac} />
        ))}
      </div>
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[.03] p-6">
        <p className="mb-4 font-display font-semibold">Nhật ký biến động kho</p>
        {nhatKy.isError && <BaoLoi loi={nhatKy.error} thuLai={() => nhatKy.refetch()} />}
        {nhatKy.data && (
          <Table
            dong={nhatKy.data.noiDung}
            khoaDong={(b) => b.id}
            cot={[
              { tieuDe: 'Thời gian', hienThi: (b) => <span className="text-xs text-slate-500">{formatNgayGio(b.thoiGian)}</span> },
              { tieuDe: 'Lô', hienThi: (b) => <span className="font-mono text-xs">{b.maLo}</span> },
              { tieuDe: 'Loại', hienThi: (b) => <Badge mau={THONG_TIN_BIEN_DONG[b.loai].mau}>{THONG_TIN_BIEN_DONG[b.loai].nhan}</Badge> },
              { tieuDe: 'Số lượng', hienThi: moTaBienDong },
              { tieuDe: 'Ghi chú', hienThi: (b) => <span className="text-slate-400">{b.ghiChu ?? '—'}</span> },
            ]}
          />
        )}
      </div>
      <ModalThaoTacLo key={thaoTac ? `${thaoTac.loai}-${thaoTac.lo.id}` : 'dong'} thaoTac={thaoTac} khiDong={() => setThaoTac(null)} />
      {moTao && <ModalTaoLo mo={moTao} khiDong={() => setMoTao(false)} />}
    </div>
  )
}
