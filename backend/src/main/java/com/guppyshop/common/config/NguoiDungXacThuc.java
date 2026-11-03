package com.guppyshop.common.config;

/** Người dùng lấy từ JWT, controller nhận qua @AuthenticationPrincipal. */
public record NguoiDungXacThuc(Long id, String email, String vaiTro) {
}
