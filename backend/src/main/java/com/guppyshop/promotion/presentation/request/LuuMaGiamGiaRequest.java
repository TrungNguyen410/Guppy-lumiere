package com.guppyshop.promotion.presentation.request;

import com.guppyshop.promotion.application.dto.MaGiamGiaDtos.LuuMaGiamGiaCommand;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;

@Schema(description = "Thêm hoặc sửa mã giảm giá")
public record LuuMaGiamGiaRequest(
        @Schema(description = "Không đổi được sau khi tạo", example = "GUPPY10")
        @NotBlank(message = "Mã không được trống") @Pattern(regexp = "[A-Za-z0-9-]{1,30}", message = "Mã chỉ gồm chữ, số và dấu gạch ngang") String ma,
        @Schema(example = "10") @Min(value = 1, message = "Phần trăm từ 1 đến 100") @Max(value = 100, message = "Phần trăm từ 1 đến 100") int phanTram,
        @NotNull(message = "Chưa nhập ngày bắt đầu") LocalDateTime ngayBatDau,
        @NotNull(message = "Chưa nhập ngày hết hạn") LocalDateTime ngayHetHan,
        @Schema(description = "Bỏ trống là không giới hạn") @Min(value = 1, message = "Số lượt phải lớn hơn 0") Integer soLuotToiDa,
        boolean kichHoat) {

    public LuuMaGiamGiaCommand sangLenh() {
        return new LuuMaGiamGiaCommand(ma, phanTram, ngayBatDau, ngayHetHan, soLuotToiDa, kichHoat);
    }
}
