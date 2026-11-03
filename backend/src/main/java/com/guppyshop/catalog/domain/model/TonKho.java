package com.guppyshop.catalog.domain.model;

/** Tổng số cá hiện có của một sản phẩm, cộng từ các lô. */
public record TonKho(int duc, int cai, int bot) {

    public static final TonKho TRONG = new TonKho(0, 0, 0);
}
