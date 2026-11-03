package com.guppyshop.payment.domain.model;

import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/** Chuyển khoản: tạo nội dung đối soát lúc đặt, nhân viên xác nhận khi tiền về. */
@Entity
@DiscriminatorValue("CHUYEN_KHOAN")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ThanhToanChuyenKhoan extends ThanhToan {

    public ThanhToanChuyenKhoan(Long donHangId, BigDecimal soTien) {
        super(donHangId, soTien);
    }

    @Override
    public PhuongThucThanhToan layPhuongThuc() {
        return PhuongThucThanhToan.CHUYEN_KHOAN;
    }

    @Override
    public void thucHien(CongThanhToan cong, String maDon, String soDienThoai) {
        datNoiDungChuyenKhoan(cong.taoNoiDung(maDon, soDienThoai));
    }

    @Override
    public void xacNhanDaNhanTien() {
        if (getTrangThai() != TrangThaiThanhToan.CHUA_THANH_TOAN) {
            throw new BusinessException("Đơn này không ở trạng thái chờ thanh toán");
        }
        danhDauDaTra();
    }

    @Override
    public void khiDonHoanTat() {
        // Tiền chuyển khoản do nhân viên xác nhận riêng, giao xong không tự coi là đã nhận
    }
}
