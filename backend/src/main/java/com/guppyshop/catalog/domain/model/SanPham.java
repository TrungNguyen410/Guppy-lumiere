package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiSanPham;
import com.guppyshop.catalog.domain.model.CatalogEnums.NhanSanPham;
import com.guppyshop.common.domain.BaseEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.Set;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * KẾ THỪA + ABSTRACT, JPA JOINED: phần chung ở san_pham, phần riêng ở ca_guppy và phu_kien.
 * Mỗi loại tự định nghĩa tinhGia và conHang (đa hình).
 */
@Getter
@Entity
@Table(name = "san_pham")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "loai_san_pham", length = 31)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class SanPham extends BaseEntity {

    @Column(name = "ten", nullable = false)
    private String ten;

    @Column(name = "slug", nullable = false, updatable = false)
    private String slug;

    @Column(name = "mo_ta", columnDefinition = "text")
    private String moTa;

    @Column(name = "diem_danh_gia", nullable = false)
    private BigDecimal diemDanhGia = BigDecimal.ZERO;

    @Column(name = "so_danh_gia", nullable = false)
    private int soDanhGia;

    @Column(name = "da_ban", nullable = false)
    private int daBan;

    /** Lưu sẵn để lọc và sắp xếp theo giá bằng SQL mà không cần join bảng giá. */
    @Column(name = "gia_thap_nhat", nullable = false)
    private BigDecimal giaThapNhat = BigDecimal.ZERO;

    @Column(name = "dang_ban", nullable = false)
    private boolean dangBan = true;

    @ElementCollection
    @CollectionTable(name = "san_pham_nhan", joinColumns = @JoinColumn(name = "san_pham_id"))
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "nhan", nullable = false)
    private Set<NhanSanPham> nhan = EnumSet.noneOf(NhanSanPham.class);

    protected SanPham(String ten, String slug, String moTa, Set<NhanSanPham> nhan) {
        this.slug = slug;
        capNhatThongTinChung(ten, moTa, nhan);
    }

    /** Giá của soLuong đơn vị rẻ nhất, cũng là giá "Chỉ từ" trên thẻ sản phẩm khi soLuong = 1. */
    public abstract BigDecimal tinhGia(int soLuong);

    /** Có thể mua được không với số cá hiện có; phụ kiện không dùng tham số này. */
    public abstract boolean conHang(TonKho tonKhoCa);

    public abstract LoaiSanPham layLoai();

    /** Kiểm tra lựa chọn của người mua có hợp lệ với sản phẩm này không và chuẩn hóa lại. */
    public abstract LuaChonBan chuanHoaLuaChon(DonViBan donVi, GioiTinh gioiTinh);

    /** Lựa chọn đã lưu còn được bán không, ví dụ admin có thể đã bỏ đơn vị đó khỏi bảng giá. */
    public abstract boolean coBan(LuaChonBan luaChon);

    public abstract BigDecimal tinhGia(LuaChonBan luaChon, int soLuong);

    /** Số đơn vị của lựa chọn này còn mua được. */
    public abstract int conLai(LuaChonBan luaChon, TonKho tonKhoCa);

    public final void capNhatThongTinChung(String ten, String moTa, Set<NhanSanPham> nhan) {
        this.ten = ten;
        this.moTa = moTa;
        this.nhan.clear();
        this.nhan.addAll(nhan);
    }

    public void ngungBan() {
        this.dangBan = false;
    }

    public void moBanLai() {
        this.dangBan = true;
    }

    protected final void datGiaThapNhat(BigDecimal gia) {
        this.giaThapNhat = gia;
    }
}
