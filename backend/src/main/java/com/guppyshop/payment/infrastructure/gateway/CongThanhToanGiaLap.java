package com.guppyshop.payment.infrastructure.gateway;

import com.guppyshop.payment.domain.model.CongThanhToan;
import org.springframework.stereotype.Component;

/**
 * Cổng giả lập cho đồ án: không gọi ngân hàng thật và không nhận tiền thật.
 * Số tài khoản lấy theo thiết kế chỉ để hiển thị minh họa.
 */
@Component
class CongThanhToanGiaLap implements CongThanhToan {

    private static final ThongTinChuyenKhoan TAI_KHOAN =
            new ThongTinChuyenKhoan("Vietcombank", "0071 000 777 999", "GUPPY LUMIERE");

    @Override
    public ThongTinChuyenKhoan thongTinNhanTien() {
        return TAI_KHOAN;
    }

    @Override
    public String taoNoiDung(String maDon, String soDienThoai) {
        return maDon + " " + soDienThoai;
    }
}
