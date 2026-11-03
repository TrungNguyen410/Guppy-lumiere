import { Hash, Phone, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/ui/Button'

interface Props {
  maBanDau: string
  sdtBanDau: string
  dangTim: boolean
  khiTim: (maDon: string, sdt: string) => void
}

export function FormTraCuu({ maBanDau, sdtBanDau, dangTim, khiTim }: Props) {
  const [maDon, setMaDon] = useState(maBanDau)
  const [sdt, setSdt] = useState(sdtBanDau)
  return (
    <form
      onSubmit={(su) => {
        su.preventDefault()
        khiTim(maDon.trim(), sdt.trim())
      }}
      className="glass mt-8 flex flex-col gap-2 rounded-[28px] p-2 md:flex-row md:rounded-full"
    >
      <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-3 focus-within:bg-white/5">
        <Hash className="h-4 w-4 text-aqua" />
        <input required aria-label="Mã đơn" value={maDon} onChange={(su) => setMaDon(su.target.value)} placeholder="Mã đơn (VD: GP24110931)" className="w-full bg-transparent text-sm uppercase outline-none placeholder:text-slate-500 placeholder:normal-case" />
      </label>
      <span className="hidden w-px bg-white/10 md:block" />
      <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-3 focus-within:bg-white/5">
        <Phone className="h-4 w-4 text-aqua" />
        <input required aria-label="Số điện thoại" value={sdt} onChange={(su) => setSdt(su.target.value)} placeholder="Số điện thoại đặt hàng" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" />
      </label>
      <Button type="submit" coNut="lon" disabled={dangTim}>
        <Search className="h-4 w-4" /> Tra cứu
      </Button>
    </form>
  )
}
