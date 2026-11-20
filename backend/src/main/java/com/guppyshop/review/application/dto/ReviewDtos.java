package com.guppyshop.review.application.dto;

import com.guppyshop.ordering.domain.model.TrangThaiDon;
import com.guppyshop.review.domain.model.HinhThucBaoHanh;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class ReviewDtos {

    private ReviewDtos() {
    }

    public record TaoDanhGiaCommand(String maDon, Long sanPhamId, int soSao, String noiDung) {
    }

    public record TaoBaoHanhCommand(String maDon, String moTa, String duongDanVideo, int soCaChet) {
    }

    public record XuLyBaoHanhCommand(HinhThucBaoHanh hinhThuc, BigDecimal soTienHoan, String ghiChu) {
    }

    @Schema(description = "Một đánh giá, chỉ hiện tên rút gọn của khách")
    public record DanhGiaDto(Long id, String tenKhach, int soSao, String noiDung, LocalDateTime taoLuc) {
    }

    @Schema(description = "Yêu cầu bảo hành")
    public record BaoHanhDto(Long id, String maDon, TrangThaiDon trangThaiDon, String tenKhach, String soDienThoai,
                             String moTa, String duongDanVideo, int soCaChet,
                             @Schema(description = "Null nghĩa là đang chờ xử lý") HinhThucBaoHanh hinhThuc,
                             @Schema(description = "Chỉ có khi hình thức là HOAN_TIEN") BigDecimal soTienHoan,
                             @Schema(description = "Tiền hàng của đơn sau giảm giá, không gồm phí giao: mức hoàn tối đa") BigDecimal tienHoanToiDa,
                             @Schema(description = "Ghi chú của nhân viên") String ketQua,
                             @Schema(description = "Null nghĩa là đang chờ xử lý") LocalDateTime xuLyLuc,
                             LocalDateTime taoLuc) {
    }
}
