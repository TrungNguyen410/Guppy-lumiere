package com.guppyshop.cart.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.DonViBanConverter;
import com.guppyshop.catalog.domain.model.LuaChonBan;
import com.guppyshop.common.domain.PhiGiaoHang;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class GioHangTest {

    private static final LuaChonBan CAP = new LuaChonBan(DonViBan.CAP, GioiTinh.KHONG_AP_DUNG);
    private static final LuaChonBan DUC = new LuaChonBan(DonViBan.CON_LE, GioiTinh.DUC);
    private static final LuaChonBan CAI = new LuaChonBan(DonViBan.CON_LE, GioiTinh.CAI);

    @Test
    void trungSanPhamVaLuaChonThiCongDon() {
        GioHang gio = GioHang.choSession("session-1");

        gio.them(1L, CAP, 1);
        gio.them(1L, CAP, 2);

        assertThat(gio.getChiTiet()).hasSize(1);
        assertThat(gio.getChiTiet().getFirst().getSoLuong()).isEqualTo(3);
    }

    @Test
    void khacLuaChonThiTachDong() {
        GioHang gio = GioHang.choSession("session-1");

        gio.them(1L, DUC, 1);
        gio.them(1L, CAI, 1);
        gio.them(2L, DUC, 1);

        assertThat(gio.getChiTiet()).hasSize(3);
    }

    @Test
    void phuKienCongDonDuDonViNull() {
        GioHang gio = GioHang.choKhachHang(5L);

        gio.them(9L, LuaChonBan.PHU_KIEN, 1);
        gio.them(9L, LuaChonBan.PHU_KIEN, 1);

        assertThat(gio.getChiTiet()).hasSize(1);
        assertThat(gio.getChiTiet().getFirst().getSoLuong()).isEqualTo(2);
    }

    @Test
    void gopCongDonDongTrungVaThemDongMoi() {
        GioHang taiKhoan = GioHang.choKhachHang(5L);
        taiKhoan.them(1L, CAP, 1);
        GioHang session = GioHang.choSession("session-1");
        session.them(1L, CAP, 2);
        session.them(2L, DUC, 4);

        taiKhoan.gopTu(session);

        assertThat(taiKhoan.getChiTiet()).hasSize(2);
        assertThat(taiKhoan.timDong(1L, CAP).orElseThrow().getSoLuong()).isEqualTo(3);
        assertThat(taiKhoan.timDong(2L, DUC).orElseThrow().getSoLuong()).isEqualTo(4);
    }

    @Test
    void soLuongKhongDuongBiTuChoi() {
        assertThatThrownBy(() -> GioHang.choSession("s").them(1L, CAP, 0)).isInstanceOf(BusinessException.class);
    }

    @Test
    void dongKhongThuocGioBaoKhongTimThay() {
        GioHang gio = GioHang.choSession("s");

        assertThatThrownBy(() -> gio.xoaDong(99L)).isInstanceOf(NotFoundException.class);
        assertThatThrownBy(() -> gio.doiSoLuong(99L, 1)).isInstanceOf(NotFoundException.class);
    }

    @Test
    void phiGiaoMienPhiTu500NghinVaKhiGioTrong() {
        assertThat(PhiGiaoHang.tinh(BigDecimal.ZERO)).isEqualByComparingTo("0");
        assertThat(PhiGiaoHang.tinh(new BigDecimal("499999"))).isEqualByComparingTo("50000");
        assertThat(PhiGiaoHang.tinh(new BigDecimal("500000"))).isEqualByComparingTo("0");
    }

    @Test
    void converterDoiPhuKienQuaLaiGiaTriKhongNull() {
        DonViBanConverter converter = new DonViBanConverter();

        assertThat(converter.convertToDatabaseColumn(null)).isEqualTo("KHONG_AP_DUNG");
        assertThat(converter.convertToEntityAttribute("KHONG_AP_DUNG")).isNull();
        assertThat(converter.convertToEntityAttribute("CAP")).isEqualTo(DonViBan.CAP);
    }
}
