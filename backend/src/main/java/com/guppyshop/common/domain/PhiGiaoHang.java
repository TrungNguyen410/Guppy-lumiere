package com.guppyshop.common.domain;

import java.math.BigDecimal;

/**
 * Giao hỏa tốc 50.000đ, miễn phí khi tiền hàng sau giảm giá từ 500.000đ.
 * Giỏ hàng, xem trước mã giảm giá và đơn hàng dùng chung quy tắc này.
 */
public final class PhiGiaoHang {

    private static final BigDecimal PHI = new BigDecimal("50000");
    private static final BigDecimal MUC_MIEN_PHI = new BigDecimal("500000");

    private PhiGiaoHang() {
    }

    /** Giỏ chưa áp mã. */
    public static BigDecimal tinh(BigDecimal tamTinh) {
        return tinh(tamTinh, BigDecimal.ZERO);
    }

    /** Giỏ trống thì không có phí; mã giảm 100% vẫn tính phí vì tiền hàng sau giảm dưới mốc. */
    public static BigDecimal tinh(BigDecimal tamTinh, BigDecimal giamGia) {
        if (tamTinh.signum() == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal sauGiam = tamTinh.subtract(giamGia == null ? BigDecimal.ZERO : giamGia);
        return sauGiam.compareTo(MUC_MIEN_PHI) >= 0 ? BigDecimal.ZERO : PHI;
    }
}
