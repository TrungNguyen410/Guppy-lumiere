package com.guppyshop.promotion.domain.model;

import com.guppyshop.common.domain.BaseEntity;
import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** Mã giảm giá theo %, có hạn dùng và có thể giới hạn số lượt. */
@Getter
@Entity
@Table(name = "ma_giam_gia")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MaGiamGia extends BaseEntity {

    private static final BigDecimal MOT_TRAM = BigDecimal.valueOf(100);

    @Column(name = "ma", nullable = false, updatable = false)
    private String ma;

    @Column(name = "phan_tram", nullable = false)
    private int phanTram;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_het_han", nullable = false)
    private LocalDateTime ngayHetHan;

    @Column(name = "so_luot_toi_da")
    private Integer soLuotToiDa;

    @Column(name = "so_luot_da_dung", nullable = false)
    private int soLuotDaDung;

    @Column(name = "kich_hoat", nullable = false)
    private boolean kichHoat;

    public MaGiamGia(String ma, int phanTram, LocalDateTime ngayBatDau, LocalDateTime ngayHetHan, Integer soLuotToiDa, boolean kichHoat) {
        this.ma = ma;
        capNhat(phanTram, ngayBatDau, ngayHetHan, soLuotToiDa, kichHoat);
    }

    public final void capNhat(int phanTram, LocalDateTime ngayBatDau, LocalDateTime ngayHetHan, Integer soLuotToiDa, boolean kichHoat) {
        if (phanTram < 1 || phanTram > 100) {
            throw new BusinessException("Phần trăm giảm phải từ 1 đến 100");
        }
        if (!ngayBatDau.isBefore(ngayHetHan)) {
            throw new BusinessException("Ngày bắt đầu phải trước ngày hết hạn");
        }
        if (soLuotToiDa != null && soLuotToiDa < 1) {
            throw new BusinessException("Số lượt tối đa phải lớn hơn 0");
        }
        this.phanTram = phanTram;
        this.ngayBatDau = ngayBatDau;
        this.ngayHetHan = ngayHetHan;
        this.soLuotToiDa = soLuotToiDa;
        this.kichHoat = kichHoat;
    }

    /** Số tiền được giảm, làm tròn đến đồng; mã không dùng được thì báo lý do cụ thể. */
    public BigDecimal tinhTienGiam(BigDecimal tamTinh, LocalDateTime bayGio) {
        if (!kichHoat) {
            throw new BusinessException("Mã giảm giá không còn hoạt động");
        }
        if (bayGio.isBefore(ngayBatDau)) {
            throw new BusinessException("Mã giảm giá chưa đến thời gian sử dụng");
        }
        if (!bayGio.isBefore(ngayHetHan)) {
            throw new BusinessException("Mã giảm giá đã hết hạn");
        }
        if (soLuotToiDa != null && soLuotDaDung >= soLuotToiDa) {
            throw new BusinessException("Mã giảm giá đã hết lượt sử dụng");
        }
        return tamTinh.multiply(BigDecimal.valueOf(phanTram)).divide(MOT_TRAM, 0, RoundingMode.HALF_UP);
    }

    public void dungMotLuot() {
        soLuotDaDung++;
    }

    /** Đơn bị hủy thì trả lại lượt đã dùng. */
    public void traMotLuot() {
        if (soLuotDaDung > 0) {
            soLuotDaDung--;
        }
    }
}
