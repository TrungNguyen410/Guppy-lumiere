package com.guppyshop.payment.domain.model;

import com.guppyshop.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * KẾ THỪA + ABSTRACT, JPA SINGLE_TABLE, STRATEGY: mỗi phương thức tự định nghĩa thucHien,
 * và tự quyết định phản ứng khi đơn hoàn tất. Đơn hàng không cần biết đang dùng phương thức nào.
 */
@Getter
@Entity
@Table(name = "thanh_toan")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "loai_thanh_toan", length = 31)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class ThanhToan extends BaseEntity {

    @Column(name = "don_hang_id", nullable = false, updatable = false)
    private Long donHangId;

    @Column(name = "so_tien", nullable = false, updatable = false)
    private BigDecimal soTien;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiThanhToan trangThai = TrangThaiThanhToan.CHUA_THANH_TOAN;

    @Column(name = "noi_dung_ck")
    private String noiDungCk;

    @Column(name = "da_tra_luc")
    private LocalDateTime daTraLuc;

    protected ThanhToan(Long donHangId, BigDecimal soTien) {
        this.donHangId = donHangId;
        this.soTien = soTien;
    }

    public abstract PhuongThucThanhToan layPhuongThuc();

    /** Bắt đầu thanh toán ngay khi đơn được tạo. */
    public abstract void thucHien(CongThanhToan cong, String maDon, String soDienThoai);

    /** Nhân viên xác nhận đã nhận được tiền chuyển khoản. */
    public abstract void xacNhanDaNhanTien();

    /** Đơn được giao xong. */
    public abstract void khiDonHoanTat();

    /** Đơn bị hủy: chỉ hoàn tiền nếu đã thu. */
    public void khiDonBiHuy() {
        if (trangThai == TrangThaiThanhToan.DA_THANH_TOAN) {
            trangThai = TrangThaiThanhToan.DA_HOAN_TIEN;
        }
    }

    protected final void danhDauDaTra() {
        trangThai = TrangThaiThanhToan.DA_THANH_TOAN;
        daTraLuc = LocalDateTime.now();
    }

    protected final void datNoiDungChuyenKhoan(String noiDung) {
        noiDungCk = noiDung;
    }
}
