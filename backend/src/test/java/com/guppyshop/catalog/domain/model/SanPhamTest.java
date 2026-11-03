package com.guppyshop.catalog.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.CatalogEnums.KieuDuoi;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiPhuKien;
import com.guppyshop.common.exception.BusinessException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SanPhamTest {

    private static final BigDecimal T22 = new BigDecimal("22.0");
    private static final BigDecimal T28 = new BigDecimal("28.0");
    private static final BigDecimal PH68 = new BigDecimal("6.8");
    private static final BigDecimal PH78 = new BigDecimal("7.8");

    private static MucGia conLe(GioiTinh gioiTinh, long gia) {
        return new MucGia(DonViBan.CON_LE, gioiTinh, BigDecimal.valueOf(gia));
    }

    private static MucGia cap(long gia) {
        return new MucGia(DonViBan.CAP, null, BigDecimal.valueOf(gia));
    }

    private static CaGuppy taoCa(List<MucGia> bangGia) {
        return CaGuppy.builder().ten("Full Gold").slug("full-gold").nhan(Set.of()).kieuDuoi(KieuDuoi.DELTA)
                .mauSac("Vàng").thuanChung(true).kichThuoc("3 cm").tuoiTuan(14).soConMoiLo(10)
                .thongSoNuoc(new ThongSoNuoc(T22, T28, PH68, PH78, "8–12 dGH")).bangGia(bangGia).build();
    }

    @Test
    void giaThapNhatLayTuBangGiaVaCapNhatKhiDoiGia() {
        CaGuppy ca = taoCa(List.of(conLe(GioiTinh.DUC, 45000), conLe(GioiTinh.CAI, 35000), cap(75000)));
        assertThat(ca.getGiaThapNhat()).isEqualByComparingTo("35000");

        ca.capNhatBangGia(List.of(conLe(GioiTinh.DUC, 45000), cap(30000)));

        assertThat(ca.getGiaThapNhat()).isEqualByComparingTo("30000");
        assertThat(ca.getBangGia()).hasSize(2);
    }

    @Test
    void tinhGiaTheoDonViVaGioiTinhDaChon() {
        CaGuppy ca = taoCa(List.of(conLe(GioiTinh.DUC, 45000), conLe(GioiTinh.CAI, 35000), cap(75000)));

        assertThat(ca.tinhGia(DonViBan.CON_LE, GioiTinh.DUC, 2)).isEqualByComparingTo("90000");
        assertThat(ca.tinhGia(DonViBan.CON_LE, GioiTinh.CAI, 2)).isEqualByComparingTo("70000");
        assertThat(ca.tinhGia(DonViBan.CAP, null, 2)).isEqualByComparingTo("150000");
    }

    @Test
    void khongBanTheoDonViNayThiBaoLoi() {
        CaGuppy ca = taoCa(List.of(cap(75000)));

        assertThatThrownBy(() -> ca.tinhGia(DonViBan.BO_BA, null, 1)).isInstanceOf(BusinessException.class);
    }

    @Test
    void conHangChiTinhDonViDangCoGia() {
        CaGuppy chiBanCap = taoCa(List.of(cap(75000)));

        assertThat(chiBanCap.conHang(new TonKho(5, 0, 100))).isFalse();
        assertThat(chiBanCap.conHang(new TonKho(5, 1, 0))).isTrue();
    }

    @Test
    void bangGiaRongHoacTrungBiTuChoi() {
        assertThatThrownBy(() -> taoCa(List.of())).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> taoCa(List.of(cap(1), cap(2)))).isInstanceOf(BusinessException.class);
    }

    @Test
    void conLePhaiCoGioiTinhConDonViKhacThiKhong() {
        assertThatThrownBy(() -> conLe(null, 1000)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> new MucGia(DonViBan.CAP, GioiTinh.DUC, BigDecimal.TEN)).isInstanceOf(BusinessException.class);
        assertThat(cap(1000).gioiTinh()).isEqualTo(GioiTinh.KHONG_AP_DUNG);
    }

    @Test
    void thongSoNuocNgoaiKhoangBiTuChoi() {
        assertThatThrownBy(() -> new ThongSoNuoc(new BigDecimal("21.9"), T28, PH68, PH78, "x")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> new ThongSoNuoc(T22, new BigDecimal("28.1"), PH68, PH78, "x")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> new ThongSoNuoc(T22, T28, new BigDecimal("6.7"), PH78, "x")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> new ThongSoNuoc(T22, T28, PH68, new BigDecimal("7.9"), "x")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> new ThongSoNuoc(T28, T22, PH68, PH78, "x")).isInstanceOf(BusinessException.class);
    }

    @Test
    void phuKienTinhGiaVaTonKhoRieng() {
        PhuKien phuKien = new PhuKien("Cám", "cam", null, Set.of(), LoaiPhuKien.THUC_AN, new BigDecimal("45000"), 0);

        assertThat(phuKien.tinhGia(2)).isEqualByComparingTo("90000");
        assertThat(phuKien.getGiaThapNhat()).isEqualByComparingTo("45000");
        assertThat(phuKien.conHang(new TonKho(9, 9, 9))).isFalse();
    }

    @Test
    void slugBoDauTiengViet() {
        assertThat(TaoSlug.tu("Rồng Đỏ Đuôi Voan")).isEqualTo("rong-do-duoi-voan");
        assertThat(TaoSlug.tu("  Bể kính 30cm!! ")).isEqualTo("be-kinh-30cm");
    }
}
