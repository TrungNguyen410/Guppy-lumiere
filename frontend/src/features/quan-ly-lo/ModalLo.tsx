import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent, type ReactNode } from 'react'
import { ghiHaoHut, nhapDe, phanGioi, taoLoCa } from '@/entities/lo-ca/api'
import type { LoCa } from '@/entities/lo-ca/model'
import { layDanhSachSanPham } from '@/entities/san-pham/api'
import { Button } from '@/shared/ui/Button'
import { Input, Select, Truong } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'

export const KHOA_LO = ['lo-ca']
export type ThaoTacLo = { loai: 'nhap-de' | 'phan-gioi' | 'hao-hut'; lo: LoCa }

function useLuuLo<T>(ham: (d: T) => Promise<unknown>, khiDong: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ham,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: KHOA_LO })
      await queryClient.invalidateQueries({ queryKey: ['san-pham'] })
      khiDong()
    },
  })
}

function OSo({ nhan, giaTri, khiDoi, toiDa }: { nhan: string; giaTri: number; khiDoi: (v: number) => void; toiDa?: number }) {
  return (
    <Truong nhan={nhan} goiY={toiDa !== undefined ? `còn ${toiDa}` : undefined}>
      <Input type="number" min={0} max={toiDa} value={giaTri} onChange={(su) => khiDoi(Math.max(0, Number(su.target.value) || 0))} />
    </Truong>
  )
}

function KhungForm({ onSubmit, loi, dangLuu, nhanNut, children }: { onSubmit: () => void; loi: unknown; dangLuu: boolean; nhanNut: string; children: ReactNode }) {
  return (
    <form
      className="space-y-4"
      onSubmit={(su: FormEvent) => {
        su.preventDefault()
        onSubmit()
      }}
    >
      {children}
      <LoiThaoTac loi={loi} />
      <Button type="submit" className="w-full" disabled={dangLuu}>
        {dangLuu ? 'Đang lưu…' : nhanNut}
      </Button>
    </form>
  )
}

function FormNhapDe({ lo, khiDong }: { lo: LoCa; khiDong: () => void }) {
  const [soCaBot, setSoCaBot] = useState(0)
  const [ghiChu, setGhiChu] = useState('')
  const luu = useLuuLo(() => nhapDe(lo.id, { soCaBot, ghiChu: ghiChu || undefined }), khiDong)
  return (
    <KhungForm onSubmit={() => luu.mutate(undefined)} loi={luu.error} dangLuu={luu.isPending} nhanNut="Nhập cá bột">
      <OSo nhan="Số cá bột mới" giaTri={soCaBot} khiDoi={setSoCaBot} />
      <Truong nhan="Ghi chú" goiY="không bắt buộc">
        <Input value={ghiChu} maxLength={255} onChange={(su) => setGhiChu(su.target.value)} placeholder="Lứa 1 của cặp bố mẹ" />
      </Truong>
    </KhungForm>
  )
}

function FormPhanGioi({ lo, khiDong }: { lo: LoCa; khiDong: () => void }) {
  const [soDuc, setSoDuc] = useState(0)
  const [soCai, setSoCai] = useState(0)
  const [ghiChu, setGhiChu] = useState('')
  const luu = useLuuLo(() => phanGioi(lo.id, { soDuc, soCai, ghiChu: ghiChu || undefined }), khiDong)
  return (
    <KhungForm onSubmit={() => luu.mutate(undefined)} loi={luu.error} dangLuu={luu.isPending} nhanNut="Phân giới">
      <p className="text-sm text-slate-400">Lô đang có {lo.soCaBot} cá bột.</p>
      <div className="grid grid-cols-2 gap-3">
        <OSo nhan="Thành đực" giaTri={soDuc} khiDoi={setSoDuc} />
        <OSo nhan="Thành cái" giaTri={soCai} khiDoi={setSoCai} />
      </div>
      <Truong nhan="Ghi chú" goiY="không bắt buộc">
        <Input value={ghiChu} maxLength={255} onChange={(su) => setGhiChu(su.target.value)} placeholder="Cá 9 tuần tuổi" />
      </Truong>
    </KhungForm>
  )
}

function FormHaoHut({ lo, khiDong }: { lo: LoCa; khiDong: () => void }) {
  const [soDuc, setSoDuc] = useState(0)
  const [soCai, setSoCai] = useState(0)
  const [soCaBot, setSoCaBot] = useState(0)
  const [ghiChu, setGhiChu] = useState('')
  const luu = useLuuLo(() => ghiHaoHut(lo.id, { soDuc, soCai, soCaBot, ghiChu: ghiChu || undefined }), khiDong)
  return (
    <KhungForm onSubmit={() => luu.mutate(undefined)} loi={luu.error} dangLuu={luu.isPending} nhanNut="Ghi nhận hao hụt">
      <div className="grid grid-cols-3 gap-3">
        <OSo nhan="Đực" giaTri={soDuc} khiDoi={setSoDuc} toiDa={lo.soDuc} />
        <OSo nhan="Cái" giaTri={soCai} khiDoi={setSoCai} toiDa={lo.soCai} />
        <OSo nhan="Cá bột" giaTri={soCaBot} khiDoi={setSoCaBot} toiDa={lo.soCaBot} />
      </div>
      <Truong nhan="Nguyên nhân" goiY="không bắt buộc">
        <Input value={ghiChu} maxLength={255} onChange={(su) => setGhiChu(su.target.value)} placeholder="Nhiệt độ giảm đêm" />
      </Truong>
    </KhungForm>
  )
}

const TIEU_DE: Record<ThaoTacLo['loai'], string> = { 'nhap-de': 'Nhập đẻ', 'phan-gioi': 'Phân giới', 'hao-hut': 'Ghi hao hụt' }

export function ModalThaoTacLo({ thaoTac, khiDong }: { thaoTac: ThaoTacLo | null; khiDong: () => void }) {
  return (
    <Modal mo={thaoTac !== null} khiDoi={(mo) => !mo && khiDong()} tieuDe={thaoTac ? `${TIEU_DE[thaoTac.loai]} · ${thaoTac.lo.maLo}` : ''}>
      {thaoTac?.loai === 'nhap-de' && <FormNhapDe lo={thaoTac.lo} khiDong={khiDong} />}
      {thaoTac?.loai === 'phan-gioi' && <FormPhanGioi lo={thaoTac.lo} khiDong={khiDong} />}
      {thaoTac?.loai === 'hao-hut' && <FormHaoHut lo={thaoTac.lo} khiDong={khiDong} />}
    </Modal>
  )
}

export function ModalTaoLo({ mo, khiDong }: { mo: boolean; khiDong: () => void }) {
  const [maLo, setMaLo] = useState('')
  const [caGuppyId, setCaGuppyId] = useState('')
  const [boMe, setBoMe] = useState('')
  const [beNuoi, setBeNuoi] = useState('')
  const [ngayNo, setNgayNo] = useState('')
  const [soDuc, setSoDuc] = useState(0)
  const [soCai, setSoCai] = useState(0)
  const [soCaBot, setSoCaBot] = useState(0)
  const sanPham = useQuery({ queryKey: ['san-pham', 'chon-lo'], queryFn: () => layDanhSachSanPham({ loai: 'CA_GUPPY', kichThuoc: 100 }), enabled: mo })
  const luu = useLuuLo(() => taoLoCa({ maLo: maLo.trim(), caGuppyId: Number(caGuppyId), boMe: boMe || undefined, beNuoi: beNuoi.trim(), ngayNo, soDuc, soCai, soCaBot }), khiDong)
  return (
    <Modal mo={mo} khiDoi={(m) => !m && khiDong()} tieuDe="Tạo lô mới">
      <KhungForm onSubmit={() => luu.mutate(undefined)} loi={luu.error} dangLuu={luu.isPending} nhanNut="Tạo lô">
        <Truong nhan="Sản phẩm cá *">
          <Select required value={caGuppyId} onChange={(su) => setCaGuppyId(su.target.value)}>
            <option value="">Chọn sản phẩm</option>
            {sanPham.data?.noiDung.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.ten}
              </option>
            ))}
          </Select>
        </Truong>
        <div className="grid grid-cols-2 gap-3">
          <Truong nhan="Mã lô *">
            <Input required pattern="[A-Za-z0-9\-]{1,30}" title="Chỉ gồm chữ, số và dấu gạch ngang" value={maLo} onChange={(su) => setMaLo(su.target.value)} placeholder="LO-2411-FG3" />
          </Truong>
          <Truong nhan="Bể nuôi *">
            <Input required maxLength={40} value={beNuoi} onChange={(su) => setBeNuoi(su.target.value)} placeholder="Bể A1" />
          </Truong>
          <Truong nhan="Bố mẹ">
            <Input maxLength={60} value={boMe} onChange={(su) => setBoMe(su.target.value)} placeholder="FG-A3 × FG-B1" />
          </Truong>
          <Truong nhan="Ngày nở *">
            <Input required type="date" value={ngayNo} onChange={(su) => setNgayNo(su.target.value)} />
          </Truong>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <OSo nhan="Đực" giaTri={soDuc} khiDoi={setSoDuc} />
          <OSo nhan="Cái" giaTri={soCai} khiDoi={setSoCai} />
          <OSo nhan="Cá bột" giaTri={soCaBot} khiDoi={setSoCaBot} />
        </div>
      </KhungForm>
    </Modal>
  )
}
