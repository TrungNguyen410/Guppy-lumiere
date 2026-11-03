package com.guppyshop.review.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.common.exception.BusinessException;
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

    @Test
    void yeuCauChiXuLyMotLan() {
        YeuCauBaoHanh yeuCau = new YeuCauBaoHanh(1L, 2L, "Cá chết", null);
        assertThat(yeuCau.daXuLy()).isFalse();

        yeuCau.xuLy("Đã đổi cá", LocalDateTime.now());

        assertThat(yeuCau.daXuLy()).isTrue();
        assertThat(yeuCau.getKetQua()).isEqualTo("Đã đổi cá");
        assertThatThrownBy(() -> yeuCau.xuLy("Lần hai", LocalDateTime.now())).isInstanceOf(BusinessException.class);
    }
}
