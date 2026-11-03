package com.guppyshop.review.domain.model;

import com.guppyshop.common.domain.BaseEntity;
import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** Đánh giá của khách cho một sản phẩm trong một đơn đã hoàn tất. */
@Getter
@Entity
@Table(name = "danh_gia")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DanhGia extends BaseEntity {

    @Column(name = "khach_hang_id", nullable = false, updatable = false)
    private Long khachHangId;

    @Column(name = "san_pham_id", nullable = false, updatable = false)
    private Long sanPhamId;

    @Column(name = "don_hang_id", nullable = false, updatable = false)
    private Long donHangId;

    @Column(name = "so_sao", nullable = false, updatable = false)
    private int soSao;

    @Column(name = "noi_dung", updatable = false)
    private String noiDung;

    public DanhGia(Long khachHangId, Long sanPhamId, Long donHangId, int soSao, String noiDung) {
        if (soSao < 1 || soSao > 5) {
            throw new BusinessException("Số sao phải từ 1 đến 5");
        }
        this.khachHangId = khachHangId;
        this.sanPhamId = sanPhamId;
        this.donHangId = donHangId;
        this.soSao = soSao;
        this.noiDung = noiDung;
    }

    /** Hiển thị công khai dạng "Anh N." để không lộ họ tên đầy đủ của khách. */
    public static String anTen(String hoTen) {
        if (hoTen == null || hoTen.isBlank()) {
            return "Khách hàng";
        }
        String[] tu = hoTen.strip().split("\\s+");
        return tu.length == 1 ? tu[0] : tu[tu.length - 1] + " " + tu[0].charAt(0) + ".";
    }
}
