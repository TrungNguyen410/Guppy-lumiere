import type { SaleUnit } from '@/entities/fish/model/types'

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PACKING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED'
export type PaymentMethod = 'COD' | 'BANK_TRANSFER'

export const STATUS_FLOW: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PACKING', 'SHIPPING', 'COMPLETED']

export const STATUS_META: Record<OrderStatus, { label: string; tone: 'sun' | 'aqua' | 'orchid' | 'coral' | 'kelp' | 'slate'; color: string }> = {
  PENDING: { label: 'Chờ xác nhận', tone: 'sun', color: '#fbbf24' },
  CONFIRMED: { label: 'Đã xác nhận', tone: 'aqua', color: '#22d3ee' },
  PACKING: { label: 'Đang đóng gói', tone: 'orchid', color: '#c084fc' },
  SHIPPING: { label: 'Đang giao', tone: 'coral', color: '#fb7185' },
  COMPLETED: { label: 'Hoàn tất', tone: 'kelp', color: '#34d399' },
  CANCELLED: { label: 'Đã hủy', tone: 'slate', color: '#64748b' },
}

export interface OrderLine { fishName: string; unit: SaleUnit; qty: number; price: number }
export interface Order {
  code: string
  customer: string
  phone: string
  address: string
  city: string
  lines: OrderLine[]
  shipping: number
  payment: PaymentMethod
  status: OrderStatus
  createdAt: string
  guest: boolean
  history: { status: OrderStatus; at: string }[]
}

export const orderTotal = (o: Order) => o.lines.reduce((s, l) => s + l.price * l.qty, 0) + o.shipping
