package com.guppyshop.cart.presentation;

import com.guppyshop.cart.application.dto.GioHangDtos.ChuGioHang;
import com.guppyshop.cart.application.dto.GioHangDtos.GioHangDto;
import com.guppyshop.cart.application.usecase.GioHangUseCase;
import com.guppyshop.cart.presentation.request.GioHangRequests.DoiSoLuongRequest;
import com.guppyshop.cart.presentation.request.GioHangRequests.ThemVaoGioRequest;
import com.guppyshop.common.config.NguoiDungXacThuc;
import com.guppyshop.common.exception.XacThucThatBaiException;
import com.guppyshop.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Giỏ hàng", description = "Khách vãng lai dùng header X-Session-Id; khách hàng đã đăng nhập dùng giỏ của tài khoản")
@RestController
@RequestMapping("/api/gio-hang")
public class GioHangController {

    private static final String HEADER_SESSION = "X-Session-Id";
    private static final String VAI_TRO_KHACH_HANG = "KHACH_HANG";

    private final GioHangUseCase gioHangUseCase;

    public GioHangController(GioHangUseCase gioHangUseCase) {
        this.gioHangUseCase = gioHangUseCase;
    }

    @Operation(summary = "Xem giỏ hàng")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Thiếu hoặc sai X-Session-Id")
    @GetMapping
    public ApiResponse<GioHangDto> xem(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                       @RequestHeader(value = HEADER_SESSION, required = false) String sessionId) {
        return ApiResponse.ok(gioHangUseCase.xem(chuGio(nguoiDung, sessionId)));
    }

    @Operation(summary = "Thêm vào giỏ", description = "Trùng sản phẩm và đơn vị thì cộng dồn số lượng")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã thêm")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Sản phẩm không tồn tại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Hết hàng, vượt tồn hoặc sai đơn vị")
    @PostMapping
    public ApiResponse<GioHangDto> them(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                        @RequestHeader(value = HEADER_SESSION, required = false) String sessionId,
                                        @Valid @RequestBody ThemVaoGioRequest yeuCau) {
        return ApiResponse.ok(gioHangUseCase.them(chuGio(nguoiDung, sessionId), yeuCau.sangLenh()));
    }

    @Operation(summary = "Đổi số lượng của một dòng")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã đổi")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Dòng không thuộc giỏ này")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Vượt tồn")
    @PutMapping("/{chiTietId}")
    public ApiResponse<GioHangDto> doiSoLuong(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                              @RequestHeader(value = HEADER_SESSION, required = false) String sessionId,
                                              @PathVariable Long chiTietId, @Valid @RequestBody DoiSoLuongRequest yeuCau) {
        return ApiResponse.ok(gioHangUseCase.doiSoLuong(chuGio(nguoiDung, sessionId), chiTietId, yeuCau.soLuong()));
    }

    @Operation(summary = "Xóa một dòng")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã xóa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Dòng không thuộc giỏ này")
    @DeleteMapping("/{chiTietId}")
    public ApiResponse<GioHangDto> xoaDong(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                           @RequestHeader(value = HEADER_SESSION, required = false) String sessionId,
                                           @PathVariable Long chiTietId) {
        return ApiResponse.ok(gioHangUseCase.xoaDong(chuGio(nguoiDung, sessionId), chiTietId));
    }

    @Operation(summary = "Làm trống giỏ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã làm trống")
    @DeleteMapping
    public ApiResponse<GioHangDto> lamTrong(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                            @RequestHeader(value = HEADER_SESSION, required = false) String sessionId) {
        return ApiResponse.ok(gioHangUseCase.lamTrong(chuGio(nguoiDung, sessionId)));
    }

    @Operation(summary = "Gộp giỏ session vào tài khoản", description = "Frontend gọi ngay sau khi khách hàng đăng nhập; giỏ session bị xóa sau khi gộp")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã gộp")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không phải khách hàng")
    @PostMapping("/gop")
    public ApiResponse<GioHangDto> gop(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                       @RequestHeader(value = HEADER_SESSION, required = false) String sessionId) {
        if (nguoiDung == null) {
            throw new XacThucThatBaiException("Vui lòng đăng nhập");
        }
        if (!VAI_TRO_KHACH_HANG.equals(nguoiDung.vaiTro())) {
            throw new AccessDeniedException("Chỉ khách hàng mới gộp giỏ");
        }
        return ApiResponse.ok(gioHangUseCase.gopGio(nguoiDung.id(), sessionId));
    }

    /** Chỉ khách hàng có giỏ tài khoản; nhân viên và admin mua hàng thì dùng giỏ theo session. */
    private ChuGioHang chuGio(NguoiDungXacThuc nguoiDung, String sessionId) {
        boolean laKhachHang = nguoiDung != null && VAI_TRO_KHACH_HANG.equals(nguoiDung.vaiTro());
        return laKhachHang ? new ChuGioHang(nguoiDung.id(), null) : new ChuGioHang(null, sessionId);
    }
}
