import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Fish as FishIcon } from 'lucide-react'
import { PageHero } from '@/shared/ui/page-hero'
import { FISHES } from '@/entities/fish/model/mock'
import { FishCard } from '@/entities/fish/ui/fish-card'
import { QuickAddButton } from '@/features/add-to-cart/quick-add-button'
import { FilterPanel } from '@/features/fish-filter/filter-panel'
import { applyFilter, DEFAULT_FILTER, type FishFilter, type SortKey } from '@/features/fish-filter/model'
import { Bubbles } from '@/shared/ui/bubbles'

export function CatalogPage() {
  const [params] = useSearchParams()
  const [filter, setFilter] = useState<FishFilter>(() => ({ ...DEFAULT_FILTER, strains: params.get('dong') ? [params.get('dong')!] : [] }))
  const list = useMemo(() => applyFilter(FISHES, filter), [filter])
  return (
    <>
      <Bubbles count={14} />
      <PageHero eyebrow="Cửa hàng" title={<>Đàn cá <span className="text-iridescent">bảy màu</span></>} desc="Lọc theo dòng, giới tính, kiểu đuôi, đơn vị bán và mức giá. Mỗi con cá đều thuộc một lô nuôi có mã truy xuất.">
        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <label className="glass flex flex-1 items-center gap-3 rounded-full px-5 py-3">
            <Search className="h-5 w-5 text-aqua" />
            <input value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} placeholder="Tìm Full Gold, Koi, Rồng Đỏ…" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" />
          </label>
          <select value={filter.sort} onChange={(e) => setFilter({ ...filter, sort: e.target.value as SortKey })}
            className="glass cursor-pointer rounded-full px-5 py-3 text-sm outline-none [&>option]:bg-deep">
            <option value="popular">Bán chạy nhất</option>
            <option value="rating">Đánh giá cao</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
          </select>
        </div>
      </PageHero>
      <div className="relative mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[290px_1fr]">
        <div><FilterPanel value={filter} onChange={setFilter} /></div>
        <div>
          <p className="mb-5 text-sm text-slate-400">Tìm thấy <span className="font-semibold text-white">{list.length}</span> sản phẩm</p>
          <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((f) => (
                <motion.div key={f.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35 }}>
                  <FishCard fish={f} action={<QuickAddButton fish={f} />} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {!list.length && (
            <div className="glass grid place-items-center rounded-3xl py-20 text-center text-slate-400">
              <FishIcon className="mb-3 h-10 w-10 text-slate-600" /> Không có cá nào khớp bộ lọc. Thử nới khoảng giá nhé!
            </div>
          )}
        </div>
      </div>
    </>
  )
}
