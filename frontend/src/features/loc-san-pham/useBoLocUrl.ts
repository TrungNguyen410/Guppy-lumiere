import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { BoLocSanPham, DonViBan, GioiTinh, KieuDuoi, LoaiSanPham, SapXep } from '@/entities/san-pham/model'

export const GIA_TOI_DA_MAC_DINH = 500_000
const SO_SAN_PHAM_MOI_TRANG = 9
const BO_LOC_CHI_CHO_CA = ['dong', 'gioiTinh', 'kieuDuoi', 'donVi']

/** Bộ lọc nằm trên URL: tải lại trang, chia sẻ liên kết và link "?dong=" từ trang chủ đều giữ đúng. */
export function useBoLocUrl() {
  const [thamSo, setThamSo] = useSearchParams()

  const boLoc: BoLocSanPham = useMemo(() => {
    const giaMax = Number(thamSo.get('giaMax'))
    return {
      q: thamSo.get('q') ?? undefined,
      loai: (thamSo.get('loai') as LoaiSanPham | null) ?? undefined,
      dong: thamSo.getAll('dong'),
      gioiTinh: thamSo.getAll('gioiTinh') as GioiTinh[],
      kieuDuoi: thamSo.getAll('kieuDuoi') as KieuDuoi[],
      donVi: thamSo.getAll('donVi') as DonViBan[],
      giaMax: giaMax > 0 ? giaMax : undefined,
      sapXep: (thamSo.get('sapXep') as SapXep | null) ?? undefined,
      trang: Number(thamSo.get('trang')) || 0,
      kichThuoc: SO_SAN_PHAM_MOI_TRANG,
    }
  }, [thamSo])

  /** Đổi tiêu chí nào cũng về trang đầu, vì trang hiện tại có thể không còn tồn tại. */
  const datGiaTri = useCallback(
    (khoa: string, giaTri: string | undefined) => {
      setThamSo(
        (cu) => {
          const moi = new URLSearchParams(cu)
          moi.delete('trang')
          if (giaTri) moi.set(khoa, giaTri)
          else moi.delete(khoa)
          // Phụ kiện không có dòng, giới tính, đuôi, đơn vị: giữ lại thì kết quả luôn rỗng
          if (khoa === 'loai' && giaTri === 'PHU_KIEN') BO_LOC_CHI_CHO_CA.forEach((k) => moi.delete(k))
          return moi
        },
        { replace: true },
      )
    },
    [setThamSo],
  )

  const batTat = useCallback(
    (khoa: string, giaTri: string) => {
      setThamSo(
        (cu) => {
          const moi = new URLSearchParams(cu)
          moi.delete('trang')
          const hienTai = moi.getAll(khoa)
          moi.delete(khoa)
          const sau = hienTai.includes(giaTri) ? hienTai.filter((g) => g !== giaTri) : [...hienTai, giaTri]
          sau.forEach((g) => moi.append(khoa, g))
          if (BO_LOC_CHI_CHO_CA.includes(khoa) && moi.get('loai') === 'PHU_KIEN') moi.delete('loai')
          return moi
        },
        { replace: true },
      )
    },
    [setThamSo],
  )

  const datTrang = useCallback(
    (trang: number) => {
      setThamSo((cu) => {
        const moi = new URLSearchParams(cu)
        if (trang > 0) moi.set('trang', String(trang))
        else moi.delete('trang')
        return moi
      })
      window.scrollTo({ top: 0 })
    },
    [setThamSo],
  )

  /** Giữ lại ô tìm kiếm và cách sắp xếp, vì hai ô này nằm ngoài bảng lọc. */
  const datLai = useCallback(() => {
    setThamSo(
      (cu) => {
        const moi = new URLSearchParams()
        for (const khoa of ['q', 'sapXep']) {
          const giaTri = cu.get(khoa)
          if (giaTri) moi.set(khoa, giaTri)
        }
        return moi
      },
      { replace: true },
    )
  }, [setThamSo])

  return { boLoc, datGiaTri, batTat, datTrang, datLai }
}
