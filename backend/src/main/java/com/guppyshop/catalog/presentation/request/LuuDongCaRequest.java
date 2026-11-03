package com.guppyshop.catalog.presentation.request;

import com.guppyshop.catalog.application.dto.SanPhamDtos.LuuDongCaCommand;
import com.guppyshop.catalog.domain.model.CatalogEnums.HoaTiet;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Thêm hoặc sửa dòng cá")
public record LuuDongCaRequest(
        @Schema(description = "Dùng trong URL lọc, không đổi được sau khi tạo", example = "tuxedo")
        @NotBlank(message = "Mã không được trống") @Pattern(regexp = "[a-z0-9-]{1,40}", message = "Mã chỉ gồm chữ thường, số và dấu gạch ngang") String ma,
        @NotBlank(message = "Tên không được trống") @Size(max = 80) String ten,
        @NotBlank(message = "Xuất xứ không được trống") @Size(max = 80) String xuatXu,
        @NotNull(message = "Chưa chọn họa tiết") HoaTiet hoaTiet,
        @Schema(example = "#e2e8f0") @NotBlank @Pattern(regexp = MAU_HEX, message = "Màu phải có dạng #rrggbb") String mauThan,
        @Schema(example = "#2dd4bf") @NotBlank @Pattern(regexp = MAU_HEX, message = "Màu phải có dạng #rrggbb") String mauDuoi1,
        @Schema(example = "#134e4a") @NotBlank @Pattern(regexp = MAU_HEX, message = "Màu phải có dạng #rrggbb") String mauDuoi2,
        @Schema(example = "#94a3b8") @NotBlank @Pattern(regexp = MAU_HEX, message = "Màu phải có dạng #rrggbb") String mauNhan) {

    private static final String MAU_HEX = "#[0-9a-fA-F]{6}";

    public LuuDongCaCommand sangLenh() {
        return new LuuDongCaCommand(ma, ten, xuatXu, hoaTiet, mauThan, mauDuoi1, mauDuoi2, mauNhan);
    }
}
