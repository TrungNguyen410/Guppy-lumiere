package com.guppyshop.ordering.domain.state;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

class TrangThaiStateTest {

    /** Ma trận chuyển trạng thái đúng theo đề bài, kiểm tra toàn bộ 7 × 7 cặp. */
    private static final Map<TrangThaiDon, Set<TrangThaiDon>> DUOC_PHEP = Map.of(
            TrangThaiDon.CHO_XAC_NHAN, EnumSet.of(TrangThaiDon.DA_XAC_NHAN, TrangThaiDon.DA_HUY),
            TrangThaiDon.DA_XAC_NHAN, EnumSet.of(TrangThaiDon.DANG_DONG_GOI, TrangThaiDon.DA_HUY),
            TrangThaiDon.DANG_DONG_GOI, EnumSet.of(TrangThaiDon.DANG_GIAO),
            TrangThaiDon.DANG_GIAO, EnumSet.of(TrangThaiDon.HOAN_TAT, TrangThaiDon.DA_HUY),
            TrangThaiDon.HOAN_TAT, EnumSet.of(TrangThaiDon.BAO_HANH),
            TrangThaiDon.BAO_HANH, EnumSet.of(TrangThaiDon.HOAN_TAT),
            TrangThaiDon.DA_HUY, EnumSet.noneOf(TrangThaiDon.class));

    @ParameterizedTest
    @EnumSource(TrangThaiDon.class)
    void maTranChuyenTrangThaiDungDeBai(TrangThaiDon nguon) {
        TrangThaiState state = TrangThaiState.cua(nguon);
        assertThat(state.ma()).isEqualTo(nguon);
        for (TrangThaiDon dich : TrangThaiDon.values()) {
            if (DUOC_PHEP.get(nguon).contains(dich)) {
                assertThat(state.chuyenSang(dich)).isEqualTo(dich);
            } else {
                assertThatThrownBy(() -> state.chuyenSang(dich))
                        .as("%s sang %s phải bị từ chối", nguon, dich)
                        .isInstanceOf(BusinessException.class);
            }
        }
    }

    @Test
    void huyDuocDungBaTrangThaiCuaDeBai() {
        Set<TrangThaiDon> huyDuoc = EnumSet.noneOf(TrangThaiDon.class);
        for (TrangThaiDon nguon : TrangThaiDon.values()) {
            if (TrangThaiState.cua(nguon).coTheChuyenSang().contains(TrangThaiDon.DA_HUY)) {
                huyDuoc.add(nguon);
            }
        }
        assertThat(huyDuoc).containsExactlyInAnyOrder(TrangThaiDon.CHO_XAC_NHAN, TrangThaiDon.DA_XAC_NHAN, TrangThaiDon.DANG_GIAO);
    }

    @ParameterizedTest
    @EnumSource(TrangThaiDon.class)
    void khachChiHuyDuocKhiChoXacNhan(TrangThaiDon trangThai) {
        assertThat(TrangThaiState.cua(trangThai).khachDuocHuy()).isEqualTo(trangThai == TrangThaiDon.CHO_XAC_NHAN);
    }

    @Test
    void duongChinhDiHetVongDoiDonHang() {
        TrangThaiDon hienTai = TrangThaiDon.CHO_XAC_NHAN;
        for (TrangThaiDon buoc : List.of(TrangThaiDon.DA_XAC_NHAN, TrangThaiDon.DANG_DONG_GOI, TrangThaiDon.DANG_GIAO,
                TrangThaiDon.HOAN_TAT, TrangThaiDon.BAO_HANH, TrangThaiDon.HOAN_TAT)) {
            hienTai = TrangThaiState.cua(hienTai).chuyenSang(buoc);
        }
        assertThat(hienTai).isEqualTo(TrangThaiDon.HOAN_TAT);
    }

    @Test
    void thongBaoLoiNeuRoTrangThaiNguonVaDich() {
        assertThatThrownBy(() -> TrangThaiState.cua(TrangThaiDon.DANG_DONG_GOI).chuyenSang(TrangThaiDon.DA_HUY))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("DANG_DONG_GOI")
                .hasMessageContaining("DA_HUY");
    }
}
