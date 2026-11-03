package com.guppyshop.catalog.presentation;

import com.guppyshop.catalog.application.dto.SanPhamDtos.DongCaDto;
import com.guppyshop.catalog.application.usecase.QuanLyDongCaUseCase;
import com.guppyshop.catalog.presentation.request.LuuDongCaRequest;
import com.guppyshop.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
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

@Tag(name = "Admin - Dòng cá", description = "Admin quản lý dòng cá")
@RestController
@RequestMapping("/api/admin/dong-ca")
public class AdminDongCaController {

    private final QuanLyDongCaUseCase quanLyDongCa;

    public AdminDongCaController(QuanLyDongCaUseCase quanLyDongCa) {
        this.quanLyDongCa = quanLyDongCa;
    }

    @Operation(summary = "Danh sách dòng cá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không phải admin")
    @GetMapping
    public ApiResponse<List<DongCaDto>> danhSach() {
        return ApiResponse.ok(quanLyDongCa.layTatCa());
    }

    @Operation(summary = "Xem một dòng cá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @GetMapping("/{id}")
    public ApiResponse<DongCaDto> chiTiet(@PathVariable Long id) {
        return ApiResponse.ok(quanLyDongCa.layTheoId(id));
    }

    @Operation(summary = "Thêm dòng cá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đã thêm")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Mã đã tồn tại")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<DongCaDto> tao(@Valid @RequestBody LuuDongCaRequest yeuCau) {
        return ApiResponse.ok(quanLyDongCa.tao(yeuCau.sangLenh()));
    }

    @Operation(summary = "Sửa dòng cá", description = "Mã dòng được giữ nguyên")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã sửa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @PutMapping("/{id}")
    public ApiResponse<DongCaDto> sua(@PathVariable Long id, @Valid @RequestBody LuuDongCaRequest yeuCau) {
        return ApiResponse.ok(quanLyDongCa.capNhat(id, yeuCau.sangLenh()));
    }

    @Operation(summary = "Xóa dòng cá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã xóa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Dòng cá đang có sản phẩm")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> xoa(@PathVariable Long id) {
        quanLyDongCa.xoa(id);
        return ApiResponse.ok("Đã xóa dòng cá", null);
    }
}
