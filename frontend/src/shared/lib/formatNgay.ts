/** Ví dụ: 08:12 01/11 */
export function formatNgayGio(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  })
}

/** Ví dụ: 20/7/2026 */
export function formatNgay(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN')
}
