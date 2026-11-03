package com.guppyshop.identity.presentation;

import com.guppyshop.common.config.NguoiDungXacThuc;
import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.identity.application.dto.KhachHangDtos.DiaChiDto;
import com.guppyshop.identity.application.dto.KhachHangDtos.HoSoDto;
import com.guppyshop.identity.application.usecase.KhachHangUseCase;
import com.guppyshop.identity.presentation.request.KhachHangRequests.CapNhatHoSoRequest;
import com.guppyshop.identity.presentation.request.KhachHangRequests.LuuDiaChiRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Khách hàng", description = "Hồ sơ và sổ địa chỉ của khách hàng đang đăng nhập")
@RestController
@RequestMapping("/api/khach-hang")
public class KhachHangController {

    private final KhachHangUseCase khachHangUseCase;

    public KhachHangController(KhachHangUseCase khachHangUseCase) {
        this.khachHangUseCase = khachHangUseCase;
    }

    @Operation(summary = "Xem hồ sơ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    @GetMapping("/ho-so")
    public ApiResponse<HoSoDto> layHoSo(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung) {
        return ApiResponse.ok(khachHangUseCase.layHoSo(nguoiDung.id()));
    }

    @Operation(summary = "Cập nhật hồ sơ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Số điện thoại đã được dùng")
    @PutMapping("/ho-so")
    public ApiResponse<HoSoDto> capNhatHoSo(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                            @Valid @RequestBody CapNhatHoSoRequest yeuCau) {
        return ApiResponse.ok(khachHangUseCase.capNhatHoSo(nguoiDung.id(), yeuCau.sangLenh()));
    }

    @Operation(summary = "Xem sổ địa chỉ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @GetMapping("/dia-chi")
    public ApiResponse<List<DiaChiDto>> layDiaChi(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung) {
        return ApiResponse.ok(khachHangUseCase.layDiaChi(nguoiDung.id()));
    }

    @Operation(summary = "Thêm địa chỉ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đã thêm")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
    @PostMapping("/dia-chi")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<DiaChiDto> themDiaChi(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                             @Valid @RequestBody LuuDiaChiRequest yeuCau) {
        return ApiResponse.ok(khachHangUseCase.themDiaChi(nguoiDung.id(), yeuCau.sangLenh()));
    }

    @Operation(summary = "Sửa địa chỉ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã sửa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Địa chỉ không tồn tại hoặc của người khác")
    @PutMapping("/dia-chi/{id}")
    public ApiResponse<DiaChiDto> suaDiaChi(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                            @PathVariable Long id, @Valid @RequestBody LuuDiaChiRequest yeuCau) {
        return ApiResponse.ok(khachHangUseCase.suaDiaChi(nguoiDung.id(), id, yeuCau.sangLenh()));
    }

    @Operation(summary = "Xóa địa chỉ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã xóa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Địa chỉ không tồn tại hoặc của người khác")
    @DeleteMapping("/dia-chi/{id}")
    public ApiResponse<Void> xoaDiaChi(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                       @PathVariable Long id) {
        khachHangUseCase.xoaDiaChi(nguoiDung.id(), id);
        return ApiResponse.ok("Đã xóa địa chỉ", null);
    }
}
