const KHOA_TOKEN = 'guppy-token'
const KHOA_SESSION = 'guppy-session-id'

/** Token đọc từ cả 2 nơi: Ghi nhớ lưu lâu dài, không Ghi nhớ thì mất khi đóng tab. */
export function docToken(): string | null {
  return localStorage.getItem(KHOA_TOKEN) ?? sessionStorage.getItem(KHOA_TOKEN)
}

export function ghiToken(token: string | null, ghiNho = false): void {
  localStorage.removeItem(KHOA_TOKEN)
  sessionStorage.removeItem(KHOA_TOKEN)
  if (token) (ghiNho ? localStorage : sessionStorage).setItem(KHOA_TOKEN, token)
}

/** Không dùng crypto.randomUUID: hàm này không có khi mở web qua http bằng IP, mọi lời gọi API sẽ hỏng. */
function taoUuid(): string {
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** Mã giỏ hàng của khách vãng lai, gửi qua header X-Session-Id. */
export function laySessionId(): string {
  let id = localStorage.getItem(KHOA_SESSION)
  if (!id) {
    id = taoUuid()
    localStorage.setItem(KHOA_SESSION, id)
  }
  return id
}
