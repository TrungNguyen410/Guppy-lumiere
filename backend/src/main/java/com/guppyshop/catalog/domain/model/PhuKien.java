package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiPhuKien;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiSanPham;
import com.guppyshop.catalog.domain.model.CatalogEnums.NhanSanPham;
import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.Set;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** Thức ăn, bể, lọc, thuốc: một giá duy nhất, tồn kho ngay trên sản phẩm. */
@Getter
@Entity
@Table(name = "phu_kien")
@PrimaryKeyJoinColumn(name = "san_pham_id")
@DiscriminatorValue("PHU_KIEN")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PhuKien extends SanPham {

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "loai_phu_kien", nullable = false)
    private LoaiPhuKien loaiPhuKien;

    @Column(name = "gia", nullable = false)
    private BigDecimal gia;

    @Column(name = "ton_kho", nullable = false)
    private int tonKho;

    public PhuKien(String ten, String slug, String moTa, Set<NhanSanPham> nhan,
                   LoaiPhuKien loaiPhuKien, BigDecimal gia, int tonKho) {
        super(ten, slug, moTa, nhan);
        capNhatThongTinPhuKien(loaiPhuKien, gia, tonKho);
    }

    @Override
    public LoaiSanPham layLoai() {
        return LoaiSanPham.PHU_KIEN;
    }

    @Override
    public BigDecimal tinhGia(int soLuong) {
        if (soLuong <= 0) {
            throw new BusinessException("Số lượng phải lớn hơn 0");
        }
        return gia.multiply(BigDecimal.valueOf(soLuong));
    }

    @Override
    public boolean conHang(TonKho tonKhoCa) {
        return tonKho > 0;
    }

    @Override
    public LuaChonBan chuanHoaLuaChon(DonViBan donVi, GioiTinh gioiTinh) {
        if (donVi != null) {
            throw new BusinessException("Phụ kiện không có đơn vị bán");
        }
        return LuaChonBan.PHU_KIEN;
    }

    @Override
    public boolean coBan(LuaChonBan luaChon) {
        return luaChon.donVi() == null;
    }

    @Override
    public BigDecimal tinhGia(LuaChonBan luaChon, int soLuong) {
        return tinhGia(soLuong);
    }

    @Override
    public int conLai(LuaChonBan luaChon, TonKho tonKhoCa) {
        return tonKho;
    }

    public final void capNhatThongTinPhuKien(LoaiPhuKien loaiPhuKien, BigDecimal gia, int tonKho) {
        if (gia.signum() <= 0) {
            throw new BusinessException("Giá phải lớn hơn 0");
        }
        if (tonKho < 0) {
            throw new BusinessException("Tồn kho không được âm");
        }
        this.loaiPhuKien = loaiPhuKien;
        this.gia = gia;
        this.tonKho = tonKho;
        datGiaThapNhat(gia);
    }
}
