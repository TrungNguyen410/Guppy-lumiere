import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

const NEN_O_NHAP =
  'w-full rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-aqua/60 focus:bg-white/[.07] focus:shadow-[0_0_0_4px_rgb(34_211_238/0.12)]'

/** Có forwardRef để dùng được với register của React Hook Form. */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...conLai }, ref) {
  return <input ref={ref} className={cn(NEN_O_NHAP, className)} {...conLai} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...conLai }, ref) {
  return <textarea ref={ref} className={cn(NEN_O_NHAP, 'min-h-24 resize-none', className)} {...conLai} />
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, ...conLai }, ref) {
  return <select ref={ref} className={cn(NEN_O_NHAP, 'cursor-pointer', className)} {...conLai} />
})

interface TruongProps {
  nhan: ReactNode
  goiY?: string
  loi?: string
  className?: string
  children: ReactNode
}

/** Nhãn, gợi ý và thông báo lỗi của một ô nhập. */
export function Truong({ nhan, goiY, loi, className, children }: TruongProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300">
        {nhan}
        {goiY && <span className="font-normal text-slate-500">{goiY}</span>}
      </span>
      {children}
      {loi && <span className="mt-1 block text-xs text-coral">{loi}</span>}
    </label>
  )
}
