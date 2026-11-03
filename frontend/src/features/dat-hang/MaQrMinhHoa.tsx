const KICH_THUOC = 21

/** QR minh họa cho cổng thanh toán giả lập, không quét ra giao dịch thật. */
export function MaQrMinhHoa() {
  const oVuong = Array.from({ length: KICH_THUOC * KICH_THUOC }, (_, i) => {
    const x = i % KICH_THUOC
    const y = Math.floor(i / KICH_THUOC)
    const oDinhVi = (a: number, b: number) =>
      x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || (x > a + 1 && x < a + 5 && y > b + 1 && y < b + 5))
    if (oDinhVi(0, 0) || oDinhVi(14, 0) || oDinhVi(0, 14)) return true
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) return false
    return (x * 7 + y * 13 + x * y) % 5 < 2
  })
  return (
    <div role="img" aria-label="Mã QR minh họa" className="grid h-36 w-36 shrink-0 grid-cols-[repeat(21,1fr)] rounded-xl bg-white p-2">
      {oVuong.map((den, i) => (
        <span key={i} className={den ? 'bg-abyss' : ''} />
      ))}
    </div>
  )
}
