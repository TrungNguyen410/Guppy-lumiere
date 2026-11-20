package com.guppyshop.payment.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.common.exception.BusinessException;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class ThanhToanTest {

    private static final CongThanhToan CONG = new CongThanhToan() {
        @Override
        public ThongTinChuyenKhoan thongTinNhanTien() {
            return new ThongTinChuyenKhoan("NH", "1", "A");
        }

        @Override
        public String taoNoiDung(String maDon, String soDienThoai) {
            return maDon + "|" + soDienThoai;
        }
    };

    private static ThanhToan tao(PhuongThucThanhToan phuongThuc) {
        return ThanhToanFactory.tao(phuongThuc, 1L, BigDecimal.TEN);
    }

    @Test
    void factoryTaoDungLop() {
        assertThat(tao(PhuongThucThanhToan.COD)).isInstanceOf(ThanhToanCOD.class);
        assertThat(tao(PhuongThucThanhToan.CHUYEN_KHOAN)).isInstanceOf(ThanhToanChuyenKhoan.class);
    }

    @Test
    void chuyenKhoanTaoNoiDungDoiSoatConCodThiKhong() {
        ThanhToan chuyenKhoan = tao(PhuongThucThanhToan.CHUYEN_KHOAN);
        ThanhToan cod = tao(PhuongThucThanhToan.COD);

        chuyenKhoan.thucHien(CONG, "GP1", "090");
        cod.thucHien(CONG, "GP1", "090");

        assertThat(chuyenKhoan.getNoiDungCk()).isEqualTo("GP1|090");
        assertThat(cod.getNoiDungCk()).isNull();
    }

    @Test
    void codDuocTinhDaTraKhiDonHoanTat() {
        ThanhToan cod = tao(PhuongThucThanhToan.COD);

        cod.khiDonHoanTat();

        assertThat(cod.getTrangThai()).isEqualTo(TrangThaiThanhToan.DA_THANH_TOAN);
        assertThat(cod.getDaTraLuc()).isNotNull();
    }

    @Test
    void chuyenKhoanKhongTuDaTraKhiDonHoanTat() {
        ThanhToan chuyenKhoan = tao(PhuongThucThanhToan.CHUYEN_KHOAN);

        chuyenKhoan.khiDonHoanTat();

        assertThat(chuyenKhoan.getTrangThai()).isEqualTo(TrangThaiThanhToan.CHUA_THANH_TOAN);
    }

    @Test
    void xacNhanNhanTienChiChoChuyenKhoanVaChiMotLan() {
        ThanhToan chuyenKhoan = tao(PhuongThucThanhToan.CHUYEN_KHOAN);
        chuyenKhoan.xacNhanDaNhanTien();

        assertThat(chuyenKhoan.getTrangThai()).isEqualTo(TrangThaiThanhToan.DA_THANH_TOAN);
        assertThatThrownBy(chuyenKhoan::xacNhanDaNhanTien).isInstanceOf(BusinessException.class);
        assertThatThrownBy(tao(PhuongThucThanhToan.COD)::xacNhanDaNhanTien).isInstanceOf(BusinessException.class);
    }

    @Test
    void huyDonChiHoanTienKhiDaThu() {
        ThanhToan daThu = tao(PhuongThucThanhToan.CHUYEN_KHOAN);
        daThu.xacNhanDaNhanTien();
        ThanhToan chuaThu = tao(PhuongThucThanhToan.COD);

        daThu.khiDonBiHuy();
        chuaThu.khiDonBiHuy();

        assertThat(daThu.getTrangThai()).isEqualTo(TrangThaiThanhToan.DA_HOAN_TIEN);
        assertThat(chuaThu.getTrangThai()).isEqualTo(TrangThaiThanhToan.CHUA_THANH_TOAN);
    }

    @Test
    void hoanTienBaoHanhMotPhanRoiToanBo() {
        ThanhToan cod = ThanhToanFactory.tao(PhuongThucThanhToan.COD, 1L, new BigDecimal("300000"));
        assertThatThrownBy(() -> cod.hoanTien(BigDecimal.ONE)).isInstanceOf(BusinessException.class)
                .hasMessageContaining("chưa thu tiền");
        cod.khiDonHoanTat();

        cod.hoanTien(new BigDecimal("100000"));
        assertThat(cod.getTrangThai()).isEqualTo(TrangThaiThanhToan.DA_THANH_TOAN);
        assertThat(cod.getSoTienHoan()).isEqualByComparingTo("100000");

        assertThatThrownBy(() -> cod.hoanTien(new BigDecimal("200001"))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> cod.hoanTien(BigDecimal.ZERO)).isInstanceOf(BusinessException.class);

        cod.hoanTien(new BigDecimal("200000"));
        assertThat(cod.getTrangThai()).isEqualTo(TrangThaiThanhToan.DA_HOAN_TIEN);
    }

    @Test
    void huyDonDaThuThiHoanToanBo() {
        ThanhToan cod = ThanhToanFactory.tao(PhuongThucThanhToan.COD, 1L, new BigDecimal("300000"));
        cod.khiDonHoanTat();
        cod.khiDonBiHuy();
        assertThat(cod.getSoTienHoan()).isEqualByComparingTo("300000");
    }
}
