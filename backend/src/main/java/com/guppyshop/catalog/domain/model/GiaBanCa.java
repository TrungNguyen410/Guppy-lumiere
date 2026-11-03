package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** Một dòng trong bảng giá, chỉ tồn tại bên trong CaGuppy (composition). */
@Getter
@Entity
@Table(name = "gia_ban_ca")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GiaBanCa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ca_guppy_id", nullable = false, updatable = false)
    private CaGuppy caGuppy;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "don_vi", nullable = false, updatable = false)
    private DonViBan donVi;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "gioi_tinh", nullable = false, updatable = false)
    private GioiTinh gioiTinh;

    @Column(name = "gia", nullable = false)
    private BigDecimal gia;

    GiaBanCa(CaGuppy caGuppy, MucGia muc) {
        this.caGuppy = caGuppy;
        this.donVi = muc.donVi();
        this.gioiTinh = muc.gioiTinh();
        this.gia = muc.gia();
    }

    boolean cungLoai(DonViBan donVi, GioiTinh gioiTinh) {
        return this.donVi == donVi && this.gioiTinh == gioiTinh;
    }

    void doiGia(BigDecimal gia) {
        this.gia = gia;
    }
}
