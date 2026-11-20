-- Nhật ký kho có thêm loại BAO_HANH: cá xuất gửi bù khi bảo hành đổi cá.
ALTER TABLE bien_dong_kho DROP CHECK ck_bien_dong_loai;
ALTER TABLE bien_dong_kho ADD CONSTRAINT ck_bien_dong_loai
    CHECK (loai IN ('NHAP_DE', 'PHAN_GIOI', 'HAO_HUT', 'BAN', 'TRA_TON', 'BAO_HANH'));
