package com.guppyshop.report.application.usecase;

import com.guppyshop.ordering.domain.model.TrangThaiDon;
import com.guppyshop.report.application.dto.ThongKeDto;
import com.guppyshop.report.application.dto.ThongKeDto.DiemDoanhThu;
import com.guppyshop.report.domain.model.SoLieuThongKe.DemTrangThai;
import com.guppyshop.report.domain.model.SoLieuThongKe.DoanhThuNgay;
import com.guppyshop.report.domain.model.SoLieuThongKe.TonKhoTong;
import com.guppyshop.report.domain.repository.ThongKeRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ThongKeUseCase {

    private static final int SO_NGAY_BIEU_DO = 7;
    private static final int SO_DONG_TOP = 5;
    private static final int SO_DON_MOI = 5;
    private static final BigDecimal MOT_TRAM = BigDecimal.valueOf(100);

    private final ThongKeRepository thongKeRepository;
    private final Clock dongHo;

    @Autowired
    public ThongKeUseCase(ThongKeRepository thongKeRepository) {
        this(thongKeRepository, Clock.systemDefaultZone());
    }

    ThongKeUseCase(ThongKeRepository thongKeRepository, Clock dongHo) {
        this.thongKeRepository = thongKeRepository;
        this.dongHo = dongHo;
    }

    /** Đọc trong một transaction để các con số trên trang nhất quán với nhau. */
    @Transactional(readOnly = true)
    public ThongKeDto layTongQuan() {
        LocalDate homNay = LocalDate.now(dongHo);
        LocalDate ngayDau = homNay.minusDays(SO_NGAY_BIEU_DO - 1L);

        Map<LocalDate, BigDecimal> doanhThu = thongKeRepository.doanhThuTheoNgay(ngayDau, homNay).stream()
                .collect(Collectors.toMap(DoanhThuNgay::ngay, DoanhThuNgay::doanhThu));
        List<DiemDoanhThu> bieuDo = new ArrayList<>();
        for (LocalDate ngay = ngayDau; !ngay.isAfter(homNay); ngay = ngay.plusDays(1)) {
            bieuDo.add(new DiemDoanhThu(ngay, nhanThu(ngay.getDayOfWeek()), doanhThu.getOrDefault(ngay, BigDecimal.ZERO)));
        }
        BigDecimal doanhThuHomNay = doanhThu.getOrDefault(homNay, BigDecimal.ZERO);
        BigDecimal doanhThuHomQua = doanhThu.getOrDefault(homNay.minusDays(1), BigDecimal.ZERO);
        BigDecimal tong7Ngay = bieuDo.stream().map(DiemDoanhThu::doanhThu).reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> demDon = thongKeRepository.demDonTheoTrangThai().stream()
                .collect(Collectors.toMap(DemTrangThai::trangThai, DemTrangThai::soDon));
        List<DemTrangThai> theoTrangThai = Arrays.stream(TrangThaiDon.values())
                .map(t -> new DemTrangThai(t.name(), demDon.getOrDefault(t.name(), 0L)))
                .toList();

        TonKhoTong ton = thongKeRepository.tonKho();
        long haoHut = thongKeRepository.haoHutTrongKhoang(homNay.withDayOfMonth(1), homNay);

        return new ThongKeDto(homNay, doanhThuHomNay, doanhThuHomQua, tangTruong(doanhThuHomNay, doanhThuHomQua),
                bieuDo, tong7Ngay, demDon.getOrDefault(TrangThaiDon.CHO_XAC_NHAN.name(), 0L), theoTrangThai,
                ton.tongCa(), ton.soLo(), haoHut, tiLeHaoHut(haoHut, ton.tongCa()),
                thongKeRepository.dongBanChay(SO_DONG_TOP), thongKeRepository.donGanDay(SO_DON_MOI));
    }

    private BigDecimal tangTruong(BigDecimal homNay, BigDecimal homQua) {
        if (homQua.signum() == 0) {
            return null;
        }
        return homNay.subtract(homQua).multiply(MOT_TRAM).divide(homQua, 1, RoundingMode.HALF_UP);
    }

    private BigDecimal tiLeHaoHut(long haoHut, long tongCa) {
        long tongDan = haoHut + tongCa;
        if (tongDan == 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(haoHut).multiply(MOT_TRAM).divide(BigDecimal.valueOf(tongDan), 1, RoundingMode.HALF_UP);
    }

    private String nhanThu(DayOfWeek thu) {
        return thu == DayOfWeek.SUNDAY ? "CN" : "T" + (thu.getValue() + 1);
    }
}
