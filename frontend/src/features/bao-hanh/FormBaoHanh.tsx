import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { guiBaoHanh } from '@/entities/don-hang/api'
import { Button } from '@/shared/ui/Button'
import { Input, Textarea, Truong } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'

interface Props {
  maDon: string | null
  khiDong: () => void
  khiXong?: () => void
}

/** Yêu cầu bảo hành cá chết trong 24h; chỉ nhận đường dẫn video, không tải tệp lên. */
export function FormBaoHanh({ maDon, khiDong, khiXong }: Props) {
  const queryClient = useQueryClient()
  const [moTa, setMoTa] = useState('')
  const [video, setVideo] = useState('')
  const [soCaChet, setSoCaChet] = useState(1)
  const gui = useMutation({
    mutationFn: () => guiBaoHanh({ maDon: maDon!, moTa: moTa.trim(), duongDanVideo: video.trim(), soCaChet }),
    onSuccess: async () => {
      setMoTa('')
      setVideo('')
      await queryClient.invalidateQueries({ queryKey: ['lich-su-don'] })
      await queryClient.invalidateQueries({ queryKey: ['bao-hanh'] })
      khiXong?.()
      khiDong()
    },
  })
  return (
    <Modal mo={maDon !== null} khiDoi={(mo) => !mo && khiDong()} tieuDe={`Báo cá chết · ${maDon ?? ''}`}>
      <form
        className="space-y-4"
        onSubmit={(su) => {
          su.preventDefault()
          gui.mutate()
        }}
      >
        <Truong nhan="Tình trạng cá *">
          <Textarea required maxLength={1000} value={moTa} onChange={(su) => setMoTa(su.target.value)} placeholder="Mô tả số cá chết và tình trạng khi mở túi" />
        </Truong>
        <Truong nhan="Số cá chết *">
          <Input required type="number" min={1} max={999} value={soCaChet} onChange={(su) => setSoCaChet(Number(su.target.value))} />
        </Truong>
        <Truong nhan="Đường dẫn video mở hàng *" goiY="quay liền mạch từ lúc nhận hộp tới khi mở túi">
          <Input required type="url" maxLength={500} value={video} onChange={(su) => setVideo(su.target.value)} placeholder="https://…" />
        </Truong>
        <LoiThaoTac loi={gui.error} />
        <Button type="submit" className="w-full" disabled={gui.isPending || !moTa.trim() || !video.trim()}>
          {gui.isPending ? 'Đang gửi…' : 'Gửi yêu cầu bảo hành'}
        </Button>
      </form>
    </Modal>
  )
}
