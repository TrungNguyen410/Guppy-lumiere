package com.guppyshop.cart.application.dto;

import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamTomTatDto;
import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;

/** Dữ liệu vào và ra của giỏ hàng. */
public final class GioHangDtos {

    private GioHangDtos() {
    }

    /** Chủ giỏ: khachHangId khác null thì dùng giỏ tài khoản, ngược lại dùng giỏ theo session. */
    public record ChuGioHang(Long khachHangId, String sessionId) {
    }

    public record ThemVaoGioCommand(Long sanPhamId, DonViBan donVi, GioiTinh gioiTinh, int soLuong) {
    }

    @Schema(description = "Một dòng trong giỏ")
    public record DongGioDto(
            Long id,
            SanPhamTomTatDto sanPham,
            @Schema(description = "Null với phụ kiện") DonViBan donVi,
            GioiTinh gioiTinh,
            int soLuong,
            @Schema(description = "Null khi lựa chọn này không còn bán") BigDecimal donGia,
            BigDecimal thanhTien,
            @Schema(description = "Số đơn vị còn mua được") int conLai,
            @Schema(description = "Sản phẩm và đơn vị này còn được bán không") boolean conBan,
            @Schema(description = "Số lượng trong giỏ vượt số còn lại") boolean vuotTon) {
    }

    @Schema(description = "Giỏ hàng")
    public record GioHangDto(
            List<DongGioDto> chiTiet,
            @Schema(description = "Tổng số lượng, hiển thị trên Header") int tongSoLuong,
            @Schema(description = "Chỉ tính các dòng còn bán") BigDecimal tamTinh,
            @Schema(description = "50.000đ, miễn phí từ 500.000đ") BigDecimal phiGiao,
            BigDecimal tongCong) {
    }
}
