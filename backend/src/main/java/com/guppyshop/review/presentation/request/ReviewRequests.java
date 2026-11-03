package com.guppyshop.review.presentation.request;

import com.guppyshop.review.application.dto.ReviewDtos.TaoBaoHanhCommand;
import com.guppyshop.review.application.dto.ReviewDtos.TaoDanhGiaCommand;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class ReviewRequests {

    private ReviewRequests() {
    }

    @Schema(description = "Đánh giá một sản phẩm trong đơn đã hoàn tất")
    public record TaoDanhGiaRequest(
            @Schema(example = "GP24110903") @NotBlank(message = "Chưa có mã đơn") String maDon,
            @NotNull(message = "Chưa chọn sản phẩm") Long sanPhamId,
            @Schema(example = "5") @Min(value = 1, message = "Số sao từ 1 đến 5") @Max(value = 5, message = "Số sao từ 1 đến 5") int soSao,
            @Size(max = 1000, message = "Nội dung tối đa 1000 ký tự") String noiDung) {

        public TaoDanhGiaCommand sangLenh() {
            return new TaoDanhGiaCommand(maDon, sanPhamId, soSao, noiDung);
        }
    }

    @Schema(description = "Yêu cầu bảo hành cá chết trong 24h")
    public record TaoBaoHanhRequest(
            @NotBlank(message = "Chưa có mã đơn") String maDon,
            @NotBlank(message = "Vui lòng mô tả tình trạng cá") @Size(max = 1000, message = "Mô tả tối đa 1000 ký tự") String moTa,
            // Chỉ nhận http và https để giao diện hiển thị thành liên kết an toàn
            @Schema(description = "Đường dẫn video mở hàng, không bắt buộc", example = "https://example.com/video")
            @Size(max = 500) @Pattern(regexp = "https?://\\S+", message = "Đường dẫn video phải bắt đầu bằng http:// hoặc https://") String duongDanVideo) {

        public TaoBaoHanhCommand sangLenh() {
            return new TaoBaoHanhCommand(maDon, moTa, duongDanVideo);
        }
    }

    @Schema(description = "Kết quả xử lý bảo hành")
    public record XuLyBaoHanhRequest(
            @Schema(example = "Đã đổi cá mới") @NotBlank(message = "Vui lòng nhập kết quả xử lý") @Size(max = 500, message = "Kết quả tối đa 500 ký tự") String ketQua) {
    }
}
