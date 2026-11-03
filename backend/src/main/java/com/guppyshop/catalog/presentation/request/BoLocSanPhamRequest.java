package com.guppyshop.catalog.presentation.request;

import com.guppyshop.catalog.domain.model.BoLocSanPham;
import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.CatalogEnums.KieuDuoi;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiSanPham;
import com.guppyshop.catalog.domain.model.CatalogEnums.SapXepSanPham;
import com.guppyshop.common.domain.PhanTrang;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;

/** Tham số lọc trên URL; có thể lặp lại tham số hoặc ngăn cách bằng dấu phẩy để chọn nhiều giá trị. */
@Schema(description = "Bộ lọc sản phẩm")
public record BoLocSanPhamRequest(
        @Schema(description = "Tìm trong tên, không phân biệt hoa thường và dấu", example = "koi") String q,
        @Schema(description = "CA_GUPPY hoặc PHU_KIEN") LoaiSanPham loai,
        @Schema(description = "Mã dòng cá", example = "full-gold") List<String> dong,
        List<GioiTinh> gioiTinh,
        List<KieuDuoi> kieuDuoi,
        List<DonViBan> donVi,
        @Schema(description = "So với giá thấp nhất của sản phẩm") BigDecimal giaMin,
        @Schema(description = "So với giá thấp nhất của sản phẩm", example = "300000") BigDecimal giaMax,
        @Schema(description = "Mặc định BAN_CHAY") SapXepSanPham sapXep,
        @Schema(description = "Số trang, bắt đầu từ 0", example = "0") Integer trang,
        @Schema(description = "Tối đa 100, mặc định 12", example = "12") Integer kichThuoc) {

    private static final int KICH_THUOC_MAC_DINH = 12;

    public BoLocSanPham sangBoLoc(boolean chiDangBan) {
        return new BoLocSanPham(q, loai, dong, gioiTinh, kieuDuoi, donVi, giaMin, giaMax, sapXep, chiDangBan);
    }

    public PhanTrang sangPhanTrang() {
        return new PhanTrang(trang == null ? 0 : trang, kichThuoc == null ? KICH_THUOC_MAC_DINH : kichThuoc);
    }
}
