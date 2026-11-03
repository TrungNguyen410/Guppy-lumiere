package com.guppyshop.report.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.guppyshop.report.application.dto.ThongKeDto;
import com.guppyshop.report.domain.model.SoLieuThongKe.DemTrangThai;
import com.guppyshop.report.domain.model.SoLieuThongKe.DoanhThuNgay;
import com.guppyshop.report.domain.model.SoLieuThongKe.TonKhoTong;
import com.guppyshop.report.domain.repository.ThongKeRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ThongKeUseCaseTest {

    private static final ZoneId VN = ZoneId.of("Asia/Ho_Chi_Minh");
    /** Chủ nhật 15/11/2026. */
    private static final LocalDate HOM_NAY = LocalDate.of(2026, 11, 15);

    private ThongKeRepository repository;
    private ThongKeUseCase useCase;

    @BeforeEach
    void setUp() {
        repository = mock(ThongKeRepository.class);
        Instant luc = HOM_NAY.atTime(12, 0).atZone(VN).toInstant();
        useCase = new ThongKeUseCase(repository, Clock.fixed(luc, VN));
        when(repository.tonKho()).thenReturn(new TonKhoTong(0, 0));
        when(repository.dongBanChay(anyInt())).thenReturn(List.of());
        when(repository.donGanDay(anyInt())).thenReturn(List.of());
    }

    private void doanhThu(DoanhThuNgay... cacNgay) {
        when(repository.doanhThuTheoNgay(HOM_NAY.minusDays(6), HOM_NAY)).thenReturn(List.of(cacNgay));
    }

    @Test
    void bieuDoDuBayNgayNgayTrongLaKhongNhanThuDung() {
        doanhThu(new DoanhThuNgay(HOM_NAY.minusDays(6), new BigDecimal("1000")), new DoanhThuNgay(HOM_NAY, new BigDecimal("2000")));

        ThongKeDto ketQua = useCase.layTongQuan();

        assertThat(ketQua.doanhThu7Ngay()).hasSize(7);
        assertThat(ketQua.doanhThu7Ngay()).extracting(ThongKeDto.DiemDoanhThu::nhan)
                .containsExactly("T2", "T3", "T4", "T5", "T6", "T7", "CN");
        assertThat(ketQua.doanhThu7Ngay().get(0).doanhThu()).isEqualByComparingTo("1000");
        assertThat(ketQua.doanhThu7Ngay().get(1).doanhThu()).isEqualByComparingTo("0");
        assertThat(ketQua.tongDoanhThu7Ngay()).isEqualByComparingTo("3000");
    }

    @Test
    void tangTruongSoVoiHomQua() {
        doanhThu(new DoanhThuNgay(HOM_NAY.minusDays(1), new BigDecimal("6195000")), new DoanhThuNgay(HOM_NAY, new BigDecimal("7420000")));

        assertThat(useCase.layTongQuan().tangTruongPhanTram()).isEqualByComparingTo("19.8");
    }

    @Test
    void giamSoVoiHomQuaThiAm() {
        doanhThu(new DoanhThuNgay(HOM_NAY.minusDays(1), new BigDecimal("200")), new DoanhThuNgay(HOM_NAY, new BigDecimal("100")));

        assertThat(useCase.layTongQuan().tangTruongPhanTram()).isEqualByComparingTo("-50.0");
    }

    @Test
    void homQuaKhongCoDoanhThuThiKhongChiaChoKhong() {
        doanhThu(new DoanhThuNgay(HOM_NAY, new BigDecimal("100")));

        assertThat(useCase.layTongQuan().tangTruongPhanTram()).isNull();
    }

    @Test
    void demDuMoiTrangThaiKeCaKhongCoDon() {
        doanhThu();
        when(repository.demDonTheoTrangThai()).thenReturn(List.of(new DemTrangThai("CHO_XAC_NHAN", 2)));

        ThongKeDto ketQua = useCase.layTongQuan();

        assertThat(ketQua.donChoXacNhan()).isEqualTo(2);
        assertThat(ketQua.donTheoTrangThai()).hasSize(7);
        assertThat(ketQua.donTheoTrangThai()).filteredOn(d -> d.trangThai().equals("DA_HUY")).singleElement()
                .satisfies(d -> assertThat(d.soDon()).isZero());
    }

    @Test
    void haoHutTinhTrongThangVaTiLeTrenTongDan() {
        doanhThu();
        when(repository.tonKho()).thenReturn(new TonKhoTong(6, 662));
        when(repository.haoHutTrongKhoang(LocalDate.of(2026, 11, 1), HOM_NAY)).thenReturn(50L);

        ThongKeDto ketQua = useCase.layTongQuan();

        assertThat(ketQua.haoHutThangNay()).isEqualTo(50);
        assertThat(ketQua.tiLeHaoHutPhanTram()).isEqualByComparingTo("7.0");
        verify(repository).haoHutTrongKhoang(LocalDate.of(2026, 11, 1), HOM_NAY);
    }

    @Test
    void khoTrongKhongChiaChoKhong() {
        doanhThu();

        assertThat(useCase.layTongQuan().tiLeHaoHutPhanTram()).isEqualByComparingTo("0");
    }
}
