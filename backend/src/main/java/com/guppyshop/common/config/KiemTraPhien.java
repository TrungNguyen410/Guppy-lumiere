package com.guppyshop.common.config;

/**
 * Hỏi module identity tài khoản còn hoạt động không, để khóa tài khoản có tác dụng ngay.
 * Đặt interface ở common giúp common không phụ thuộc ngược vào identity.
 */
public interface KiemTraPhien {

    boolean conHoatDong(Long nguoiDungId);
}
