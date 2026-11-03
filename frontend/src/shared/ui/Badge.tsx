import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

const kieuNhan = cva('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', {
  variants: {
    mau: {
      aqua: 'border-aqua/30 bg-aqua/10 text-aqua',
      coral: 'border-coral/30 bg-coral/10 text-coral',
      sun: 'border-sun/30 bg-sun/10 text-sun',
      orchid: 'border-orchid/30 bg-orchid/10 text-orchid',
      kelp: 'border-kelp/30 bg-kelp/10 text-kelp',
      xam: 'border-white/10 bg-white/5 text-slate-300',
    },
  },
  defaultVariants: { mau: 'aqua' },
})

export type MauNhan = NonNullable<VariantProps<typeof kieuNhan>['mau']>

export function Badge({ className, mau, ...conLai }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof kieuNhan>) {
  return <span className={cn(kieuNhan({ mau }), className)} {...conLai} />
}
