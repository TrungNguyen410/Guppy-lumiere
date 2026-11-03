/** Trình duyệt có tạo được WebGL không; không có thì dùng ảnh tĩnh thay cho cảnh 3D. */
export function hoTroWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** Mobile, máy yếu hoặc người dùng chọn giảm chuyển động thì giảm số cá và tắt hậu kỳ. */
export function canGiamHieuUng(): boolean {
  const manHinhNho = window.matchMedia('(max-width: 768px)').matches
  const giamChuyenDong = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mayYeu = (navigator.hardwareConcurrency ?? 8) <= 4
  return manHinhNho || giamChuyenDong || mayYeu
}
