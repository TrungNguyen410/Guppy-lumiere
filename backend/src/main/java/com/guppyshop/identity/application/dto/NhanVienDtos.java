package com.guppyshop.identity.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** Dữ liệu quản lý nhân viên. */
public final class NhanVienDtos {

    private NhanVienDtos() {
    }

    public record TaoNhanVienCommand(String hoTen, String email, String soDienThoai, String matKhau) {
    }

    /** matKhauMoi để trống nghĩa là giữ nguyên mật khẩu. */
    public record SuaNhanVienCommand(String hoTen, String soDienThoai, boolean kichHoat, String matKhauMoi) {
    }

    @Schema(description = "Nhân viên")
    public record NhanVienDto(Long id, String hoTen, String email, String soDienThoai, boolean kichHoat) {
    }
}
