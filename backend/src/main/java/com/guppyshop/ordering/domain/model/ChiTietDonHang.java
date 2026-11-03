package com.guppyshop.ordering.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.DonViBanConverter;
import com.guppyshop.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** Dòng đơn (composition): lưu tên và đơn giá lúc mua nên sửa sản phẩm không làm đổi đơn cũ. */
@Getter
@Entity
@Table(name = "chi_tiet_don_hang")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChiTietDonHang extends BaseEntity {

    /** Dữ liệu để tạo một dòng đơn. */
    public record DongMoi(Long sanPhamId, String tenSanPham, DonViBan donVi, GioiTinh gioiTinh, int soLuong, BigDecimal donGia) {
    }

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "don_hang_id", nullable = false, updatable = false)
    private DonHang donHang;

    @Column(name = "san_pham_id", nullable = false, updatable = false)
    private Long sanPhamId;

    @Column(name = "ten_san_pham", nullable = false, updatable = false)
    private String tenSanPham;

    @Convert(converter = DonViBanConverter.class)
    @Column(name = "don_vi", nullable = false, updatable = false)
    private DonViBan donVi;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "gioi_tinh", nullable = false, updatable = false)
    private GioiTinh gioiTinh;

    @Column(name = "so_luong", nullable = false, updatable = false)
    private int soLuong;

    @Column(name = "don_gia", nullable = false, updatable = false)
    private BigDecimal donGia;

    ChiTietDonHang(DonHang donHang, DongMoi dong) {
        this.donHang = donHang;
        this.sanPhamId = dong.sanPhamId();
        this.tenSanPham = dong.tenSanPham();
        this.donVi = dong.donVi();
        this.gioiTinh = dong.gioiTinh();
        this.soLuong = dong.soLuong();
        this.donGia = dong.donGia();
    }

    public BigDecimal thanhTien() {
        return donGia.multiply(BigDecimal.valueOf(soLuong));
    }
}
