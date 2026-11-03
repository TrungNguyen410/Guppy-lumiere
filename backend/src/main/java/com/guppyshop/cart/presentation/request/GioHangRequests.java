package com.guppyshop.cart.presentation.request;

import com.guppyshop.cart.application.dto.GioHangDtos.ThemVaoGioCommand;
import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public final class GioHangRequests {

    private GioHangRequests() {
    }

    @Schema(description = "Thêm vào giỏ. Cá phải có donVi; CON_LE phải có gioiTinh; phụ kiện bỏ trống cả hai")
    public record ThemVaoGioRequest(
            @NotNull(message = "Chưa chọn sản phẩm") Long sanPhamId,
            DonViBan donVi,
            GioiTinh gioiTinh,
            @Min(value = 1, message = "Số lượng phải lớn hơn 0") @Max(value = 999, message = "Số lượng tối đa 999") int soLuong) {

        public ThemVaoGioCommand sangLenh() {
            return new ThemVaoGioCommand(sanPhamId, donVi, gioiTinh, soLuong);
        }
    }

    @Schema(description = "Đổi số lượng của một dòng")
    public record DoiSoLuongRequest(
            @Min(value = 1, message = "Số lượng phải lớn hơn 0") @Max(value = 999, message = "Số lượng tối đa 999") int soLuong) {
    }
}
