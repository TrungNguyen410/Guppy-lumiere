-- Cấu trúc CSDL Guppy Lumière. Tên bảng và cột theo nghiệp vụ tiếng Việt.

-- ===== identity: SINGLE_TABLE cho NguoiDung (KhachHang, NhanVien, Admin) =====
CREATE TABLE nguoi_dung (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    loai_nguoi_dung  VARCHAR(31)  NOT NULL,
    ho_ten           VARCHAR(120) NOT NULL,
    email            VARCHAR(160) NOT NULL,
    so_dien_thoai    VARCHAR(15)  NULL,
    mat_khau_hash    VARCHAR(100) NOT NULL,
    kich_hoat        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_nguoi_dung_email (email),
    UNIQUE KEY uk_nguoi_dung_sdt (so_dien_thoai),
    CONSTRAINT ck_nguoi_dung_loai CHECK (loai_nguoi_dung IN ('KHACH_HANG', 'NHAN_VIEN', 'ADMIN'))
);

CREATE TABLE dia_chi (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    khach_hang_id  BIGINT       NOT NULL,
    ho_ten_nhan    VARCHAR(120) NOT NULL,
    so_dien_thoai  VARCHAR(15)  NOT NULL,
    dia_chi        VARCHAR(255) NOT NULL,
    thanh_pho      VARCHAR(40)  NOT NULL,
    mac_dinh       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_dia_chi_khach_hang FOREIGN KEY (khach_hang_id) REFERENCES nguoi_dung (id) ON DELETE CASCADE
);

-- ===== catalog: JOINED cho SanPham (CaGuppy, PhuKien) =====
CREATE TABLE dong_ca (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    ma          VARCHAR(40)  NOT NULL,
    ten         VARCHAR(80)  NOT NULL,
    xuat_xu     VARCHAR(80)  NOT NULL,
    hoa_tiet    VARCHAR(20)  NOT NULL,
    mau_than    CHAR(7)      NOT NULL,
    mau_duoi_1  CHAR(7)      NOT NULL,
    mau_duoi_2  CHAR(7)      NOT NULL,
    mau_nhan    CHAR(7)      NOT NULL,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_dong_ca_ma (ma),
    CONSTRAINT ck_dong_ca_hoa_tiet CHECK (hoa_tiet IN ('SOLID', 'MOSAIC', 'GRASS', 'KOI'))
);

CREATE TABLE san_pham (
    id             BIGINT        NOT NULL AUTO_INCREMENT,
    loai_san_pham  VARCHAR(31)   NOT NULL,
    ten            VARCHAR(160)  NOT NULL,
    slug           VARCHAR(180)  NOT NULL,
    mo_ta          TEXT          NULL,
    diem_danh_gia  DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    so_danh_gia    INT           NOT NULL DEFAULT 0,
    da_ban         INT           NOT NULL DEFAULT 0,
    gia_thap_nhat  DECIMAL(12, 0) NOT NULL,
    dang_ban       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at     DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_san_pham_slug (slug),
    KEY idx_san_pham_loai (loai_san_pham, dang_ban),
    CONSTRAINT ck_san_pham_loai CHECK (loai_san_pham IN ('CA_GUPPY', 'PHU_KIEN'))
);

CREATE TABLE san_pham_nhan (
    san_pham_id  BIGINT      NOT NULL,
    nhan         VARCHAR(20) NOT NULL,
    PRIMARY KEY (san_pham_id, nhan),
    CONSTRAINT fk_san_pham_nhan FOREIGN KEY (san_pham_id) REFERENCES san_pham (id) ON DELETE CASCADE,
    CONSTRAINT ck_san_pham_nhan CHECK (nhan IN ('HOT', 'MOI_VE', 'HIEM', 'GIAM_GIA'))
);

CREATE TABLE ca_guppy (
    san_pham_id    BIGINT        NOT NULL,
    dong_ca_id     BIGINT        NOT NULL,
    kieu_duoi      VARCHAR(20)   NOT NULL,
    mau_sac        VARCHAR(80)   NOT NULL,
    thuan_chung    BOOLEAN       NOT NULL DEFAULT TRUE,
    kich_thuoc     VARCHAR(20)   NOT NULL,
    tuoi_tuan      INT           NOT NULL,
    so_con_moi_lo  INT           NOT NULL DEFAULT 10,
    nhiet_do_min   DECIMAL(3, 1) NOT NULL DEFAULT 22.0,
    nhiet_do_max   DECIMAL(3, 1) NOT NULL DEFAULT 28.0,
    ph_min         DECIMAL(2, 1) NOT NULL DEFAULT 6.8,
    ph_max         DECIMAL(2, 1) NOT NULL DEFAULT 7.8,
    do_cung        VARCHAR(20)   NOT NULL DEFAULT '8–12 dGH',
    PRIMARY KEY (san_pham_id),
    KEY idx_ca_guppy_dong (dong_ca_id),
    CONSTRAINT fk_ca_guppy_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham (id) ON DELETE CASCADE,
    CONSTRAINT fk_ca_guppy_dong_ca FOREIGN KEY (dong_ca_id) REFERENCES dong_ca (id),
    CONSTRAINT ck_ca_guppy_kieu_duoi CHECK (kieu_duoi IN ('DELTA', 'TRON', 'KIEM_DOI', 'VOAN', 'DAN', 'THUONG')),
    CONSTRAINT ck_ca_guppy_so_con CHECK (so_con_moi_lo > 0),
    CONSTRAINT ck_ca_guppy_nhiet_do CHECK (nhiet_do_min >= 22.0 AND nhiet_do_max <= 28.0 AND nhiet_do_min < nhiet_do_max),
    CONSTRAINT ck_ca_guppy_ph CHECK (ph_min >= 6.8 AND ph_max <= 7.8 AND ph_min < ph_max)
);

-- CON_LE có giá riêng theo giới tính; các đơn vị khác dùng KHONG_AP_DUNG
CREATE TABLE gia_ban_ca (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    ca_guppy_id  BIGINT        NOT NULL,
    don_vi       VARCHAR(20)   NOT NULL,
    gioi_tinh    VARCHAR(20)   NOT NULL DEFAULT 'KHONG_AP_DUNG',
    gia          DECIMAL(12, 0) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_gia_ban_ca (ca_guppy_id, don_vi, gioi_tinh),
    CONSTRAINT fk_gia_ban_ca FOREIGN KEY (ca_guppy_id) REFERENCES ca_guppy (san_pham_id) ON DELETE CASCADE,
    CONSTRAINT ck_gia_ban_ca_don_vi CHECK (don_vi IN ('CON_LE', 'CAP', 'BO_BA', 'LO_CA_BOT')),
    CONSTRAINT ck_gia_ban_ca_gioi_tinh CHECK (
        (don_vi = 'CON_LE' AND gioi_tinh IN ('DUC', 'CAI'))
        OR (don_vi <> 'CON_LE' AND gioi_tinh = 'KHONG_AP_DUNG')),
    CONSTRAINT ck_gia_ban_ca_gia CHECK (gia > 0)
);

CREATE TABLE phu_kien (
    san_pham_id    BIGINT         NOT NULL,
    loai_phu_kien  VARCHAR(20)    NOT NULL,
    gia            DECIMAL(12, 0) NOT NULL,
    ton_kho        INT            NOT NULL DEFAULT 0,
    PRIMARY KEY (san_pham_id),
    CONSTRAINT fk_phu_kien_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham (id) ON DELETE CASCADE,
    CONSTRAINT ck_phu_kien_loai CHECK (loai_phu_kien IN ('THUC_AN', 'BE', 'LOC', 'THUOC')),
    CONSTRAINT ck_phu_kien_gia CHECK (gia > 0),
    CONSTRAINT ck_phu_kien_ton CHECK (ton_kho >= 0)
);

-- ===== inventory =====
CREATE TABLE lo_ca (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    ma_lo        VARCHAR(30)  NOT NULL,
    ca_guppy_id  BIGINT       NOT NULL,
    bo_me        VARCHAR(60)  NULL,
    be_nuoi      VARCHAR(40)  NOT NULL,
    ngay_no      DATE         NOT NULL,
    so_duc       INT          NOT NULL DEFAULT 0,
    so_cai       INT          NOT NULL DEFAULT 0,
    so_ca_bot    INT          NOT NULL DEFAULT 0,
    hao_hut      INT          NOT NULL DEFAULT 0,
    giai_doan    VARCHAR(20)  NOT NULL,
    phien_ban    BIGINT       NOT NULL DEFAULT 0,
    created_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_lo_ca_ma (ma_lo),
    KEY idx_lo_ca_san_pham (ca_guppy_id),
    CONSTRAINT fk_lo_ca_ca_guppy FOREIGN KEY (ca_guppy_id) REFERENCES ca_guppy (san_pham_id),
    CONSTRAINT ck_lo_ca_so_luong CHECK (so_duc >= 0 AND so_cai >= 0 AND so_ca_bot >= 0 AND hao_hut >= 0),
    CONSTRAINT ck_lo_ca_giai_doan CHECK (giai_doan IN ('CA_BOT', 'DANG_PHAN_GIOI', 'TRUONG_THANH'))
);

-- ===== promotion =====
CREATE TABLE ma_giam_gia (
    id                BIGINT      NOT NULL AUTO_INCREMENT,
    ma                VARCHAR(30) NOT NULL,
    phan_tram         INT         NOT NULL,
    ngay_bat_dau      DATETIME(6) NOT NULL,
    ngay_het_han      DATETIME(6) NOT NULL,
    so_luot_toi_da    INT         NULL,
    so_luot_da_dung   INT         NOT NULL DEFAULT 0,
    kich_hoat         BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at        DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_ma_giam_gia (ma),
    CONSTRAINT ck_ma_giam_gia_phan_tram CHECK (phan_tram BETWEEN 1 AND 100),
    CONSTRAINT ck_ma_giam_gia_han CHECK (ngay_bat_dau < ngay_het_han)
);

-- ===== cart: giỏ thuộc về session (khách vãng lai) hoặc tài khoản =====
CREATE TABLE gio_hang (
    id             BIGINT      NOT NULL AUTO_INCREMENT,
    session_id     VARCHAR(64) NULL,
    khach_hang_id  BIGINT      NULL,
    created_at     DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_gio_hang_session (session_id),
    UNIQUE KEY uk_gio_hang_khach (khach_hang_id),
    CONSTRAINT fk_gio_hang_khach FOREIGN KEY (khach_hang_id) REFERENCES nguoi_dung (id) ON DELETE CASCADE
);

-- Phụ kiện dùng don_vi = KHONG_AP_DUNG
CREATE TABLE chi_tiet_gio_hang (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    gio_hang_id  BIGINT      NOT NULL,
    san_pham_id  BIGINT      NOT NULL,
    don_vi       VARCHAR(20) NOT NULL DEFAULT 'KHONG_AP_DUNG',
    gioi_tinh    VARCHAR(20) NOT NULL DEFAULT 'KHONG_AP_DUNG',
    so_luong     INT         NOT NULL,
    created_at   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_chi_tiet_gio (gio_hang_id, san_pham_id, don_vi, gioi_tinh),
    CONSTRAINT fk_chi_tiet_gio_gio FOREIGN KEY (gio_hang_id) REFERENCES gio_hang (id) ON DELETE CASCADE,
    CONSTRAINT fk_chi_tiet_gio_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham (id),
    CONSTRAINT ck_chi_tiet_gio_so_luong CHECK (so_luong > 0)
);

-- ===== ordering: DonHang là Aggregate Root, khach_hang_id null với khách vãng lai =====
CREATE TABLE don_hang (
    id              BIGINT         NOT NULL AUTO_INCREMENT,
    ma_don          VARCHAR(20)    NOT NULL,
    khach_hang_id   BIGINT         NULL,
    ho_ten_nhan     VARCHAR(120)   NOT NULL,
    sdt_nhan        VARCHAR(15)    NOT NULL,
    dia_chi_nhan    VARCHAR(255)   NOT NULL,
    thanh_pho_nhan  VARCHAR(40)    NOT NULL,
    ghi_chu         VARCHAR(500)   NULL,
    trang_thai      VARCHAR(20)    NOT NULL,
    tam_tinh        DECIMAL(12, 0) NOT NULL,
    phi_giao        DECIMAL(12, 0) NOT NULL DEFAULT 0,
    giam_gia        DECIMAL(12, 0) NOT NULL DEFAULT 0,
    tong_tien       DECIMAL(12, 0) NOT NULL,
    ma_giam_gia_id  BIGINT         NULL,
    hoan_tat_luc    DATETIME(6)    NULL,
    created_at      DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_don_hang_ma (ma_don),
    KEY idx_don_hang_trang_thai (trang_thai),
    KEY idx_don_hang_sdt (sdt_nhan),
    CONSTRAINT fk_don_hang_khach FOREIGN KEY (khach_hang_id) REFERENCES nguoi_dung (id),
    CONSTRAINT fk_don_hang_ma_giam FOREIGN KEY (ma_giam_gia_id) REFERENCES ma_giam_gia (id),
    CONSTRAINT ck_don_hang_trang_thai CHECK (trang_thai IN
        ('CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_DONG_GOI', 'DANG_GIAO', 'HOAN_TAT', 'DA_HUY', 'BAO_HANH')),
    CONSTRAINT ck_don_hang_thanh_pho CHECK (thanh_pho_nhan IN ('TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'))
);

-- Lưu lại tên và đơn giá lúc mua để sửa sản phẩm không làm đổi đơn cũ
CREATE TABLE chi_tiet_don_hang (
    id            BIGINT         NOT NULL AUTO_INCREMENT,
    don_hang_id   BIGINT         NOT NULL,
    san_pham_id   BIGINT         NOT NULL,
    ten_san_pham  VARCHAR(160)   NOT NULL,
    don_vi        VARCHAR(20)    NOT NULL DEFAULT 'KHONG_AP_DUNG',
    gioi_tinh     VARCHAR(20)    NOT NULL DEFAULT 'KHONG_AP_DUNG',
    so_luong      INT            NOT NULL,
    don_gia       DECIMAL(12, 0) NOT NULL,
    created_at    DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_chi_tiet_don_don FOREIGN KEY (don_hang_id) REFERENCES don_hang (id) ON DELETE CASCADE,
    CONSTRAINT fk_chi_tiet_don_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham (id),
    CONSTRAINT ck_chi_tiet_don_so_luong CHECK (so_luong > 0)
);

CREATE TABLE lich_su_trang_thai (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    don_hang_id  BIGINT       NOT NULL,
    trang_thai   VARCHAR(20)  NOT NULL,
    thoi_diem    DATETIME(6)  NOT NULL,
    ghi_chu      VARCHAR(255) NULL,
    created_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_lich_su_don (don_hang_id, thoi_diem),
    CONSTRAINT fk_lich_su_don FOREIGN KEY (don_hang_id) REFERENCES don_hang (id) ON DELETE CASCADE
);

-- Nhật ký kho: delta âm là giảm, dương là tăng
CREATE TABLE bien_dong_kho (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    lo_ca_id     BIGINT       NOT NULL,
    don_hang_id  BIGINT       NULL,
    loai         VARCHAR(20)  NOT NULL,
    delta_duc    INT          NOT NULL DEFAULT 0,
    delta_cai    INT          NOT NULL DEFAULT 0,
    delta_bot    INT          NOT NULL DEFAULT 0,
    ghi_chu      VARCHAR(255) NULL,
    created_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_bien_dong_lo (lo_ca_id, created_at),
    CONSTRAINT fk_bien_dong_lo FOREIGN KEY (lo_ca_id) REFERENCES lo_ca (id),
    CONSTRAINT fk_bien_dong_don FOREIGN KEY (don_hang_id) REFERENCES don_hang (id),
    CONSTRAINT ck_bien_dong_loai CHECK (loai IN ('NHAP_DE', 'PHAN_GIOI', 'HAO_HUT', 'BAN', 'TRA_TON'))
);

-- ===== payment: SINGLE_TABLE cho ThanhToan (COD, chuyển khoản) =====
CREATE TABLE thanh_toan (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    loai_thanh_toan  VARCHAR(31)    NOT NULL,
    don_hang_id      BIGINT         NOT NULL,
    so_tien          DECIMAL(12, 0) NOT NULL,
    trang_thai       VARCHAR(20)    NOT NULL,
    noi_dung_ck      VARCHAR(60)    NULL,
    da_tra_luc       DATETIME(6)    NULL,
    created_at       DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_thanh_toan_don (don_hang_id),
    CONSTRAINT fk_thanh_toan_don FOREIGN KEY (don_hang_id) REFERENCES don_hang (id) ON DELETE CASCADE,
    CONSTRAINT ck_thanh_toan_loai CHECK (loai_thanh_toan IN ('COD', 'CHUYEN_KHOAN')),
    CONSTRAINT ck_thanh_toan_trang_thai CHECK (trang_thai IN ('CHUA_THANH_TOAN', 'DA_THANH_TOAN', 'DA_HOAN_TIEN'))
);

-- ===== review =====
CREATE TABLE danh_gia (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    khach_hang_id  BIGINT       NOT NULL,
    san_pham_id    BIGINT       NOT NULL,
    don_hang_id    BIGINT       NOT NULL,
    so_sao         INT          NOT NULL,
    noi_dung       VARCHAR(1000) NULL,
    created_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_danh_gia (khach_hang_id, san_pham_id, don_hang_id),
    KEY idx_danh_gia_san_pham (san_pham_id),
    CONSTRAINT fk_danh_gia_khach FOREIGN KEY (khach_hang_id) REFERENCES nguoi_dung (id),
    CONSTRAINT fk_danh_gia_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham (id),
    CONSTRAINT fk_danh_gia_don FOREIGN KEY (don_hang_id) REFERENCES don_hang (id),
    CONSTRAINT ck_danh_gia_so_sao CHECK (so_sao BETWEEN 1 AND 5)
);

CREATE TABLE yeu_cau_bao_hanh (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    don_hang_id      BIGINT        NOT NULL,
    khach_hang_id    BIGINT        NOT NULL,
    mo_ta            VARCHAR(1000) NOT NULL,
    duong_dan_video  VARCHAR(500)  NULL,
    ket_qua          VARCHAR(500)  NULL,
    xu_ly_luc        DATETIME(6)   NULL,
    created_at       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_bao_hanh_don (don_hang_id),
    CONSTRAINT fk_bao_hanh_don FOREIGN KEY (don_hang_id) REFERENCES don_hang (id),
    CONSTRAINT fk_bao_hanh_khach FOREIGN KEY (khach_hang_id) REFERENCES nguoi_dung (id)
);
