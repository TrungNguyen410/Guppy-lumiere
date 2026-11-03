package com.guppyshop.inventory.domain.model;

import com.guppyshop.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** Một dòng nhật ký kho, không sửa sau khi ghi. Số âm là giảm, số dương là tăng. */
@Getter
@Entity
@Table(name = "bien_dong_kho")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BienDongKho extends BaseEntity {

    @Column(name = "lo_ca_id", nullable = false, updatable = false)
    private Long loCaId;

    @Column(name = "don_hang_id", updatable = false)
    private Long donHangId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "loai", nullable = false, updatable = false)
    private LoaiBienDong loai;

    @Column(name = "delta_duc", nullable = false, updatable = false)
    private int deltaDuc;

    @Column(name = "delta_cai", nullable = false, updatable = false)
    private int deltaCai;

    @Column(name = "delta_bot", nullable = false, updatable = false)
    private int deltaBot;

    @Column(name = "ghi_chu", updatable = false)
    private String ghiChu;

    BienDongKho(Long loCaId, Long donHangId, LoaiBienDong loai, int deltaDuc, int deltaCai, int deltaBot, String ghiChu) {
        this.loCaId = loCaId;
        this.donHangId = donHangId;
        this.loai = loai;
        this.deltaDuc = deltaDuc;
        this.deltaCai = deltaCai;
        this.deltaBot = deltaBot;
        this.ghiChu = ghiChu;
    }
}
