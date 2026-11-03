const dinhDangSo = new Intl.NumberFormat('vi-VN')

/** Ví dụ: 75000 thành 75.000đ */
export function formatTien(soTien: number): string {
  return `${dinhDangSo.format(soTien)}đ`
}
