-- Bổ sung họa tiết, kiểu đuôi theo các lớp IFGA và tên gọi phổ biến ở Việt Nam; sửa dữ liệu mẫu lệch quy tắc.

-- ===== Họa tiết: thêm TUXEDO (Half Black), SNAKESKIN (Cobra), DRAGON (vảy rồng ánh kim) =====
ALTER TABLE dong_ca DROP CHECK ck_dong_ca_hoa_tiet;
ALTER TABLE dong_ca ADD CONSTRAINT ck_dong_ca_hoa_tiet
    CHECK (hoa_tiet IN ('SOLID', 'MOSAIC', 'GRASS', 'KOI', 'TUXEDO', 'SNAKESKIN', 'DRAGON'));

-- ===== Kiểu đuôi: thêm KIM (pintail), CO (flagtail) =====
ALTER TABLE ca_guppy DROP CHECK ck_ca_guppy_kieu_duoi;
ALTER TABLE ca_guppy ADD CONSTRAINT ck_ca_guppy_kieu_duoi
    CHECK (kieu_duoi IN ('DELTA', 'TRON', 'KIEM_DOI', 'VOAN', 'DAN', 'THUONG', 'KIM', 'CO'));

-- Tuxedo là họa tiết nửa thân sau sẫm màu, không phải một màu; Rồng Đỏ là họa tiết vảy rồng
UPDATE dong_ca SET hoa_tiet = 'TUXEDO' WHERE ma = 'tuxedo';
UPDATE dong_ca SET hoa_tiet = 'DRAGON' WHERE ma = 'rong-do';

-- Giai đoạn lô phải khớp quy tắc của LoCa.tinhLaiGiaiDoan: còn cá bột và đã có cá trưởng thành là DANG_PHAN_GIOI
UPDATE lo_ca SET giai_doan = CASE
    WHEN so_ca_bot = 0 THEN 'TRUONG_THANH'
    WHEN so_duc > 0 OR so_cai > 0 THEN 'DANG_PHAN_GIOI'
    ELSE 'CA_BOT' END;

-- Tuổi bán và số con mỗi lô có giới hạn như ở API
ALTER TABLE ca_guppy ADD CONSTRAINT ck_ca_guppy_tuoi CHECK (tuoi_tuan BETWEEN 0 AND 104);
ALTER TABLE ca_guppy ADD CONSTRAINT ck_ca_guppy_so_con_toi_da CHECK (so_con_moi_lo <= 500);

-- ===== Dòng cá mới =====
INSERT INTO dong_ca (ma, ten, xuat_xu, hoa_tiet, mau_than, mau_duoi_1, mau_duoi_2, mau_nhan) VALUES
    ('moscow-blue',       'Moscow Blue',       'Nga',      'SOLID',     '#1e40af', '#2563eb', '#0f172a', '#93c5fd'),
    ('king-cobra',        'King Cobra',        'Thái Lan', 'SNAKESKIN', '#bef264', '#65a30d', '#1a2e05', '#d9f99d'),
    ('half-black-yellow', 'Half Black Yellow', 'Nhật Bản', 'TUXEDO',    '#fef08a', '#facc15', '#a16207', '#fef9c3');

INSERT INTO san_pham (loai_san_pham, ten, slug, mo_ta, diem_danh_gia, so_danh_gia, da_ban, gia_thap_nhat) VALUES
    ('CA_GUPPY', 'Moscow Blue Đuôi Quạt', 'moscow-blue-duoi-quat', 'Dòng Moscow từ giới chơi cá Nga, toàn thân xanh thẫm ánh kim, vây lưng và đuôi quạt cùng màu. Cá đực trưởng thành có thân dày, màu đậm dần theo tuổi.', 0.0, 0, 0, 0),
    ('CA_GUPPY', 'King Cobra Đuôi Kim', 'king-cobra-duoi-kim', 'Vân da rắn chạy dọc thân và lan ra vây, đuôi kim ngắn có tia giữa kéo dài. Dòng cá khỏe, bơi nhanh, hợp bể cộng đồng.', 0.0, 0, 0, 0),
    ('CA_GUPPY', 'Half Black Yellow Đuôi Cờ', 'half-black-yellow-duoi-co', 'Nửa thân trước vàng, nửa thân sau đen kiểu Tuxedo, đuôi cờ vuông vức màu vàng tươi. Dòng lai tạo Nhật Bản.', 0.0, 0, 0, 0);

INSERT INTO san_pham_nhan (san_pham_id, nhan)
SELECT s.id, v.nhan
FROM (VALUES
    ROW('moscow-blue-duoi-quat', 'MOI_VE'),
    ROW('king-cobra-duoi-kim', 'HIEM'),
    ROW('half-black-yellow-duoi-co', 'MOI_VE')
) AS v (slug, nhan)
JOIN san_pham s ON s.slug = v.slug;

INSERT INTO ca_guppy (san_pham_id, dong_ca_id, kieu_duoi, mau_sac, kich_thuoc, tuoi_tuan, so_con_moi_lo, nhiet_do_min, nhiet_do_max, ph_min, ph_max)
SELECT s.id, d.id, v.kieu_duoi, v.mau_sac, v.kich_thuoc, v.tuoi, v.so_con, v.t_min, v.t_max, v.ph_min, v.ph_max
FROM (VALUES
    ROW('moscow-blue-duoi-quat',     'moscow-blue',       'DELTA', 'Xanh thẫm ánh kim',      '3.5–4 cm', 16, 10, 23.0, 27.0, 7.0, 7.8),
    ROW('king-cobra-duoi-kim',       'king-cobra',        'KIM',   'Xanh lá vân rắn',        '3–3.5 cm', 14, 10, 22.0, 28.0, 6.8, 7.8),
    ROW('half-black-yellow-duoi-co', 'half-black-yellow', 'CO',    'Vàng, nửa thân sau đen', '3–3.5 cm', 13, 10, 22.0, 28.0, 6.8, 7.8)
) AS v (slug, dong, kieu_duoi, mau_sac, kich_thuoc, tuoi, so_con, t_min, t_max, ph_min, ph_max)
JOIN san_pham s ON s.slug = v.slug
JOIN dong_ca d ON d.ma = v.dong;

-- Giá cặp không cao hơn 1 đực + 1 cái, bộ ba không cao hơn 1 đực + 2 cái, như quy tắc trong CaGuppy
INSERT INTO gia_ban_ca (ca_guppy_id, don_vi, gioi_tinh, gia)
SELECT s.id, v.don_vi, v.gioi_tinh, v.gia
FROM (VALUES
    ROW('moscow-blue-duoi-quat', 'CON_LE', 'DUC', 90000), ROW('moscow-blue-duoi-quat', 'CON_LE', 'CAI', 70000),
    ROW('moscow-blue-duoi-quat', 'CAP', 'KHONG_AP_DUNG', 150000), ROW('moscow-blue-duoi-quat', 'BO_BA', 'KHONG_AP_DUNG', 210000),
    ROW('king-cobra-duoi-kim', 'CON_LE', 'DUC', 75000), ROW('king-cobra-duoi-kim', 'CON_LE', 'CAI', 55000),
    ROW('king-cobra-duoi-kim', 'CAP', 'KHONG_AP_DUNG', 120000), ROW('king-cobra-duoi-kim', 'BO_BA', 'KHONG_AP_DUNG', 170000),
    ROW('half-black-yellow-duoi-co', 'CON_LE', 'DUC', 60000), ROW('half-black-yellow-duoi-co', 'CON_LE', 'CAI', 45000),
    ROW('half-black-yellow-duoi-co', 'CAP', 'KHONG_AP_DUNG', 99000), ROW('half-black-yellow-duoi-co', 'BO_BA', 'KHONG_AP_DUNG', 139000)
) AS v (slug, don_vi, gioi_tinh, gia)
JOIN san_pham s ON s.slug = v.slug;

UPDATE san_pham s
JOIN (SELECT ca_guppy_id, MIN(gia) AS gia FROM gia_ban_ca GROUP BY ca_guppy_id) g ON g.ca_guppy_id = s.id
SET s.gia_thap_nhat = g.gia
WHERE s.slug IN ('moscow-blue-duoi-quat', 'king-cobra-duoi-kim', 'half-black-yellow-duoi-co');

INSERT INTO lo_ca (ma_lo, ca_guppy_id, bo_me, be_nuoi, ngay_no, so_duc, so_cai, so_ca_bot, hao_hut, giai_doan)
SELECT v.ma_lo, s.id, v.bo_me, v.be, v.ngay_no, v.duc, v.cai, v.bot, v.hao_hut, 'TRUONG_THANH'
FROM (VALUES
    ROW('LO-2411-MB', 'moscow-blue-duoi-quat',     'MB-01 × MB-04', 'Bể E1', DATE '2026-08-01', 7, 10, 0, 1),
    ROW('LO-2411-KC', 'king-cobra-duoi-kim',       'KC-02 × KC-05', 'Bể E2', DATE '2026-08-10', 6,  8, 0, 2),
    ROW('LO-2411-HB', 'half-black-yellow-duoi-co', 'HB-03 × HB-06', 'Bể E3', DATE '2026-08-12', 9, 12, 0, 1)
) AS v (ma_lo, slug, bo_me, be, ngay_no, duc, cai, bot, hao_hut)
JOIN san_pham s ON s.slug = v.slug;

INSERT INTO bien_dong_kho (lo_ca_id, loai, delta_duc, delta_cai, delta_bot, ghi_chu)
SELECT l.id, 'HAO_HUT', 0, -l.hao_hut, 0, 'Hao hụt khi nuôi'
FROM lo_ca l
WHERE l.ma_lo IN ('LO-2411-MB', 'LO-2411-KC', 'LO-2411-HB');
