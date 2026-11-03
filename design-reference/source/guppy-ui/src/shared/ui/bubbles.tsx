import { useMemo } from 'react'

export function Bubbles({ count = 18 }: { count?: number }) {
  const items = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      left: (i * 53) % 100, size: 4 + ((i * 7) % 14), dur: 9 + ((i * 13) % 12), delay: -((i * 3.1) % 15),
    })),
    [count],
  )
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      {items.map((b, i) => (
        <span key={i} className="bubble" style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />
      ))}
    </div>
  )
}
