import { AlertTriangle, Fish, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

/** Ba trạng thái đang tải, lỗi và trống dùng chung để mọi trang hiển thị nhất quán. */
export function DangTai({ noiDung = 'Đang tải dữ liệu…' }: { noiDung?: string }) {
  return (
    <div className="glass grid place-items-center rounded-3xl py-20 text-center text-slate-400" role="status">
      <Loader2 className="mb-3 h-8 w-8 animate-spin text-aqua" />
      {noiDung}
    </div>
  )
}

export function BaoLoi({ loi, thuLai }: { loi: unknown; thuLai?: () => void }) {
  const noiDung = loi instanceof Error ? loi.message : 'Có lỗi xảy ra, vui lòng thử lại'
  return (
    <div className="glass grid place-items-center rounded-3xl py-16 text-center" role="alert">
      <AlertTriangle className="mb-3 h-10 w-10 text-coral" />
      <p className="text-slate-300">{noiDung}</p>
      {thuLai && (
        <button type="button" onClick={thuLai} className="mt-4 cursor-pointer text-sm text-aqua hover:underline">
          Thử lại
        </button>
      )}
    </div>
  )
}

export function Trong({ noiDung, children }: { noiDung: string; children?: ReactNode }) {
  return (
    <div className="glass grid place-items-center rounded-3xl py-20 text-center text-slate-400">
      <Fish className="mb-3 h-10 w-10 text-slate-600" />
      {noiDung}
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}

/** Dòng thông báo lỗi của một thao tác, ví dụ khi đặt hàng thất bại. */
export function LoiThaoTac({ loi }: { loi: unknown }) {
  if (!loi) return null
  return (
    <p className="rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral" role="alert">
      {loi instanceof Error ? loi.message : 'Có lỗi xảy ra, vui lòng thử lại'}
    </p>
  )
}
