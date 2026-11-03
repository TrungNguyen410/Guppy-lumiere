package com.guppyshop.catalog.presentation;

import com.guppyshop.catalog.application.dto.SanPhamDtos.DongCaDto;
import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamChiTietDto;
import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamTomTatDto;
import com.guppyshop.catalog.application.usecase.QuanLyDongCaUseCase;
import com.guppyshop.catalog.application.usecase.TraCuuSanPhamUseCase;
import com.guppyshop.catalog.presentation.request.BoLocSanPhamRequest;
import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.common.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Danh mục", description = "Khách xem sản phẩm và dòng cá, không cần đăng nhập")
@SecurityRequirements
@RestController
@RequestMapping("/api")
public class SanPhamController {

    private final TraCuuSanPhamUseCase traCuuSanPham;
    private final QuanLyDongCaUseCase quanLyDongCa;

    public SanPhamController(TraCuuSanPhamUseCase traCuuSanPham, QuanLyDongCaUseCase quanLyDongCa) {
        this.traCuuSanPham = traCuuSanPham;
        this.quanLyDongCa = quanLyDongCa;
    }

    @Operation(summary = "Tìm và lọc sản phẩm đang bán")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Tham số lọc không hợp lệ")
    @GetMapping("/san-pham")
    public ApiResponse<PageResponse<SanPhamTomTatDto>> timKiem(@ParameterObject BoLocSanPhamRequest boLoc) {
        return ApiResponse.ok(PageResponse.tu(traCuuSanPham.timKiem(boLoc.sangBoLoc(true), boLoc.sangPhanTrang())));
    }

    @Operation(summary = "Xem chi tiết sản phẩm theo id")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại hoặc đã ngừng bán")
    @GetMapping("/san-pham/{id}")
    public ApiResponse<SanPhamChiTietDto> theoId(@PathVariable Long id) {
        return ApiResponse.ok(traCuuSanPham.layTheoId(id));
    }

    @Operation(summary = "Xem chi tiết sản phẩm theo slug trên URL")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại hoặc đã ngừng bán")
    @GetMapping("/san-pham/slug/{slug}")
    public ApiResponse<SanPhamChiTietDto> theoSlug(@PathVariable String slug) {
        return ApiResponse.ok(traCuuSanPham.layTheoSlug(slug));
    }

    @Operation(summary = "Danh sách dòng cá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @GetMapping("/dong-ca")
    public ApiResponse<List<DongCaDto>> dongCa() {
        return ApiResponse.ok(quanLyDongCa.layTatCa());
    }
}
