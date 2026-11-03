package com.guppyshop.common.response;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ApiResponseTest {

    @Test
    void okMangDuLieuVaBaoThanhCong() {
        ApiResponse<String> phanHoi = ApiResponse.ok("du lieu");

        assertThat(phanHoi.thanhCong()).isTrue();
        assertThat(phanHoi.duLieu()).isEqualTo("du lieu");
    }

    @Test
    void loiBaoThatBaiVaKhongCoDuLieu() {
        ApiResponse<String> phanHoi = ApiResponse.loi("Sai dữ liệu");

        assertThat(phanHoi.thanhCong()).isFalse();
        assertThat(phanHoi.thongBao()).isEqualTo("Sai dữ liệu");
        assertThat(phanHoi.duLieu()).isNull();
    }
}
