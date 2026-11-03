package com.guppyshop.ordering.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.ordering.domain.event.DonHangDaHoanTatEvent;
import com.guppyshop.ordering.domain.event.DonHangDaHuyEvent;
import com.guppyshop.ordering.domain.event.DonHangDaTaoEvent;
import com.guppyshop.ordering.domain.model.ChiTietDonHang.DongMoi;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class DonHangTest {

    private static final ThongTinNguoiNhan NGUOI_NHAN = new ThongTinNguoiNhan("A", "0901234567", "1 Lê Lợi", "Hà Nội", null);

    private static DongMoi dong(long gia, int soLuong) {
        return new DongMoi(1L, "Cá", DonViBan.CAP, GioiTinh.KHONG_AP_DUNG, soLuong, BigDecimal.valueOf(gia));
    }

    private static DonHang don(Long khachHangId, BigDecimal giam, DongMoi... cacDong) {
        return DonHang.builder().maDon("GP1").khachHangId(khachHangId).nguoiNhan(NGUOI_NHAN)
                .cacDong(List.of(cacDong)).giamGia(giam).build();
    }

    private static DonHang denTrangThai(TrangThaiDon... duongDi) {
        DonHang don = don(null, null, dong(100000, 1));
        for (TrangThaiDon buoc : duongDi) {
            don.chuyenTrangThai(buoc, null);
        }
        don.laySuKienVaXoa();
        return don;
    }

    @Test
    void tongTienCongPhiGiaoKhiDuoi500Nghin() {
        DonHang don = don(null, null, dong(75000, 1), dong(65000, 2));

        assertThat(don.getTamTinh()).isEqualByComparingTo("205000");
        assertThat(don.getPhiGiao()).isEqualByComparingTo("50000");
        assertThat(don.getTongTien()).isEqualByComparingTo("255000");
    }

    @Test
    void mienPhiGiaoTu500NghinVaGiamGiaTruVaoTong() {
        DonHang don = don(null, new BigDecimal("56000"), dong(280000, 2));

        assertThat(don.getPhiGiao()).isEqualByComparingTo("0");
        assertThat(don.getTongTien()).isEqualByComparingTo("504000");
    }

    @Test
    void phiGiaoTinhTrenTamTinhTruocGiamGia() {
        DonHang don = don(null, new BigDecimal("100000"), dong(500000, 1));

        assertThat(don.getPhiGiao()).isEqualByComparingTo("0");
        assertThat(don.getTongTien()).isEqualByComparingTo("400000");
    }

    @Test
    void donMoiChoXacNhanCoLichSuDauTien() {
        DonHang don = don(5L, null, dong(1000, 1));

        assertThat(don.getTrangThai()).isEqualTo(TrangThaiDon.CHO_XAC_NHAN);
        assertThat(don.getLichSu()).hasSize(1);
        assertThat(don.laKhachVangLai()).isFalse();
    }

    @Test
    void donKhongCoSanPhamBiTuChoi() {
        assertThatThrownBy(() -> don(null, null)).isInstanceOf(BusinessException.class);
    }

    @Test
    void khongChoDanhSachBenNgoaiSuaDongDon() {
        DonHang don = don(null, null, dong(1000, 1));

        assertThatThrownBy(() -> don.getChiTiet().clear()).isInstanceOf(UnsupportedOperationException.class);
        assertThatThrownBy(() -> don.getLichSu().clear()).isInstanceOf(UnsupportedOperationException.class);
    }

    @Test
    void ghiNhanDaTaoPhatSuKienMotLan() {
        DonHang don = don(null, null, dong(1000, 2));

        don.ghiNhanDaTao();

        assertThat(don.laySuKienVaXoa()).singleElement().isInstanceOfSatisfying(DonHangDaTaoEvent.class,
                e -> assertThat(e.chiTiet().getFirst().soLuong()).isEqualTo(2));
        assertThat(don.laySuKienVaXoa()).isEmpty();
    }

    @Test
    void chuyenSaiTrangThaiKhongDoiGiKhongPhatSuKien() {
        DonHang don = don(null, null, dong(1000, 1));

        assertThatThrownBy(() -> don.chuyenTrangThai(TrangThaiDon.HOAN_TAT, null)).isInstanceOf(BusinessException.class);

        assertThat(don.getTrangThai()).isEqualTo(TrangThaiDon.CHO_XAC_NHAN);
        assertThat(don.getLichSu()).hasSize(1);
        assertThat(don.laySuKienVaXoa()).isEmpty();
    }

    @Test
    void huyPhatSuKienCoMaGiamGia() {
        DonHang don = DonHang.builder().maDon("GP1").nguoiNhan(NGUOI_NHAN).cacDong(List.of(dong(1000, 1))).maGiamGiaId(7L).build();

        don.chuyenTrangThai(TrangThaiDon.DA_HUY, "Khách đổi ý");

        assertThat(don.laySuKienVaXoa()).singleElement().isInstanceOfSatisfying(DonHangDaHuyEvent.class,
                e -> assertThat(e.maGiamGiaId()).isEqualTo(7L));
        assertThat(don.getLichSu().getLast().getGhiChu()).isEqualTo("Khách đổi ý");
    }

    @Test
    void nhanVienHuyDuocKhiDangGiaoVaPhatSuKienTraTon() {
        DonHang don = denTrangThai(TrangThaiDon.DA_XAC_NHAN, TrangThaiDon.DANG_DONG_GOI, TrangThaiDon.DANG_GIAO);

        don.chuyenTrangThai(TrangThaiDon.DA_HUY, "Khách không nhận");

        assertThat(don.getTrangThai()).isEqualTo(TrangThaiDon.DA_HUY);
        assertThat(don.laySuKienVaXoa()).singleElement().isInstanceOf(DonHangDaHuyEvent.class);
    }

    @Test
    void dangDongGoiKhongHuyDuocVaKhongPhatSuKien() {
        DonHang don = denTrangThai(TrangThaiDon.DA_XAC_NHAN, TrangThaiDon.DANG_DONG_GOI);

        assertThatThrownBy(() -> don.chuyenTrangThai(TrangThaiDon.DA_HUY, "Đổi ý")).isInstanceOf(BusinessException.class);

        assertThat(don.getTrangThai()).isEqualTo(TrangThaiDon.DANG_DONG_GOI);
        assertThat(don.laySuKienVaXoa()).isEmpty();
    }

    @Test
    void khachChiHuyDuocKhiChoXacNhan() {
        DonHang choXacNhan = denTrangThai();
        choXacNhan.khachHuy();
        assertThat(choXacNhan.getTrangThai()).isEqualTo(TrangThaiDon.DA_HUY);

        DonHang daXacNhan = denTrangThai(TrangThaiDon.DA_XAC_NHAN);
        assertThatThrownBy(daXacNhan::khachHuy).isInstanceOf(BusinessException.class);
        assertThat(daXacNhan.getTrangThai()).isEqualTo(TrangThaiDon.DA_XAC_NHAN);
    }

    @Test
    void baoHanhTrongDung24GioKeTuHoanTat() {
        DonHang don = denTrangThai(TrangThaiDon.DA_XAC_NHAN, TrangThaiDon.DANG_DONG_GOI, TrangThaiDon.DANG_GIAO, TrangThaiDon.HOAN_TAT);
        var hoanTat = don.getHoanTatLuc();

        assertThat(don.conHanBaoHanh(hoanTat.plusHours(24))).isTrue();
        assertThat(don.conHanBaoHanh(hoanTat.plusHours(24).plusSeconds(1))).isFalse();
        assertThatThrownBy(() -> don.vaoBaoHanh(hoanTat.plusHours(25))).isInstanceOf(BusinessException.class);
        assertThat(don.getTrangThai()).isEqualTo(TrangThaiDon.HOAN_TAT);

        don.vaoBaoHanh(hoanTat.plusHours(1));
        assertThat(don.getTrangThai()).isEqualTo(TrangThaiDon.BAO_HANH);
    }

    @Test
    void donChuaHoanTatKhongDuocBaoHanh() {
        DonHang don = denTrangThai(TrangThaiDon.DA_XAC_NHAN);

        assertThat(don.conHanBaoHanh(java.time.LocalDateTime.now())).isFalse();
        assertThatThrownBy(() -> don.vaoBaoHanh(java.time.LocalDateTime.now())).isInstanceOf(BusinessException.class);
    }

    @Test
    void hoanTatLanDauPhatSuKienSauBaoHanhThiKhong() {
        DonHang don = denTrangThai(TrangThaiDon.DA_XAC_NHAN, TrangThaiDon.DANG_DONG_GOI, TrangThaiDon.DANG_GIAO);

        don.chuyenTrangThai(TrangThaiDon.HOAN_TAT, null);
        var lanDau = don.getHoanTatLuc();
        assertThat(lanDau).isNotNull();
        assertThat(don.laySuKienVaXoa()).singleElement().isInstanceOf(DonHangDaHoanTatEvent.class);

        don.chuyenTrangThai(TrangThaiDon.BAO_HANH, null);
        don.chuyenTrangThai(TrangThaiDon.HOAN_TAT, null);

        assertThat(don.laySuKienVaXoa()).isEmpty();
        assertThat(don.getHoanTatLuc()).isEqualTo(lanDau);
    }
}
