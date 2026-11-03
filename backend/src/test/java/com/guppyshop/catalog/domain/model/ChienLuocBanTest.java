package com.guppyshop.catalog.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.common.exception.BusinessException;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.EnumSource;

class ChienLuocBanTest {

    private static final TonKho TON = new TonKho(10, 7, 125);

    @ParameterizedTest
    @EnumSource(DonViBan.class)
    void factoryTraVeChienLuocDungDonVi(DonViBan donVi) {
        assertThat(ChienLuocBanFactory.theoDonVi(donVi).donVi()).isEqualTo(donVi);
    }

    @ParameterizedTest
    @CsvSource({
            "CON_LE, DUC, 10",
            "CON_LE, CAI, 7",
            "CAP, KHONG_AP_DUNG, 7",
            "BO_BA, KHONG_AP_DUNG, 3",
            "LO_CA_BOT, KHONG_AP_DUNG, 12"
    })
    void tonKhaDungTinhTheoTungDonVi(DonViBan donVi, GioiTinh gioiTinh, int mongDoi) {
        assertThat(ChienLuocBanFactory.theoDonVi(donVi).tonKhaDung(TON, gioiTinh, 10)).isEqualTo(mongDoi);
    }

    @Test
    void boBaBiGioiHanBoiSoDucKhiNhieuCai() {
        assertThat(new ChienLuocBan.BanBoBa().tonKhaDung(new TonKho(1, 20, 0), GioiTinh.KHONG_AP_DUNG, 10)).isEqualTo(1);
    }

    @Test
    void tinhGiaNhanTheoSoLuong() {
        assertThat(new ChienLuocBan.BanCap().tinhGia(new BigDecimal("75000"), 3)).isEqualByComparingTo("225000");
    }

    @ParameterizedTest
    @CsvSource({"0", "-1"})
    void soLuongKhongDuongBiTuChoi(int soLuong) {
        assertThatThrownBy(() -> new ChienLuocBan.BanConLe().tinhGia(BigDecimal.TEN, soLuong))
                .isInstanceOf(BusinessException.class);
    }

    @ParameterizedTest
    @EnumSource(DonViBan.class)
    void moiDonViTinhGiaTheoDonGiaNhanSoLuong(DonViBan donVi) {
        assertThat(ChienLuocBanFactory.theoDonVi(donVi).tinhGia(new BigDecimal("35000"), 4)).isEqualByComparingTo("140000");
    }

    @ParameterizedTest
    @CsvSource({
            "CON_LE, DUC, 3, 3, 0, 0",
            "CON_LE, CAI, 3, 0, 3, 0",
            "CAP, KHONG_AP_DUNG, 2, 2, 2, 0",
            "BO_BA, KHONG_AP_DUNG, 2, 2, 4, 0",
            "LO_CA_BOT, KHONG_AP_DUNG, 2, 0, 0, 20"
    })
    void soCaCanXuatKhoTheoTungDonVi(DonViBan donVi, GioiTinh gioiTinh, int soLuong, int duc, int cai, int bot) {
        assertThat(ChienLuocBanFactory.theoDonVi(donVi).soCaCan(gioiTinh, 10, soLuong)).isEqualTo(new TonKho(duc, cai, bot));
    }

    @ParameterizedTest
    @CsvSource({
            "CON_LE, DUC",
            "CON_LE, CAI",
            "CAP, KHONG_AP_DUNG",
            "BO_BA, KHONG_AP_DUNG",
            "LO_CA_BOT, KHONG_AP_DUNG"
    })
    void banHetTonKhaDungKhongBaoGioVuotSoCaThat(DonViBan donVi, GioiTinh gioiTinh) {
        ChienLuocBan chienLuoc = ChienLuocBanFactory.theoDonVi(donVi);

        int tonKhaDung = chienLuoc.tonKhaDung(TON, gioiTinh, 10);
        TonKho canXuat = chienLuoc.soCaCan(gioiTinh, 10, tonKhaDung);

        assertThat(tonKhaDung).isPositive();
        assertThat(canXuat.duc()).isLessThanOrEqualTo(TON.duc());
        assertThat(canXuat.cai()).isLessThanOrEqualTo(TON.cai());
        assertThat(canXuat.bot()).isLessThanOrEqualTo(TON.bot());
    }

    @Test
    void thieuMotGioiTinhThiCapVaBoBaHetHang() {
        TonKho chiCoDuc = new TonKho(9, 0, 0);

        assertThat(new ChienLuocBan.BanCap().tonKhaDung(chiCoDuc, GioiTinh.KHONG_AP_DUNG, 10)).isZero();
        assertThat(new ChienLuocBan.BanBoBa().tonKhaDung(chiCoDuc, GioiTinh.KHONG_AP_DUNG, 10)).isZero();
    }

    @Test
    void chuaDuMotLoCaBotThiKhongBanDuoc() {
        assertThat(new ChienLuocBan.BanLoCaBot().tonKhaDung(new TonKho(0, 0, 9), GioiTinh.KHONG_AP_DUNG, 10)).isZero();
    }
}
