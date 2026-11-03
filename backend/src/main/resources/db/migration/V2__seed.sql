-- Dữ liệu mẫu cho đồ án. Số cá trong lô là tồn hiện tại, đã trừ phần của các đơn mẫu.

-- 7 dòng cá theo đề bài: Koi, Dragon, Albino, Mosaic hiển thị theo tên trong thiết kế
INSERT INTO dong_ca (ma, ten, xuat_xu, hoa_tiet, mau_than, mau_duoi_1, mau_duoi_2, mau_nhan) VALUES
    ('full-gold',    'Full Gold',       'Thái Lan', 'SOLID',  '#fcd34d', '#fbbf24', '#f97316', '#fff7ed'),
    ('koi',          'Koi Tricolor',    'Nhật Bản', 'KOI',    '#f8fafc', '#f43f5e', '#0f172a', '#fb7185'),
    ('rong-do',      'Rồng Đỏ',         'Thái Lan', 'MOSAIC', '#fecaca', '#ef4444', '#7f1d1d', '#fca5a5'),
    ('blue-grass',   'Blue Grass',      'Đài Loan', 'GRASS',  '#bae6fd', '#38bdf8', '#1e3a8a', '#0ea5e9'),
    ('albino',       'Albino Full Red', 'Malaysia', 'SOLID',  '#ffe4e6', '#fb7185', '#e11d48', '#ffffff'),
    ('black-mosaic', 'Black Mosaic',    'Đức',      'MOSAIC', '#cbd5e1', '#334155', '#a855f7', '#94a3b8'),
    ('tuxedo',       'Tuxedo',          'Việt Nam', 'SOLID',  '#e2e8f0', '#2dd4bf', '#134e4a', '#94a3b8');

-- Tài khoản demo cho đồ án, mật khẩu ghi trong README, không dùng cho môi trường thật
INSERT INTO nguoi_dung (loai_nguoi_dung, ho_ten, email, so_dien_thoai, mat_khau_hash) VALUES
    ('ADMIN',     'Quản trị viên', 'admin@guppylumiere.vn',    '0909000777', '$2b$10$WLAjRJ8bRjpvBkuuVKXabuqCEmvdfs74O6oKVxSD6rBzcgg59fvVW'),
    ('NHAN_VIEN', 'Nhân viên kho', 'nhanvien@guppylumiere.vn', '0909000778', '$2b$10$YpqLn6PxV1JQvhzpYJwmkOKOeov0VCsNLBmXoFrxl4BX6qiN86EwG');

-- 20 sản phẩm: 14 cá và 6 phụ kiện. gia_thap_nhat được tính lại ở cuối file.
INSERT INTO san_pham (loai_san_pham, ten, slug, mo_ta, diem_danh_gia, so_danh_gia, da_ban, gia_thap_nhat) VALUES
    ('CA_GUPPY', 'Full Gold Đuôi Quạt', 'full-gold-duoi-quat', 'Dòng Full Gold vàng kim óng ánh từ đầu tới đuôi, vây quạt xòe rộng 180°. Cá khỏe, dễ nuôi, rất hợp bể thủy sinh sáng màu.', 4.9, 214, 812, 0),
    ('CA_GUPPY', 'Koi Tricolor Đuôi Tròn', 'koi-tricolor-duoi-tron', 'Họa tiết ba màu đỏ, trắng, đen như cá Koi Nhật, đầu đỏ đặc trưng. Đuôi tròn gọn, bơi chậm rãi rất sang.', 4.8, 96, 341, 0),
    ('CA_GUPPY', 'Rồng Đỏ Đuôi Voan', 'rong-do-duoi-voan', 'Thân vảy rồng ánh kim, đuôi voan đỏ thẫm buông mềm như lụa. Dòng cá tuyển chọn thi đấu, số lượng giới hạn.', 5.0, 41, 128, 0),
    ('CA_GUPPY', 'Blue Grass Đuôi Quạt', 'blue-grass-duoi-quat', 'Đuôi xanh lam điểm hạt mè như thảm cỏ, ánh lên dưới đèn LED. Dòng cá quốc dân cho người mới.', 4.7, 150, 560, 0),
    ('CA_GUPPY', 'Albino Full Red Đuôi Đàn', 'albino-full-red-duoi-dan', 'Mắt đỏ ruby, toàn thân đỏ rực. Đuôi đàn lia hai thùy cong vút. Lứa hiện tại chưa đủ tuổi xuất bán.', 4.9, 30, 97, 0),
    ('CA_GUPPY', 'Black Mosaic Đuôi Quạt', 'black-mosaic-duoi-quat', 'Họa tiết khảm mosaic đen ánh tím trên nền bạc. Vây quạt to bản, phù hợp chụp ảnh và thi đấu.', 4.7, 58, 188, 0),
    ('CA_GUPPY', 'Lô Cá Bột Full Gold', 'lo-ca-bot-full-gold', 'Lô 20 cá bột 3 tuần tuổi chưa phân giới tính, bố mẹ Full Gold thuần chủng. Phù hợp người muốn tự nuôi lớn và tuyển chọn.', 4.5, 22, 76, 0),
    ('CA_GUPPY', 'Tuxedo Kiếm Đôi', 'tuxedo-kiem-doi', 'Nửa thân sau sẫm màu như áo tuxedo, ánh xanh ngọc. Hai kiếm đuôi trên dưới cực độc đáo, lai tạo tại trại Việt Nam.', 4.8, 118, 402, 0),
    ('CA_GUPPY', 'Tuxedo Đuôi Thuổng', 'tuxedo-duoi-thuong', 'Tuxedo cổ điển với đuôi thuổng mũi nhọn, màu cực bền, dễ giữ dáng qua nhiều lứa.', 4.6, 67, 233, 0),
    ('CA_GUPPY', 'Full Gold Đuôi Thuổng', 'full-gold-duoi-thuong', 'Biến thể Full Gold thân thon, đuôi thuổng gọn, hợp bể nhỏ và bể cộng đồng.', 4.6, 35, 120, 0),
    ('CA_GUPPY', 'Koi Tricolor Đuôi Quạt', 'koi-tricolor-duoi-quat', 'Mảng đỏ đen rõ nét trên nền trắng, đuôi quạt xòe rộng làm nổi bật họa tiết Koi.', 4.7, 44, 156, 0),
    ('CA_GUPPY', 'Rồng Đỏ Đuôi Đàn', 'rong-do-duoi-dan', 'Vảy rồng đỏ kết hợp đuôi đàn hai thùy, dòng tuyển chọn số lượng rất ít.', 4.9, 20, 64, 0),
    ('CA_GUPPY', 'Blue Grass Kiếm Đôi', 'blue-grass-kiem-doi', 'Hạt mè xanh trên đuôi kiếm đôi mảnh, bơi nhanh, ánh lam rõ dưới đèn trắng.', 4.5, 28, 98, 0),
    ('CA_GUPPY', 'Black Mosaic Đuôi Voan', 'black-mosaic-duoi-voan', 'Khảm đen ánh tím trên đuôi voan buông dài, dáng bơi mềm mại.', 4.6, 19, 72, 0),
    ('PHU_KIEN', 'Cám Vi Sinh Lên Màu 50g', 'cam-vi-sinh-len-mau-50g', 'Cám hạt nhỏ giàu astaxanthin, giúp cá lên màu và không làm đục nước.', 4.8, 60, 240, 45000),
    ('PHU_KIEN', 'Trùn Chỉ Sấy Khô 30g', 'trun-chi-say-kho-30g', 'Thức ăn đạm cao cho cá trưởng thành và cá sinh sản, bảo quản dễ dàng.', 4.6, 34, 131, 35000),
    ('PHU_KIEN', 'Bể Kính Siêu Trong 30cm', 'be-kinh-sieu-trong-30cm', 'Bể kính 30 x 20 x 20 cm, phù hợp nuôi một bộ ba hoặc ươm cá bột.', 4.9, 12, 47, 350000),
    ('PHU_KIEN', 'Lọc Vi Sinh Mini', 'loc-vi-sinh-mini', 'Lọc treo êm, dòng chảy nhẹ không cuốn cá bột, dùng cho bể dưới 40 lít.', 4.7, 25, 88, 120000),
    ('PHU_KIEN', 'Muối Khoáng Cho Cá 200g', 'muoi-khoang-cho-ca-200g', 'Bổ sung khoáng, hỗ trợ cá phục hồi sau vận chuyển và thay nước.', 4.5, 16, 62, 55000),
    ('PHU_KIEN', 'Thuốc Xanh Methylen 20ml', 'thuoc-xanh-methylen-20ml', 'Hỗ trợ xử lý nấm và ký sinh ngoài da, dùng đúng liều theo hướng dẫn.', 4.4, 9, 39, 30000);

INSERT INTO san_pham_nhan (san_pham_id, nhan)
SELECT s.id, v.nhan
FROM (VALUES
    ROW('full-gold-duoi-quat', 'HOT'),
    ROW('koi-tricolor-duoi-tron', 'MOI_VE'),
    ROW('rong-do-duoi-voan', 'HIEM'),
    ROW('blue-grass-duoi-quat', 'HOT'),
    ROW('blue-grass-duoi-quat', 'GIAM_GIA'),
    ROW('albino-full-red-duoi-dan', 'HIEM'),
    ROW('black-mosaic-duoi-quat', 'GIAM_GIA'),
    ROW('tuxedo-kiem-doi', 'MOI_VE'),
    ROW('tuxedo-kiem-doi', 'HOT'),
    ROW('koi-tricolor-duoi-quat', 'HOT'),
    ROW('rong-do-duoi-dan', 'HIEM'),
    ROW('black-mosaic-duoi-voan', 'MOI_VE'),
    ROW('cam-vi-sinh-len-mau-50g', 'HOT')
) AS v (slug, nhan)
JOIN san_pham s ON s.slug = v.slug;

-- Thông số nước riêng từng con đều nằm trong khoảng 22–28°C, pH 6.8–7.8
INSERT INTO ca_guppy (san_pham_id, dong_ca_id, kieu_duoi, mau_sac, kich_thuoc, tuoi_tuan, so_con_moi_lo, nhiet_do_min, nhiet_do_max, ph_min, ph_max)
SELECT s.id, d.id, v.kieu_duoi, v.mau_sac, v.kich_thuoc, v.tuoi, v.so_con, v.t_min, v.t_max, v.ph_min, v.ph_max
FROM (VALUES
    ROW('full-gold-duoi-quat',      'full-gold',    'DELTA',    'Vàng kim',          '3–4 cm',     14, 10, 22.0, 28.0, 6.8, 7.8),
    ROW('koi-tricolor-duoi-tron',   'koi',          'TRON',     'Đỏ, trắng, đen',    '3–3.5 cm',   16, 10, 23.0, 28.0, 6.8, 7.8),
    ROW('rong-do-duoi-voan',        'rong-do',      'VOAN',     'Đỏ thẫm',           '4–4.5 cm',   18, 10, 22.0, 28.0, 6.8, 7.8),
    ROW('blue-grass-duoi-quat',     'blue-grass',   'DELTA',    'Xanh lam',          '3–4 cm',     12, 10, 22.0, 28.0, 6.8, 7.8),
    ROW('albino-full-red-duoi-dan', 'albino',       'DAN',      'Đỏ rực',            '3.5–4 cm',   15, 10, 24.0, 27.0, 6.8, 7.8),
    ROW('black-mosaic-duoi-quat',   'black-mosaic', 'DELTA',    'Đen ánh tím',       '3.5–4 cm',   15, 10, 22.0, 28.0, 6.8, 7.6),
    ROW('lo-ca-bot-full-gold',      'full-gold',    'DELTA',    'Vàng kim',          '0.8–1.2 cm',  3, 20, 25.0, 28.0, 6.8, 7.8),
    ROW('tuxedo-kiem-doi',          'tuxedo',       'KIEM_DOI', 'Bạc và xanh ngọc',  '3–4 cm',     11, 10, 22.0, 28.0, 6.8, 7.8),
    ROW('tuxedo-duoi-thuong',       'tuxedo',       'THUONG',   'Bạc và xanh ngọc',  '3–3.5 cm',   13, 10, 22.0, 28.0, 6.8, 7.8),
    ROW('full-gold-duoi-thuong',    'full-gold',    'THUONG',   'Vàng kim',          '3–3.5 cm',   13, 10, 22.0, 28.0, 6.8, 7.8),
    ROW('koi-tricolor-duoi-quat',   'koi',          'DELTA',    'Đỏ, trắng, đen',    '3–4 cm',     15, 10, 23.0, 28.0, 6.8, 7.8),
    ROW('rong-do-duoi-dan',         'rong-do',      'DAN',      'Đỏ thẫm',           '3.5–4 cm',   17, 10, 22.0, 28.0, 6.8, 7.8),
    ROW('blue-grass-kiem-doi',      'blue-grass',   'KIEM_DOI', 'Xanh lam',          '3–3.5 cm',   12, 10, 22.0, 28.0, 6.8, 7.8),
    ROW('black-mosaic-duoi-voan',   'black-mosaic', 'VOAN',     'Đen ánh tím',       '3.5–4 cm',   16, 10, 22.0, 28.0, 6.8, 7.6)
) AS v (slug, dong, kieu_duoi, mau_sac, kich_thuoc, tuoi, so_con, t_min, t_max, ph_min, ph_max)
JOIN san_pham s ON s.slug = v.slug
JOIN dong_ca d ON d.ma = v.dong;

INSERT INTO gia_ban_ca (ca_guppy_id, don_vi, gioi_tinh, gia)
SELECT s.id, v.don_vi, v.gioi_tinh, v.gia
FROM (VALUES
    ROW('full-gold-duoi-quat', 'CON_LE', 'DUC', 45000), ROW('full-gold-duoi-quat', 'CON_LE', 'CAI', 35000),
    ROW('full-gold-duoi-quat', 'CAP', 'KHONG_AP_DUNG', 75000), ROW('full-gold-duoi-quat', 'BO_BA', 'KHONG_AP_DUNG', 105000),
    ROW('full-gold-duoi-quat', 'LO_CA_BOT', 'KHONG_AP_DUNG', 150000),
    ROW('koi-tricolor-duoi-tron', 'CON_LE', 'DUC', 85000), ROW('koi-tricolor-duoi-tron', 'CON_LE', 'CAI', 65000),
    ROW('koi-tricolor-duoi-tron', 'CAP', 'KHONG_AP_DUNG', 140000), ROW('koi-tricolor-duoi-tron', 'BO_BA', 'KHONG_AP_DUNG', 195000),
    ROW('rong-do-duoi-voan', 'CON_LE', 'DUC', 120000), ROW('rong-do-duoi-voan', 'CON_LE', 'CAI', 90000),
    ROW('rong-do-duoi-voan', 'CAP', 'KHONG_AP_DUNG', 199000), ROW('rong-do-duoi-voan', 'BO_BA', 'KHONG_AP_DUNG', 280000),
    ROW('blue-grass-duoi-quat', 'CON_LE', 'DUC', 55000), ROW('blue-grass-duoi-quat', 'CON_LE', 'CAI', 40000),
    ROW('blue-grass-duoi-quat', 'CAP', 'KHONG_AP_DUNG', 89000), ROW('blue-grass-duoi-quat', 'BO_BA', 'KHONG_AP_DUNG', 125000),
    ROW('blue-grass-duoi-quat', 'LO_CA_BOT', 'KHONG_AP_DUNG', 180000),
    ROW('albino-full-red-duoi-dan', 'CON_LE', 'DUC', 95000), ROW('albino-full-red-duoi-dan', 'CON_LE', 'CAI', 70000),
    ROW('albino-full-red-duoi-dan', 'CAP', 'KHONG_AP_DUNG', 155000),
    ROW('black-mosaic-duoi-quat', 'CON_LE', 'DUC', 60000), ROW('black-mosaic-duoi-quat', 'CON_LE', 'CAI', 45000),
    ROW('black-mosaic-duoi-quat', 'CAP', 'KHONG_AP_DUNG', 99000), ROW('black-mosaic-duoi-quat', 'BO_BA', 'KHONG_AP_DUNG', 139000),
    ROW('lo-ca-bot-full-gold', 'LO_CA_BOT', 'KHONG_AP_DUNG', 120000),
    ROW('tuxedo-kiem-doi', 'CON_LE', 'DUC', 65000), ROW('tuxedo-kiem-doi', 'CON_LE', 'CAI', 45000),
    ROW('tuxedo-kiem-doi', 'CAP', 'KHONG_AP_DUNG', 105000), ROW('tuxedo-kiem-doi', 'BO_BA', 'KHONG_AP_DUNG', 145000),
    ROW('tuxedo-kiem-doi', 'LO_CA_BOT', 'KHONG_AP_DUNG', 200000),
    ROW('tuxedo-duoi-thuong', 'CON_LE', 'DUC', 70000), ROW('tuxedo-duoi-thuong', 'CON_LE', 'CAI', 50000),
    ROW('tuxedo-duoi-thuong', 'CAP', 'KHONG_AP_DUNG', 115000), ROW('tuxedo-duoi-thuong', 'BO_BA', 'KHONG_AP_DUNG', 160000),
    ROW('tuxedo-duoi-thuong', 'LO_CA_BOT', 'KHONG_AP_DUNG', 220000),
    ROW('full-gold-duoi-thuong', 'CON_LE', 'DUC', 50000), ROW('full-gold-duoi-thuong', 'CON_LE', 'CAI', 38000),
    ROW('full-gold-duoi-thuong', 'CAP', 'KHONG_AP_DUNG', 85000), ROW('full-gold-duoi-thuong', 'BO_BA', 'KHONG_AP_DUNG', 120000),
    ROW('koi-tricolor-duoi-quat', 'CON_LE', 'DUC', 90000), ROW('koi-tricolor-duoi-quat', 'CON_LE', 'CAI', 70000),
    ROW('koi-tricolor-duoi-quat', 'CAP', 'KHONG_AP_DUNG', 150000), ROW('koi-tricolor-duoi-quat', 'BO_BA', 'KHONG_AP_DUNG', 210000),
    ROW('rong-do-duoi-dan', 'CON_LE', 'DUC', 130000), ROW('rong-do-duoi-dan', 'CON_LE', 'CAI', 95000),
    ROW('rong-do-duoi-dan', 'CAP', 'KHONG_AP_DUNG', 215000), ROW('rong-do-duoi-dan', 'BO_BA', 'KHONG_AP_DUNG', 300000),
    ROW('blue-grass-kiem-doi', 'CON_LE', 'DUC', 60000), ROW('blue-grass-kiem-doi', 'CON_LE', 'CAI', 42000),
    ROW('blue-grass-kiem-doi', 'CAP', 'KHONG_AP_DUNG', 95000), ROW('blue-grass-kiem-doi', 'BO_BA', 'KHONG_AP_DUNG', 135000),
    ROW('black-mosaic-duoi-voan', 'CON_LE', 'DUC', 75000), ROW('black-mosaic-duoi-voan', 'CON_LE', 'CAI', 55000),
    ROW('black-mosaic-duoi-voan', 'CAP', 'KHONG_AP_DUNG', 125000), ROW('black-mosaic-duoi-voan', 'BO_BA', 'KHONG_AP_DUNG', 175000)
) AS v (slug, don_vi, gioi_tinh, gia)
JOIN san_pham s ON s.slug = v.slug;

UPDATE san_pham s
JOIN (SELECT ca_guppy_id, MIN(gia) AS gia FROM gia_ban_ca GROUP BY ca_guppy_id) g ON g.ca_guppy_id = s.id
SET s.gia_thap_nhat = g.gia;

INSERT INTO phu_kien (san_pham_id, loai_phu_kien, gia, ton_kho)
SELECT s.id, v.loai, s.gia_thap_nhat, v.ton
FROM (VALUES
    ROW('cam-vi-sinh-len-mau-50g', 'THUC_AN', 80),
    ROW('trun-chi-say-kho-30g', 'THUC_AN', 60),
    ROW('be-kinh-sieu-trong-30cm', 'BE', 12),
    ROW('loc-vi-sinh-mini', 'LOC', 25),
    ROW('muoi-khoang-cho-ca-200g', 'THUOC', 40),
    ROW('thuoc-xanh-methylen-20ml', 'THUOC', 0)
) AS v (slug, loai, ton)
JOIN san_pham s ON s.slug = v.slug;

-- Lô cá: tồn kho của từng sản phẩm cá
INSERT INTO lo_ca (ma_lo, ca_guppy_id, bo_me, be_nuoi, ngay_no, so_duc, so_cai, so_ca_bot, hao_hut, giai_doan)
SELECT v.ma_lo, s.id, v.bo_me, v.be, v.ngay_no, v.duc, v.cai, v.bot, v.hao_hut, v.giai_doan
FROM (VALUES
    ROW('LO-2410-FG',  'full-gold-duoi-quat',      'FG-A3 × FG-B1', 'Bể A1',       DATE '2026-07-20', 24, 31, 120,  4, 'TRUONG_THANH'),
    ROW('LO-2410-BG',  'blue-grass-duoi-quat',     'BG-07 × BG-12', 'Bể A2',       DATE '2026-08-05', 18, 22,  80,  6, 'TRUONG_THANH'),
    ROW('LO-2410-TX',  'tuxedo-kiem-doi',          'TX-01 × TX-04', 'Bể B1',       DATE '2026-08-15', 15,  9, 150, 11, 'DANG_PHAN_GIOI'),
    ROW('LO-2409-RD',  'rong-do-duoi-voan',        'RD-02 × RD-05', 'Bể C1',       DATE '2026-06-30',  3,  5,   0,  2, 'TRUONG_THANH'),
    ROW('LO-2411-FG2', 'lo-ca-bot-full-gold',      'FG-A3 × FG-C2', 'Bể D1 (ươm)', DATE '2026-10-10',  0,  0, 300, 18, 'CA_BOT'),
    ROW('LO-2411-AL',  'albino-full-red-duoi-dan', 'AL-01 × AL-03', 'Bể D2 (ươm)', DATE '2026-10-22',  0,  0,  85,  9, 'CA_BOT'),
    ROW('LO-2410-KO',  'koi-tricolor-duoi-tron',   'KO-02 × KO-06', 'Bể A3',       DATE '2026-07-12',  8, 12,   0,  3, 'TRUONG_THANH'),
    ROW('LO-2409-BM',  'black-mosaic-duoi-quat',   'BM-03 × BM-08', 'Bể C2',       DATE '2026-07-05',  6, 10,   0,  2, 'TRUONG_THANH'),
    ROW('LO-2410-TT',  'tuxedo-duoi-thuong',       'TX-02 × TX-07', 'Bể B2',       DATE '2026-07-30', 11, 14,  60,  5, 'TRUONG_THANH'),
    ROW('LO-2410-FT',  'full-gold-duoi-thuong',    'FG-B2 × FG-D1', 'Bể A4',       DATE '2026-07-28', 10, 12,   0,  1, 'TRUONG_THANH'),
    ROW('LO-2410-KQ',  'koi-tricolor-duoi-quat',   'KO-04 × KO-09', 'Bể A5',       DATE '2026-07-15',  5,  7,   0,  2, 'TRUONG_THANH'),
    ROW('LO-2409-RL',  'rong-do-duoi-dan',         'RD-03 × RD-07', 'Bể C3',       DATE '2026-07-02',  2,  4,   0,  1, 'TRUONG_THANH'),
    ROW('LO-2410-BK',  'blue-grass-kiem-doi',      'BG-09 × BG-14', 'Bể B3',       DATE '2026-08-08',  9, 11,   0,  3, 'TRUONG_THANH'),
    ROW('LO-2410-BV',  'black-mosaic-duoi-voan',   'BM-05 × BM-11', 'Bể C4',       DATE '2026-07-18',  6,  8,   0,  2, 'TRUONG_THANH')
) AS v (ma_lo, slug, bo_me, be, ngay_no, duc, cai, bot, hao_hut, giai_doan)
JOIN san_pham s ON s.slug = v.slug;

-- Khách hàng demo có tài khoản, mật khẩu ghi trong README
INSERT INTO nguoi_dung (loai_nguoi_dung, ho_ten, email, so_dien_thoai, mat_khau_hash) VALUES
    ('KHACH_HANG', 'Trần Quốc Bảo', 'quocbao@example.com', '0912345678', '$2b$10$cHz0/XFDsow2wmJ9OnrpRuB.pm62BFBEcAePhUH9sAc989E7lP0oO'),
    ('KHACH_HANG', 'Phạm Gia Huy',  'giahuy@example.com',  '0933111222', '$2b$10$cHz0/XFDsow2wmJ9OnrpRuB.pm62BFBEcAePhUH9sAc989E7lP0oO'),
    ('KHACH_HANG', 'Đặng Ngọc Mai', 'ngocmai@example.com', '0909555666', '$2b$10$cHz0/XFDsow2wmJ9OnrpRuB.pm62BFBEcAePhUH9sAc989E7lP0oO'),
    ('KHACH_HANG', 'Hồ Mỹ Linh',    'mylinh@example.com',  '0966123123', '$2b$10$cHz0/XFDsow2wmJ9OnrpRuB.pm62BFBEcAePhUH9sAc989E7lP0oO');

INSERT INTO ma_giam_gia (ma, phan_tram, ngay_bat_dau, ngay_het_han, so_luot_toi_da, so_luot_da_dung, kich_hoat) VALUES
    ('GUPPY10',  10, '2026-01-01 00:00:00', '2030-12-31 23:59:59', NULL, 0, TRUE),
    ('KHAITRUONG20', 20, '2026-01-01 00:00:00', '2030-12-31 23:59:59', 100, 0, TRUE),
    ('HETHAN15', 15, '2025-01-01 00:00:00', '2025-12-31 23:59:59', NULL, 0, TRUE),
    ('TAMDUNG5',  5, '2026-01-01 00:00:00', '2030-12-31 23:59:59', NULL, 0, FALSE);

-- 8 đơn mẫu theo thiết kế; dòng Galaxy Neon và Moscow Blue đổi sang Tuxedo cùng giá để giữ tổng tiền
INSERT INTO don_hang (ma_don, khach_hang_id, ho_ten_nhan, sdt_nhan, dia_chi_nhan, thanh_pho_nhan, trang_thai, tam_tinh, phi_giao, giam_gia, tong_tien, hoan_tat_luc, created_at)
SELECT v.ma_don, n.id, v.ho_ten, v.sdt, v.dia_chi, v.thanh_pho, v.trang_thai, v.tam_tinh, v.phi_giao, 0, v.tam_tinh + v.phi_giao, v.hoan_tat, v.tao_luc
FROM (VALUES
    ROW('GP24110931', NULL,                  'Nguyễn Minh Anh', '0901234567', '12 Lê Lợi, Q.1',       'TP. Hồ Chí Minh', 'DANG_GIAO',     205000, 50000, NULL,                  TIMESTAMP '2026-11-01 08:12:00'),
    ROW('GP24110927', 'quocbao@example.com', 'Trần Quốc Bảo',   '0912345678', '88 Trần Phú',          'Đà Nẵng',         'CHO_XAC_NHAN',  560000, 0,     NULL,                  TIMESTAMP '2026-11-01 10:02:00'),
    ROW('GP24110925', NULL,                  'Lê Thu Hà',       '0987654321', '5 Hàng Bài',           'Hà Nội',          'CHO_XAC_NHAN',  180000, 50000, NULL,                  TIMESTAMP '2026-11-01 09:47:00'),
    ROW('GP24110918', 'giahuy@example.com',  'Phạm Gia Huy',    '0933111222', '201 Nguyễn Trãi, Q.5', 'TP. Hồ Chí Minh', 'DA_XAC_NHAN',   140000, 50000, NULL,                  TIMESTAMP '2026-10-31 19:20:00'),
    ROW('GP24110911', NULL,                  'Võ Hoàng Long',   '0977000888', '17 Bạch Đằng',         'Đà Nẵng',         'DANG_DONG_GOI', 630000, 0,     NULL,                  TIMESTAMP '2026-10-31 15:10:00'),
    ROW('GP24110903', 'ngocmai@example.com', 'Đặng Ngọc Mai',   '0909555666', '9 Kim Mã',             'Hà Nội',          'HOAN_TAT',      180000, 50000, TIMESTAMP '2026-10-30 18:30:00', TIMESTAMP '2026-10-30 11:00:00'),
    ROW('GP24110899', NULL,                  'Bùi Thanh Tâm',   '0944777999', '45 Võ Văn Tần, Q.3',   'TP. Hồ Chí Minh', 'DA_HUY',        105000, 50000, NULL,                  TIMESTAMP '2026-10-30 09:30:00'),
    ROW('GP24110890', 'mylinh@example.com',  'Hồ Mỹ Linh',      '0966123123', '3 Lý Thường Kiệt',     'Hà Nội',          'HOAN_TAT',      590000, 0,     TIMESTAMP '2026-10-29 19:00:00', TIMESTAMP '2026-10-29 13:15:00')
) AS v (ma_don, email, ho_ten, sdt, dia_chi, thanh_pho, trang_thai, tam_tinh, phi_giao, hoan_tat, tao_luc)
LEFT JOIN nguoi_dung n ON n.email = v.email;

INSERT INTO chi_tiet_don_hang (don_hang_id, san_pham_id, ten_san_pham, don_vi, gioi_tinh, so_luong, don_gia)
SELECT d.id, s.id, s.ten, v.don_vi, v.gioi_tinh, v.so_luong, v.don_gia
FROM (VALUES
    ROW('GP24110931', 'full-gold-duoi-quat',    'CAP',       'KHONG_AP_DUNG', 1, 75000),
    ROW('GP24110931', 'tuxedo-kiem-doi',        'CON_LE',    'DUC',           2, 65000),
    ROW('GP24110927', 'rong-do-duoi-voan',      'BO_BA',     'KHONG_AP_DUNG', 2, 280000),
    ROW('GP24110925', 'blue-grass-duoi-quat',   'LO_CA_BOT', 'KHONG_AP_DUNG', 1, 180000),
    ROW('GP24110918', 'koi-tricolor-duoi-tron', 'CAP',       'KHONG_AP_DUNG', 1, 140000),
    ROW('GP24110911', 'tuxedo-duoi-thuong',     'BO_BA',     'KHONG_AP_DUNG', 3, 160000),
    ROW('GP24110911', 'full-gold-duoi-quat',    'LO_CA_BOT', 'KHONG_AP_DUNG', 1, 150000),
    ROW('GP24110903', 'black-mosaic-duoi-quat', 'CON_LE',    'DUC',           3, 60000),
    ROW('GP24110899', 'tuxedo-kiem-doi',        'CAP',       'KHONG_AP_DUNG', 1, 105000),
    ROW('GP24110890', 'full-gold-duoi-quat',    'BO_BA',     'KHONG_AP_DUNG', 4, 105000),
    ROW('GP24110890', 'koi-tricolor-duoi-tron', 'CON_LE',    'DUC',           2, 85000)
) AS v (ma_don, slug, don_vi, gioi_tinh, so_luong, don_gia)
JOIN don_hang d ON d.ma_don = v.ma_don
JOIN san_pham s ON s.slug = v.slug;

INSERT INTO lich_su_trang_thai (don_hang_id, trang_thai, thoi_diem)
SELECT d.id, v.trang_thai, v.thoi_diem
FROM (VALUES
    ROW('GP24110931', 'CHO_XAC_NHAN',  TIMESTAMP '2026-11-01 08:12:00'),
    ROW('GP24110931', 'DA_XAC_NHAN',   TIMESTAMP '2026-11-01 08:40:00'),
    ROW('GP24110931', 'DANG_DONG_GOI', TIMESTAMP '2026-11-01 09:30:00'),
    ROW('GP24110931', 'DANG_GIAO',     TIMESTAMP '2026-11-01 11:05:00'),
    ROW('GP24110927', 'CHO_XAC_NHAN',  TIMESTAMP '2026-11-01 10:02:00'),
    ROW('GP24110925', 'CHO_XAC_NHAN',  TIMESTAMP '2026-11-01 09:47:00'),
    ROW('GP24110918', 'CHO_XAC_NHAN',  TIMESTAMP '2026-10-31 19:20:00'),
    ROW('GP24110918', 'DA_XAC_NHAN',   TIMESTAMP '2026-10-31 20:01:00'),
    ROW('GP24110911', 'CHO_XAC_NHAN',  TIMESTAMP '2026-10-31 15:10:00'),
    ROW('GP24110911', 'DA_XAC_NHAN',   TIMESTAMP '2026-10-31 15:30:00'),
    ROW('GP24110911', 'DANG_DONG_GOI', TIMESTAMP '2026-11-01 07:50:00'),
    ROW('GP24110903', 'CHO_XAC_NHAN',  TIMESTAMP '2026-10-30 11:00:00'),
    ROW('GP24110903', 'DA_XAC_NHAN',   TIMESTAMP '2026-10-30 11:20:00'),
    ROW('GP24110903', 'DANG_DONG_GOI', TIMESTAMP '2026-10-30 14:00:00'),
    ROW('GP24110903', 'DANG_GIAO',     TIMESTAMP '2026-10-30 16:00:00'),
    ROW('GP24110903', 'HOAN_TAT',      TIMESTAMP '2026-10-30 18:30:00'),
    ROW('GP24110899', 'CHO_XAC_NHAN',  TIMESTAMP '2026-10-30 09:30:00'),
    ROW('GP24110899', 'DA_HUY',        TIMESTAMP '2026-10-30 10:00:00'),
    ROW('GP24110890', 'CHO_XAC_NHAN',  TIMESTAMP '2026-10-29 13:15:00'),
    ROW('GP24110890', 'DA_XAC_NHAN',   TIMESTAMP '2026-10-29 13:40:00'),
    ROW('GP24110890', 'DANG_DONG_GOI', TIMESTAMP '2026-10-29 15:00:00'),
    ROW('GP24110890', 'DANG_GIAO',     TIMESTAMP '2026-10-29 16:30:00'),
    ROW('GP24110890', 'HOAN_TAT',      TIMESTAMP '2026-10-29 19:00:00')
) AS v (ma_don, trang_thai, thoi_diem)
JOIN don_hang d ON d.ma_don = v.ma_don;

INSERT INTO thanh_toan (loai_thanh_toan, don_hang_id, so_tien, trang_thai, noi_dung_ck, da_tra_luc)
SELECT v.loai, d.id, d.tong_tien, v.trang_thai,
       CASE WHEN v.loai = 'CHUYEN_KHOAN' THEN CONCAT(d.ma_don, ' ', d.sdt_nhan) END, d.hoan_tat_luc
FROM (VALUES
    ROW('GP24110931', 'COD',          'CHUA_THANH_TOAN'),
    ROW('GP24110927', 'CHUYEN_KHOAN', 'CHUA_THANH_TOAN'),
    ROW('GP24110925', 'COD',          'CHUA_THANH_TOAN'),
    ROW('GP24110918', 'CHUYEN_KHOAN', 'CHUA_THANH_TOAN'),
    ROW('GP24110911', 'COD',          'CHUA_THANH_TOAN'),
    ROW('GP24110903', 'CHUYEN_KHOAN', 'DA_THANH_TOAN'),
    ROW('GP24110899', 'COD',          'CHUA_THANH_TOAN'),
    ROW('GP24110890', 'COD',          'DA_THANH_TOAN')
) AS v (ma_don, loai, trang_thai)
JOIN don_hang d ON d.ma_don = v.ma_don;

-- Nhật ký xuất kho của các đơn chưa kết thúc: hủy các đơn này sẽ trả cá về đúng lô
INSERT INTO bien_dong_kho (lo_ca_id, don_hang_id, loai, delta_duc, delta_cai, delta_bot, ghi_chu, created_at)
SELECT l.id, d.id, 'BAN', v.duc, v.cai, v.bot, CONCAT('Đơn ', d.ma_don), d.created_at
FROM (VALUES
    ROW('GP24110931', 'LO-2410-FG', -1, -1,   0),
    ROW('GP24110931', 'LO-2410-TX', -2,  0,   0),
    ROW('GP24110927', 'LO-2409-RD', -2, -4,   0),
    ROW('GP24110925', 'LO-2410-BG',  0,  0, -10),
    ROW('GP24110918', 'LO-2410-KO', -1, -1,   0),
    ROW('GP24110911', 'LO-2410-TT', -3, -6,   0),
    ROW('GP24110911', 'LO-2410-FG',  0,  0, -10)
) AS v (ma_don, ma_lo, duc, cai, bot)
JOIN don_hang d ON d.ma_don = v.ma_don
JOIN lo_ca l ON l.ma_lo = v.ma_lo;
-- 7 đơn sỉ đã hoàn tất, ngày tính theo lúc khởi tạo CSDL để biểu đồ doanh thu 7 ngày có số liệu.
-- Giá trị bám theo biểu đồ trong thiết kế; hôm nay 7.420.000đ như ảnh Tổng quan.
INSERT INTO don_hang (ma_don, ho_ten_nhan, sdt_nhan, dia_chi_nhan, thanh_pho_nhan, trang_thai, tam_tinh, phi_giao, giam_gia, tong_tien, hoan_tat_luc, created_at)
SELECT v.ma_don, 'Trại cá An Phú', '0988000111', '20 An Phú, TP. Thủ Đức', 'TP. Hồ Chí Minh', 'HOAN_TAT',
       v.so_luong * v.don_gia, 0, 0, v.so_luong * v.don_gia,
       DATE_SUB(NOW(), INTERVAL v.so_ngay DAY), DATE_SUB(NOW(), INTERVAL v.so_ngay DAY)
FROM (VALUES
    ROW('GP24111001', 6, 20, 105000),
    ROW('GP24111002', 5, 32, 105000),
    ROW('GP24111003', 4, 27, 105000),
    ROW('GP24111004', 3, 44, 105000),
    ROW('GP24111005', 2, 37, 105000),
    ROW('GP24111006', 1, 59, 105000),
    ROW('GP24111007', 0, 53, 140000)
) AS v (ma_don, so_ngay, so_luong, don_gia);

INSERT INTO chi_tiet_don_hang (don_hang_id, san_pham_id, ten_san_pham, don_vi, gioi_tinh, so_luong, don_gia)
SELECT d.id, s.id, s.ten, v.don_vi, 'KHONG_AP_DUNG', d.tong_tien / v.don_gia, v.don_gia
FROM (VALUES
    ROW('GP24111001', 'full-gold-duoi-quat',    'BO_BA', 105000),
    ROW('GP24111002', 'full-gold-duoi-quat',    'BO_BA', 105000),
    ROW('GP24111003', 'full-gold-duoi-quat',    'BO_BA', 105000),
    ROW('GP24111004', 'full-gold-duoi-quat',    'BO_BA', 105000),
    ROW('GP24111005', 'full-gold-duoi-quat',    'BO_BA', 105000),
    ROW('GP24111006', 'full-gold-duoi-quat',    'BO_BA', 105000),
    ROW('GP24111007', 'koi-tricolor-duoi-tron', 'CAP',   140000)
) AS v (ma_don, slug, don_vi, don_gia)
JOIN don_hang d ON d.ma_don = v.ma_don
JOIN san_pham s ON s.slug = v.slug;

INSERT INTO lich_su_trang_thai (don_hang_id, trang_thai, thoi_diem)
SELECT d.id, t.trang_thai, d.hoan_tat_luc
FROM don_hang d
JOIN (VALUES ROW('CHO_XAC_NHAN'), ROW('DA_XAC_NHAN'), ROW('DANG_DONG_GOI'), ROW('DANG_GIAO'), ROW('HOAN_TAT')) AS t (trang_thai)
WHERE d.ma_don LIKE 'GP241110%';

INSERT INTO thanh_toan (loai_thanh_toan, don_hang_id, so_tien, trang_thai, da_tra_luc)
SELECT 'COD', d.id, d.tong_tien, 'DA_THANH_TOAN', d.hoan_tat_luc
FROM don_hang d
WHERE d.ma_don LIKE 'GP241110%';

-- Nhật ký hao hụt khớp cột hao_hut của từng lô, ghi vào tháng khởi tạo CSDL
INSERT INTO bien_dong_kho (lo_ca_id, loai, delta_duc, delta_cai, delta_bot, ghi_chu)
SELECT l.id, 'HAO_HUT', 0, CASE WHEN l.so_ca_bot > 0 THEN 0 ELSE -l.hao_hut END, CASE WHEN l.so_ca_bot > 0 THEN -l.hao_hut ELSE 0 END, 'Hao hụt khi nuôi'
FROM lo_ca l
WHERE l.hao_hut > 0;

-- Đánh giá mẫu của khách đã mua
INSERT INTO danh_gia (khach_hang_id, san_pham_id, don_hang_id, so_sao, noi_dung)
SELECT n.id, s.id, d.id, v.so_sao, v.noi_dung
FROM (VALUES
    ROW('ngocmai@example.com', 'GP24110903', 'black-mosaic-duoi-quat', 5, 'Cá khỏe, mosaic đen ánh tím rất đẹp, đóng túi oxy cẩn thận.'),
    ROW('mylinh@example.com',  'GP24110890', 'full-gold-duoi-quat',    5, 'Màu vàng kim đúng như hình, giao trong ngày.'),
    ROW('mylinh@example.com',  'GP24110890', 'koi-tricolor-duoi-tron', 4, 'Họa tiết đẹp, có một con hơi nhỏ hơn mô tả.')
) AS v (email, ma_don, slug, so_sao, noi_dung)
JOIN nguoi_dung n ON n.email = v.email
JOIN don_hang d ON d.ma_don = v.ma_don
JOIN san_pham s ON s.slug = v.slug;