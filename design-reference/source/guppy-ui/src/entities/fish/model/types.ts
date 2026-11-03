export type TailType = 'delta' | 'round' | 'doubleSword' | 'veil' | 'lyre' | 'spade'
export type Pattern = 'solid' | 'mosaic' | 'grass' | 'koi'
export type SaleUnit = 'MALE' | 'FEMALE' | 'PAIR' | 'TRIO' | 'FRY_LOT'
export type FishTag = 'Hot' | 'Mới về' | 'Hiếm' | 'Đặt trước' | 'Giảm giá'

export interface Palette {
  body: string
  tail1: string
  tail2: string
  accent: string
}

export interface Strain {
  id: string
  name: string
  origin: string
  palette: Palette
  pattern: Pattern
}

export interface WaterParams {
  tempMin: number
  tempMax: number
  phMin: number
  phMax: number
  hardness: string
}

export interface Fish {
  id: string
  slug: string
  name: string
  strain: Strain
  tailType: TailType
  prices: Partial<Record<SaleUnit, number>>
  stock: { male: number; female: number; fry: number }
  fryLotSize: number
  sizeCm: string
  ageWeeks: number
  rating: number
  sold: number
  tags: FishTag[]
  batchCode: string
  water: WaterParams
  description: string
}

export const TAIL_LABEL: Record<TailType, string> = {
  delta: 'Đuôi quạt (Delta)',
  round: 'Đuôi tròn',
  doubleSword: 'Đuôi kiếm đôi',
  veil: 'Đuôi voan (Veil)',
  lyre: 'Đuôi đàn (Lyre)',
  spade: 'Đuôi thuổng (Spade)',
}

export const UNIT_LABEL: Record<SaleUnit, string> = {
  MALE: 'Con lẻ – Đực',
  FEMALE: 'Con lẻ – Cái',
  PAIR: 'Cặp (1 đực + 1 cái)',
  TRIO: 'Bộ ba (1 đực + 2 cái)',
  FRY_LOT: 'Lô cá bột',
}

export const UNIT_SHORT: Record<SaleUnit, string> = {
  MALE: 'Đực', FEMALE: 'Cái', PAIR: 'Cặp', TRIO: 'Bộ ba', FRY_LOT: 'Lô bột',
}

export const minPrice = (f: Fish) => Math.min(...Object.values(f.prices).filter((v): v is number => v != null))
