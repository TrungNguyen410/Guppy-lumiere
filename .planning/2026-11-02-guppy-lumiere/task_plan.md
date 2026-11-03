# Kế hoạch: Guppy Lumière

## Goal
Xây dựng website bán cá bảy màu "Guppy Lumière" (đồ án Xây dựng Phát triển Ứng dụng Hướng đối tượng) theo 8 pha, dừng cho người dùng kiểm tra sau mỗi pha.

## Next Step
Chờ người dùng kiểm tra Pha 7. Đây là pha cuối của đề bài.

## Current Phase
Pha 7

## Phases

### Phase 0: Đọc design-reference, báo cáo, tạo docs/jira/
**Status:** complete
- [x] Đọc source và ảnh, báo cáo
- [x] Tạo jira-plan.md, jira-import.csv, doi-chieu-de-bai-thiet-ke.md
- [x] GUPPY-139: người dùng xác nhận L1 (7 dòng), L2 (hủy theo đề bài) ngày 02/11/2026

### Phase 1: Khởi tạo backend + frontend, Docker Compose, Flyway, Swagger, in tree
**Status:** complete
- [x] Khung backend, frontend, Docker, Flyway, Swagger (story E2)
- [x] GUPPY-143: thư viện React 18, shadcn/ui, BrowserRouter, nginx fallback (phần tách OrderSummary, Logo làm ở Pha 6)
- [x] V1 đủ 19 bảng; V2 có 7 dòng cá và 2 tài khoản demo
- [x] Cây đầy đủ: tree-pha1.txt

### Phase 2: identity + catalog
**Status:** complete
- [x] Story E3 và phần backend của E4
- [x] GUPPY-148: dữ liệu hiển thị cho cá
- [x] GUPPY-152: đơn vị bán có giới tính
- [x] GUPPY-156: mở rộng API lọc, slug
- [x] GUPPY-167: seed 7 dòng và sản phẩm, phần backend
- [x] Seed lô cá (phần lô của GUPPY-205, làm sớm vì tồn kho sản phẩm cần lô)

### Phase 3: inventory + cart
**Status:** complete
- [x] Story E5, E6, phần backend
- [x] GUPPY-178: nhập đẻ, phân giới, nhật ký kho, phần backend
- [x] Sự kiện DonHangDaTaoEvent, DonHangDaHuyEvent và listener kho (ordering sẽ phát ở Pha 4)

### Phase 4: ordering + payment + promotion
**Status:** complete
- [x] Story E7, E8 và mã giảm giá, phần backend
- [x] GUPPY-187: quy tắc hủy đơn
- [x] GUPPY-190: lịch sử trạng thái
- [x] GUPPY-194: phí giao, thành phố, ghi chú
- [x] GUPPY-201: cổng thanh toán giả lập
- [x] GUPPY-205: seed đơn và lô khớp ảnh

### Phase 5: review, bảo hành, report
**Status:** complete
- [x] Đánh giá, bảo hành, thống kê, phần backend
- [x] GUPPY-211: trạng thái và quyền bảo hành, phần backend
- [x] GUPPY-219: đủ số liệu thống kê, phần backend
- [x] GUPPY-222: tham số tuKhoa cho API đơn và lô

### Phase 6: Frontend viết mới, nối API thật, so với screenshots
**Status:** complete
- [x] Toàn bộ phần giao diện của các story
- [x] GUPPY-160: giao diện theo vai trò
- [x] GUPPY-164: đăng nhập, đăng ký
- [x] GUPPY-171: phụ kiện
- [x] GUPPY-175: ảnh tĩnh, giảm hiệu ứng
- [x] GUPPY-183: giỏ từ server
- [x] GUPPY-198: bỏ đặt trước
- [x] GUPPY-208: hiển thị giảm giá
- [x] GUPPY-215: trang chưa có mẫu
- [x] GUPPY-225: liên kết chân trang
- [x] Phần giao diện của GUPPY-178, 211, 219, 222

### Phase 7: Unit test, README, chạy thử bằng Docker
**Status:** complete
- [x] Unit test DatHangUseCase, State đơn, Strategy giá (144 test qua)
- [x] README, chạy thử bằng Docker từ bản sao sạch (story E11)
- [x] Gửi thử trên trình duyệt các biểu mẫu còn lại của Pha 6, đo mobile 360 và 390px
- [ ] Kiểm tra đột biến dang dở: 2 đột biến chưa chạy, 1 đột biến chưa chạy lại vì máy thiếu bộ nhớ

## Decisions Made
| Quyết định | Lý do |
|---|---|
| Đặt file kế hoạch trong .planning/ thay vì gốc dự án | Giữ gốc GUPPY/ khớp cây thư mục bắt buộc ở mục 3 |
| design-reference/ chỉ đọc | Quy tắc mục 0 |
| Nghiệp vụ, API, công nghệ theo đề bài; giao diện theo thiết kế | Xử lý 23 điểm lệch L1–L23 |
| Task mới bắt đầu từ GUPPY-139 | Giữ nguyên mã cũ, gồm GUPPY-25 |
| Chỉ BaseEntity (common) dùng auditing của Spring Data | Domain của 9 module vẫn không import Spring |
| three 0.170 cùng fiber 8, drei 9, postprocessing 2 | Bộ tương thích React 18, đã chạy thật trong trình duyệt |
| Viết đủ schema ngay ở V1, seed bổ sung dần vào V2 | Đề bài chỉ có 2 file migration; khi V2 đổi thì chạy docker compose down -v |
| Thêm common/application cho BaseCrudService | Cây mục 3 chưa có chỗ cho Template Method dùng chung |
| Controller trả application/dto trực tiếp; presentation/response tạm chưa có lớp | Hình dạng API trùng DTO, tránh chép 2 lần lớp giống hệt |
| JWT, filter đặt ở common/config; kiểm tra tài khoản qua interface KiemTraPhien | common không phụ thuộc ngược identity; khóa tài khoản có tác dụng ngay |
| Xóa sản phẩm là ngừng bán | Đơn cũ và lô cá vẫn tham chiếu sản phẩm |
| Thêm cột san_pham.gia_thap_nhat | Lọc và sắp xếp theo giá bằng SQL cho cả cá và phụ kiện |
| Mật khẩu chỉ nhận ký tự ASCII | BCrypt giới hạn 72 byte, ký tự có dấu chiếm nhiều byte sẽ gây lỗi |
| Giữ tồn bằng khóa bi quan, thứ tự khóa cố định | Không bán vượt tồn và không deadlock; đã thử 8 đơn đồng thời |
| Listener kho chạy đồng bộ trong transaction đơn hàng | Thiếu tồn thì đơn rollback theo |
| Sửa lô không đổi được số cá | Số cá chỉ đổi qua nhập đẻ, phân giới, hao hụt để luôn có nhật ký |
| Gộp giỏ không chặn theo tồn, đánh dấu vuotTon | Khách không mất hàng đã chọn chỉ vì đăng nhập; chặn thật ở bước đặt hàng |
| Nhân viên, admin dùng giỏ theo session | Giỏ tài khoản chỉ dành cho khách hàng |
| Test tích hợp gắn tag tich-hop, không chạy khi build image | Cần MySQL thật; lệnh chạy ghi trong README |
| Đặt hàng lấy sản phẩm từ giỏ trên server, không nhận từ client | Client không gửi được giá hay sản phẩm giả |
| Khóa giỏ, đơn, mã giảm giá khi ghi | Chặn đặt trùng, hủy trùng, dùng mã vượt lượt |
| Cổng thanh toán giả lập, nhân viên xác nhận tiền | L10: đồ án không nối ngân hàng thật |
| Chưa chặn giao đơn chuyển khoản khi chưa nhận tiền | Đề bài không có quy tắc này; đã báo người dùng để quyết định |
| Thêm payment/infrastructure/gateway | Chỗ cho hiện thực cổng thanh toán, cây mục 3 chưa có |
| Giữ cho phép giao đơn chuyển khoản chưa nhận tiền | Người dùng trả lời OK, giữ theo đề bài |
| Seed 7 đơn sỉ và nhật ký hao hụt theo ngày khởi tạo CSDL | Tổng quan có số liệu thật giống ảnh mà không đổi 8 đơn mẫu; đổi lại số Hoàn tất là 9 thay vì 2 |
| Doanh thu tính theo ngày hoàn tất lần đầu | Tiền chỉ được tính khi giao xong |
| Kết thúc bảo hành chỉ qua API bảo hành | Để luôn ghi lại kết quả xử lý |
| Mỗi đơn chỉ yêu cầu bảo hành một lần | Tránh lạm dụng; đề bài không quy định số lần |
| Bảo hành không tự xuất cá đổi | Đề bài không quy định; nhân viên ghi kết quả và tự ghi hao hụt nếu cần |
| Thêm entities/gio-hang, entities/quan-tri, features bao-hanh và danh-gia, widgets TomTatDon và CaXoay3D, pages TaiKhoan, KhungXacThuc, admin QuanLyKhuyenMai, QuanLyTaiKhoan | Cây mục 3 chưa có chỗ cho các chức năng này |
| Thẻ Đơn vị bán không có dòng giá từ | API chỉ có giá thấp nhất theo sản phẩm, không có theo đơn vị; ghi cứng sẽ sai khi đổi giá |
| Hiệu ứng chuyển trang không dùng filter blur | blur(0) còn lại làm phần tử fixed định vị theo main |

## Errors Encountered
| Lỗi | Lần thử | Cách xử lý |
|---|---|---|
| UnicodeEncodeError khi in tiếng Việt do python -I bỏ qua PYTHONIOENCODING | 1 | Chạy lại với -X utf8 |
| Script .ps1 UTF-8 không BOM bị PowerShell 5.1 đọc sai | 1 | Ghi lại file có BOM |
| PowerShell thêm BOM vào câu SQL khi pipe sang mysql | 1 | Chạy SQL bằng Bash heredoc |
| LazyInitializationException khi sửa lô: @Transactional ở lớp con không áp dụng cho phương thức kế thừa BaseCrudService | 1 | Đặt @Transactional trên BaseCrudService, thêm BaseCrudServiceTest |
| Backend không khởi động: ThongKeUseCase có 2 constructor | 1 | Thêm @Autowired cho constructor chính |
| Backend không khởi động: Spring Data không quét repository lồng trong class | 1 | Tách thành DanhGiaJpaRepository, YeuCauBaoHanhJpaRepository |
| Hộp đặt hàng thành công lệch vị trí, sau hộp hiện tổng tiền âm | 1 | Bỏ filter ở chuyển trang, ẩn biểu mẫu sau khi đặt |
| Mobile: nút giỏ bị cắt, không có menu, cá ngoài khung hình, trang chi tiết tràn ngang | 1 | Sửa Header, thêm menu di động, lùi camera khi màn hình dọc, giới hạn vùng sáng |
| Chọn Phụ kiện khi còn bộ lọc cá ra 0 sản phẩm | 1 | Xóa bộ lọc chỉ dành cho cá khi đổi loại |
| Mở thẳng link #cham-soc không cuộn | 1 | Cuộn lần hai sau khi trang tải xong |
| Chrome treo khi tải 4 iframe có WebGL lúc kiểm tra mobile | 2 | Kiểm tra từng iframe một |
| Mở web qua http bằng IP: crypto.randomUUID không có, mọi API báo không kết nối được | 1 | Tự tạo UUID bằng getRandomValues, thêm chepVanBan cho nút chép mã |
| Đổi họ tên xong lời chào vẫn là tên cũ | 1 | Thêm doiHoTen vào usePhienStore |
| Thanh bước thanh toán sát mép màn hình 390px | 1 | Thu nhỏ khoảng cách và cỡ chữ ở mobile |
| Cú bấm của công cụ Chrome không tới trang quản trị (trình lắng nghe ở window không nhận sự kiện) | 3 | Chuyển sang Playwright trong Docker, bấm chuột thật đều chạy; nguyên nhân phía công cụ chưa xác định |
| Đột biến "bỏ kiểm tra đơn vị còn bán" sống sót | 1 | Test kiểm tra thêm nội dung thông báo |
| Hệ thống dừng lần chạy đột biến vì thiếu bộ nhớ | 1 | Không chạy lại; ghi nhận phần chưa kiểm tra |
