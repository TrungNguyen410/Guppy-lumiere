package com.guppyshop.promotion.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.common.exception.BusinessException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class MaGiamGiaTest {

    private static final LocalDateTime BAT_DAU = LocalDateTime.of(2026, 1, 1, 0, 0);
    private static final LocalDateTime HET_HAN = LocalDateTime.of(2026, 12, 31, 0, 0);
    private static final LocalDateTime TRONG_HAN = LocalDateTime.of(2026, 6, 1, 0, 0);

    private static MaGiamGia ma(int phanTram, Integer soLuot, boolean kichHoat) {
        return new MaGiamGia("M", phanTram, BAT_DAU, HET_HAN, soLuot, kichHoat);
    }

    @Test
    void tinhTienGiamTheoPhanTramLamTronDenDong() {
        assertThat(ma(10, null, true).tinhTienGiam(new BigDecimal("435000"), TRONG_HAN)).isEqualByComparingTo("43500");
        assertThat(ma(33, null, true).tinhTienGiam(new BigDecimal("1005"), TRONG_HAN)).isEqualByComparingTo("332");
        assertThat(ma(100, null, true).tinhTienGiam(new BigDecimal("1000"), TRONG_HAN)).isEqualByComparingTo("1000");
    }

    @Test
    void ngoaiThoiGianHoacDaTatBiTuChoi() {
        assertThatThrownBy(() -> ma(10, null, true).tinhTienGiam(BigDecimal.TEN, BAT_DAU.minusSeconds(1))).isInstanceOf(BusinessException.class).hasMessageContaining("chưa đến");
        assertThatThrownBy(() -> ma(10, null, true).tinhTienGiam(BigDecimal.TEN, HET_HAN)).isInstanceOf(BusinessException.class).hasMessageContaining("hết hạn");
        assertThatThrownBy(() -> ma(10, null, false).tinhTienGiam(BigDecimal.TEN, TRONG_HAN)).isInstanceOf(BusinessException.class).hasMessageContaining("không còn");
    }

    @Test
    void hetLuotBiTuChoiTraLuotThiDungLaiDuoc() {
        MaGiamGia ma = ma(10, 1, true);
        ma.tinhTienGiam(BigDecimal.TEN, TRONG_HAN);
        ma.dungMotLuot();

        assertThatThrownBy(() -> ma.tinhTienGiam(BigDecimal.TEN, TRONG_HAN)).isInstanceOf(BusinessException.class).hasMessageContaining("hết lượt");

        ma.traMotLuot();
        assertThat(ma.tinhTienGiam(new BigDecimal("100"), TRONG_HAN)).isEqualByComparingTo("10");
    }

    @Test
    void duLieuSaiBiTuChoi() {
        assertThatThrownBy(() -> ma(0, null, true)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> ma(101, null, true)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> ma(10, 0, true)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> new MaGiamGia("M", 10, HET_HAN, BAT_DAU, null, true)).isInstanceOf(BusinessException.class);
    }

    @Test
    void traLuotKhongXuongDuoi0() {
        MaGiamGia ma = ma(10, null, true);

        ma.traMotLuot();

        assertThat(ma.getSoLuotDaDung()).isZero();
    }
}
