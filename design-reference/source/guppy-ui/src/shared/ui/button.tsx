import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua/60 cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary:
          'text-abyss bg-[linear-gradient(110deg,#67e8f9,#a5b4fc_45%,#f9a8d4)] shadow-[0_0_30px_-5px_rgba(34,211,238,.6)] hover:shadow-[0_0_45px_-2px_rgba(192,132,252,.8)] hover:-translate-y-0.5',
        glass: 'glass text-white hover:bg-white/15 hover:-translate-y-0.5',
        ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
        outline: 'border border-white/15 text-white hover:border-aqua/60 hover:text-aqua',
        danger: 'bg-coral/15 text-coral border border-coral/30 hover:bg-coral/25',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-13 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
