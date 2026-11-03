# Guppy Lumière

Website bán cá bảy màu, đồ án môn Xây dựng Phát triển Ứng dụng Hướng đối tượng.

Khách xem và lọc cá, đặt hàng không cần tài khoản rồi tra cứu đơn bằng mã đơn và số điện thoại. Nhân viên xử lý đơn và quản lý lô cá. Admin quản lý sản phẩm, khuyến mãi, nhân viên và xem thống kê.

## Công nghệ
- **Backend:** Java 21, Spring Boot 3, JPA, Spring Security + JWT, Flyway, MySQL 8, springdoc, JUnit 5 + Mockito
- **Frontend:** React 18, TypeScript, Vite, Tailwind, shadcn/ui, React Router, TanStack Query, Zustand, React Hook Form + Zod, Three.js, Framer Motion, Recharts
- **Triển khai:** Docker Compose, Nginx

## Chạy dự án
Chỉ cần Docker Desktop đang chạy; không cần cài Java, Node hay MySQL. Các cổng 3000, 8080 và 3306 phải còn trống.

**PowerShell:**
```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

**Git Bash, macOS, Linux:**
```bash
cp .env.example .env
docker compose up -d --build
```

Khi chạy thật cần đổi các mật khẩu và `JWT_SECRET` trong `.env`; để chấm đồ án trên máy cá nhân thì giữ nguyên giá trị mẫu vẫn chạy được.

| Dịch vụ | Địa chỉ |
|---|---|
| Website | http://localhost:3000 |
| Swagger | http://localhost:8080/swagger-ui.html |
| phpMyAdmin (tùy chọn) | http://localhost:8081, chạy thêm `docker compose --profile tuy-chon up -d` |

Backend cần thêm khoảng nửa phút sau khi lệnh trên kết thúc để tạo bảng và nạp dữ liệu mẫu. Nếu web chưa có dữ liệu, chờ một lát rồi tải lại trang.

Dừng dự án: `docker compose down`. Xóa cả dữ liệu để về dữ liệu mẫu ban đầu: `docker compose down -v`.

## Tài khoản demo
| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | admin@guppylumiere.vn | Admin@123 |
| Nhân viên | nhanvien@guppylumiere.vn | Nhanvien@123 |
| Khách hàng | quocbao@example.com (cũng có giahuy, ngocmai, mylinh) | Khach@123 |

Trang quản trị nằm ở http://localhost:3000/quan-tri.

Tra cứu đơn mẫu: `GP24110931` / `0901234567`, `GP24110927` / `0912345678`, `GP24110899` / `0944777999`.

Mã giảm giá mẫu: `GUPPY10`, `KHAITRUONG20` dùng được; `HETHAN15` đã hết hạn; `TAMDUNG5` đang tắt. Cổng thanh toán là giả lập, không nhận tiền thật.

## Kiến trúc
Backend chia 9 module theo nghiệp vụ, thêm `common` dùng chung: `identity`, `catalog`, `inventory`, `cart`, `ordering`, `payment`, `promotion`, `review`, `report`. Trong mỗi module, phụ thuộc đi theo một chiều:

```
presentation → application → domain ← infrastructure
```

Frontend theo chiều `pages → widgets → features → entities → shared`.

## OOP và mẫu thiết kế
| Kỹ thuật | Áp dụng | Vị trí |
|---|---|---|
| Kế thừa, abstract | `NguoiMua`, `NhanSu`, `SanPham`, `ThanhToan` | `identity`, `catalog`, `payment` (`domain/model`) |
| JPA Inheritance | `SINGLE_TABLE` cho `NguoiDung`, `ThanhToan`; `JOINED` cho `SanPham` | như trên |
| Aggregate Root | `DonHang` gồm `ChiTietDonHang`, `ThongTinNguoiNhan` | `ordering/domain/model` |
| State | Chuyển trạng thái đơn | `ordering/domain/state/TrangThaiState.java` |
| Strategy + Factory | Giá và tồn theo đơn vị bán | `catalog/domain/model/ChienLuocBan.java`, `ChienLuocBanFactory.java` |
| Strategy + Factory | Phương thức thanh toán | `payment/domain/model/ThanhToan.java`, `ThanhToanFactory.java` |
| Observer | Tạo đơn thì giữ tồn, hủy đơn thì trả tồn và trả lượt mã | `ordering/domain/event`, các `infrastructure/listener` |
| Builder | Tạo đơn hàng, sản phẩm cá | `DonHang.java`, `CaGuppy.java` |
| Repository | Domain chỉ biết interface | `domain/repository`, hiện thực ở `infrastructure/persistence` |
| Template Method | Trình tự CRUD dùng chung | `common/application/BaseCrudService.java` |

## Kiểm thử
Unit test chạy tự động khi build image backend; test lỗi thì build dừng lại. Chạy riêng từ thư mục gốc dự án:

```powershell
docker run --rm -v "${PWD}\backend:/app" -w /app maven:3.9-eclipse-temurin-21 mvn -B test
```

Trên macOS, Linux thay `${PWD}\backend` bằng `"$PWD/backend"`.

Các test nghiệp vụ chính:
- `DatHangUseCaseTest`: đặt hàng cho khách vãng lai và khách hàng, giá, mã giảm giá, lỗi thiếu hàng
- `TrangThaiStateTest`: toàn bộ các cặp chuyển trạng thái đơn
- `ChienLuocBanTest`: giá, tồn khả dụng và số cá xuất kho theo từng đơn vị bán

Test giữ và trả tồn cần MySQL thật nên không chạy khi build image. Cần các dịch vụ đang chạy với dữ liệu mới seed, rồi chạy từ thư mục gốc dự án (PowerShell). Tên mạng `guppy_default` lấy theo tên thư mục dự án, đổi lại nếu bạn đặt thư mục tên khác. Ví dụ clone repo về thư mục `Guppy-lumiere` thì tên mạng là `guppy-lumiere_default`; xem tên đúng bằng `docker network ls`:

```powershell
docker run --rm --network guppy_default --env-file .env -v "${PWD}\backend:/app" -w /app maven:3.9-eclipse-temurin-21 mvn -B test "-Dgroups=tich-hop" "-DexcludedGroups=khong-co"
```

## Xử lý sự cố
- **Backend báo sai checksum Flyway:** file migration đã bị sửa sau khi CSDL được tạo. Chạy `docker compose down -v` rồi `docker compose up -d --build`. Lệnh này xóa toàn bộ dữ liệu MySQL của dự án.
- **Báo trùng cổng:** tắt chương trình đang dùng cổng 3000, 8080 hoặc 3306.
- **Không thấy cảnh 3D:** máy hoặc trình duyệt không hỗ trợ WebGL, web tự chuyển sang ảnh tĩnh.

## Tài liệu
- Kế hoạch Jira: `docs/jira/jira-plan.md`, tệp nhập: `docs/jira/jira-import.csv`
- Đối chiếu đề bài với thiết kế: `docs/jira/doi-chieu-de-bai-thiet-ke.md`
