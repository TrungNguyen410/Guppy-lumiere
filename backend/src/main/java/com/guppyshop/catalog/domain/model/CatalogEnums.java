package com.guppyshop.catalog.domain.model;

/** Các tập giá trị của module catalog, khớp với CHECK trong V1__init.sql. */
public final class CatalogEnums {

    private CatalogEnums() {
    }

    public enum LoaiSanPham { CA_GUPPY, PHU_KIEN }

    /**
     * Theo các lớp màu của IFGA và tên gọi phổ biến ở Việt Nam: SOLID (một màu, gồm cả Full Red, Moscow),
     * TUXEDO (nửa thân sau sẫm màu, Half Black), SNAKESKIN (vân da rắn, Cobra), DRAGON (vảy rồng ánh kim).
     */
    public enum HoaTiet { SOLID, MOSAIC, GRASS, KOI, TUXEDO, SNAKESKIN, DRAGON }

    /** KIM: đuôi kim (pintail), CO: đuôi cờ (flagtail), hai kiểu đuôi ngắn có trong chuẩn IFGA. */
    public enum KieuDuoi { DELTA, TRON, KIEM_DOI, VOAN, DAN, THUONG, KIM, CO }

    public enum DonViBan { CON_LE, CAP, BO_BA, LO_CA_BOT }

    public enum GioiTinh { DUC, CAI, KHONG_AP_DUNG }

    public enum NhanSanPham { HOT, MOI_VE, HIEM, GIAM_GIA }

    public enum LoaiPhuKien { THUC_AN, BE, LOC, THUOC }

    public enum SapXepSanPham { BAN_CHAY, DANH_GIA, GIA_TANG, GIA_GIAM }
}
