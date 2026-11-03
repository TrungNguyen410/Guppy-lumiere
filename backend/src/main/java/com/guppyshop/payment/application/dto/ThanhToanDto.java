package com.guppyshop.payment.application.dto;

import com.guppyshop.payment.domain.model.PhuongThucThanhToan;
import com.guppyshop.payment.domain.model.TrangThaiThanhToan;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "Thanh toán của đơn; các trường ngân hàng chỉ có với chuyển khoản")
public record ThanhToanDto(
        PhuongThucThanhToan phuongThuc,
        TrangThaiThanhToan trangThai,
        BigDecimal soTien,
        LocalDateTime daTraLuc,
        String noiDungChuyenKhoan,
        String nganHang,
        String soTaiKhoan,
        String chuTaiKhoan) {
}
