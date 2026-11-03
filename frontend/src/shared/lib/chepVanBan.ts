/** navigator.clipboard không có khi mở web qua http bằng IP, lúc đó chép bằng ô nhập tạm. */
export async function chepVanBan(noiDung: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(noiDung)
      return true
    } catch {
      // Trình duyệt từ chối quyền: thử cách bên dưới
    }
  }
  const o = document.createElement('textarea')
  o.value = noiDung
  o.style.position = 'fixed'
  o.style.opacity = '0'
  document.body.appendChild(o)
  o.select()
  const thanhCong = document.execCommand('copy')
  o.remove()
  return thanhCong
}
