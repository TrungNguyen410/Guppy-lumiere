import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { layDanhSachSanPham } from '@/entities/san-pham/api'
import { CardCa } from '@/entities/san-pham/ui/CardCa'
import { useBoLocUrl } from '@/features/loc-san-pham/useBoLocUrl'
import { NutThemNhanh } from '@/features/them-vao-gio/NutThemNhanh'
import { BotKhi } from '@/shared/ui/BotKhi'
import { PhanTrang } from '@/shared/ui/PhanTrang'
import { DauTrang } from '@/shared/ui/TieuDe'
import { BaoLoi, DangTai, Trong } from '@/shared/ui/TrangThaiDuLieu'
import { BoLocCa } from '@/widgets/BoLocCa'

export function DanhSachCa() {
  const { boLoc, datGiaTri, batTat, datTrang, datLai } = useBoLocUrl()
  const [oTim, setOTim] = useState(boLoc.q ?? '')

  // Chờ ngừng gõ rồi mới gọi API để không gửi một yêu cầu cho mỗi phím
  useEffect(() => {
    const henGio = setTimeout(() => {
      if (oTim !== (boLoc.q ?? '')) datGiaTri('q', oTim || undefined)
    }, 300)
    return () => clearTimeout(henGio)
  }, [oTim, boLoc.q, datGiaTri])

  const sanPham = useQuery({ queryKey: ['san-pham', boLoc], queryFn: () => layDanhSachSanPham(boLoc), placeholderData: keepPreviousData })

  return (
    <>
      <BotKhi soLuong={14} />
      <DauTrang
        nhanPhu="Cửa hàng"
        tieuDe={
          <>
            Đàn cá <span className="text-iridescent">bảy màu</span>
          </>
        }
        moTa="Lọc theo dòng, giới tính, kiểu đuôi, đơn vị bán và mức giá. Mỗi con cá đều thuộc một lô nuôi có mã truy xuất."
      >
        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <label className="glass flex flex-1 items-center gap-3 rounded-full px-5 py-3">
            <Search className="h-5 w-5 text-aqua" />
            <input aria-label="Tìm sản phẩm" value={oTim} onChange={(su) => setOTim(su.target.value)} placeholder="Tìm Full Gold, Koi, Rồng Đỏ…" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" />
          </label>
          <select aria-label="Sắp xếp" value={boLoc.sapXep ?? 'BAN_CHAY'} onChange={(su) => datGiaTri('sapXep', su.target.value === 'BAN_CHAY' ? undefined : su.target.value)} className="glass cursor-pointer rounded-full px-5 py-3 text-sm outline-none">
            <option value="BAN_CHAY">Bán chạy nhất</option>
            <option value="DANH_GIA">Đánh giá cao</option>
            <option value="GIA_TANG">Giá tăng dần</option>
            <option value="GIA_GIAM">Giá giảm dần</option>
          </select>
        </div>
      </DauTrang>
      <div className="relative mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[290px_1fr]">
        <div>
          <BoLocCa boLoc={boLoc} datGiaTri={datGiaTri} batTat={batTat} datLai={datLai} />
        </div>
        <div>
          {sanPham.isPending && <DangTai />}
          {sanPham.isError && <BaoLoi loi={sanPham.error} thuLai={() => sanPham.refetch()} />}
          {sanPham.data && (
            <>
              <p className="mb-5 text-sm text-slate-400" aria-live="polite">
                Tìm thấy <span className="font-semibold text-white">{sanPham.data.tongPhanTu}</span> sản phẩm
              </p>
              {sanPham.data.noiDung.length === 0 ? (
                <Trong noiDung="Không có sản phẩm nào khớp bộ lọc. Thử nới khoảng giá nhé!" />
              ) : (
                <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {sanPham.data.noiDung.map((sp) => (
                      <motion.div key={sp.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35 }}>
                        <CardCa sanPham={sp} hanhDong={<NutThemNhanh sanPham={sp} />} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
              <PhanTrang trang={sanPham.data.trang} tongTrang={sanPham.data.tongTrang} khiDoi={datTrang} />
            </>
          )}
        </div>
      </div>
    </>
  )
}
