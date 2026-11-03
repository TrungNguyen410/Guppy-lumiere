package com.guppyshop.payment.presentation;

import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.payment.application.dto.ThanhToanDto;
import com.guppyshop.payment.application.usecase.ThanhToanUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Nhân viên - Thanh toán", description = "Xác nhận tiền chuyển khoản; cổng thanh toán của đồ án là giả lập")
@RestController
@RequestMapping("/api/nv/don-hang")
public class ThanhToanController {

    private final ThanhToanUseCase thanhToanUseCase;

    public ThanhToanController(ThanhToanUseCase thanhToanUseCase) {
        this.thanhToanUseCase = thanhToanUseCase;
    }

    @Operation(summary = "Xác nhận đã nhận tiền chuyển khoản")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã xác nhận")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không có đơn này")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Đơn COD hoặc đã thanh toán rồi")
    @PutMapping("/{id}/thanh-toan")
    public ApiResponse<ThanhToanDto> xacNhan(@PathVariable Long id) {
        return ApiResponse.ok(thanhToanUseCase.xacNhanDaNhanTien(id));
    }
}
