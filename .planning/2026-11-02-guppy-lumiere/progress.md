# Nhật ký

## 2026-11-02 – Pha 0
- Đã đọc các file nguồn trong design-reference/source/guppy-ui/src và 11 ảnh; kết quả ở findings.md.
- Đã tạo docs/jira/jira-plan.md và docs/jira/jira-import.csv (138 dòng: 11 Epic, 35 Story, 92 Sub-task, 147 điểm).
- Script sinh CSV đọc lại file để kiểm tra khóa, quan hệ cha con, mẫu câu Story, thang Fibonacci, GUPPY-25: qua hết. Chưa import thử trên Jira thật.
- Không sửa gì trong design-reference/, không chạy npm.
- Người dùng yêu cầu so sánh lại điểm lệch và tạo lại task: đã viết docs/jira/doi-chieu-de-bai-thiet-ke.md (L1–L23), thêm 24 story GUPPY-139 đến GUPPY-225; backlog còn 227 dòng, 216 điểm.
- Người dùng xác nhận giữ 7 dòng và hủy đơn theo đề bài.

## 2026-11-02 – Pha 1
- Đã tạo backend, frontend, Docker Compose, Flyway, Swagger. docker compose up -d --build chạy được từ volume trống.
- Đã kiểm tra: Swagger 200, Authorize có; Flyway v1, v2 thành công; 19 bảng; 7 dòng cá; CHECK từ chối 3 ca sai, nhận ca đúng; proxy nginx trả 401 từ backend; deep link trả 200; 3D render, không lỗi console; test Maven 2/2 qua; phpMyAdmin 200; không có import ngược; không file nào trong design-reference bị đổi.
- Chưa kiểm tra: đăng nhập bằng tài khoản demo (API có ở Pha 2).
- Người dùng đồng ý sang Pha 2.

## 2026-11-02 – Pha 2
- Đã viết backend identity (đăng ký, đăng nhập JWT, phân quyền, hồ sơ, sổ địa chỉ, quản lý nhân viên) và catalog (sản phẩm, dòng cá, lọc, Strategy, Factory, quản trị). Seed 20 sản phẩm, 14 lô.
- Kết quả: 30 unit test đạt khi build; 167 kiểm tra đầu cuối trên MySQL thật đạt lần chạy đầu; ddl-auto validate qua. Script kiểm thử: scratchpad/e2e_p2.py.
- Sau kiểm thử đã chạy docker compose down -v để xóa dữ liệu thử.
- Giao diện chưa nối API (Pha 6). Kiểu dữ liệu trong entities/san-pham/model.ts của frontend sẽ cần khớp lại ở Pha 6.
- Người dùng đồng ý sang Pha 3.

## 2026-11-02 – Pha 3
- Đã viết backend inventory (CRUD lô, hao hụt, nhập đẻ, phân giới, nhật ký kho, giữ và trả tồn qua sự kiện) và cart (giỏ session, giỏ tài khoản, gộp giỏ, phí giao).
- Kiểm thử phát hiện và đã sửa lỗi có từ Pha 2: CRUD qua BaseCrudService chạy không có transaction bao ngoài.
- Test tích hợp 4/4 trên MySQL thật, gồm 8 đơn đồng thời mua 3 con cá cuối. E2E Pha 2: 167/167; E2E Pha 3: 105/105. Script ở scratchpad/e2e_p2.py, e2e_p3.py.
- Listener kho mới được kiểm thử bằng cách phát sự kiện trực tiếp; luồng đặt hàng thật có ở Pha 4.
- Người dùng đồng ý sang Pha 4.

## 2026-11-02 – Pha 4
- Đã viết backend ordering (State, DonHang, DatHangUseCase, tra cứu, hủy, chuyển trạng thái, lịch sử), payment (COD, chuyển khoản, cổng giả lập, xác nhận tiền, hoàn tiền) và promotion (mã giảm giá, trả lượt).
- Seed thêm 4 khách hàng, 4 mã giảm giá, 8 đơn theo thiết kế, nhật ký xuất kho.
- 100 unit test đạt; E2E Pha 4: 154/154 trên MySQL thật, gồm 4 ca đồng thời. Script: scratchpad/e2e_p4.py.
- Người dùng đồng ý sang Pha 5, giữ nguyên quy tắc giao đơn chuyển khoản.

## 2026-11-02 – Pha 5
- Đã viết backend review (đánh giá, điểm trung bình), bảo hành (yêu cầu, xử lý, hạn 24h), report (GET /admin/thong-ke), tìm kiếm tuKhoa cho đơn và lô.
- Backend hoàn thành, đủ API mục 5. Giao diện chưa nối API (Pha 6).
- Script E2E Pha 5: scratchpad/e2e_p5.py.
- Đang dừng chờ người dùng kiểm tra trước khi sang Pha 6.

## 2026-11-02 – Pha 6
- Viết xong frontend theo Feature-Sliced, nối API thật; build tsc và vite qua trong Docker.
- So 11 ảnh thiết kế trong Chrome ở màn 1536px; kiểm tra màn 390px bằng iframe vì cửa sổ Chrome không thu nhỏ được.
- Chạy thử: đặt đơn, mã giảm giá, tra cứu, hủy, gộp giỏ, chuyển trạng thái, sửa sản phẩm, tạo mã, tạo nhân viên, phân quyền nhân viên, ảnh tĩnh khi tắt WebGL.
- Backend không đổi ở pha này nên không chạy lại test backend.
- Đang chờ người dùng kiểm tra.

## Pha 7 (02/11/2026)
- Unit test: 144 qua. Thêm test cá thật, số cá xuất kho, hủy đơn theo trạng thái.
- Bản sao sạch dùng .env.example, build --no-cache: chạy được; 4 test tích hợp qua.
- Playwright trong Docker: các biểu mẫu lô, đánh giá, bảo hành, đăng ký, hồ sơ, địa chỉ, dòng cá, ngừng bán, khách vãng lai chuyển khoản đều qua; mobile 360, 390px không vượt mép.
- Sửa 3 lỗi giao diện: randomUUID trên http, lời chào sau khi đổi tên, thanh bước thanh toán ở mobile.
- Đột biến: 15/16 bị bắt ở lần chạy; 1 sống sót đã siết test nhưng chưa chạy lại; 2 chưa chạy do thiếu bộ nhớ.
