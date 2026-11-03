import type { Fish, SaleUnit, TailType } from '@/entities/fish/model/types'
import { minPrice } from '@/entities/fish/model/types'

export type Gender = 'male' | 'female'
export type SortKey = 'popular' | 'priceAsc' | 'priceDesc' | 'rating'
export interface FishFilter {
  q: string
  strains: string[]
  genders: Gender[]
  tails: TailType[]
  units: SaleUnit[]
  maxPrice: number
  sort: SortKey
}
export const DEFAULT_FILTER: FishFilter = { q: '', strains: [], genders: [], tails: [], units: [], maxPrice: 300000, sort: 'popular' }

export function applyFilter(list: Fish[], f: FishFilter) {
  return list
    .filter((x) => !f.q || x.name.toLowerCase().includes(f.q.toLowerCase()))
    .filter((x) => !f.strains.length || f.strains.includes(x.strain.id))
    .filter((x) => !f.tails.length || f.tails.includes(x.tailType))
    .filter((x) => !f.units.length || f.units.some((u) => x.prices[u] != null))
    .filter((x) => !f.genders.length || f.genders.some((g) => x.prices[g === 'male' ? 'MALE' : 'FEMALE'] != null))
    .filter((x) => minPrice(x) <= f.maxPrice)
    .sort((a, b) =>
      f.sort === 'priceAsc' ? minPrice(a) - minPrice(b)
        : f.sort === 'priceDesc' ? minPrice(b) - minPrice(a)
          : f.sort === 'rating' ? b.rating - a.rating
            : b.sold - a.sold)
}

export const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
