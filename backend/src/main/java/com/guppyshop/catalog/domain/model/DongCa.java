package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.HoaTiet;
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

/** Dòng cá cùng bảng màu; frontend dùng bảng màu này để vẽ cá SVG và 3D. */
@Getter
@Entity
@Table(name = "dong_ca")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DongCa extends BaseEntity {

    @Column(name = "ma", nullable = false, updatable = false)
    private String ma;

    @Column(name = "ten", nullable = false)
    private String ten;

    @Column(name = "xuat_xu", nullable = false)
    private String xuatXu;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "hoa_tiet", nullable = false)
    private HoaTiet hoaTiet;

    @Column(name = "mau_than", nullable = false, columnDefinition = "char(7)")
    private String mauThan;

    @Column(name = "mau_duoi_1", nullable = false, columnDefinition = "char(7)")
    private String mauDuoi1;

    @Column(name = "mau_duoi_2", nullable = false, columnDefinition = "char(7)")
    private String mauDuoi2;

    @Column(name = "mau_nhan", nullable = false, columnDefinition = "char(7)")
    private String mauNhan;

    public DongCa(String ma, String ten, String xuatXu, HoaTiet hoaTiet,
                  String mauThan, String mauDuoi1, String mauDuoi2, String mauNhan) {
        this.ma = ma;
        capNhat(ten, xuatXu, hoaTiet, mauThan, mauDuoi1, mauDuoi2, mauNhan);
    }

    public final void capNhat(String ten, String xuatXu, HoaTiet hoaTiet,
                              String mauThan, String mauDuoi1, String mauDuoi2, String mauNhan) {
        this.ten = ten;
        this.xuatXu = xuatXu;
        this.hoaTiet = hoaTiet;
        this.mauThan = mauThan;
        this.mauDuoi1 = mauDuoi1;
        this.mauDuoi2 = mauDuoi2;
        this.mauNhan = mauNhan;
    }
}
