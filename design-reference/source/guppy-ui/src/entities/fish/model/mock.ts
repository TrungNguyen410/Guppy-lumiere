import type { Fish, Strain, WaterParams } from './types'

export const STRAINS: Strain[] = [
  { id: 'full-gold', name: 'Full Gold', origin: 'Thái Lan', pattern: 'solid', palette: { body: '#fcd34d', tail1: '#fbbf24', tail2: '#f97316', accent: '#fff7ed' } },
  { id: 'koi', name: 'Koi Tricolor', origin: 'Nhật Bản', pattern: 'koi', palette: { body: '#f8fafc', tail1: '#f43f5e', tail2: '#0f172a', accent: '#fb7185' } },
  { id: 'rong-do', name: 'Rồng Đỏ', origin: 'Thái Lan', pattern: 'mosaic', palette: { body: '#fecaca', tail1: '#ef4444', tail2: '#7f1d1d', accent: '#fca5a5' } },
  { id: 'blue-grass', name: 'Blue Grass', origin: 'Đài Loan', pattern: 'grass', palette: { body: '#bae6fd', tail1: '#38bdf8', tail2: '#1e3a8a', accent: '#0ea5e9' } },
  { id: 'albino', name: 'Albino Full Red', origin: 'Malaysia', pattern: 'solid', palette: { body: '#ffe4e6', tail1: '#fb7185', tail2: '#e11d48', accent: '#ffffff' } },
  { id: 'moscow', name: 'Moscow Blue', origin: 'Nga', pattern: 'solid', palette: { body: '#1e3a8a', tail1: '#3b82f6', tail2: '#0c4a6e', accent: '#60a5fa' } },
  { id: 'galaxy', name: 'Galaxy Neon', origin: 'Việt Nam', pattern: 'grass', palette: { body: '#a5f3fc', tail1: '#c084fc', tail2: '#22d3ee', accent: '#f0abfc' } },
  { id: 'black-mosaic', name: 'Black Mosaic', origin: 'Đức', pattern: 'mosaic', palette: { body: '#cbd5e1', tail1: '#334155', tail2: '#a855f7', accent: '#94a3b8' } },
]

const S = (id: string) => STRAINS.find((s) => s.id === id)!
const W = (o: Partial<WaterParams> = {}): WaterParams => ({ tempMin: 22, tempMax: 28, phMin: 6.8, phMax: 7.8, hardness: '8–12 dGH', ...o })

export const FISHES: Fish[] = [
  { id: 'f1', slug: 'full-gold-delta', name: 'Full Gold Đuôi Quạt', strain: S('full-gold'), tailType: 'delta',
    prices: { MALE: 45000, FEMALE: 35000, PAIR: 75000, TRIO: 105000, FRY_LOT: 150000 }, stock: { male: 24, female: 31, fry: 120 }, fryLotSize: 10,
    sizeCm: '3–4 cm', ageWeeks: 14, rating: 4.9, sold: 812, tags: ['Hot'], batchCode: 'LO-2410-FG', water: W(),
    description: 'Dòng Full Gold vàng kim óng ánh từ đầu tới đuôi, vây quạt xòe rộng 180°. Cá khỏe, dễ nuôi, rất hợp bể thủy sinh sáng màu.' },
  { id: 'f2', slug: 'koi-tricolor-round', name: 'Koi Tricolor Đuôi Tròn', strain: S('koi'), tailType: 'round',
    prices: { MALE: 85000, FEMALE: 65000, PAIR: 140000, TRIO: 195000 }, stock: { male: 8, female: 12, fry: 0 }, fryLotSize: 10,
    sizeCm: '3–3.5 cm', ageWeeks: 16, rating: 4.8, sold: 341, tags: ['Mới về'], batchCode: 'LO-2410-KO', water: W({ tempMin: 23 }),
    description: 'Họa tiết ba màu đỏ – trắng – đen như cá Koi Nhật, đầu đỏ đặc trưng. Đuôi tròn gọn, bơi chậm rãi rất sang.' },
  { id: 'f3', slug: 'rong-do-veil', name: 'Rồng Đỏ Đuôi Voan', strain: S('rong-do'), tailType: 'veil',
    prices: { MALE: 120000, FEMALE: 90000, PAIR: 199000, TRIO: 280000 }, stock: { male: 3, female: 5, fry: 0 }, fryLotSize: 10,
    sizeCm: '4–4.5 cm', ageWeeks: 18, rating: 5, sold: 128, tags: ['Hiếm'], batchCode: 'LO-2409-RD', water: W(),
    description: 'Thân vảy rồng ánh kim, đuôi voan đỏ thẫm buông mềm như lụa. Dòng cá tuyển chọn thi đấu, số lượng giới hạn.' },
  { id: 'f4', slug: 'blue-grass-delta', name: 'Blue Grass Đuôi Quạt', strain: S('blue-grass'), tailType: 'delta',
    prices: { MALE: 55000, FEMALE: 40000, PAIR: 89000, TRIO: 125000, FRY_LOT: 180000 }, stock: { male: 18, female: 22, fry: 80 }, fryLotSize: 10,
    sizeCm: '3–4 cm', ageWeeks: 12, rating: 4.7, sold: 560, tags: ['Hot', 'Giảm giá'], batchCode: 'LO-2410-BG', water: W(),
    description: 'Đuôi xanh lam điểm hạt mè như thảm cỏ, ánh lên dưới đèn LED. Dòng cá “quốc dân” cho người mới.' },
  { id: 'f5', slug: 'albino-full-red-lyre', name: 'Albino Full Red Đuôi Đàn', strain: S('albino'), tailType: 'lyre',
    prices: { MALE: 95000, FEMALE: 70000, PAIR: 155000 }, stock: { male: 0, female: 0, fry: 0 }, fryLotSize: 10,
    sizeCm: '3.5–4 cm', ageWeeks: 15, rating: 4.9, sold: 97, tags: ['Đặt trước', 'Hiếm'], batchCode: 'LO-2411-AL', water: W({ tempMin: 24, tempMax: 27 }),
    description: 'Mắt đỏ ruby, toàn thân đỏ rực. Đuôi đàn lia hai thùy cong vút. Hết hàng – nhận đặt trước lứa tháng 12.' },
  { id: 'f6', slug: 'moscow-blue-spade', name: 'Moscow Blue Đuôi Thuổng', strain: S('moscow'), tailType: 'spade',
    prices: { MALE: 70000, FEMALE: 50000, PAIR: 115000, TRIO: 160000, FRY_LOT: 220000 }, stock: { male: 11, female: 14, fry: 60 }, fryLotSize: 10,
    sizeCm: '3–3.5 cm', ageWeeks: 13, rating: 4.6, sold: 233, tags: [], batchCode: 'LO-2410-MB', water: W(),
    description: 'Xanh dương thẫm phủ toàn thân như nhung, đuôi thuổng mũi nhọn. Dòng Nga cổ điển, màu cực bền.' },
  { id: 'f7', slug: 'galaxy-neon-double-sword', name: 'Galaxy Neon Kiếm Đôi', strain: S('galaxy'), tailType: 'doubleSword',
    prices: { MALE: 65000, FEMALE: 45000, PAIR: 105000, TRIO: 145000, FRY_LOT: 200000 }, stock: { male: 15, female: 9, fry: 150 }, fryLotSize: 10,
    sizeCm: '3–4 cm', ageWeeks: 11, rating: 4.8, sold: 402, tags: ['Mới về', 'Hot'], batchCode: 'LO-2410-GN', water: W(),
    description: 'Dòng lai tạo tại trại Việt Nam, ánh tím – xanh neon như dải ngân hà. Hai kiếm đuôi trên dưới cực độc đáo.' },
  { id: 'f8', slug: 'black-mosaic-delta', name: 'Black Mosaic Đuôi Quạt', strain: S('black-mosaic'), tailType: 'delta',
    prices: { MALE: 60000, FEMALE: 45000, PAIR: 99000, TRIO: 139000 }, stock: { male: 6, female: 10, fry: 0 }, fryLotSize: 10,
    sizeCm: '3.5–4 cm', ageWeeks: 15, rating: 4.7, sold: 188, tags: ['Giảm giá'], batchCode: 'LO-2409-BM', water: W({ phMax: 7.6 }),
    description: 'Họa tiết khảm mosaic đen ánh tím trên nền bạc. Vây quạt to bản, phù hợp chụp ảnh và thi đấu.' },
  { id: 'f9', slug: 'full-gold-fry-lot', name: 'Lô Cá Bột Full Gold', strain: S('full-gold'), tailType: 'delta',
    prices: { FRY_LOT: 120000 }, stock: { male: 0, female: 0, fry: 300 }, fryLotSize: 20,
    sizeCm: '0.8–1.2 cm', ageWeeks: 3, rating: 4.5, sold: 76, tags: [], batchCode: 'LO-2411-FG2', water: W({ tempMin: 25, tempMax: 28 }),
    description: 'Lô 20 cá bột 3 tuần tuổi chưa phân giới tính, bố mẹ Full Gold thuần chủng. Phù hợp người muốn tự nuôi lớn và tuyển chọn.' },
]

export const findFish = (slug: string) => FISHES.find((f) => f.slug === slug)
