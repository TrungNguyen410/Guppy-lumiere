package com.guppyshop.review.application.dto;

import com.guppyshop.ordering.domain.model.TrangThaiDon;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

public final class ReviewDtos {

    private ReviewDtos() {
    }

    public record TaoDanhGiaCommand(String maDon, Long sanPhamId, int soSao, String noiDung) {
    }

    public record TaoBaoHanhCommand(String maDon, String moTa, String duongDanVideo) {
    }

    @Schema(description = "Một đánh giá, chỉ hiện tên rút gọn của khách")
    public record DanhGiaDto(Long id, String tenKhach, int soSao, String noiDung, LocalDateTime taoLuc) {
    }

    @Schema(description = "Yêu cầu bảo hành")
    public record BaoHanhDto(Long id, String maDon, TrangThaiDon trangThaiDon, String tenKhach, String soDienThoai,
                             String moTa, String duongDanVideo, String ketQua,
                             @Schema(description = "Null nghĩa là đang chờ xử lý") LocalDateTime xuLyLuc,
                             LocalDateTime taoLuc) {
    }
}
