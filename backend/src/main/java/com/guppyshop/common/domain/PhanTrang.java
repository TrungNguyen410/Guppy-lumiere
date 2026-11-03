package com.guppyshop.common.domain;

/** Yêu cầu phân trang của domain, giúp interface repository không phụ thuộc Spring Data. */
public record PhanTrang(int trang, int kichThuoc) {

    private static final int KICH_THUOC_TOI_DA = 100;

    public PhanTrang {
        trang = Math.max(trang, 0);
        kichThuoc = Math.clamp(kichThuoc, 1, KICH_THUOC_TOI_DA);
    }
}
