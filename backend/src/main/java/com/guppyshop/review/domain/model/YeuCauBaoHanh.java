package com.guppyshop.review.domain.model;

import com.guppyshop.common.domain.BaseEntity;
import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Yêu cầu bảo hành cá chết; video chỉ là đường dẫn, hệ thống không nhận tải tệp.
 * Khi xử lý, nhân viên chọn một hình thức; chỉ HOAN_TIEN có số tiền và số tiền không vượt tiền hàng của đơn.
 */
@Getter
@Entity
@Table(name = "yeu_cau_bao_hanh")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class YeuCauBaoHanh extends BaseEntity {

    @Column(name = "don_hang_id", nullable = false, updatable = false)
    private Long donHangId;

    @Column(name = "khach_hang_id", nullable = false, updatable = false)
    private Long khachHangId;

    @Column(name = "mo_ta", nullable = false, updatable = false)
    private String moTa;

    @Column(name = "duong_dan_video", updatable = false)
    private String duongDanVideo;

    @Column(name = "so_ca_chet", nullable = false, updatable = false)
    private int soCaChet;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "hinh_thuc")
    private HinhThucBaoHanh hinhThuc;

    @Column(name = "so_tien_hoan")
    private BigDecimal soTienHoan;

    /** Ghi chú của nhân viên; bắt buộc khi từ chối để khách biết lý do. */
    @Column(name = "ket_qua")
    private String ketQua;

    @Column(name = "xu_ly_luc")
    private LocalDateTime xuLyLuc;

    public YeuCauBaoHanh(Long donHangId, Long khachHangId, String moTa, String duongDanVideo, int soCaChet) {
        if (soCaChet < 1) {
            throw new BusinessException("Số cá chết phải từ 1 con");
        }
        this.donHangId = donHangId;
        this.khachHangId = khachHangId;
        this.moTa = moTa;
        this.duongDanVideo = duongDanVideo;
        this.soCaChet = soCaChet;
    }

    public boolean daXuLy() {
        return xuLyLuc != null;
    }

    /**
     * @param tienHoanToiDa tiền hàng khách đã trả cho đơn (sau giảm giá, không gồm phí giao)
     */
    public void xuLy(HinhThucBaoHanh hinhThuc, BigDecimal soTienHoan, BigDecimal tienHoanToiDa, String ghiChu, LocalDateTime luc) {
        if (daXuLy()) {
            throw new BusinessException("Yêu cầu này đã được xử lý");
        }
        if (hinhThuc == null) {
            throw new BusinessException("Chưa chọn hình thức xử lý");
        }
        String ghiChuGon = ghiChu == null || ghiChu.isBlank() ? null : ghiChu.strip();
        if (hinhThuc == HinhThucBaoHanh.HOAN_TIEN) {
            if (soTienHoan == null || soTienHoan.signum() <= 0) {
                throw new BusinessException("Số tiền hoàn phải lớn hơn 0");
            }
            if (soTienHoan.compareTo(tienHoanToiDa) > 0) {
                throw new BusinessException("Số tiền hoàn không được vượt tiền hàng của đơn (" + tienHoanToiDa.toPlainString() + "đ)");
            }
        } else if (soTienHoan != null && soTienHoan.signum() != 0) {
            throw new BusinessException("Chỉ hình thức hoàn tiền mới có số tiền hoàn");
        }
        if (hinhThuc == HinhThucBaoHanh.TU_CHOI && ghiChuGon == null) {
            throw new BusinessException("Vui lòng ghi lý do từ chối");
        }
        this.hinhThuc = hinhThuc;
        this.soTienHoan = hinhThuc == HinhThucBaoHanh.HOAN_TIEN ? soTienHoan : null;
        this.ketQua = ghiChuGon;
        this.xuLyLuc = luc;
    }

    /** Một dòng tóm tắt để ghi vào lịch sử đơn. */
    public String tomTat() {
        String chinh = switch (hinhThuc) {
            case DOI_CA -> "Đổi " + soCaChet + " cá mới";
            case HOAN_TIEN -> "Hoàn " + soTienHoan.toPlainString() + "đ tiền cá";
            case TU_CHOI -> "Từ chối";
        };
        return ketQua == null ? chinh : chinh + " – " + ketQua;
    }
}
