import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

const base =
  'w-full rounded-2xl bg-white/[.04] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-aqua/60 focus:bg-white/[.07] focus:shadow-[0_0_0_4px_rgba(34,211,238,.12)]'

export function Input({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...p} />
}
export function Textarea({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, 'min-h-24 resize-none', className)} {...p} />
}
export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300">
      {children}
      {hint && <span className="text-slate-500 font-normal">{hint}</span>}
    </span>
  )
}
