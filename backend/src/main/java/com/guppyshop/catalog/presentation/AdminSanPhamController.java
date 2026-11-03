package com.guppyshop.catalog.presentation;

import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamChiTietDto;
import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamTomTatDto;
import com.guppyshop.catalog.application.usecase.QuanLySanPhamUseCase;
import com.guppyshop.catalog.application.usecase.TraCuuSanPhamUseCase;
import com.guppyshop.catalog.presentation.request.BoLocSanPhamRequest;
import com.guppyshop.catalog.presentation.request.LuuSanPhamRequest;
import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.common.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin - Sản phẩm", description = "Admin quản lý cá và phụ kiện")
@RestController
@RequestMapping("/api/admin/san-pham")
public class AdminSanPhamController {

    private final QuanLySanPhamUseCase quanLySanPham;
    private final TraCuuSanPhamUseCase traCuuSanPham;

    public AdminSanPhamController(QuanLySanPhamUseCase quanLySanPham, TraCuuSanPhamUseCase traCuuSanPham) {
        this.quanLySanPham = quanLySanPham;
        this.traCuuSanPham = traCuuSanPham;
    }

    @Operation(summary = "Danh sách sản phẩm, gồm cả sản phẩm đã ngừng bán")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không phải admin")
    @GetMapping
    public ApiResponse<PageResponse<SanPhamTomTatDto>> danhSach(@ParameterObject BoLocSanPhamRequest boLoc) {
        return ApiResponse.ok(PageResponse.tu(traCuuSanPham.timKiem(boLoc.sangBoLoc(false), boLoc.sangPhanTrang())));
    }

    @Operation(summary = "Xem chi tiết sản phẩm, gồm cả sản phẩm đã ngừng bán")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @GetMapping("/{id}")
    public ApiResponse<SanPhamChiTietDto> chiTiet(@PathVariable Long id) {
        return ApiResponse.ok(quanLySanPham.layTheoId(id));
    }

    @Operation(summary = "Thêm sản phẩm", description = "Trường loai là CA_GUPPY hoặc PHU_KIEN quyết định các trường còn lại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đã thêm")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Sai quy tắc, ví dụ nhiệt độ ngoài 22–28°C")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SanPhamChiTietDto> tao(@Valid @RequestBody LuuSanPhamRequest yeuCau) {
        return ApiResponse.ok(quanLySanPham.tao(yeuCau.sangLenh()));
    }

    @Operation(summary = "Sửa sản phẩm", description = "Không đổi được loại và slug của sản phẩm đã có")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã sửa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Sai quy tắc nghiệp vụ")
    @PutMapping("/{id}")
    public ApiResponse<SanPhamChiTietDto> sua(@PathVariable Long id, @Valid @RequestBody LuuSanPhamRequest yeuCau) {
        return ApiResponse.ok(quanLySanPham.capNhat(id, yeuCau.sangLenh()));
    }

    @Operation(summary = "Ngừng bán sản phẩm", description = "Không xóa khỏi CSDL vì đơn cũ và lô cá vẫn tham chiếu đến sản phẩm")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã ngừng bán")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> xoa(@PathVariable Long id) {
        quanLySanPham.ngungBan(id);
        return ApiResponse.ok("Đã ngừng bán sản phẩm", null);
    }

    @Operation(summary = "Mở bán lại sản phẩm")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã mở bán")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @PutMapping("/{id}/mo-ban")
    public ApiResponse<SanPhamChiTietDto> moBan(@PathVariable Long id) {
        return ApiResponse.ok(quanLySanPham.moBanLai(id));
    }
}
