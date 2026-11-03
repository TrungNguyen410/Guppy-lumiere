import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  mo: boolean
  khiDoi: (mo: boolean) => void
  tieuDe: string
  children: ReactNode
}

/** Hộp thoại dựa trên Radix như shadcn/ui: có sẵn khóa focus và đóng bằng phím Esc. */
export function Modal({ mo, khiDoi, tieuDe, children }: Props) {
  return (
    <Dialog.Root open={mo} onOpenChange={khiDoi}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-abyss/80 backdrop-blur-md" />
        <Dialog.Content
          aria-describedby={undefined}
          className="glass-strong fixed top-1/2 left-1/2 z-[61] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[32px] p-8"
        >
          <Dialog.Title className="font-display text-xl font-semibold">{tieuDe}</Dialog.Title>
          <Dialog.Close
            aria-label="Đóng"
            className="absolute top-5 right-5 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>
          <div className="mt-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
