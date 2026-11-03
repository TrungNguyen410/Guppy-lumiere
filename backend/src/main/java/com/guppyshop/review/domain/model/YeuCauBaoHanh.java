package com.guppyshop.review.domain.model;

import com.guppyshop.common.domain.BaseEntity;
import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** Yêu cầu bảo hành cá chết; video chỉ là đường dẫn, hệ thống không nhận tải tệp. */
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

    @Column(name = "ket_qua")
    private String ketQua;

    @Column(name = "xu_ly_luc")
    private LocalDateTime xuLyLuc;

    public YeuCauBaoHanh(Long donHangId, Long khachHangId, String moTa, String duongDanVideo) {
        this.donHangId = donHangId;
        this.khachHangId = khachHangId;
        this.moTa = moTa;
        this.duongDanVideo = duongDanVideo;
    }

    public boolean daXuLy() {
        return xuLyLuc != null;
    }

    public void xuLy(String ketQua, LocalDateTime luc) {
        if (daXuLy()) {
            throw new BusinessException("Yêu cầu này đã được xử lý");
        }
        this.ketQua = ketQua;
        this.xuLyLuc = luc;
    }
}
