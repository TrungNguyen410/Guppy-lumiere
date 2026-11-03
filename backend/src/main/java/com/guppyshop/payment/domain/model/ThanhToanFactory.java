package com.guppyshop.payment.domain.model;

import java.math.BigDecimal;

/** FACTORY: tạo đúng lớp thanh toán theo lựa chọn của khách. */
public final class ThanhToanFactory {

    private ThanhToanFactory() {
    }

    public static ThanhToan tao(PhuongThucThanhToan phuongThuc, Long donHangId, BigDecimal soTien) {
        return switch (phuongThuc) {
            case COD -> new ThanhToanCOD(donHangId, soTien);
            case CHUYEN_KHOAN -> new ThanhToanChuyenKhoan(donHangId, soTien);
        };
    }
}
