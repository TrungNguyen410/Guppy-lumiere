package com.guppyshop.report.presentation;

import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.report.application.dto.ThongKeDto;
import com.guppyshop.report.application.usecase.ThongKeUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin - Thống kê", description = "Số liệu trang Tổng quan")
@RestController
@RequestMapping("/api/admin/thong-ke")
public class ThongKeController {

    private final ThongKeUseCase thongKeUseCase;

    public ThongKeController(ThongKeUseCase thongKeUseCase) {
        this.thongKeUseCase = thongKeUseCase;
    }

    @Operation(summary = "Số liệu tổng quan cửa hàng", description = "Doanh thu tính theo ngày đơn hoàn tất lần đầu")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không phải admin")
    @GetMapping
    public ApiResponse<ThongKeDto> tongQuan() {
        return ApiResponse.ok(thongKeUseCase.layTongQuan());
    }
}
