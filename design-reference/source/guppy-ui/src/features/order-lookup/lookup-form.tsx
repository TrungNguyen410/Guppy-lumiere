import { useState } from 'react'
import { Search, Hash, Phone } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function LookupForm({ onSearch }: { onSearch: (code: string, phone: string) => void }) {
  const [code, setCode] = useState('GP24110931')
  const [phone, setPhone] = useState('0901234567')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(code, phone) }} className="glass mt-8 flex flex-col gap-2 rounded-[28px] p-2 md:flex-row md:rounded-full">
      <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-3 focus-within:bg-white/5">
        <Hash className="h-4 w-4 text-aqua" /><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã đơn (VD: GP24110931)" className="w-full bg-transparent text-sm uppercase outline-none placeholder:normal-case placeholder:text-slate-500" />
      </label>
      <span className="hidden w-px bg-white/10 md:block" />
      <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-3 focus-within:bg-white/5">
        <Phone className="h-4 w-4 text-aqua" /><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại đặt hàng" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" />
      </label>
      <Button type="submit" size="lg"><Search className="h-4 w-4" /> Tra cứu</Button>
    </form>
  )
}
