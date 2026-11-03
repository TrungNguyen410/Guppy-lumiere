package com.guppyshop.ordering.domain.model;

import com.guppyshop.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** Mỗi lần đổi trạng thái ghi một dòng; thanh trạng thái hiển thị thời gian từ đây. */
@Getter
@Entity
@Table(name = "lich_su_trang_thai")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LichSuTrangThai extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "don_hang_id", nullable = false, updatable = false)
    private DonHang donHang;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "trang_thai", nullable = false, updatable = false)
    private TrangThaiDon trangThai;

    @Column(name = "thoi_diem", nullable = false, updatable = false)
    private LocalDateTime thoiDiem;

    @Column(name = "ghi_chu", updatable = false)
    private String ghiChu;

    LichSuTrangThai(DonHang donHang, TrangThaiDon trangThai, LocalDateTime thoiDiem, String ghiChu) {
        this.donHang = donHang;
        this.trangThai = trangThai;
        this.thoiDiem = thoiDiem;
        this.ghiChu = ghiChu;
    }
}
