import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { gopGioSauDangNhap } from '@/entities/gio-hang/api'
import { dangKy, dangNhap } from '@/entities/nguoi-dung/api'
import { laNhanSu, type PhienDangNhap } from '@/entities/nguoi-dung/model'
import { usePhienStore } from '@/entities/nguoi-dung/phien'
import { cn } from '@/shared/lib/cn'
import { DUONG_DAN } from '@/shared/lib/duongDan'
import { Button } from '@/shared/ui/Button'
import { LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'

const luocDoDangNhap = z.object({
  tenDangNhap: z.string().trim().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
  matKhau: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  ghiNho: z.boolean(),
})

const luocDoDangKy = z
  .object({
    hoTen: z.string().trim().min(1, 'Vui lòng nhập họ tên').max(120),
    soDienThoai: z.string().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 số, bắt đầu bằng 0'),
    email: z.email('Email không hợp lệ'),
    matKhau: z.string().min(8, 'Mật khẩu từ 8 ký tự').max(72).regex(/^[\x20-\x7E]*$/, 'Mật khẩu không dùng ký tự có dấu'),
    nhapLai: z.string(),
  })
  .refine((d) => d.matKhau === d.nhapLai, { message: 'Mật khẩu nhập lại không khớp', path: ['nhapLai'] })

type DuLieuDangNhap = z.infer<typeof luocDoDangNhap>
type DuLieuDangKy = z.infer<typeof luocDoDangKy>

interface OProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: typeof Mail
  loi?: string
}

const ONhap = forwardRef<HTMLInputElement, OProps>(function ONhap({ icon: Icon, loi, type, ...conLai }, ref) {
  const [hienMatKhau, setHienMatKhau] = useState(false)
  const laMatKhau = type === 'password'
  return (
    <div>
      <label className={cn('flex items-center gap-3 rounded-2xl border bg-white/[.03] px-4 py-3 transition focus-within:border-aqua/60 focus-within:shadow-[0_0_0_4px_rgb(34_211_238/0.1)]', loi ? 'border-coral/50' : 'border-white/10')}>
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
        <input ref={ref} type={laMatKhau && hienMatKhau ? 'text' : type} aria-invalid={Boolean(loi)} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" {...conLai} />
        {laMatKhau && (
          <button type="button" aria-label={hienMatKhau ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setHienMatKhau((h) => !h)} className="cursor-pointer text-slate-500 hover:text-white">
            {hienMatKhau ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </label>
      {loi && <p className="mt-1 text-xs text-coral">{loi}</p>}
    </div>
  )
})

/** Sau khi có phiên: gộp giỏ của khách và chuyển về trang phù hợp với vai trò. */
function useHoanTatPhien() {
  const dangNhapStore = usePhienStore((s) => s.dangNhap)
  const queryClient = useQueryClient()
  const dieuHuong = useNavigate()
  const viTri = useLocation()
  return async (phien: PhienDangNhap, ghiNho: boolean) => {
    dangNhapStore(phien, ghiNho)
    if (phien.vaiTro === 'KHACH_HANG') {
      // Gộp lỗi không được cản đăng nhập: giỏ session vẫn còn và khách có thể đặt lại
      await gopGioSauDangNhap().catch(() => undefined)
    }
    await queryClient.invalidateQueries({ queryKey: ['gio-hang'] })
    const quayVe = (viTri.state as { tu?: string } | null)?.tu
    dieuHuong(laNhanSu(phien.vaiTro) ? DUONG_DAN.quanTri : (quayVe ?? DUONG_DAN.taiKhoan), { replace: true })
  }
}

function FormDangNhap() {
  const hoanTat = useHoanTatPhien()
  const [thongBaoQuen, setThongBaoQuen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DuLieuDangNhap>({ resolver: zodResolver(luocDoDangNhap), defaultValues: { tenDangNhap: '', matKhau: '', ghiNho: false } })
  const thaoTac = useMutation({
    mutationFn: async (d: DuLieuDangNhap) => hoanTat(await dangNhap(d.tenDangNhap, d.matKhau), d.ghiNho),
  })
  return (
    <form onSubmit={handleSubmit((d) => thaoTac.mutate(d))} className="space-y-3" noValidate>
      <h2 className="font-display text-2xl font-semibold">Chào mừng trở lại 👋</h2>
      <p className="pb-2 text-sm text-slate-400">Đăng nhập để lưu giỏ hàng, xem lịch sử đơn và đánh giá cá.</p>
      <ONhap icon={Mail} placeholder="Email hoặc số điện thoại" autoComplete="username" loi={errors.tenDangNhap?.message} {...register('tenDangNhap')} />
      <ONhap icon={Lock} type="password" placeholder="Mật khẩu" autoComplete="current-password" loi={errors.matKhau?.message} {...register('matKhau')} />
      <div className="flex justify-between text-xs text-slate-400">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-aqua" {...register('ghiNho')} /> Ghi nhớ
        </label>
        <button type="button" onClick={() => setThongBaoQuen(true)} className="cursor-pointer hover:text-aqua">
          Quên mật khẩu?
        </button>
      </div>
      {thongBaoQuen && <p className="text-xs text-sun">Vui lòng gọi cửa hàng theo số 0909 000 777 để được cấp lại mật khẩu.</p>}
      <LoiThaoTac loi={thaoTac.error} />
      <Button type="submit" coNut="lon" className="mt-2 w-full" disabled={thaoTac.isPending}>
        {thaoTac.isPending ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </Button>
      <p className="pt-2 text-center text-xs text-slate-500">Giỏ hàng khách vãng lai sẽ được gộp vào tài khoản sau khi đăng nhập.</p>
    </form>
  )
}

function FormDangKy() {
  const hoanTat = useHoanTatPhien()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DuLieuDangKy>({ resolver: zodResolver(luocDoDangKy) })
  const thaoTac = useMutation({
    mutationFn: async ({ nhapLai: _nhapLai, ...d }: DuLieuDangKy) => hoanTat(await dangKy(d), true),
  })
  return (
    <form onSubmit={handleSubmit((d) => thaoTac.mutate(d))} className="space-y-3" noValidate>
      <h2 className="font-display text-2xl font-semibold">Tạo tài khoản mới</h2>
      <p className="pb-2 text-sm text-slate-400">Thành viên được lưu giỏ, theo dõi đơn, đánh giá và bảo hành cá trong 24h.</p>
      <ONhap icon={User} placeholder="Họ và tên" autoComplete="name" loi={errors.hoTen?.message} {...register('hoTen')} />
      <ONhap icon={Phone} placeholder="Số điện thoại" autoComplete="tel" loi={errors.soDienThoai?.message} {...register('soDienThoai')} />
      <ONhap icon={Mail} placeholder="Email" autoComplete="email" loi={errors.email?.message} {...register('email')} />
      <ONhap icon={Lock} type="password" placeholder="Mật khẩu" autoComplete="new-password" loi={errors.matKhau?.message} {...register('matKhau')} />
      <ONhap icon={Lock} type="password" placeholder="Nhập lại mật khẩu" autoComplete="new-password" loi={errors.nhapLai?.message} {...register('nhapLai')} />
      <LoiThaoTac loi={thaoTac.error} />
      <Button type="submit" coNut="lon" className="mt-2 w-full" disabled={thaoTac.isPending}>
        {thaoTac.isPending ? 'Đang tạo tài khoản…' : 'Đăng ký'}
      </Button>
    </form>
  )
}

/** Giữ giao diện hai tab của thiết kế; mỗi tab là một đường dẫn riêng để khớp hai trang của đề bài. */
export function TheXacThuc({ tab }: { tab: 'dang-nhap' | 'dang-ky' }) {
  const viTri = useLocation()
  const cacTab = [
    { ma: 'dang-nhap', nhan: 'Đăng nhập', den: DUONG_DAN.dangNhap },
    { ma: 'dang-ky', nhan: 'Đăng ký', den: DUONG_DAN.dangKy },
  ] as const
  return (
    <div className="glass-strong w-full max-w-md rounded-[32px] p-8 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]">
      <div className="relative mb-8 grid grid-cols-2 rounded-full bg-white/5 p-1">
        {cacTab.map((t) => (
          <Link key={t.ma} to={t.den} state={viTri.state} replace className={cn('relative rounded-full py-2.5 text-center text-sm font-medium transition', tab === t.ma ? 'text-abyss' : 'text-slate-400')}>
            {tab === t.ma && <motion.span layoutId="tab-xac-thuc" className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,#67e8f9,#c4b5fd)]" />}
            <span className="relative">{t.nhan}</span>
          </Link>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: tab === 'dang-nhap' ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
          {tab === 'dang-nhap' ? <FormDangNhap /> : <FormDangKy />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
