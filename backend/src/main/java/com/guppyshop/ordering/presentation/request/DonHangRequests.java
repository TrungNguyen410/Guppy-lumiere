package com.guppyshop.ordering.presentation.request;

import com.guppyshop.cart.application.dto.GioHangDtos.ChuGioHang;
import com.guppyshop.common.domain.ThanhPhoGiao;
import com.guppyshop.ordering.application.dto.DonHangDtos.ChuyenTrangThaiCommand;
import com.guppyshop.ordering.application.dto.DonHangDtos.DatHangCommand;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import com.guppyshop.payment.domain.model.PhuongThucThanhToan;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class DonHangRequests {

    private DonHangRequests() {
    }

    @Schema(description = "Đặt hàng từ giỏ hiện tại; sản phẩm và giá do hệ thống lấy từ giỏ, không gửi từ client")
    public record DatHangRequest(
            @Schema(example = "Nguyễn Văn A") @NotBlank(message = "Họ tên không được trống") @Size(max = 120) String hoTen,
            @Schema(example = "0901234567") @NotBlank(message = "Số điện thoại không được trống") @Pattern(regexp = "0\\d{9}", message = "Số điện thoại gồm 10 số, bắt đầu bằng 0") String soDienThoai,
            @Schema(example = "12 Lê Lợi, Q.1") @NotBlank(message = "Địa chỉ không được trống") @Size(max = 255) String diaChi,
            @Schema(example = "TP. Hồ Chí Minh") @NotBlank(message = "Thành phố không được trống") @Pattern(regexp = ThanhPhoGiao.REGEX, message = "Cá sống chỉ giao tại TP. Hồ Chí Minh, Hà Nội, Đà Nẵng") String thanhPho,
            @Size(max = 500) String ghiChu,
            @NotNull(message = "Chưa chọn phương thức thanh toán") PhuongThucThanhToan phuongThuc,
            @Schema(example = "GUPPY10") @Size(max = 30) String maGiamGia) {

        public DatHangCommand sangLenh(ChuGioHang chu) {
            return new DatHangCommand(chu, hoTen, soDienThoai, diaChi, thanhPho, ghiChu, phuongThuc, maGiamGia);
        }
    }

    @Schema(description = "Khách hủy đơn; số điện thoại phải khớp với đơn")
    public record HuyDonRequest(
            @Schema(example = "0901234567") @NotBlank(message = "Số điện thoại không được trống") String soDienThoai) {
    }

    @Schema(description = "Nhân viên chuyển trạng thái đơn")
    public record ChuyenTrangThaiRequest(
            @NotNull(message = "Chưa chọn trạng thái") TrangThaiDon trangThai,
            @Size(max = 255) String ghiChu) {

        public ChuyenTrangThaiCommand sangLenh() {
            return new ChuyenTrangThaiCommand(trangThai, ghiChu);
        }
    }
}
