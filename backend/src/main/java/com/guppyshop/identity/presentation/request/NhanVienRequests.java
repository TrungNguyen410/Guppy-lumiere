package com.guppyshop.identity.presentation.request;

import com.guppyshop.common.domain.SoDienThoai;
import com.guppyshop.identity.application.dto.NhanVienDtos.SuaNhanVienCommand;
import com.guppyshop.identity.application.dto.NhanVienDtos.TaoNhanVienCommand;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class NhanVienRequests {

    private NhanVienRequests() {
    }

    @Schema(description = "Tạo nhân viên")
    public record TaoNhanVienRequest(
            @NotBlank(message = "Họ tên không được trống") @Size(max = 120) String hoTen,
            @NotBlank(message = "Email không được trống") @Email(message = "Email không hợp lệ") @Size(max = 160) String email,
            @NotBlank(message = "Số điện thoại không được trống") @Pattern(regexp = SoDienThoai.REGEX, message = SoDienThoai.THONG_BAO) String soDienThoai,
            @NotBlank(message = "Mật khẩu không được trống") @Size(min = 8, max = 72, message = "Mật khẩu từ 8 đến 72 ký tự") @Pattern(regexp = "\\p{ASCII}*", message = "Mật khẩu không dùng ký tự có dấu") String matKhau) {

        public TaoNhanVienCommand sangLenh() {
            return new TaoNhanVienCommand(hoTen, email, soDienThoai, matKhau);
        }
    }

    @Schema(description = "Sửa nhân viên")
    public record SuaNhanVienRequest(
            @NotBlank(message = "Họ tên không được trống") @Size(max = 120) String hoTen,
            @NotBlank(message = "Số điện thoại không được trống") @Pattern(regexp = SoDienThoai.REGEX, message = SoDienThoai.THONG_BAO) String soDienThoai,
            boolean kichHoat,
            @Schema(description = "Để trống nếu giữ nguyên mật khẩu") @Size(min = 8, max = 72, message = "Mật khẩu từ 8 đến 72 ký tự") @Pattern(regexp = "\\p{ASCII}*", message = "Mật khẩu không dùng ký tự có dấu") String matKhauMoi) {

        public SuaNhanVienCommand sangLenh() {
            return new SuaNhanVienCommand(hoTen, soDienThoai, kichHoat, matKhauMoi);
        }
    }
}
