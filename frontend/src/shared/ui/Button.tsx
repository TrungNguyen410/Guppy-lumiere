import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

const kieuNut = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 select-none focus-visible:ring-2 focus-visible:ring-aqua/60 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      kieu: {
        chinh:
          'bg-[linear-gradient(110deg,#67e8f9,#a5b4fc_45%,#f9a8d4)] text-abyss shadow-[0_0_30px_-5px_rgb(34_211_238/0.6)] hover:-translate-y-0.5 hover:shadow-[0_0_45px_-2px_rgb(192_132_252/0.8)]',
        kinh: 'glass text-white hover:-translate-y-0.5 hover:bg-white/15',
        vien: 'border border-white/15 text-white hover:border-aqua/60 hover:text-aqua',
        nguyHiem: 'border border-coral/30 bg-coral/15 text-coral hover:bg-coral/25',
      },
      coNut: {
        nho: 'h-8 px-3 text-xs',
        vua: 'h-10 px-5 text-sm',
        lon: 'h-13 px-8 text-base',
      },
    },
    defaultVariants: { kieu: 'chinh', coNut: 'vua' },
  },
)

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof kieuNut>

export function Button({ className, kieu, coNut, type = 'button', ...conLai }: Props) {
  return <button type={type} className={cn(kieuNut({ kieu, coNut }), className)} {...conLai} />
}
