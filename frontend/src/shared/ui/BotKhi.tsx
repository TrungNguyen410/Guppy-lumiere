import { useMemo } from 'react'

/** Bọt khí nền bằng CSS, nhẹ hơn nhiều so với cảnh 3D. */
export function BotKhi({ soLuong = 18 }: { soLuong?: number }) {
  const danhSach = useMemo(
    () =>
      Array.from({ length: soLuong }, (_, i) => ({
        trai: (i * 53) % 100,
        coBot: 4 + ((i * 7) % 14),
        thoiGian: 9 + ((i * 13) % 12),
        tre: -((i * 3.1) % 15),
      })),
    [soLuong],
  )
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {danhSach.map((b) => (
        <span
          key={b.trai + b.tre}
          className="bot-khi"
          style={{ left: `${b.trai}%`, width: b.coBot, height: b.coBot, animationDuration: `${b.thoiGian}s`, animationDelay: `${b.tre}s` }}
        />
      ))}
    </div>
  )
}
