package com.guppyshop.common.domain;

/**
 * Số di động Việt Nam sau khi chuyển mạng 11 số sang 10 số (2018): 10 chữ số, đầu số 03, 05, 07, 08, 09.
 * Các đầu 01x, 02x (cố định), 04x, 06x không phải số di động nên không nhận được tin giao hàng.
 */
public final class SoDienThoai {

    /** Dùng trong @Pattern nên phải là hằng số lúc biên dịch. */
    public static final String REGEX = "0[35789]\\d{8}";

    public static final String THONG_BAO = "Số di động gồm 10 số, đầu số 03, 05, 07, 08 hoặc 09";

    private SoDienThoai() {
    }
}
