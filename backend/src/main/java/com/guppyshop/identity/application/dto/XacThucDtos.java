package com.guppyshop.identity.application.dto;

import com.guppyshop.identity.domain.model.VaiTro;
import io.swagger.v3.oas.annotations.media.Schema;

/** Dữ liệu vào và ra của đăng ký, đăng nhập. */
public final class XacThucDtos {

    private XacThucDtos() {
    }

    public record DangKyCommand(String hoTen, String email, String soDienThoai, String matKhau) {
    }

    public record DangNhapCommand(String tenDangNhap, String matKhau) {
    }

    @Schema(description = "Phiên đăng nhập")
    public record PhienDangNhapDto(
            @Schema(description = "JWT dùng cho header Authorization") String token,
            String hoTen,
            String email,
            VaiTro vaiTro) {
    }
}
