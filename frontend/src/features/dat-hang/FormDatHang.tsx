import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Banknote, Check, Landmark, Tag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { datHang, kiemTraMaGiamGia } from '@/entities/don-hang/api'
import type { DonHang, KetQuaApMa, PhuongThucThanhToan } from '@/entities/don-hang/model'
import { layHoSo, laySoDiaChi } from '@/entities/nguoi-dung/api'
import { THANH_PHO_GIAO } from '@/entities/nguoi-dung/model'
import { usePhienStore } from '@/entities/nguoi-dung/phien'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Input, Textarea, Truong } from '@/shared/ui/Input'
import { LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'

const luocDo = z.object({
  hoTen: z.string().trim().min(1, 'Vui lòng nhập họ tên').max(120),
  soDienThoai: z.string().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 số, bắt đầu bằng 0'),
  diaChi: z.string().trim().min(1, 'Vui lòng nhập địa chỉ').max(255),
  thanhPho: z.enum(THANH_PHO_GIAO),
  ghiChu: z.string().max(500).optional(),
  phuongThuc: z.enum(['COD', 'CHUYEN_KHOAN']),
})

type DuLieu = z.infer<typeof luocDo>

const CAC_PHUONG_THUC: { ma: PhuongThucThanhToan; icon: typeof Banknote; ten: string; moTa: string }[] = [
  { ma: 'COD', icon: Banknote, ten: 'Thanh toán khi nhận (COD)', moTa: 'Kiểm tra cá còn khỏe rồi mới trả tiền' },
  { ma: 'CHUYEN_KHOAN', icon: Landmark, ten: 'Chuyển khoản ngân hàng', moTa: 'Quét mã QR, nhân viên xác nhận khi nhận được tiền' },
]

interface Props {
  tamTinh: number
  coTheDat: boolean
  khiApMa: (ketQua: KetQuaApMa | null) => void
  khiThanhCong: (don: DonHang) => void
}

export function FormDatHang({ tamTinh, coTheDat, khiApMa, khiThanhCong }: Props) {
  const laThanhVien = usePhienStore((s) => s.phien?.vaiTro === 'KHACH_HANG')
  const queryClient = useQueryClient()
  const [maNhap, setMaNhap] = useState('')
  const [maDaAp, setMaDaAp] = useState<KetQuaApMa | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DuLieu>({
    resolver: zodResolver(luocDo),
    defaultValues: { hoTen: '', soDienThoai: '', diaChi: '', thanhPho: THANH_PHO_GIAO[0], ghiChu: '', phuongThuc: 'COD' },
  })
  const thanhPho = watch('thanhPho')
  const phuongThuc = watch('phuongThuc')

  // Thành viên được điền sẵn từ địa chỉ mặc định hoặc hồ sơ
  const hoSo = useQuery({ queryKey: ['ho-so'], queryFn: layHoSo, enabled: laThanhVien })
  const soDiaChi = useQuery({ queryKey: ['dia-chi'], queryFn: laySoDiaChi, enabled: laThanhVien })
  useEffect(() => {
    if (!hoSo.data || !soDiaChi.data) return
    const macDinh = soDiaChi.data.find((d) => d.macDinh)
    reset((cu) => ({
      ...cu,
      hoTen: macDinh?.hoTenNhan ?? hoSo.data.hoTen,
      soDienThoai: macDinh?.soDienThoai ?? hoSo.data.soDienThoai ?? '',
      diaChi: macDinh?.diaChi ?? '',
      thanhPho: (macDinh?.thanhPho as DuLieu['thanhPho'] | undefined) ?? cu.thanhPho,
    }))
  }, [hoSo.data, soDiaChi.data, reset])

  const apMa = useMutation({
    mutationFn: () => kiemTraMaGiamGia(maNhap.trim(), tamTinh),
    onSuccess: (ketQua) => {
      setMaDaAp(ketQua)
      khiApMa(ketQua)
    },
  })

  // Giỏ đổi thì số tiền giảm cũ không còn đúng, tính lại theo tạm tính mới
  useEffect(() => {
    if (!maDaAp) return
    kiemTraMaGiamGia(maDaAp.ma, tamTinh).then(khiApMa).catch(() => boMa())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tamTinh])

  function boMa() {
    setMaDaAp(null)
    setMaNhap('')
    khiApMa(null)
    apMa.reset()
  }

  const dat = useMutation({
    mutationFn: (d: DuLieu) => datHang({ ...d, ghiChu: d.ghiChu || undefined, maGiamGia: maDaAp?.ma }),
    onSuccess: async (don) => {
      await queryClient.invalidateQueries({ queryKey: ['gio-hang'] })
      khiThanhCong(don)
    },
  })

  return (
    <form onSubmit={handleSubmit((d) => dat.mutate(d))} className="space-y-6" noValidate>
      <div className="glass rounded-[28px] p-6">
        <p className="mb-5 flex items-center gap-3 font-display text-lg font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-aqua/15 text-sm text-aqua">1</span> Thông tin nhận cá
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Truong nhan="Họ và tên *" loi={errors.hoTen?.message}>
            <Input placeholder="Nguyễn Văn A" autoComplete="name" {...register('hoTen')} />
          </Truong>
          <Truong nhan="Số điện thoại *" goiY="dùng để tra cứu đơn" loi={errors.soDienThoai?.message}>
            <Input placeholder="09xx xxx xxx" autoComplete="tel" {...register('soDienThoai')} />
          </Truong>
          <Truong nhan="Địa chỉ *" className="md:col-span-2" loi={errors.diaChi?.message}>
            <Input placeholder="Số nhà, đường, phường/xã, quận/huyện" autoComplete="street-address" {...register('diaChi')} />
          </Truong>
          <div className="md:col-span-2">
            <p className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300">
              Tỉnh / Thành phố *<span className="font-normal text-slate-500">cá sống chỉ giao hỏa tốc 3 thành phố</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {THANH_PHO_GIAO.map((tp) => (
                <button
                  type="button"
                  key={tp}
                  aria-pressed={thanhPho === tp}
                  onClick={() => setValue('thanhPho', tp)}
                  className={cn('cursor-pointer rounded-2xl border px-3 py-3 text-sm transition', thanhPho === tp ? 'border-aqua/60 bg-aqua/10 text-white' : 'border-white/10 text-slate-400 hover:border-white/25')}
                >
                  {tp}
                </button>
              ))}
            </div>
          </div>
          <Truong nhan="Ghi chú" goiY="không bắt buộc" className="md:col-span-2" loi={errors.ghiChu?.message}>
            <Textarea placeholder="Giao giờ hành chính, gọi trước 15 phút…" {...register('ghiChu')} />
          </Truong>
        </div>
      </div>

      <div className="glass rounded-[28px] p-6">
        <p className="mb-5 flex items-center gap-3 font-display text-lg font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-aqua/15 text-sm text-aqua">2</span> Phương thức thanh toán
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {CAC_PHUONG_THUC.map(({ ma, icon: Icon, ten, moTa }) => (
            <button
              type="button"
              key={ma}
              aria-pressed={phuongThuc === ma}
              onClick={() => setValue('phuongThuc', ma)}
              className={cn('relative flex cursor-pointer items-start gap-4 rounded-2xl border p-4 text-left transition', phuongThuc === ma ? 'border-transparent bg-white/[.05]' : 'border-white/10 hover:border-white/25')}
            >
              {phuongThuc === ma && <motion.span layoutId="vien-thanh-toan" className="border-iridescent absolute inset-0 rounded-2xl" />}
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5">
                <Icon className="h-5 w-5 text-aqua" />
              </span>
              <span className="relative">
                <span className="block text-sm font-semibold">{ten}</span>
                <span className="text-xs text-slate-400">{moTa}</span>
              </span>
              {phuongThuc === ma && <Check className="relative ml-auto h-5 w-5 shrink-0 text-aqua" />}
            </button>
          ))}
        </div>
        {phuongThuc === 'CHUYEN_KHOAN' && <p className="mt-3 text-xs text-slate-400">Mã QR và nội dung chuyển khoản hiện ngay sau khi đặt hàng, kèm mã đơn của bạn.</p>}
      </div>

      <div className="glass rounded-[28px] p-6">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Tag className="h-4 w-4 text-aqua" /> Mã giảm giá
        </p>
        {maDaAp ? (
          <p className="flex items-center justify-between rounded-2xl border border-kelp/30 bg-kelp/10 px-4 py-3 text-sm text-kelp">
            <span>
              Đã áp mã <b>{maDaAp.ma}</b> (giảm {maDaAp.phanTram}%)
            </span>
            <button type="button" aria-label="Bỏ mã giảm giá" onClick={boMa} className="cursor-pointer hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </p>
        ) : (
          <div className="flex gap-2">
            <Input aria-label="Mã giảm giá" value={maNhap} onChange={(su) => setMaNhap(su.target.value)} placeholder="Nhập mã nếu có" className="uppercase placeholder:normal-case" />
            <Button kieu="vien" disabled={!maNhap.trim() || apMa.isPending || tamTinh === 0} onClick={() => apMa.mutate()} className="h-auto shrink-0">
              Áp dụng
            </Button>
          </div>
        )}
        {apMa.error && <p className="mt-2 text-xs text-coral">{apMa.error.message}</p>}
      </div>

      <LoiThaoTac loi={dat.error} />
      <Button type="submit" coNut="lon" className="w-full" disabled={dat.isPending || !coTheDat}>
        {dat.isPending ? 'Đang đặt hàng…' : 'Đặt hàng ngay'}
      </Button>
    </form>
  )
}
