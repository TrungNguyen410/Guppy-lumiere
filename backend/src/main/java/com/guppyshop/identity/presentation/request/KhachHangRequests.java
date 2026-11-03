package com.guppyshop.identity.presentation.request;

import com.guppyshop.common.domain.ThanhPhoGiao;
import com.guppyshop.identity.application.dto.KhachHangDtos.CapNhatHoSoCommand;
import com.guppyshop.identity.application.dto.KhachHangDtos.LuuDiaChiCommand;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class KhachHangRequests {

    private KhachHangRequests() {
    }

    @Schema(description = "Cập nhật hồ sơ")
    public record CapNhatHoSoRequest(
            @NotBlank(message = "Họ tên không được trống") @Size(max = 120) String hoTen,
            @NotBlank(message = "Số điện thoại không được trống") @Pattern(regexp = "0\\d{9}", message = "Số điện thoại gồm 10 số, bắt đầu bằng 0") String soDienThoai) {

        public CapNhatHoSoCommand sangLenh() {
            return new CapNhatHoSoCommand(hoTen, soDienThoai);
        }
    }

    @Schema(description = "Thêm hoặc sửa địa chỉ")
    public record LuuDiaChiRequest(
            @NotBlank(message = "Họ tên người nhận không được trống") @Size(max = 120) String hoTenNhan,
            @NotBlank(message = "Số điện thoại không được trống") @Pattern(regexp = "0\\d{9}", message = "Số điện thoại gồm 10 số, bắt đầu bằng 0") String soDienThoai,
            @NotBlank(message = "Địa chỉ không được trống") @Size(max = 255) String diaChi,
            @Schema(example = "Hà Nội") @NotBlank(message = "Thành phố không được trống") @Pattern(regexp = ThanhPhoGiao.REGEX, message = "Cá sống chỉ giao tại TP. Hồ Chí Minh, Hà Nội, Đà Nẵng") String thanhPho,
            boolean macDinh) {

        public LuuDiaChiCommand sangLenh() {
            return new LuuDiaChiCommand(hoTenNhan, soDienThoai, diaChi, thanhPho, macDinh);
        }
    }
}
