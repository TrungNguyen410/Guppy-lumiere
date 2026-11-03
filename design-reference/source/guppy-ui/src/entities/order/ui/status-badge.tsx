import { Badge } from '@/shared/ui/badge'
import { STATUS_META, type OrderStatus } from '../model/types'

export function StatusBadge({ status }: { status: OrderStatus }) {
  const m = STATUS_META[status]
  return (
    <Badge tone={m.tone}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }} />
      {m.label}
    </Badge>
  )
}
