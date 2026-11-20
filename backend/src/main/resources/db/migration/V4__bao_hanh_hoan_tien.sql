-- Kết quả bảo hành có cấu trúc (đổi cá, hoàn tiền cá, từ chối) và hoàn tiền một phần cho thanh toán.

-- ===== Thanh toán: tổng tiền đã hoàn =====
ALTER TABLE thanh_toan ADD COLUMN so_tien_hoan DECIMAL(12, 0) NOT NULL DEFAULT 0 AFTER so_tien;
-- Đơn hủy trước đây được hoàn toàn bộ
UPDATE thanh_toan SET so_tien_hoan = so_tien WHERE trang_thai = 'DA_HOAN_TIEN';
ALTER TABLE thanh_toan ADD CONSTRAINT ck_thanh_toan_hoan CHECK (so_tien_hoan >= 0 AND so_tien_hoan <= so_tien);
ALTER TABLE thanh_toan ADD CONSTRAINT ck_thanh_toan_hoan_trang_thai CHECK (
    (trang_thai = 'DA_HOAN_TIEN' AND so_tien_hoan = so_tien)
    OR (trang_thai = 'DA_THANH_TOAN' AND so_tien_hoan < so_tien)
    OR (trang_thai = 'CHUA_THANH_TOAN' AND so_tien_hoan = 0));

-- ===== Yêu cầu bảo hành =====
ALTER TABLE yeu_cau_bao_hanh
    ADD COLUMN so_ca_chet   INT            NOT NULL DEFAULT 1 AFTER duong_dan_video,
    ADD COLUMN hinh_thuc    VARCHAR(20)    NULL AFTER so_ca_chet,
    ADD COLUMN so_tien_hoan DECIMAL(12, 0) NULL AFTER hinh_thuc;

-- Yêu cầu đã xử lý trước khi có cột hình thức được coi là đã đổi cá
UPDATE yeu_cau_bao_hanh SET hinh_thuc = 'DOI_CA' WHERE xu_ly_luc IS NOT NULL;

ALTER TABLE yeu_cau_bao_hanh
    ADD CONSTRAINT ck_bao_hanh_so_ca CHECK (so_ca_chet >= 1),
    ADD CONSTRAINT ck_bao_hanh_hinh_thuc CHECK (hinh_thuc IS NULL OR hinh_thuc IN ('DOI_CA', 'HOAN_TIEN', 'TU_CHOI')),
    -- Chưa xử lý thì chưa có hình thức; chỉ hoàn tiền mới có số tiền
    ADD CONSTRAINT ck_bao_hanh_xu_ly CHECK ((xu_ly_luc IS NULL) = (hinh_thuc IS NULL)),
    ADD CONSTRAINT ck_bao_hanh_tien_hoan CHECK (
        (hinh_thuc = 'HOAN_TIEN' AND so_tien_hoan > 0)
        OR ((hinh_thuc IS NULL OR hinh_thuc <> 'HOAN_TIEN') AND so_tien_hoan IS NULL));

-- Mỗi đơn chỉ một yêu cầu bảo hành; trước đây chỉ kiểm tra ở tầng ứng dụng
ALTER TABLE yeu_cau_bao_hanh ADD CONSTRAINT uk_bao_hanh_don UNIQUE (don_hang_id);
