package com.guppyshop.common.domain;

/** Cá sống chỉ giao hỏa tốc tại 3 thành phố. */
public final class ThanhPhoGiao {

    /** Dùng trong @Pattern nên phải là hằng số lúc biên dịch. */
    public static final String REGEX = "TP\\. Hồ Chí Minh|Hà Nội|Đà Nẵng";

    private ThanhPhoGiao() {
    }
}
