import type { Order, OrderStatus } from './types'

const h = (...s: [OrderStatus, string][]) => s.map(([status, at]) => ({ status, at }))

export const ORDERS: Order[] = [
  { code: 'GP24110931', customer: 'Nguyễn Minh Anh', phone: '0901234567', address: '12 Lê Lợi, Q.1', city: 'TP. Hồ Chí Minh', guest: true, payment: 'COD', shipping: 50000,
    lines: [{ fishName: 'Full Gold Đuôi Quạt', unit: 'PAIR', qty: 1, price: 75000 }, { fishName: 'Galaxy Neon Kiếm Đôi', unit: 'MALE', qty: 2, price: 65000 }],
    status: 'SHIPPING', createdAt: '2026-11-01T08:12:00', history: h(['PENDING', '2026-11-01T08:12:00'], ['CONFIRMED', '2026-11-01T08:40:00'], ['PACKING', '2026-11-01T09:30:00'], ['SHIPPING', '2026-11-01T11:05:00']) },
  { code: 'GP24110927', customer: 'Trần Quốc Bảo', phone: '0912345678', address: '88 Trần Phú', city: 'Đà Nẵng', guest: false, payment: 'BANK_TRANSFER', shipping: 0,
    lines: [{ fishName: 'Rồng Đỏ Đuôi Voan', unit: 'TRIO', qty: 2, price: 280000 }],
    status: 'PENDING', createdAt: '2026-11-01T10:02:00', history: h(['PENDING', '2026-11-01T10:02:00']) },
  { code: 'GP24110925', customer: 'Lê Thu Hà', phone: '0987654321', address: '5 Hàng Bài', city: 'Hà Nội', guest: true, payment: 'COD', shipping: 50000,
    lines: [{ fishName: 'Blue Grass Đuôi Quạt', unit: 'FRY_LOT', qty: 1, price: 180000 }],
    status: 'PENDING', createdAt: '2026-11-01T09:47:00', history: h(['PENDING', '2026-11-01T09:47:00']) },
  { code: 'GP24110918', customer: 'Phạm Gia Huy', phone: '0933111222', address: '201 Nguyễn Trãi, Q.5', city: 'TP. Hồ Chí Minh', guest: false, payment: 'BANK_TRANSFER', shipping: 50000,
    lines: [{ fishName: 'Koi Tricolor Đuôi Tròn', unit: 'PAIR', qty: 1, price: 140000 }],
    status: 'CONFIRMED', createdAt: '2026-10-31T19:20:00', history: h(['PENDING', '2026-10-31T19:20:00'], ['CONFIRMED', '2026-10-31T20:01:00']) },
  { code: 'GP24110911', customer: 'Võ Hoàng Long', phone: '0977000888', address: '17 Bạch Đằng', city: 'Đà Nẵng', guest: true, payment: 'COD', shipping: 0,
    lines: [{ fishName: 'Moscow Blue Đuôi Thuổng', unit: 'TRIO', qty: 3, price: 160000 }, { fishName: 'Full Gold Đuôi Quạt', unit: 'FRY_LOT', qty: 1, price: 150000 }],
    status: 'PACKING', createdAt: '2026-10-31T15:10:00', history: h(['PENDING', '2026-10-31T15:10:00'], ['CONFIRMED', '2026-10-31T15:30:00'], ['PACKING', '2026-11-01T07:50:00']) },
  { code: 'GP24110903', customer: 'Đặng Ngọc Mai', phone: '0909555666', address: '9 Kim Mã', city: 'Hà Nội', guest: false, payment: 'BANK_TRANSFER', shipping: 50000,
    lines: [{ fishName: 'Black Mosaic Đuôi Quạt', unit: 'MALE', qty: 3, price: 60000 }],
    status: 'COMPLETED', createdAt: '2026-10-30T11:00:00', history: h(['PENDING', '2026-10-30T11:00:00'], ['CONFIRMED', '2026-10-30T11:20:00'], ['PACKING', '2026-10-30T14:00:00'], ['SHIPPING', '2026-10-30T16:00:00'], ['COMPLETED', '2026-10-30T18:30:00']) },
  { code: 'GP24110899', customer: 'Bùi Thanh Tâm', phone: '0944777999', address: '45 Võ Văn Tần, Q.3', city: 'TP. Hồ Chí Minh', guest: true, payment: 'COD', shipping: 50000,
    lines: [{ fishName: 'Galaxy Neon Kiếm Đôi', unit: 'PAIR', qty: 1, price: 105000 }],
    status: 'CANCELLED', createdAt: '2026-10-30T09:30:00', history: h(['PENDING', '2026-10-30T09:30:00'], ['CANCELLED', '2026-10-30T10:00:00']) },
  { code: 'GP24110890', customer: 'Hồ Mỹ Linh', phone: '0966123123', address: '3 Lý Thường Kiệt', city: 'Hà Nội', guest: false, payment: 'COD', shipping: 0,
    lines: [{ fishName: 'Full Gold Đuôi Quạt', unit: 'TRIO', qty: 4, price: 105000 }, { fishName: 'Koi Tricolor Đuôi Tròn', unit: 'MALE', qty: 2, price: 85000 }],
    status: 'COMPLETED', createdAt: '2026-10-29T13:15:00', history: h(['PENDING', '2026-10-29T13:15:00'], ['COMPLETED', '2026-10-29T19:00:00']) },
]

export const findOrder = (code: string, phone: string) =>
  ORDERS.find((o) => o.code.toUpperCase() === code.trim().toUpperCase() && o.phone === phone.trim())

export interface Batch {
  code: string; strain: string; parents: string; bornAt: string; male: number; female: number; fry: number; dead: number; tank: string; stage: 'Cá bột' | 'Đang phân giới' | 'Trưởng thành'
}
export const BATCHES: Batch[] = [
  { code: 'LO-2410-FG', strain: 'Full Gold', parents: 'FG-A3 × FG-B1', bornAt: '2026-07-20', male: 24, female: 31, fry: 0, dead: 4, tank: 'Bể A1', stage: 'Trưởng thành' },
  { code: 'LO-2410-BG', strain: 'Blue Grass', parents: 'BG-07 × BG-12', bornAt: '2026-08-05', male: 18, female: 22, fry: 0, dead: 6, tank: 'Bể A2', stage: 'Trưởng thành' },
  { code: 'LO-2410-GN', strain: 'Galaxy Neon', parents: 'GN-01 × GN-04', bornAt: '2026-08-15', male: 15, female: 9, fry: 150, dead: 11, tank: 'Bể B1', stage: 'Đang phân giới' },
  { code: 'LO-2409-RD', strain: 'Rồng Đỏ', parents: 'RD-02 × RD-05', bornAt: '2026-06-30', male: 3, female: 5, fry: 0, dead: 2, tank: 'Bể C1', stage: 'Trưởng thành' },
  { code: 'LO-2411-FG2', strain: 'Full Gold', parents: 'FG-A3 × FG-C2', bornAt: '2026-10-10', male: 0, female: 0, fry: 300, dead: 18, tank: 'Bể D1 (ươm)', stage: 'Cá bột' },
  { code: 'LO-2411-AL', strain: 'Albino Full Red', parents: 'AL-01 × AL-03', bornAt: '2026-10-22', male: 0, female: 0, fry: 85, dead: 9, tank: 'Bể D2 (ươm)', stage: 'Cá bột' },
]

export const REVENUE_7D = [
  { day: 'T2', value: 2.1 }, { day: 'T3', value: 3.4 }, { day: 'T4', value: 2.8 }, { day: 'T5', value: 4.6 },
  { day: 'T6', value: 3.9 }, { day: 'T7', value: 6.2 }, { day: 'CN', value: 7.4 },
]
