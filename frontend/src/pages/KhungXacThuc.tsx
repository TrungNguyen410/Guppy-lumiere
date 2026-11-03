import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { BANG_MAU_BE_CA, type KieuDuoi } from '@/entities/san-pham/model'
import { CaSvg } from '@/entities/san-pham/ui/CaSvg'
import { BotKhi } from '@/shared/ui/BotKhi'

const CAC_DUOI: KieuDuoi[] = ['DELTA', 'VOAN', 'TRON', 'DAN', 'THUONG', 'KIEM_DOI']
const CAC_CA = BANG_MAU_BE_CA.slice(0, CAC_DUOI.length)

/** Bố cục chung của Đăng nhập và Đăng ký: vòng cá quay bên trái, thẻ biểu mẫu bên phải. */
export function KhungXacThuc({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pt-28 lg:grid-cols-2">
      <BotKhi soLuong={16} />
      <div className="relative hidden aspect-square lg:block" style={{ perspective: 1200 }}>
        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.25),rgb(192_132_252/0.12)_50%,transparent_70%)] blur-xl" />
        <div className="absolute inset-[30%] grid place-items-center rounded-full border border-white/10 bg-white/[.03] backdrop-blur-xl">
          <div className="text-center">
            <p className="text-iridescent font-display text-5xl font-semibold">Guppy</p>
            <p className="mt-1 text-xs tracking-[.4em] text-slate-400 uppercase">Lumière Club</p>
          </div>
        </div>
        <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute inset-0" style={{ rotateX: 58, transformStyle: 'preserve-3d' }}>
          {CAC_CA.map((mau, i) => {
            const goc = (i / CAC_CA.length) * Math.PI * 2
            return (
              <div key={mau.than} className="absolute w-28" style={{ left: `${50 + Math.cos(goc) * 42}%`, top: `${50 + Math.sin(goc) * 42}%`, transform: `translate(-50%,-50%) rotate(${(goc * 180) / Math.PI + 90}deg)` }}>
                <CaSvg bangMau={mau} duoi={CAC_DUOI[i]} className="w-full -scale-x-100" />
              </div>
            )
          })}
        </motion.div>
        <div className="absolute inset-0 rounded-full border border-dashed border-white/10" />
      </div>
      <div className="flex justify-center lg:justify-end">{children}</div>
    </div>
  )
}
