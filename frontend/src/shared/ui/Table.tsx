import type { ReactNode } from 'react'

export interface CotBang<T> {
  tieuDe: string
  hienThi: (dong: T) => ReactNode
}

interface Props<T> {
  cot: CotBang<T>[]
  dong: T[]
  khoaDong: (dong: T) => string | number
  thongBaoTrong?: string
}

export function Table<T>({ cot, dong, khoaDong, thongBaoTrong = 'Chưa có dữ liệu' }: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500">
            {cot.map((c) => (
              <th key={c.tieuDe} className="pb-3 font-medium">
                {c.tieuDe}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dong.map((d) => (
            <tr key={khoaDong(d)} className="border-t border-white/5">
              {cot.map((c) => (
                <td key={c.tieuDe} className="py-3">
                  {c.hienThi(d)}
                </td>
              ))}
            </tr>
          ))}
          {dong.length === 0 && (
            <tr>
              <td colSpan={cot.length} className="border-t border-white/5 py-8 text-center text-slate-500">
                {thongBaoTrong}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
