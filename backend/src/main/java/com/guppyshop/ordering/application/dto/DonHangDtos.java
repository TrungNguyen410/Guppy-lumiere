package com.guppyshop.ordering.application.dto;

import com.guppyshop.cart.application.dto.GioHangDtos.ChuGioHang;
import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import com.guppyshop.payment.application.dto.ThanhToanDto;
import com.guppyshop.payment.domain.model.PhuongThucThanhToan;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class DonHangDtos {

    private DonHangDtos() {
    }

    public record DatHangCommand(ChuGioHang chu, String hoTen, String soDienThoai, String diaChi, String thanhPho,
                                 String ghiChu, PhuongThucThanhToan phuongThuc, String maGiamGia) {
    }

    public record ChuyenTrangThaiCommand(TrangThaiDon trangThai, String ghiChu) {
    }

    @Schema(description = "Một dòng đơn với tên và đơn giá lúc mua")
    public record ChiTietDonDto(Long sanPhamId, String tenSanPham,
                                @Schema(description = "Null với phụ kiện") DonViBan donVi,
                                GioiTinh gioiTinh, int soLuong, BigDecimal donGia, BigDecimal thanhTien) {
    }

    @Schema(description = "Một lần đổi trạng thái")
    public record LichSuDto(TrangThaiDon trangThai, LocalDateTime thoiDiem, String ghiChu) {
    }

    @Schema(description = "Đơn hàng")
    public record DonHangDto(
            Long id,
            String maDon,
            boolean khachVangLai,
            String hoTenNhan,
            String sdtNhan,
            String diaChiNhan,
            String thanhPhoNhan,
            String ghiChu,
            TrangThaiDon trangThai,
            @Schema(description = "Khách có thể tự hủy đơn này không") boolean khachDuocHuy,
            BigDecimal tamTinh,
            BigDecimal phiGiao,
            BigDecimal giamGia,
            BigDecimal tongTien,
            List<ChiTietDonDto> chiTiet,
            List<LichSuDto> lichSu,
            ThanhToanDto thanhToan,
            LocalDateTime taoLuc,
            @Schema(description = "Lần hoàn tất đầu tiên, tính hạn bảo hành 24h") LocalDateTime hoanTatLuc,
            @Schema(description = "Đơn của tài khoản, đã hoàn tất và còn trong 24h") boolean conHanBaoHanh) {
    }
}
