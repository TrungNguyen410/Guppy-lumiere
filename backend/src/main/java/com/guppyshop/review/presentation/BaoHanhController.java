package com.guppyshop.review.presentation;

import com.guppyshop.common.config.NguoiDungXacThuc;
import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.common.response.PageResponse;
import com.guppyshop.review.application.dto.ReviewDtos.BaoHanhDto;
import com.guppyshop.review.application.usecase.BaoHanhUseCase;
import com.guppyshop.review.presentation.request.ReviewRequests.TaoBaoHanhRequest;
import com.guppyshop.review.presentation.request.ReviewRequests.XuLyBaoHanhRequest;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Bảo hành", description = "Bảo hành cá chết trong 24h, chỉ dành cho khách có tài khoản")
@RestController
@RequestMapping("/api")
public class BaoHanhController {

    private final BaoHanhUseCase baoHanhUseCase;

    public BaoHanhController(BaoHanhUseCase baoHanhUseCase) {
        this.baoHanhUseCase = baoHanhUseCase;
    }

    @Operation(summary = "Gửi yêu cầu bảo hành", description = "Đơn phải của bạn, đã hoàn tất, còn trong 24h và chưa từng yêu cầu")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đã gửi, đơn chuyển sang BAO_HANH")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không phải đơn của bạn")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Quá 24h, đơn chưa hoàn tất hoặc đã yêu cầu rồi")
    @PostMapping("/bao-hanh")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<BaoHanhDto> taoYeuCau(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                             @Valid @RequestBody TaoBaoHanhRequest yeuCau) {
        return ApiResponse.ok("Đã gửi yêu cầu bảo hành", baoHanhUseCase.taoYeuCau(nguoiDung.id(), yeuCau.sangLenh()));
    }

    @Operation(summary = "Yêu cầu bảo hành của tôi")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    @GetMapping("/khach-hang/bao-hanh")
    public ApiResponse<PageResponse<BaoHanhDto>> cuaToi(@Parameter(hidden = true) @AuthenticationPrincipal NguoiDungXacThuc nguoiDung,
                                                        @RequestParam(defaultValue = "0") int trang,
                                                        @RequestParam(defaultValue = "10") int kichThuoc) {
        return ApiResponse.ok(PageResponse.tu(baoHanhUseCase.cuaKhach(nguoiDung.id(), new PhanTrang(trang, kichThuoc))));
    }

    @Operation(summary = "Danh sách yêu cầu bảo hành", description = "chuaXuLy=true chỉ lấy yêu cầu đang chờ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không phải nhân viên")
    @GetMapping("/nv/bao-hanh")
    public ApiResponse<PageResponse<BaoHanhDto>> danhSach(@RequestParam(defaultValue = "false") boolean chuaXuLy,
                                                          @RequestParam(defaultValue = "0") int trang,
                                                          @RequestParam(defaultValue = "20") int kichThuoc) {
        return ApiResponse.ok(PageResponse.tu(baoHanhUseCase.danhSachChoNhanVien(chuaXuLy, new PhanTrang(trang, kichThuoc))));
    }

    @Operation(summary = "Xử lý xong yêu cầu bảo hành", description = "Đơn quay về HOAN_TAT, kết quả được ghi vào lịch sử đơn")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã xử lý")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Yêu cầu đã được xử lý")
    @PutMapping("/nv/bao-hanh/{id}/xu-ly")
    public ApiResponse<BaoHanhDto> xuLy(@PathVariable Long id, @Valid @RequestBody XuLyBaoHanhRequest yeuCau) {
        return ApiResponse.ok(baoHanhUseCase.xuLy(id, yeuCau.ketQua()));
    }
}
