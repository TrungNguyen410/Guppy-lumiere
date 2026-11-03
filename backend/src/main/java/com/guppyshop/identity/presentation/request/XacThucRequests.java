package com.guppyshop.identity.presentation.request;

import com.guppyshop.identity.application.dto.XacThucDtos.DangKyCommand;
import com.guppyshop.identity.application.dto.XacThucDtos.DangNhapCommand;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class XacThucRequests {

    private XacThucRequests() {
    }

    @Schema(description = "Thông tin đăng ký tài khoản khách hàng")
    public record DangKyRequest(
            @Schema(example = "Nguyễn Văn A") @NotBlank(message = "Họ tên không được trống") @Size(max = 120) String hoTen,
            @Schema(example = "khach@example.com") @NotBlank(message = "Email không được trống") @Email(message = "Email không hợp lệ") @Size(max = 160) String email,
            @Schema(example = "0901234567") @NotBlank(message = "Số điện thoại không được trống") @Pattern(regexp = "0\\d{9}", message = "Số điện thoại gồm 10 số, bắt đầu bằng 0") String soDienThoai,
            @Schema(example = "MatKhau@123") @NotBlank(message = "Mật khẩu không được trống") @Size(min = 8, max = 72, message = "Mật khẩu từ 8 đến 72 ký tự") @Pattern(regexp = "\\p{ASCII}*", message = "Mật khẩu không dùng ký tự có dấu") String matKhau) {

        public DangKyCommand sangLenh() {
            return new DangKyCommand(hoTen, email, soDienThoai, matKhau);
        }
    }

    @Schema(description = "Thông tin đăng nhập")
    public record DangNhapRequest(
            @Schema(description = "Email hoặc số điện thoại", example = "admin@guppylumiere.vn") @NotBlank(message = "Tên đăng nhập không được trống") String tenDangNhap,
            @Schema(example = "Admin@123") @NotBlank(message = "Mật khẩu không được trống") @Size(max = 72, message = "Mật khẩu tối đa 72 ký tự") String matKhau) {

        public DangNhapCommand sangLenh() {
            return new DangNhapCommand(tenDangNhap, matKhau);
        }
    }
}
