package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.CatalogEnums.KieuDuoi;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiSanPham;
import com.guppyshop.catalog.domain.model.CatalogEnums.NhanSanPham;
import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Entity
@Table(name = "ca_guppy")
@PrimaryKeyJoinColumn(name = "san_pham_id")
@DiscriminatorValue("CA_GUPPY")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CaGuppy extends SanPham {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dong_ca_id", nullable = false)
    private DongCa dongCa;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "kieu_duoi", nullable = false)
    private KieuDuoi kieuDuoi;

    @Column(name = "mau_sac", nullable = false)
    private String mauSac;

    @Column(name = "thuan_chung", nullable = false)
    private boolean thuanChung;

    @Column(name = "kich_thuoc", nullable = false)
    private String kichThuoc;

    @Column(name = "tuoi_tuan", nullable = false)
    private int tuoiTuan;

    @Column(name = "so_con_moi_lo", nullable = false)
    private int soConMoiLo;

    @Embedded
    private ThongSoNuoc thongSoNuoc;

    @OneToMany(mappedBy = "caGuppy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GiaBanCa> bangGia = new ArrayList<>();

    /** BUILDER: sản phẩm cá có nhiều thuộc tính, dùng builder để lời gọi dễ đọc. */
    @Builder
    private CaGuppy(String ten, String slug, String moTa, Set<NhanSanPham> nhan, DongCa dongCa, KieuDuoi kieuDuoi,
                    String mauSac, boolean thuanChung, String kichThuoc, int tuoiTuan, int soConMoiLo,
                    ThongSoNuoc thongSoNuoc, List<MucGia> bangGia) {
        super(ten, slug, moTa, nhan);
        capNhatThongTinCa(dongCa, kieuDuoi, mauSac, thuanChung, kichThuoc, tuoiTuan, soConMoiLo, thongSoNuoc);
        capNhatBangGia(bangGia);
    }

    @Override
    public LoaiSanPham layLoai() {
        return LoaiSanPham.CA_GUPPY;
    }

    @Override
    public BigDecimal tinhGia(int soLuong) {
        GiaBanCa reNhat = bangGia.stream().min(Comparator.comparing(GiaBanCa::getGia))
                .orElseThrow(() -> new BusinessException("Sản phẩm chưa có bảng giá"));
        return ChienLuocBanFactory.theoDonVi(reNhat.getDonVi()).tinhGia(reNhat.getGia(), soLuong);
    }

    /** Giá của soLuong đơn vị đã chọn, tính qua Strategy của đơn vị đó. */
    public BigDecimal tinhGia(DonViBan donVi, GioiTinh gioiTinh, int soLuong) {
        return ChienLuocBanFactory.theoDonVi(donVi).tinhGia(layGia(donVi, gioiTinh).getGia(), soLuong);
    }

    public int tonKhaDung(DonViBan donVi, GioiTinh gioiTinh, TonKho ton) {
        return ChienLuocBanFactory.theoDonVi(donVi).tonKhaDung(ton, gioiTinh, soConMoiLo);
    }

    /** Số cá thật cần xuất kho cho soLuong đơn vị. */
    public TonKho soCaCan(LuaChonBan luaChon, int soLuong) {
        return ChienLuocBanFactory.theoDonVi(luaChon.donVi()).soCaCan(luaChon.gioiTinh(), soConMoiLo, soLuong);
    }

    @Override
    public LuaChonBan chuanHoaLuaChon(DonViBan donVi, GioiTinh gioiTinh) {
        if (donVi == null) {
            throw new BusinessException("Chưa chọn đơn vị bán");
        }
        // MucGia kiểm tra quy tắc giới tính theo đơn vị; giá 1 chỉ để tận dụng phần kiểm tra đó
        MucGia hopLe = new MucGia(donVi, gioiTinh, BigDecimal.ONE);
        LuaChonBan luaChon = new LuaChonBan(hopLe.donVi(), hopLe.gioiTinh());
        if (!coBan(luaChon)) {
            throw new BusinessException("Sản phẩm không bán theo đơn vị đã chọn");
        }
        return luaChon;
    }

    @Override
    public boolean coBan(LuaChonBan luaChon) {
        return bangGia.stream().anyMatch(g -> g.cungLoai(luaChon.donVi(), luaChon.gioiTinh()));
    }

    @Override
    public BigDecimal tinhGia(LuaChonBan luaChon, int soLuong) {
        return tinhGia(luaChon.donVi(), luaChon.gioiTinh(), soLuong);
    }

    @Override
    public int conLai(LuaChonBan luaChon, TonKho tonKhoCa) {
        return tonKhaDung(luaChon.donVi(), luaChon.gioiTinh(), tonKhoCa);
    }

    @Override
    public boolean conHang(TonKho tonKhoCa) {
        return bangGia.stream().anyMatch(g -> tonKhaDung(g.getDonVi(), g.getGioiTinh(), tonKhoCa) > 0);
    }

    public List<GiaBanCa> getBangGia() {
        return Collections.unmodifiableList(bangGia);
    }

    public final void capNhatThongTinCa(DongCa dongCa, KieuDuoi kieuDuoi, String mauSac, boolean thuanChung,
                                        String kichThuoc, int tuoiTuan, int soConMoiLo, ThongSoNuoc thongSoNuoc) {
        if (soConMoiLo <= 0) {
            throw new BusinessException("Số con mỗi lô phải lớn hơn 0");
        }
        this.dongCa = dongCa;
        this.kieuDuoi = kieuDuoi;
        this.mauSac = mauSac;
        this.thuanChung = thuanChung;
        this.kichThuoc = kichThuoc;
        this.tuoiTuan = tuoiTuan;
        this.soConMoiLo = soConMoiLo;
        this.thongSoNuoc = thongSoNuoc;
    }

    /**
     * Sửa tại chỗ thay vì xóa rồi thêm lại: Hibernate chạy INSERT trước DELETE,
     * nên xóa rồi thêm cùng đơn vị sẽ vi phạm khóa duy nhất của bảng giá.
     */
    public final void capNhatBangGia(List<MucGia> mucGia) {
        if (mucGia == null || mucGia.isEmpty()) {
            throw new BusinessException("Sản phẩm cá phải có ít nhất một mức giá");
        }
        Set<String> daGap = new HashSet<>();
        for (MucGia muc : mucGia) {
            if (!daGap.add(muc.donVi() + "/" + muc.gioiTinh())) {
                throw new BusinessException("Bảng giá bị trùng đơn vị bán");
            }
        }
        bangGia.removeIf(cu -> mucGia.stream().noneMatch(m -> cu.cungLoai(m.donVi(), m.gioiTinh())));
        for (MucGia muc : mucGia) {
            bangGia.stream().filter(g -> g.cungLoai(muc.donVi(), muc.gioiTinh())).findFirst()
                    .ifPresentOrElse(g -> g.doiGia(muc.gia()), () -> bangGia.add(new GiaBanCa(this, muc)));
        }
        datGiaThapNhat(tinhGia(1));
    }

    private GiaBanCa layGia(DonViBan donVi, GioiTinh gioiTinh) {
        GioiTinh gioiTinhTra = donVi == DonViBan.CON_LE ? gioiTinh : GioiTinh.KHONG_AP_DUNG;
        return bangGia.stream().filter(g -> g.cungLoai(donVi, gioiTinhTra)).findFirst()
                .orElseThrow(() -> new BusinessException("Sản phẩm không bán theo đơn vị đã chọn"));
    }
}
