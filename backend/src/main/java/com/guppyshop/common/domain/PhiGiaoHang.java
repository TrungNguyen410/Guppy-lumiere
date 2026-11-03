package com.guppyshop.common.domain;

import java.math.BigDecimal;

/** Giao hỏa tốc 50.000đ, miễn phí từ 500.000đ. Giỏ hàng và đơn hàng dùng chung quy tắc này. */
public final class PhiGiaoHang {

    private static final BigDecimal PHI = new BigDecimal("50000");
    private static final BigDecimal MUC_MIEN_PHI = new BigDecimal("500000");

    private PhiGiaoHang() {
    }

    public static BigDecimal tinh(BigDecimal tamTinh) {
        boolean mienPhi = tamTinh.signum() == 0 || tamTinh.compareTo(MUC_MIEN_PHI) >= 0;
        return mienPhi ? BigDecimal.ZERO : PHI;
    }
}
