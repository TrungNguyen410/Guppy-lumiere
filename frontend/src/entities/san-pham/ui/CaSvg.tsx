import { useId } from 'react'
import { cn } from '@/shared/lib/cn'
import type { BangMau, HoaTiet, KieuDuoi } from '../model'

const HINH_DUOI: Record<KieuDuoi, string> = {
  DELTA: 'M104 58 L188 10 Q204 60 188 108 Z',
  TRON: 'M104 58 C138 14 196 22 194 60 C196 98 138 104 104 58 Z',
  KIEM_DOI: 'M104 58 C120 44 140 40 160 46 L198 26 L168 54 L168 62 L198 92 L160 72 C140 78 120 74 104 58 Z',
  VOAN: 'M104 58 C146 8 192 30 190 78 C188 112 150 104 128 86 C118 78 110 66 104 58 Z',
  DAN: 'M104 58 C140 40 168 8 200 4 C176 26 158 46 148 58 C158 70 176 90 200 112 C168 108 140 76 104 58 Z',
  THUONG: 'M104 58 C136 26 172 36 198 58 C172 80 136 90 104 58 Z',
  KIM: 'M104 58 C120 38 150 36 162 52 L206 58 L162 64 C150 80 120 78 104 58 Z',
  CO: 'M104 58 C112 46 120 40 130 38 L178 32 L180 84 L130 78 C120 76 112 70 104 58 Z',
}

/** Lưới vảy trên thân, dùng cho vân da rắn và vảy rồng. */
const LUOI_VAY = Array.from({ length: 6 }, (_, hang) =>
  Array.from({ length: 11 }, (_, cot) => ({ x: 22 + cot * 8 + (hang % 2) * 4, y: 44 + hang * 6 })),
).flat()

const HINH_THAN = 'M14 61 C16 47 42 41 68 45 C88 48 102 53 110 58 C102 64 88 70 68 73 C42 77 16 74 14 61 Z'
const GOC_TIA = Array.from({ length: 9 }, (_, i) => -40 + i * 10)
const CHAM_HOA_TIET = Array.from({ length: 40 }, (_, i) => i)

interface Props {
  bangMau: BangMau
  duoi: KieuDuoi
  hoaTiet?: HoaTiet
  className?: string
  chuyenDong?: boolean
}

/** Cá vẽ bằng SVG, đuôi và họa tiết theo dữ liệu của dòng cá. */
export function CaSvg({ bangMau, duoi, hoaTiet = 'SOLID', className, chuyenDong = true }: Props) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 210 120" aria-hidden="true" className={cn('overflow-visible', chuyenDong && 'ca-boi', className)}>
      <defs>
        <linearGradient id={`duoi${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={bangMau.duoi1} stopOpacity=".95" />
          <stop offset=".55" stopColor={bangMau.duoi1} stopOpacity=".85" />
          <stop offset="1" stopColor={bangMau.duoi2} stopOpacity=".9" />
        </linearGradient>
        <linearGradient id={`than${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={bangMau.nhan} />
          <stop offset=".5" stopColor={bangMau.than} />
          <stop offset="1" stopColor={bangMau.than} stopOpacity=".8" />
        </linearGradient>
        <radialGradient id={`sang${id}`} cx=".35" cy=".3" r=".7">
          <stop offset="0" stopColor="#fff" stopOpacity=".7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={`mo${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id={`cat${id}`}>
          <path d={HINH_DUOI[duoi]} />
        </clipPath>
        <clipPath id={`catThan${id}`}>
          <path d={HINH_THAN} />
        </clipPath>
      </defs>
      <path d={HINH_DUOI[duoi]} fill={bangMau.duoi1} opacity=".45" filter={`url(#mo${id})`} />
      <g className={chuyenDong ? 'ca-duoi' : undefined}>
        <path d={HINH_DUOI[duoi]} fill={`url(#duoi${id})`} />
        <g clipPath={`url(#cat${id})`} opacity=".35">
          {GOC_TIA.map((goc) => (
            <line key={goc} x1="104" y1="58" x2={104 + 110 * Math.cos((goc * Math.PI) / 180)} y2={58 + 110 * Math.sin((goc * Math.PI) / 180)} stroke="#fff" strokeWidth=".7" />
          ))}
          {(hoaTiet === 'GRASS' || hoaTiet === 'MOSAIC') &&
            CHAM_HOA_TIET.map((i) => (
              <circle
                key={i}
                cx={115 + ((i * 37) % 85)}
                cy={14 + ((i * 53) % 92)}
                r={hoaTiet === 'GRASS' ? 1.6 : 4}
                fill={hoaTiet === 'GRASS' ? '#0f172a' : bangMau.duoi2}
                opacity={hoaTiet === 'GRASS' ? 0.7 : 0.6}
              />
            ))}
          {hoaTiet === 'SNAKESKIN' &&
            CHAM_HOA_TIET.map((i) => (
              <ellipse key={i} cx={112 + ((i * 37) % 90)} cy={12 + ((i * 53) % 96)} rx="5" ry="3" fill="none" stroke={bangMau.duoi2} strokeWidth="1.6" opacity=".8" />
            ))}
        </g>
      </g>
      <path d="M56 47 C66 24 92 22 102 52 C90 46 72 45 56 47 Z" fill={bangMau.duoi1} opacity=".85" />
      <path d={HINH_THAN} fill={`url(#than${id})`} />
      {hoaTiet === 'KOI' && (
        <>
          <path d="M16 58 C20 48 34 45 42 48 C40 56 30 64 18 66 Z" fill={bangMau.duoi1} />
          <ellipse cx="72" cy="56" rx="10" ry="5" fill="#0f172a" opacity=".85" />
          <ellipse cx="90" cy="62" rx="6" ry="3" fill={bangMau.duoi1} />
        </>
      )}
      {hoaTiet === 'TUXEDO' && <rect x="62" y="36" width="52" height="44" fill="#0b1020" opacity=".78" clipPath={`url(#catThan${id})`} />}
      {(hoaTiet === 'SNAKESKIN' || hoaTiet === 'DRAGON') && (
        <g clipPath={`url(#catThan${id})`}>
          {LUOI_VAY.map(({ x, y }) =>
            hoaTiet === 'SNAKESKIN' ? (
              <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="3.4" ry="2.4" fill="none" stroke={bangMau.duoi2} strokeWidth="1.1" opacity=".75" />
            ) : (
              <path key={`${x}-${y}`} d={`M${x - 4} ${y} A4 4 0 0 0 ${x + 4} ${y}`} fill="none" stroke="#fff" strokeWidth=".9" opacity=".55" />
            ),
          )}
        </g>
      )}
      <path d={HINH_THAN} fill={`url(#sang${id})`} />
      <path d="M52 70 C56 82 64 86 70 84 C66 78 62 74 60 71 Z" fill={bangMau.duoi1} opacity=".7" />
      <circle cx="27" cy="57" r="4.6" fill="#0b1020" />
      <circle cx="25.6" cy="55.6" r="1.5" fill="#fff" />
    </svg>
  )
}
