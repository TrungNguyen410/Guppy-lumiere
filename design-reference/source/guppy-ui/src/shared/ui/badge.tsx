import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium border', {
  variants: {
    tone: {
      aqua: 'bg-aqua/10 text-aqua border-aqua/30',
      coral: 'bg-coral/10 text-coral border-coral/30',
      sun: 'bg-sun/10 text-sun border-sun/30',
      orchid: 'bg-orchid/10 text-orchid border-orchid/30',
      kelp: 'bg-kelp/10 text-kelp border-kelp/30',
      slate: 'bg-white/5 text-slate-300 border-white/10',
    },
  },
  defaultVariants: { tone: 'aqua' },
})

export function Badge({ className, tone, ...p }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...p} />
}
