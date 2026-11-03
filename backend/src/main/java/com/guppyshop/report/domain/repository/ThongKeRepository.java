package com.guppyshop.report.domain.repository;

import com.guppyshop.report.domain.model.SoLieuThongKe.DemTrangThai;
import com.guppyshop.report.domain.model.SoLieuThongKe.DoanhThuNgay;
import com.guppyshop.report.domain.model.SoLieuThongKe.DonGanDay;
import com.guppyshop.report.domain.model.SoLieuThongKe.DongBanChay;
import com.guppyshop.report.domain.model.SoLieuThongKe.TonKhoTong;
import java.time.LocalDate;
import java.util.List;

/** Chỉ đọc. Module report không có entity riêng, số liệu tổng hợp từ bảng của các module khác. */
public interface ThongKeRepository {

    /** Doanh thu tính theo ngày đơn hoàn tất lần đầu; ngày không có đơn sẽ không có trong kết quả. */
    List<DoanhThuNgay> doanhThuTheoNgay(LocalDate tuNgay, LocalDate denNgay);

    List<DemTrangThai> demDonTheoTrangThai();

    TonKhoTong tonKho();

    long haoHutTrongKhoang(LocalDate tuNgay, LocalDate denNgay);

    List<DongBanChay> dongBanChay(int gioiHan);

    List<DonGanDay> donGanDay(int gioiHan);
}
