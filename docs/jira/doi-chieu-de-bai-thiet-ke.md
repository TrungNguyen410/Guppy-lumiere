# Đối chiếu đề bài với thiết kế

"Thiết kế" là `design-reference/source/guppy-ui/src` và `design-reference/screenshots`. Đường dẫn file trong bảng tính từ thư mục `src` đó.

**Nguyên tắc:** nghiệp vụ, API và công nghệ theo đề bài; màu, font, bố cục theo thiết kế. Thiết kế có mà đề bài chưa có thì thêm khi giao diện cần để chạy được.

**Trạng thái:** chủ dự án đã xác nhận ngày 02/11/2026: L1 giữ 7 dòng, L2 hủy đơn theo đề bài (GUPPY-139). Các mục còn lại làm theo quyết định trong bảng.

## Nghiệp vụ và dữ liệu
| Mã | Đề bài | Thiết kế | Quyết định | Task |
|---|---|---|---|---|
| L1 | 7 dòng: Full Gold, Koi, Dragon, Blue Grass, Albino, Mosaic, Tuxedo | 8 dòng, có Moscow Blue, Galaxy Neon, không có Tuxedo (`entities/fish/model/mock.ts:3`). Hero ghi "8 dòng" và "40+ dòng cá" (`pages/home/home-page.tsx:34,52`). Đơn GP24110931 có Galaxy Neon (`entities/order/model/mock.ts:7`) | Seed 7 dòng, giữ tên hiển thị trong ảnh, tạo bảng màu Tuxedo, sửa chữ hero. Đổi dòng Galaxy Neon của GP24110931 thành Tuxedo cùng giá để giữ tổng 255.000đ. Cá trang trí trong bể 3D, thanh trạng thái vẫn dùng màu Galaxy Neon làm hằng số giao diện | GUPPY-139, 167, 205 |
| L2 | Hủy ở CHO_XAC_NHAN, DA_XAC_NHAN, DANG_GIAO | Hủy ở Chờ xác nhận, Đã xác nhận, Đang đóng gói; ghi "chỉ hủy được trước khi giao" (`pages/admin/admin-orders.tsx:22,39`) | Theo đề bài, sửa nút và dòng chữ. Khách chỉ hủy ở CHO_XAC_NHAN, khớp thiết kế | GUPPY-139, 187 |
| L4 | CON_LE, CAP, BO_BA, LO_CA_BOT | MALE, FEMALE, PAIR, TRIO, FRY_LOT, đực và cái giá riêng (`entities/fish/model/types.ts:3`) | Giữ 4 đơn vị, CON_LE đi kèm giới tính và giá riêng | GUPPY-152 |
| L5 | Lọc dong, gioiTinh, kieuDuoi, donVi, giaMin, giaMax; xem chi tiết bằng id | Có ô tìm, sắp xếp, chọn nhiều giá trị, chỉ có thanh giá tối đa; URL dùng slug (`features/fish-filter/filter-panel.tsx:60`) | Thêm q, sapXep, nhiều giá trị, API theo slug; vẫn giữ giaMin trong API | GUPPY-156 |
| L6 | Dòng, kiểu đuôi, màu, giới tính, thuần chủng; nước 22–28°C, pH 6.8–7.8 | Cần thêm bảng màu, họa tiết, xuất xứ, nhãn, đánh giá, đã bán, kích thước, tuổi, mã lô, độ cứng, thông số nước riêng từng con (`entities/fish/model/types.ts:13,29`) | Thêm trường. Thông số nước riêng phải nằm trong khoảng đề bài | GUPPY-148 |
| L7 | LoCa: bể, ngày nở, đực, cái, hao hụt; API CRUD và hao hụt | Có thêm bố mẹ, cá bột, giai đoạn, nút Nhập đẻ, Phân giới, nhật ký kho (`pages/admin/admin-batches.tsx:49,58`) | Thêm trường, API nhập đẻ, phân giới, nhật ký | GUPPY-178 |
| L8 | Họ tên, SĐT, địa chỉ | Có thành phố, ghi chú, chỉ giao 3 thành phố, phí 50.000đ, miễn phí từ 500.000đ (`entities/cart/model/cart-store.tsx:63`) | Làm theo thiết kế, backend tự tính phí | GUPPY-194 |
| L9 | Không có đặt trước | Có nhãn và nút Đặt trước, không trừ kho (`pages/fish-detail/fish-detail-page.tsx:108`) | Bỏ, hiện Hết hàng. Ảnh catalog có nhãn này sẽ khác | GUPPY-198 |
| L10 | Tác nhân Cổng thanh toán | QR giả, ghi "xác nhận tự động" (`features/checkout/checkout-form.tsx:55`) | Cổng giả lập, nhân viên xác nhận đã nhận tiền, sửa dòng chữ | GUPPY-201 |
| L11 | Không nêu lịch sử trạng thái | Thanh trạng thái cần thời gian từng bước (`entities/order/model/types.ts:30`) | Thêm LichSuTrangThai | GUPPY-190 |
| L12 | BAO_HANH; POST /bao-hanh chỉ cho KHACH_HANG | Không có trạng thái này; nút báo cá chết hiện cả cho khách vãng lai, nói gửi video (`pages/order-lookup/order-lookup-page.tsx:53`) | Thêm cột và bước Bảo hành, chỉ cho thành viên, nhận mô tả và đường dẫn video | GUPPY-211 |
| L13 | Giỏ trên server theo X-Session-Id | Giỏ localStorage, sẵn 3 dòng giả nên ảnh luôn có số 4 (`entities/cart/model/cart-store.tsx:13`) | Giỏ server, mới vào là trống; muốn chụp giống ảnh thì thêm 3 dòng đó | GUPPY-183 |
| L17 | Có PhuKien | Chỉ có cá | Thêm bộ lọc loại và biến thể thẻ, trang chi tiết | GUPPY-171 |
| L18 | Mã giảm giá theo %, có hạn | Không có ô nhập, không có dòng giảm | Thêm vào ThanhToan và OrderSummary | GUPPY-208 |

## Giao diện và phân quyền
| Mã | Đề bài | Thiết kế | Quyết định | Task |
|---|---|---|---|---|
| L14 | Phân quyền JWT | Công tắc Admin/Nhân viên, biểu tượng quản trị cho mọi người (`pages/admin/admin-layout.tsx:57`, `widgets/header/header.tsx:56`) | Bỏ công tắc, ẩn biểu tượng với khách. Ảnh quản trị sẽ khác ở chỗ này | GUPPY-160 |
| L15 | 2 trang DangNhap, DangKy | 1 trang 2 tab, có Ghi nhớ, Quên mật khẩu (`features/auth/auth-card.tsx:36,42`) | 2 route dùng chung AuthCard; không có API quên mật khẩu nên báo liên hệ cửa hàng | GUPPY-164 |
| L16 | QuanLySanPham, API khuyến mãi, nhân viên, hồ sơ, lịch sử đơn | Không có ảnh, menu trỏ `#` (`pages/admin/admin-layout.tsx:17`) | Tự thiết kế cùng phong cách. Thêm trang ngoài cây mục 3 khi đề bài có API mà chưa có trang | GUPPY-215 |
| L19 | Recharts, GET /admin/thong-ke | SVG tự vẽ, số và ngày ghi cứng (`pages/admin/admin-dashboard.tsx:24,110`) | Dùng Recharts và số thật | GUPPY-219 |
| L20 | Không có API tìm kiếm quản trị | Có ô tìm, chuông, số 2 ghi cứng (`pages/admin/admin-layout.tsx:15,56,65`) | Thêm tuKhoa, số lấy từ đơn chờ thật | GUPPY-222 |
| L21 | Ảnh tĩnh khi không có WebGL, giảm hiệu ứng mobile | Chưa có | Làm mới | GUPPY-175 |
| L23 | Không nêu | Liên kết chân trang chưa có đích (`widgets/footer/footer.tsx:22`) | Nối đích hoặc bỏ | GUPPY-225 |

## Công nghệ và kiến trúc
| Mã | Đề bài | Thiết kế | Quyết định | Task |
|---|---|---|---|---|
| L3 | React 18 | React 19, fiber 9, drei 10, postprocessing 3 | Theo đề bài, dùng phiên bản tương thích React 18 | GUPPY-143 |
| L22 | shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, Axios | Không dùng; có HashRouter (`app/app.tsx:7`) và import sai tầng (`pages/checkout/checkout-page.tsx:14`, `widgets/footer/footer.tsx:2`) | Theo đề bài, dùng BrowserRouter, tách lại đúng tầng | GUPPY-143 |

## Tác động
- **Sẽ khác ảnh có chủ đích:** catalog và đơn hàng (L1, L9), nút hủy trên bảng đơn (L2), công tắc quản trị (L14), số 4 trên giỏ (L13).