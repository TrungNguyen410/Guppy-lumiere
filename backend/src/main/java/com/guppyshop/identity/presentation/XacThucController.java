package com.guppyshop.identity.presentation;

import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.identity.application.dto.XacThucDtos.PhienDangNhapDto;
import com.guppyshop.identity.application.usecase.XacThucUseCase;
import com.guppyshop.identity.presentation.request.XacThucRequests.DangKyRequest;
import com.guppyshop.identity.presentation.request.XacThucRequests.DangNhapRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Xác thực", description = "Đăng ký và đăng nhập")
@SecurityRequirements
@RestController
@RequestMapping("/api/auth")
public class XacThucController {

    private final XacThucUseCase xacThucUseCase;

    public XacThucController(XacThucUseCase xacThucUseCase) {
        this.xacThucUseCase = xacThucUseCase;
    }

    @Operation(summary = "Đăng ký tài khoản khách hàng")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đăng ký thành công, trả về JWT")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Email hoặc số điện thoại đã được dùng")
    @PostMapping("/dang-ky")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PhienDangNhapDto> dangKy(@Valid @RequestBody DangKyRequest yeuCau) {
        return ApiResponse.ok("Đăng ký thành công", xacThucUseCase.dangKy(yeuCau.sangLenh()));
    }

    @Operation(summary = "Đăng nhập bằng email hoặc số điện thoại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đăng nhập thành công, trả về JWT")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Sai thông tin hoặc tài khoản bị khóa")
    @PostMapping("/dang-nhap")
    public ApiResponse<PhienDangNhapDto> dangNhap(@Valid @RequestBody DangNhapRequest yeuCau) {
        return ApiResponse.ok("Đăng nhập thành công", xacThucUseCase.dangNhap(yeuCau.sangLenh()));
    }
}
