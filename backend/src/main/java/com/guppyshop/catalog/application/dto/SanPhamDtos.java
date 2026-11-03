package com.guppyshop.catalog.application.dto;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.CatalogEnums.HoaTiet;
import com.guppyshop.catalog.domain.model.CatalogEnums.KieuDuoi;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiPhuKien;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiSanPham;
import com.guppyshop.catalog.domain.model.CatalogEnums.NhanSanPham;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/** Dữ liệu vào và ra của danh mục sản phẩm. */
public final class SanPhamDtos {

    private SanPhamDtos() {
    }

    @Schema(description = "Dòng cá cùng bảng màu để frontend vẽ cá")
    public record DongCaDto(Long id, String ma, String ten, String xuatXu, HoaTiet hoaTiet,
                            String mauThan, String mauDuoi1, String mauDuoi2, String mauNhan) {
    }

    @Schema(description = "Sản phẩm trên thẻ danh sách")
    public record SanPhamTomTatDto(
            Long id,
            LoaiSanPham loai,
            String ten,
            String slug,
            BigDecimal diemDanhGia,
            int daBan,
            Set<NhanSanPham> nhan,
            @Schema(description = "Giá thấp nhất, hiển thị là Chỉ từ") BigDecimal giaThapNhat,
            @Schema(description = "Còn đơn vị nào mua được không") boolean conHang,
            boolean dangBan,
            @Schema(description = "Chỉ có với cá") DongCaDto dongCa,
            @Schema(description = "Chỉ có với cá") KieuDuoi kieuDuoi,
            @Schema(description = "Các đơn vị bán, chỉ có với cá") Set<DonViBan> donViBan,
            @Schema(description = "Chỉ có với phụ kiện") LoaiPhuKien loaiPhuKien) {
    }

    @Schema(description = "Giá và tồn của một đơn vị bán")
    public record GiaBanDto(DonViBan donVi, GioiTinh gioiTinh, BigDecimal gia,
                            @Schema(description = "Số đơn vị còn mua được") int conLai) {
    }

    @Schema(description = "Thông số nước khuyến nghị")
    public record ThongSoNuocDto(BigDecimal nhietDoMin, BigDecimal nhietDoMax, BigDecimal phMin, BigDecimal phMax, String doCung) {
    }

    @Schema(description = "Chi tiết sản phẩm")
    public record SanPhamChiTietDto(
            SanPhamTomTatDto tomTat,
            String moTa,
            int soDanhGia,
            @Schema(description = "Chỉ có với cá") List<GiaBanDto> bangGia,
            @Schema(description = "Chỉ có với cá") String mauSac,
            @Schema(description = "Chỉ có với cá") Boolean thuanChung,
            @Schema(description = "Chỉ có với cá") String kichThuoc,
            @Schema(description = "Chỉ có với cá") Integer tuoiTuan,
            @Schema(description = "Chỉ có với cá") Integer soConMoiLo,
            @Schema(description = "Chỉ có với cá") ThongSoNuocDto thongSoNuoc,
            @Schema(description = "Mã các lô đang nuôi, chỉ có với cá") List<String> maLo,
            @Schema(description = "Chỉ có với phụ kiện") Integer tonKhoPhuKien) {
    }

    public record LuuDongCaCommand(String ma, String ten, String xuatXu, HoaTiet hoaTiet,
                                   String mauThan, String mauDuoi1, String mauDuoi2, String mauNhan) {
    }

    public record MucGiaCommand(DonViBan donVi, GioiTinh gioiTinh, BigDecimal gia) {
    }

    /** Pattern matching ở use case bắt buộc xử lý đủ 2 loại nhờ sealed. */
    public sealed interface LuuSanPhamCommand permits LuuCaGuppyCommand, LuuPhuKienCommand {

        String ten();

        String moTa();

        Set<NhanSanPham> nhan();
    }

    public record LuuCaGuppyCommand(String ten, String moTa, Set<NhanSanPham> nhan, Long dongCaId, KieuDuoi kieuDuoi,
                                    String mauSac, boolean thuanChung, String kichThuoc, int tuoiTuan, int soConMoiLo,
                                    BigDecimal nhietDoMin, BigDecimal nhietDoMax, BigDecimal phMin, BigDecimal phMax,
                                    String doCung, List<MucGiaCommand> bangGia) implements LuuSanPhamCommand {
    }

    public record LuuPhuKienCommand(String ten, String moTa, Set<NhanSanPham> nhan, LoaiPhuKien loaiPhuKien,
                                    BigDecimal gia, int tonKho) implements LuuSanPhamCommand {
    }
}
