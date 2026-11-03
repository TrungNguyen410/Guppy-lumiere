export const formatVnd = (n: number) =>
  new Intl.NumberFormat('vi-VN').format(n) + 'đ'

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
