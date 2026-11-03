# Kế hoạch Jira – Guppy Lumière

## 1. Cấu hình dự án
| Mục | Giá trị |
|---|---|
| Phương pháp | Scrum |
| Project key | GUPPY |
| Workflow | To Do → In Progress → Code Review → Testing → Done |
| Sprint | 6 sprint, mỗi sprint 2 tuần |
| Backlog | 11 Epic, 59 Story, 157 Sub-task, 216 story point |

GUPPY-139 trở đi là các task xử lý điểm lệch, xem `doi-chieu-de-bai-thiet-ke.md`.

## 2. Epic
| Mã | Epic | Điểm |
|---|---|---|
| E1 | Phân tích & Thiết kế | 17 |
| E2 | Hạ tầng | 17 |
| E3 | Xác thực & Phân quyền | 18 |
| E4 | Danh mục sản phẩm | 43 |
| E5 | Tồn kho & Lô cá | 18 |
| E6 | Giỏ hàng | 11 |
| E7 | Đặt hàng & Thanh toán | 36 |
| E8 | Quản lý đơn | 13 |
| E9 | Khuyến mãi & Đánh giá | 23 |
| E10 | Thống kê | 8 |
| E11 | Kiểm thử & Triển khai | 12 |

## 3. Sprint
| Sprint | Mục tiêu | Epic | Story | Điểm |
|---|---|---|---|---|
| S1 Phân tích & Thiết kế | Chốt nghiệp vụ, điểm lệch, sơ đồ lớp, ERD, đặc tả API | E1 | 4 | 17 |
| S2 Nền tảng | Backend, frontend, Docker, Flyway, Swagger chạy được | E2 | 5 | 17 |
| S3 Xác thực & Sản phẩm | Đăng nhập, phân quyền, danh mục, dữ liệu mẫu | E3, E4 | 14 | 50 |
| S4 Tồn kho & Giỏ hàng | Lô cá, giữ và trả tồn, giỏ hàng, trang chủ 3D | E4, E5, E6 | 10 | 40 |
| S5 Đặt hàng | Đặt hàng, thanh toán, tra cứu, duyệt đơn | E7, E8 | 13 | 46 |
| S6 Hoàn thiện | Khuyến mãi, đánh giá, bảo hành, thống kê, kiểm thử | E8, E9, E10, E11 | 13 | 46 |

S3 đến S6 nặng gấp 2–3 lần S1, S2. Sau S2, nếu velocity thực tế thấp hơn, giảm theo thứ tự: GUPPY-225, GUPPY-222, GUPPY-171, rồi các trang quản trị không có ảnh mẫu trong GUPPY-215.

## 4. Quy ước
- **Story point:** Fibonacci 1, 2, 3, 5, 8, 13. Story từ 13 điểm trở lên phải tách nhỏ.
- **Story:** viết theo mẫu "Là..., tôi muốn..., để...", luôn có tiêu chí chấp nhận.
- **Nhánh:** `feature/GUPPY-xx-ten`, ví dụ `feature/GUPPY-25-khach-vang-lai-dat-hang`.
- **Commit:** ghi mã issue, ví dụ `GUPPY-25: thêm API đặt hàng cho khách vãng lai`.
- **Hoàn thành khi:** đạt hết tiêu chí chấp nhận, code đã được review, test qua, đã merge.

## 5. Nghi thức Scrum
| Nghi thức | Thời điểm | Nội dung |
|---|---|---|
| Sprint Planning | Đầu sprint | Chọn story, chia sub-task, cam kết mục tiêu |
| Daily Scrum | Mỗi ngày, tối đa 15 phút | Đã làm gì, sẽ làm gì, vướng gì |
| Sprint Review | Cuối sprint | Demo phần chạy được |
| Sprint Retrospective | Sau Review | Giữ gì, bỏ gì, thử gì |

**Burndown:** theo dõi bằng Burndown Chart của Jira theo story point. Đường thực tế cao hơn đường lý tưởng quá 2 ngày liên tiếp thì nêu ở Daily và cân nhắc giảm phạm vi.

## 6. Import vào Jira
1. Tạo project Scrum key GUPPY, loại company-managed, thêm các trạng thái workflow ở mục 1.
2. Tạo sẵn 6 sprint với tên đúng như cột Sprint trong CSV.
3. Vào **Settings → System → External System Import → CSV**, chọn `jira-import.csv`, mã hóa UTF-8.
4. Ánh xạ cột:

| Cột CSV | Trường Jira |
|---|---|
| Issue Key | Issue Key |
| Issue Id | Issue Id |
| Parent Id | Parent Id |
| Issue Type | Issue Type |
| Summary | Summary |
| Epic Name | Epic Name |
| Epic Link | Epic Link |
| Description | Description |
| Story Points | Story Points |
| Sprint | Sprint |
| Labels | Labels |

Cột Acceptance Criteria chỉ ánh xạ khi site có trường tùy chỉnh này, vì nội dung đã nằm sẵn trong Description.

Nên chạy thử bước Validate của trình import trước. Tên trường có thể khác nhau giữa các site Jira; file này chưa được import thử trên Jira thật.
