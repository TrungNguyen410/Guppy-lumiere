import { useId } from 'react'
import type { Palette, Pattern, TailType } from '../model/types'
import { cn } from '@/shared/lib/cn'

const TAILS: Record<TailType, string> = {
  delta: 'M104 58 L188 10 Q204 60 188 108 Z',
  round: 'M104 58 C138 14 196 22 194 60 C196 98 138 104 104 58 Z',
  doubleSword: 'M104 58 C120 44 140 40 160 46 L198 26 L168 54 L168 62 L198 92 L160 72 C140 78 120 74 104 58 Z',
  veil: 'M104 58 C146 8 192 30 190 78 C188 112 150 104 128 86 C118 78 110 66 104 58 Z',
  lyre: 'M104 58 C140 40 168 8 200 4 C176 26 158 46 148 58 C158 70 176 90 200 112 C168 108 140 76 104 58 Z',
  spade: 'M104 58 C136 26 172 36 198 58 C172 80 136 90 104 58 Z',
}

export function GuppySvg({ palette, tail, pattern = 'solid', className, animated = true }: {
  palette: Palette; tail: TailType; pattern?: Pattern; className?: string; animated?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const rays = Array.from({ length: 9 }, (_, i) => -40 + i * 10)
  return (
    <svg viewBox="0 0 210 120" className={cn('overflow-visible', animated && 'guppy-swim', className)}>
      <defs>
        <linearGradient id={`t${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={palette.tail1} stopOpacity=".95" />
          <stop offset=".55" stopColor={palette.tail1} stopOpacity=".85" />
          <stop offset="1" stopColor={palette.tail2} stopOpacity=".9" />
        </linearGradient>
        <linearGradient id={`b${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={palette.accent} />
          <stop offset=".5" stopColor={palette.body} />
          <stop offset="1" stopColor={palette.body} stopOpacity=".8" />
        </linearGradient>
        <radialGradient id={`s${id}`} cx=".35" cy=".3" r=".7">
          <stop offset="0" stopColor="#fff" stopOpacity=".7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={`g${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id={`c${id}`}><path d={TAILS[tail]} /></clipPath>
      </defs>
      {/* glow */}
      <path d={TAILS[tail]} fill={palette.tail1} opacity=".45" filter={`url(#g${id})`} />
      {/* tail */}
      <g className={animated ? 'guppy-tail' : undefined}>
        <path d={TAILS[tail]} fill={`url(#t${id})`} />
        <g clipPath={`url(#c${id})`} opacity=".35">
          {rays.map((a) => (
            <line key={a} x1="104" y1="58" x2={104 + 110 * Math.cos((a * Math.PI) / 180)} y2={58 + 110 * Math.sin((a * Math.PI) / 180)} stroke="#fff" strokeWidth=".7" />
          ))}
          {(pattern === 'grass' || pattern === 'mosaic') &&
            Array.from({ length: 40 }, (_, i) => (
              <circle key={i} cx={115 + ((i * 37) % 85)} cy={14 + ((i * 53) % 92)} r={pattern === 'grass' ? 1.6 : 4}
                fill={pattern === 'grass' ? '#0f172a' : palette.tail2} opacity={pattern === 'grass' ? 0.7 : 0.6} />
            ))}
        </g>
      </g>
      {/* dorsal fin */}
      <path d="M56 47 C66 24 92 22 102 52 C90 46 72 45 56 47 Z" fill={palette.tail1} opacity=".85" />
      {/* body */}
      <path d="M14 61 C16 47 42 41 68 45 C88 48 102 53 110 58 C102 64 88 70 68 73 C42 77 16 74 14 61 Z" fill={`url(#b${id})`} />
      {pattern === 'koi' && (
        <>
          <path d="M16 58 C20 48 34 45 42 48 C40 56 30 64 18 66 Z" fill={palette.tail1} />
          <ellipse cx="72" cy="56" rx="10" ry="5" fill="#0f172a" opacity=".85" />
          <ellipse cx="90" cy="62" rx="6" ry="3" fill={palette.tail1} />
        </>
      )}
      <path d="M14 61 C16 47 42 41 68 45 C88 48 102 53 110 58 C102 64 88 70 68 73 C42 77 16 74 14 61 Z" fill={`url(#s${id})`} />
      {/* pelvic fin */}
      <path d="M52 70 C56 82 64 86 70 84 C66 78 62 74 60 71 Z" fill={palette.tail1} opacity=".7" />
      {/* eye */}
      <circle cx="27" cy="57" r="4.6" fill="#0b1020" />
      <circle cx="25.6" cy="55.6" r="1.5" fill="#fff" />
    </svg>
  )
}
