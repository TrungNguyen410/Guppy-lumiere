import { Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/entities/cart/model/cart-store'
import type { Fish, SaleUnit } from '@/entities/fish/model/types'

/** Thêm nhanh đơn vị bán rẻ nhất vào giỏ */
export function QuickAddButton({ fish }: { fish: Fish }) {
  const { dispatch } = useCart()
  const [done, setDone] = useState(false)
  const unit = (Object.entries(fish.prices).sort((a, b) => a[1] - b[1])[0][0]) as SaleUnit
  return (
    <motion.button whileTap={{ scale: 0.85 }} title="Thêm vào giỏ"
      onClick={() => { dispatch({ type: 'add', line: { fishId: fish.id, unit, qty: 1 } }); setDone(true); setTimeout(() => setDone(false), 1200) }}
      className="grid h-11 w-11 cursor-pointer place-items-center rounded-2xl bg-[linear-gradient(135deg,#67e8f9,#c084fc)] text-abyss shadow-[0_0_20px_rgba(34,211,238,.45)] transition hover:rotate-90">
      {done ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
    </motion.button>
  )
}
