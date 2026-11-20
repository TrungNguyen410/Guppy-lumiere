package com.guppyshop.review.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.common.exception.BusinessException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class ReviewTest {

    @ParameterizedTest
    @ValueSource(ints = {0, 6, -1})
    void soSaoNgoaiKhoangBiTuChoi(int soSao) {
        assertThatThrownBy(() -> new DanhGia(1L, 1L, 1L, soSao, null)).isInstanceOf(BusinessException.class);
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 5})
    void soSaoTrongKhoangHopLe(int soSao) {
        assertThat(new DanhGia(1L, 1L, 1L, soSao, null).getSoSao()).isEqualTo(soSao);
    }

    @Test
    void anTenChiConTenVaChuCaiCuaHo() {
        assertThat(DanhGia.anTen("Nguyễn Minh Anh")).isEqualTo("Anh N.");
        assertThat(DanhGia.anTen("  Anh  ")).isEqualTo("Anh");
        assertThat(DanhGia.anTen(null)).isEqualTo("Khách hàng");
    }

    private static final BigDecimal TIEN_HANG = new BigDecimal("150000");

    private static YeuCauBaoHanh yeuCau() {
        return new YeuCauBaoHanh(1L, 2L, "Cá chết", "https://v.vn/1", 2);
    }

    @Test
    void yeuCauChiXuLyMotLan() {
        YeuCauBaoHanh yeuCau = yeuCau();
        assertThat(yeuCau.daXuLy()).isFalse();

        yeuCau.xuLy(HinhThucBaoHanh.DOI_CA, null, TIEN_HANG, "  Giao kèm đơn sau ", LocalDateTime.now());

        assertThat(yeuCau.daXuLy()).isTrue();
        assertThat(yeuCau.getKetQua()).isEqualTo("Giao kèm đơn sau");
        assertThat(yeuCau.tomTat()).isEqualTo("Đổi 2 cá mới – Giao kèm đơn sau");
        assertThatThrownBy(() -> yeuCau.xuLy(HinhThucBaoHanh.DOI_CA, null, TIEN_HANG, null, LocalDateTime.now()))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void soCaChetPhaiTuMotCon() {
        assertThatThrownBy(() -> new YeuCauBaoHanh(1L, 2L, "Cá chết", "https://v.vn/1", 0)).isInstanceOf(BusinessException.class);
    }

    @Test
    void hoanTienPhaiCoSoTienVaKhongVuotTienHang() {
        assertThatThrownBy(() -> yeuCau().xuLy(HinhThucBaoHanh.HOAN_TIEN, null, TIEN_HANG, null, LocalDateTime.now()))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> yeuCau().xuLy(HinhThucBaoHanh.HOAN_TIEN, new BigDecimal("150001"), TIEN_HANG, null, LocalDateTime.now()))
                .isInstanceOf(BusinessException.class).hasMessageContaining("vượt tiền hàng");

        YeuCauBaoHanh yeuCau = yeuCau();
        yeuCau.xuLy(HinhThucBaoHanh.HOAN_TIEN, TIEN_HANG, TIEN_HANG, null, LocalDateTime.now());
        assertThat(yeuCau.getSoTienHoan()).isEqualByComparingTo("150000");
        assertThat(yeuCau.tomTat()).isEqualTo("Hoàn 150000đ tiền cá");
    }

    @Test
    void doiCaKhongCoTienHoanVaTuChoiPhaiCoLyDo() {
        assertThatThrownBy(() -> yeuCau().xuLy(HinhThucBaoHanh.DOI_CA, BigDecimal.TEN, TIEN_HANG, null, LocalDateTime.now()))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> yeuCau().xuLy(HinhThucBaoHanh.TU_CHOI, null, TIEN_HANG, "  ", LocalDateTime.now()))
                .hasMessageContaining("lý do");
        assertThatThrownBy(() -> yeuCau().xuLy(null, null, TIEN_HANG, null, LocalDateTime.now()))
                .isInstanceOf(BusinessException.class);
    }
}
