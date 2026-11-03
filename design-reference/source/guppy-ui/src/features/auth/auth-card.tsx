import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/cn'

function Field({ icon: I, ...p }: { icon: typeof Mail } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 transition focus-within:border-aqua/60 focus-within:shadow-[0_0_0_4px_rgba(34,211,238,.1)]">
      <I className="h-4 w-4 text-slate-400" />
      <input {...p} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" />
      {p.type === 'password' && <Eye className="h-4 w-4 cursor-pointer text-slate-500" />}
    </label>
  )
}

export function AuthCard() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  return (
    <div className="glass-strong w-full max-w-md rounded-[32px] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
      <div className="relative mb-8 grid grid-cols-2 rounded-full bg-white/5 p-1">
        {(['login', 'register'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('relative cursor-pointer rounded-full py-2.5 text-sm font-medium transition', tab === t ? 'text-abyss' : 'text-slate-400')}>
            {tab === t && <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,#67e8f9,#c4b5fd)]" />}
            <span className="relative">{t === 'login' ? 'Đăng nhập' : 'Đăng ký'}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.form key={tab} initial={{ opacity: 0, x: tab === 'login' ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: tab === 'login' ? 30 : -30 }}
          onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">{tab === 'login' ? 'Chào mừng trở lại 👋' : 'Tạo tài khoản mới'}</h2>
          <p className="pb-2 text-sm text-slate-400">{tab === 'login' ? 'Đăng nhập để lưu giỏ hàng, xem lịch sử đơn và đánh giá cá.' : 'Thành viên được lưu giỏ, theo dõi đơn và nhận ưu đãi dòng hiếm.'}</p>
          {tab === 'register' && <Field icon={User} placeholder="Họ và tên" />}
          {tab === 'register' && <Field icon={Phone} placeholder="Số điện thoại" />}
          <Field icon={Mail} placeholder={tab === 'login' ? 'Tên đăng nhập hoặc email' : 'Email'} />
          <Field icon={Lock} type="password" placeholder="Mật khẩu" />
          {tab === 'register' && <Field icon={Lock} type="password" placeholder="Nhập lại mật khẩu" />}
          {tab === 'login' && (
            <div className="flex justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-aqua" /> Ghi nhớ</label>
              <a className="cursor-pointer hover:text-aqua">Quên mật khẩu?</a>
            </div>
          )}
          <Button size="lg" className="mt-2 w-full">{tab === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Button>
          <p className="pt-2 text-center text-xs text-slate-500">Giỏ hàng khách vãng lai sẽ được gộp vào tài khoản sau khi đăng nhập.</p>
        </motion.form>
      </AnimatePresence>
    </div>
  )
}
