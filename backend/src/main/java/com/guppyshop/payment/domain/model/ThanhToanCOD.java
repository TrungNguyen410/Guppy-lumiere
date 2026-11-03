package com.guppyshop.payment.domain.model;

import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/** Trả tiền khi nhận hàng: không làm gì lúc đặt, tiền được thu khi đơn hoàn tất. */
@Entity
@DiscriminatorValue("COD")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ThanhToanCOD extends ThanhToan {

    public ThanhToanCOD(Long donHangId, BigDecimal soTien) {
        super(donHangId, soTien);
    }

    @Override
    public PhuongThucThanhToan layPhuongThuc() {
        return PhuongThucThanhToan.COD;
    }

    @Override
    public void thucHien(CongThanhToan cong, String maDon, String soDienThoai) {
        // COD không cần bước nào khi đặt hàng
    }

    @Override
    public void xacNhanDaNhanTien() {
        throw new BusinessException("Đơn COD được thu tiền khi giao hàng thành công");
    }

    @Override
    public void khiDonHoanTat() {
        danhDauDaTra();
    }
}
