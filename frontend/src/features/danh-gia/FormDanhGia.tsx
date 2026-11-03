import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { useState } from 'react'
import { guiDanhGia } from '@/entities/don-hang/api'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Textarea, Truong } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { LoiThaoTac } from '@/shared/ui/TrangThaiDuLieu'

export interface MucDanhGia {
  maDon: string
  sanPhamId: number
  tenSanPham: string
}

export function FormDanhGia({ muc, khiDong }: { muc: MucDanhGia | null; khiDong: () => void }) {
  const queryClient = useQueryClient()
  const [soSao, setSoSao] = useState(5)
  const [noiDung, setNoiDung] = useState('')
  const gui = useMutation({
    mutationFn: () => guiDanhGia({ maDon: muc!.maDon, sanPhamId: muc!.sanPhamId, soSao, noiDung: noiDung.trim() || undefined }),
    onSuccess: async () => {
      setSoSao(5)
      setNoiDung('')
      await queryClient.invalidateQueries({ queryKey: ['danh-gia', muc?.sanPhamId] })
      await queryClient.invalidateQueries({ queryKey: ['san-pham'] })
      khiDong()
    },
  })
  return (
    <Modal mo={muc !== null} khiDoi={(mo) => !mo && khiDong()} tieuDe={`Đánh giá ${muc?.tenSanPham ?? ''}`}>
      <form
        className="space-y-4"
        onSubmit={(su) => {
          su.preventDefault()
          gui.mutate()
        }}
      >
        <div className="flex gap-1" role="radiogroup" aria-label="Số sao">
          {[1, 2, 3, 4, 5].map((sao) => (
            <button key={sao} type="button" role="radio" aria-checked={soSao === sao} aria-label={`${sao} sao`} onClick={() => setSoSao(sao)} className="cursor-pointer p-1">
              <Star className={cn('h-7 w-7 text-sun', sao <= soSao ? 'fill-sun' : 'opacity-30')} />
            </button>
          ))}
        </div>
        <Truong nhan="Nhận xét" goiY="không bắt buộc">
          <Textarea maxLength={1000} value={noiDung} onChange={(su) => setNoiDung(su.target.value)} placeholder="Cá có khỏe, đúng màu như mô tả không?" />
        </Truong>
        <LoiThaoTac loi={gui.error} />
        <Button type="submit" className="w-full" disabled={gui.isPending}>
          {gui.isPending ? 'Đang gửi…' : 'Gửi đánh giá'}
        </Button>
      </form>
    </Modal>
  )
}
