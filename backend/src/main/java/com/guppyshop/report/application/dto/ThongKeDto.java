package com.guppyshop.report.application.dto;

import com.guppyshop.report.domain.model.SoLieuThongKe.DemTrangThai;
import com.guppyshop.report.domain.model.SoLieuThongKe.DonGanDay;
import com.guppyshop.report.domain.model.SoLieuThongKe.DongBanChay;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Schema(description = "Số liệu trang Tổng quan")
public record ThongKeDto(
        @Schema(description = "Ngày tính số liệu") LocalDate ngay,
        BigDecimal doanhThuHomNay,
        BigDecimal doanhThuHomQua,
        @Schema(description = "% thay đổi so với hôm qua; null khi hôm qua không có doanh thu") BigDecimal tangTruongPhanTram,
        @Schema(description = "Đủ 7 ngày gần nhất, cũ nhất trước; ngày không có đơn là 0") List<DiemDoanhThu> doanhThu7Ngay,
        BigDecimal tongDoanhThu7Ngay,
        long donChoXacNhan,
        @Schema(description = "Đủ mọi trạng thái; trạng thái không có đơn là 0") List<DemTrangThai> donTheoTrangThai,
        long tongCaTon,
        long soLoDangNuoi,
        long haoHutThangNay,
        @Schema(description = "Hao hụt tháng này trên tổng đàn, tính theo %") BigDecimal tiLeHaoHutPhanTram,
        @Schema(description = "5 dòng bán nhiều nhất") List<DongBanChay> dongBanChay,
        @Schema(description = "5 đơn mới nhất") List<DonGanDay> donMoiNhat) {

    @Schema(description = "Doanh thu một ngày trên biểu đồ")
    public record DiemDoanhThu(LocalDate ngay, @Schema(example = "T2") String nhan, BigDecimal doanhThu) {
    }
}
