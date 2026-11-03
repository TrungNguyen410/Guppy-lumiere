package com.guppyshop.ordering.presentation;

import com.guppyshop.common.config.NguoiDungXacThuc;
import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.common.response.PageResponse;
import com.guppyshop.ordering.application.dto.DonHangDtos.DonHangDto;
import com.guppyshop.ordering.application.usecase.QuanLyDonHangUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Khách hàng", description = "Hồ sơ và sổ địa chỉ của khách hàng đang đăng nhập")
@RestController
@RequestMapping("/api/khach-hang/don-hang")
public class KhachHangDonHangController {

    private final QuanLyDonHangUseCase quanLyDonHang;

    public KhachHangDonHangController(QuanLyDonHangUseCase quanLyDonHang) {
        this.quanLyDonHang = quanLyDonHang;
    }

    @Operation(summary = "Lịch sử đơn của tôi, mới nhất trước")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    @GetMapping
    public ApiResponse<PageResponse<DonHangDto>> lichSu(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                                        @RequestParam(defaultValue = "0") int trang,
                                                        @RequestParam(defaultValue = "10") int kichThuoc) {
        return ApiResponse.ok(PageResponse.tu(quanLyDonHang.lichSuCuaKhach(nguoiDung.id(), new PhanTrang(trang, kichThuoc))));
    }

    @Operation(summary = "Xem một đơn của tôi")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại hoặc không phải đơn của tôi")
    @GetMapping("/{maDon}")
    public ApiResponse<DonHangDto> chiTiet(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                           @PathVariable String maDon) {
        return ApiResponse.ok(quanLyDonHang.chiTietCuaKhach(nguoiDung.id(), maDon));
    }
}
