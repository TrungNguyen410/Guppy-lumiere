package com.guppyshop.review.presentation;

import com.guppyshop.common.config.NguoiDungXacThuc;
import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.common.response.PageResponse;
import com.guppyshop.review.application.dto.ReviewDtos.DanhGiaDto;
import com.guppyshop.review.application.usecase.DanhGiaUseCase;
import com.guppyshop.review.presentation.request.ReviewRequests.TaoDanhGiaRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Đánh giá", description = "Khách đã mua đánh giá sản phẩm; ai cũng xem được")
@RestController
@RequestMapping("/api")
public class DanhGiaController {

    private final DanhGiaUseCase danhGiaUseCase;

    public DanhGiaController(DanhGiaUseCase danhGiaUseCase) {
        this.danhGiaUseCase = danhGiaUseCase;
    }

    @Operation(summary = "Đánh giá sản phẩm trong đơn đã hoàn tất")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đã đánh giá, điểm trung bình được cập nhật")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không phải đơn của bạn")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Đơn chưa hoàn tất, không có sản phẩm này hoặc đã đánh giá")
    @PostMapping("/danh-gia")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<DanhGiaDto> danhGia(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                           @Valid @RequestBody TaoDanhGiaRequest yeuCau) {
        return ApiResponse.ok("Cảm ơn bạn đã đánh giá", danhGiaUseCase.danhGia(nguoiDung.id(), yeuCau.sangLenh()));
    }

    @Operation(summary = "Xem đánh giá của sản phẩm, mới nhất trước")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @SecurityRequirements
    @GetMapping("/san-pham/{id}/danh-gia")
    public ApiResponse<PageResponse<DanhGiaDto>> theoSanPham(@PathVariable Long id,
                                                             @RequestParam(defaultValue = "0") int trang,
                                                             @RequestParam(defaultValue = "10") int kichThuoc) {
        return ApiResponse.ok(PageResponse.tu(danhGiaUseCase.theoSanPham(id, new PhanTrang(trang, kichThuoc))));
    }
}
