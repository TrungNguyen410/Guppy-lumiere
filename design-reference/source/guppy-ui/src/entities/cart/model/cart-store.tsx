import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Fish, SaleUnit } from '@/entities/fish/model/types'
import { FISHES } from '@/entities/fish/model/mock'

export interface CartLine { fishId: string; unit: SaleUnit; qty: number }
type Action =
  | { type: 'add'; line: CartLine }
  | { type: 'qty'; fishId: string; unit: SaleUnit; qty: number }
  | { type: 'remove'; fishId: string; unit: SaleUnit }
  | { type: 'clear' }

const KEY = 'guppy-cart'
const initial: CartLine[] = [
  { fishId: 'f1', unit: 'PAIR', qty: 1 },
  { fishId: 'f7', unit: 'MALE', qty: 2 },
  { fishId: 'f4', unit: 'FRY_LOT', qty: 1 },
]

function reducer(s: CartLine[], a: Action): CartLine[] {
  switch (a.type) {
    case 'add': {
      const ex = s.find((l) => l.fishId === a.line.fishId && l.unit === a.line.unit)
      return ex ? s.map((l) => (l === ex ? { ...l, qty: l.qty + a.line.qty } : l)) : [...s, a.line]
    }
    case 'qty':
      return s.map((l) => (l.fishId === a.fishId && l.unit === a.unit ? { ...l, qty: Math.max(1, a.qty) } : l))
    case 'remove':
      return s.filter((l) => !(l.fishId === a.fishId && l.unit === a.unit))
    case 'clear':
      return []
  }
}

export interface CartItem extends CartLine { fish: Fish; price: number; total: number; preorder: boolean }

const Ctx = createContext<{ items: CartItem[]; count: number; subtotal: number; dispatch: React.Dispatch<Action> } | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, undefined, () => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '') as CartLine[] } catch { return initial }
  })
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(lines)) }, [lines])
  const value = useMemo(() => {
    const items = lines.flatMap((l) => {
      const fish = FISHES.find((f) => f.id === l.fishId)
      const price = fish?.prices[l.unit]
      if (!fish || price == null) return []
      const preorder = fish.stock.male + fish.stock.female + fish.stock.fry === 0
      return [{ ...l, fish, price, total: price * l.qty, preorder }]
    })
    return { items, dispatch, count: items.reduce((s, i) => s + i.qty, 0), subtotal: items.reduce((s, i) => s + i.total, 0) }
  }, [lines])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart phải nằm trong CartProvider')
  return c
}

/** Phí giao: cá sống giao hỏa tốc 50.000đ, miễn phí từ 500.000đ */
export const shippingFee = (subtotal: number) => (subtotal === 0 || subtotal >= 500000 ? 0 : 50000)
