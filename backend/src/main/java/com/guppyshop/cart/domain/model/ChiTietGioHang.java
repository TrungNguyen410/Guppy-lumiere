package com.guppyshop.cart.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.DonViBanConverter;
import com.guppyshop.catalog.domain.model.LuaChonBan;
import com.guppyshop.common.domain.BaseEntity;
import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** Một dòng trong giỏ, chỉ tồn tại bên trong GioHang (composition). */
@Getter
@Entity
@Table(name = "chi_tiet_gio_hang")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChiTietGioHang extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gio_hang_id", nullable = false)
    private GioHang gioHang;

    @Column(name = "san_pham_id", nullable = false, updatable = false)
    private Long sanPhamId;

    @Convert(converter = DonViBanConverter.class)
    @Column(name = "don_vi", nullable = false, updatable = false)
    private DonViBan donVi;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "gioi_tinh", nullable = false, updatable = false)
    private GioiTinh gioiTinh;

    @Column(name = "so_luong", nullable = false)
    private int soLuong;

    ChiTietGioHang(GioHang gioHang, Long sanPhamId, LuaChonBan luaChon, int soLuong) {
        this.gioHang = gioHang;
        this.sanPhamId = sanPhamId;
        this.donVi = luaChon.donVi();
        this.gioiTinh = luaChon.gioiTinh();
        doiSoLuong(soLuong);
    }

    public LuaChonBan layLuaChon() {
        return new LuaChonBan(donVi, gioiTinh);
    }

    boolean cungSanPham(Long sanPhamId, LuaChonBan luaChon) {
        return this.sanPhamId.equals(sanPhamId) && layLuaChon().equals(luaChon);
    }

    final void doiSoLuong(int soLuong) {
        if (soLuong <= 0) {
            throw new BusinessException("Số lượng phải lớn hơn 0");
        }
        this.soLuong = soLuong;
    }
}
