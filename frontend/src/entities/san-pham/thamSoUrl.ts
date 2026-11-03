import type { BoLocSanPham } from './model'

/** Đổi bộ lọc thành query string; mảng được lặp tham số để backend nhận nhiều giá trị. */
export default function thamSoUrl(boLoc: BoLocSanPham): string {
  const thamSo = new URLSearchParams()
  for (const [khoa, giaTri] of Object.entries(boLoc)) {
    if (giaTri === undefined || giaTri === '' || giaTri === null) continue
    if (Array.isArray(giaTri)) {
      giaTri.forEach((g) => thamSo.append(khoa, String(g)))
    } else {
      thamSo.set(khoa, String(giaTri))
    }
  }
  return thamSo.toString()
}
