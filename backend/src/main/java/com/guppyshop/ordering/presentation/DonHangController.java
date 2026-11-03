package com.guppyshop.ordering.presentation;

import com.guppyshop.cart.application.dto.GioHangDtos.ChuGioHang;
import com.guppyshop.common.config.NguoiDungXacThuc;
import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.ordering.application.dto.DonHangDtos.DonHangDto;
import com.guppyshop.ordering.application.usecase.DatHangUseCase;
import com.guppyshop.ordering.application.usecase.QuanLyDonHangUseCase;
import com.guppyshop.ordering.presentation.request.DonHangRequests.DatHangRequest;
import com.guppyshop.ordering.presentation.request.DonHangRequests.HuyDonRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Đơn hàng", description = "Đặt hàng, tra cứu và hủy đơn, không cần tài khoản")
@RestController
@RequestMapping("/api/don-hang")
public class DonHangController {

    private final DatHangUseCase datHangUseCase;
    private final QuanLyDonHangUseCase quanLyDonHang;

    public DonHangController(DatHangUseCase datHangUseCase, QuanLyDonHangUseCase quanLyDonHang) {
        this.datHangUseCase = datHangUseCase;
        this.quanLyDonHang = quanLyDonHang;
    }

    @Operation(summary = "Đặt hàng từ giỏ hiện tại", description = "Khách vãng lai dùng header X-Session-Id; khách hàng đã đăng nhập dùng giỏ của tài khoản và đơn được gắn vào tài khoản")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đặt thành công, trả về mã đơn")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Thông tin người nhận không hợp lệ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Giỏ trống, không đủ hàng hoặc mã giảm giá không dùng được")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<DonHangDto> datHang(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                           @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
                                           @Valid @RequestBody DatHangRequest yeuCau) {
        boolean laKhachHang = nguoiDung != null && "KHACH_HANG".equals(nguoiDung.vaiTro());
        ChuGioHang chu = laKhachHang ? new ChuGioHang(nguoiDung.id(), null) : new ChuGioHang(null, sessionId);
        return ApiResponse.ok("Đặt hàng thành công", datHangUseCase.datHang(yeuCau.sangLenh(chu)));
    }

    @Operation(summary = "Tra cứu đơn bằng mã đơn và số điện thoại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Sai mã đơn hoặc số điện thoại")
    @GetMapping("/tra-cuu")
    public ApiResponse<DonHangDto> traCuu(@RequestParam String maDon, @RequestParam String sdt) {
        return ApiResponse.ok(quanLyDonHang.traCuu(maDon, sdt));
    }

    @Operation(summary = "Khách hủy đơn còn chờ xác nhận")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã hủy, tồn kho được trả lại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Sai mã đơn hoặc số điện thoại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Đơn đã được xác nhận")
    @PutMapping("/{maDon}/huy")
    public ApiResponse<DonHangDto> huy(@PathVariable String maDon, @Valid @RequestBody HuyDonRequest yeuCau) {
        return ApiResponse.ok("Đã hủy đơn", quanLyDonHang.khachHuy(maDon, yeuCau.soDienThoai()));
    }
}
