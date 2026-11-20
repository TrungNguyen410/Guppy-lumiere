package com.guppyshop.review.presentation.request;

import com.guppyshop.review.application.dto.ReviewDtos.TaoBaoHanhCommand;
import com.guppyshop.review.application.dto.ReviewDtos.TaoDanhGiaCommand;
import com.guppyshop.review.application.dto.ReviewDtos.XuLyBaoHanhCommand;
import com.guppyshop.review.domain.model.HinhThucBaoHanh;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
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
            // Các trại cá chỉ bảo hành cá chết khi có video quay liền mạch lúc mở hộp
            @Schema(description = "Đường dẫn video mở hàng, bắt buộc", example = "https://example.com/video")
            @NotBlank(message = "Vui lòng gửi đường dẫn video mở hàng") @Size(max = 500) @Pattern(regexp = "https?://\\S+", message = "Đường dẫn video phải bắt đầu bằng http:// hoặc https://") String duongDanVideo,
            @Schema(description = "Số cá chết khi mở túi", example = "1")
            @Min(value = 1, message = "Số cá chết phải từ 1 con") @Max(value = 999, message = "Số cá chết tối đa 999") int soCaChet) {

        public TaoBaoHanhCommand sangLenh() {
            return new TaoBaoHanhCommand(maDon, moTa, duongDanVideo, soCaChet);
        }
    }

    @Schema(description = "Kết quả xử lý bảo hành")
    public record XuLyBaoHanhRequest(
            @Schema(description = "DOI_CA, HOAN_TIEN hoặc TU_CHOI") @NotNull(message = "Chưa chọn hình thức xử lý") HinhThucBaoHanh hinhThuc,
            @Schema(description = "Bắt buộc với HOAN_TIEN, không vượt tiền hàng của đơn", example = "45000")
            @DecimalMin(value = "1", message = "Số tiền hoàn phải lớn hơn 0") @Digits(integer = 12, fraction = 0, message = "Số tiền hoàn tính theo đồng") BigDecimal soTienHoan,
            // Ghi vào lịch sử đơn (255 ký tự) cùng phần tóm tắt nên giới hạn 200
            @Schema(description = "Bắt buộc khi từ chối", example = "Đã giao 1 cá mới cùng đơn sau") @Size(max = 200, message = "Ghi chú tối đa 200 ký tự") String ghiChu) {

        public XuLyBaoHanhCommand sangLenh() {
            return new XuLyBaoHanhCommand(hinhThuc, soTienHoan, ghiChu);
        }
    }
}
