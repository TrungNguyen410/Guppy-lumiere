package com.guppyshop.identity.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** Dữ liệu hồ sơ và sổ địa chỉ của khách hàng. */
public final class KhachHangDtos {

    private KhachHangDtos() {
    }

    public record CapNhatHoSoCommand(String hoTen, String soDienThoai) {
    }

    public record LuuDiaChiCommand(String hoTenNhan, String soDienThoai, String diaChi, String thanhPho, boolean macDinh) {
    }

    @Schema(description = "Hồ sơ khách hàng")
    public record HoSoDto(Long id, String hoTen, String email, String soDienThoai) {
    }

    @Schema(description = "Địa chỉ trong sổ địa chỉ")
    public record DiaChiDto(Long id, String hoTenNhan, String soDienThoai, String diaChi, String thanhPho, boolean macDinh) {
    }
}
