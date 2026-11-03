package com.guppyshop.catalog.presentation.request;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.guppyshop.catalog.application.dto.SanPhamDtos.LuuCaGuppyCommand;
import com.guppyshop.catalog.application.dto.SanPhamDtos.LuuPhuKienCommand;
import com.guppyshop.catalog.application.dto.SanPhamDtos.LuuSanPhamCommand;
import com.guppyshop.catalog.application.dto.SanPhamDtos.MucGiaCommand;
import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.CatalogEnums.KieuDuoi;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiPhuKien;
import com.guppyshop.catalog.domain.model.CatalogEnums.NhanSanPham;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/** Trường loai trong JSON quyết định dữ liệu là cá hay phụ kiện. */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "loai")
@JsonSubTypes({
        @JsonSubTypes.Type(value = LuuSanPhamRequest.CaGuppyRequest.class, name = "CA_GUPPY"),
        @JsonSubTypes.Type(value = LuuSanPhamRequest.PhuKienRequest.class, name = "PHU_KIEN")
})
@Schema(description = "Thêm hoặc sửa sản phẩm", oneOf = {LuuSanPhamRequest.CaGuppyRequest.class, LuuSanPhamRequest.PhuKienRequest.class})
public sealed interface LuuSanPhamRequest {

    LuuSanPhamCommand sangLenh();

    @Schema(description = "Một mức giá; CON_LE phải có gioiTinh DUC hoặc CAI")
    record MucGiaRequest(
            @NotNull(message = "Chưa chọn đơn vị bán") DonViBan donVi,
            @Schema(description = "Bỏ trống với đơn vị khác CON_LE") GioiTinh gioiTinh,
            @NotNull(message = "Chưa nhập giá") @DecimalMin(value = "1", message = "Giá phải lớn hơn 0") BigDecimal gia) {
    }

    @Schema(description = "Sản phẩm cá; nhiệt độ trong 22–28°C, pH trong 6.8–7.8")
    record CaGuppyRequest(
            @NotBlank(message = "Tên không được trống") @Size(max = 160) String ten,
            String moTa,
            Set<NhanSanPham> nhan,
            @NotNull(message = "Chưa chọn dòng cá") Long dongCaId,
            @NotNull(message = "Chưa chọn kiểu đuôi") KieuDuoi kieuDuoi,
            @NotBlank(message = "Màu sắc không được trống") @Size(max = 80) String mauSac,
            boolean thuanChung,
            @NotBlank(message = "Kích thước không được trống") @Size(max = 20) String kichThuoc,
            @Min(value = 0, message = "Tuổi không được âm") int tuoiTuan,
            @Schema(description = "Số con trong một lô cá bột", example = "10") @Min(value = 1, message = "Số con mỗi lô phải lớn hơn 0") int soConMoiLo,
            @NotNull(message = "Chưa nhập nhiệt độ thấp nhất") BigDecimal nhietDoMin,
            @NotNull(message = "Chưa nhập nhiệt độ cao nhất") BigDecimal nhietDoMax,
            @NotNull(message = "Chưa nhập pH thấp nhất") BigDecimal phMin,
            @NotNull(message = "Chưa nhập pH cao nhất") BigDecimal phMax,
            @NotBlank(message = "Độ cứng không được trống") @Size(max = 20) String doCung,
            @NotEmpty(message = "Phải có ít nhất một mức giá") List<@Valid MucGiaRequest> bangGia) implements LuuSanPhamRequest {

        @Override
        public LuuSanPhamCommand sangLenh() {
            List<MucGiaCommand> gia = bangGia.stream().map(m -> new MucGiaCommand(m.donVi(), m.gioiTinh(), m.gia())).toList();
            return new LuuCaGuppyCommand(ten, moTa, nhan == null ? Set.of() : nhan, dongCaId, kieuDuoi, mauSac, thuanChung,
                    kichThuoc, tuoiTuan, soConMoiLo, nhietDoMin, nhietDoMax, phMin, phMax, doCung, gia);
        }
    }

    @Schema(description = "Sản phẩm phụ kiện")
    record PhuKienRequest(
            @NotBlank(message = "Tên không được trống") @Size(max = 160) String ten,
            String moTa,
            Set<NhanSanPham> nhan,
            @NotNull(message = "Chưa chọn loại phụ kiện") LoaiPhuKien loaiPhuKien,
            @NotNull(message = "Chưa nhập giá") @DecimalMin(value = "1", message = "Giá phải lớn hơn 0") BigDecimal gia,
            @Min(value = 0, message = "Tồn kho không được âm") int tonKho) implements LuuSanPhamRequest {

        @Override
        public LuuSanPhamCommand sangLenh() {
            return new LuuPhuKienCommand(ten, moTa, nhan == null ? Set.of() : nhan, loaiPhuKien, gia, tonKho);
        }
    }
}
