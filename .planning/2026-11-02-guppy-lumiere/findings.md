# Kết quả đọc design-reference (Pha 0)

## Trang (10 trang, 11 ảnh: home.png và home-full.png cùng một trang)
| Route trong source | Trang | Ảnh | Trang theo mục 3 |
|---|---|---|---|
| / | Trang chủ | home, home-full | TrangChu |
| /ca-bay-mau | Danh sách cá | catalog | DanhSachCa |
| /ca-bay-mau/:slug | Chi tiết cá | detail-full | ChiTietCa |
| /gio-hang | Giỏ hàng | cart | GioHang |
| /thanh-toan | Thanh toán + modal thành công | checkout | ThanhToan |
| /tra-cuu-don | Tra cứu đơn | lookup | TraCuuDon |
| /dang-nhap | Đăng nhập + đăng ký (2 tab) | auth | DangNhap, DangKy |
| /quan-tri | Tổng quan | admin | admin/TongQuan |
| /quan-tri/don-hang | Bảng đơn kanban | orders | admin/QuanLyDon |
| /quan-tri/lo-ca | Lô cá + nhật ký kho | batches | admin/QuanLyLoCa |

Không có ảnh và source: admin/QuanLySanPham, Khuyến mãi, Tài khoản (menu trỏ "#"), hồ sơ, sổ địa chỉ, lịch sử đơn, đánh giá, bảo hành, phụ kiện, ô mã giảm giá.

## Component
- shared/ui: Badge, Bubbles, Button, Card/CardTitle, Input/Textarea/Label, PageHero, QtyStepper, SectionTitle, TiltCard
- entities: FishCard, GuppySvg, Guppy3D, StatusBadge, StatusTimeline, cart-store
- features: QuickAddButton, AuthCard, CheckoutForm (QrMock), FilterPanel, LookupForm
- widgets: Header/Logo, Footer, AquariumScene, FishViewer (admin-sidebar là thư mục rỗng)
- nằm trong page: Hero, Marquee, StrainOrbit, Featured, SaleUnits/School, WaterCare/Gauge, Journey, RangeBar, OrderSummary, Steps, SuccessModal, AdminLayout, Kpi, RevenueChart, StatusBars, TopStrains

## Màu
abyss #030814, deep #071226, lagoon #0c2340, aqua #22d3ee, coral #fb7185, sun #fbbf24, orchid #c084fc, kelp #34d399. Nền 3D #020b18.
Gradient: chữ iridescent #67e8f9-#c084fc-#fb7185-#fbbf24; nút chính #67e8f9-#a5b4fc-#f9a8d4; nav pill #67e8f9-#c4b5fd; viền iridescent #22d3ee-#c084fc-#fb7185-#fbbf24.
Trạng thái: chờ #fbbf24, xác nhận #22d3ee, đóng gói #c084fc, giao #fb7185, hoàn tất #34d399, hủy #64748b. Lô cá: đực #22d3ee, cái #f472b6, bột #fbbf24.
Body nền abyss + 3 radial gradient cố định (aqua, orchid, coral).

## Palette dòng cá (body/tail1/tail2/accent)
full-gold #fcd34d #fbbf24 #f97316 #fff7ed | koi #f8fafc #f43f5e #0f172a #fb7185 | rong-do #fecaca #ef4444 #7f1d1d #fca5a5 | blue-grass #bae6fd #38bdf8 #1e3a8a #0ea5e9 | albino #ffe4e6 #fb7185 #e11d48 #ffffff | moscow #1e3a8a #3b82f6 #0c4a6e #60a5fa | galaxy #a5f3fc #c084fc #22d3ee #f0abfc | black-mosaic #cbd5e1 #334155 #a855f7 #94a3b8

## Font, bo góc
Unbounded Variable (tiêu đề, giá), Be Vietnam Pro 300-700 (nội dung). Bo 28-40px cho card, nút tròn hẳn. Tiện ích glass, glass-strong, text-iridescent, border-iridescent.

## Quy tắc kinh doanh chỉ có trong source
Phí giao 50.000đ, miễn phí từ 500.000đ; chỉ giao HCM/HN/ĐN; đặt trước khi hết hàng, không trừ kho; tồn cặp = min(đực, cái), bộ ba = min(đực, cái/2), lô bột = bột/cỡ lô; lô có bố mẹ, giai đoạn, cá bột, nhật ký StockMovement (Bán, Hao hụt, Phân giới, Nhập đẻ).

## Khác biệt giữa đề bài và source
1. React 18 (đề bài) khác React 19 (source: fiber 9, drei 10, postprocessing 3). React 18 phải dùng fiber 8, drei 9, postprocessing 2.
2. 7 dòng (có Tuxedo) khác 8 dòng trong source (có Moscow Blue, Galaxy Neon, không có Tuxedo).
3. Hủy đơn: đề bài cho ở CHO_XAC_NHAN/DA_XAC_NHAN/DANG_GIAO; source và ảnh orders cho ở PENDING/CONFIRMED/PACKING, ghi "chỉ hủy được trước khi giao".
4. BAO_HANH không có trong source (không có cột, không có bước timeline).
5. Đơn vị bán: CON_LE gộp đực/cái, source tách MALE/FEMALE với giá riêng.
6. API thiếu tham số q và sort mà ô tìm kiếm, dropdown sắp xếp cần.
7. LoCa đề bài thiếu số cá bột, bố mẹ, giai đoạn, nhật ký kho mà ảnh batches hiển thị.
8. Công tắc Admin/Nhân viên trong ảnh là demo, đề bài dùng phân quyền JWT thật.
9. Biểu đồ doanh thu source tự vẽ SVG, đề bài yêu cầu Recharts.
10. Source không có fallback WebGL và giảm hiệu ứng mobile; không dùng shadcn, Zustand, TanStack Query, RHF, Zod, Axios, Recharts.
