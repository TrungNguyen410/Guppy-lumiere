package com.guppyshop.identity.presentation;

import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.identity.application.dto.NhanVienDtos.NhanVienDto;
import com.guppyshop.identity.application.usecase.QuanLyNhanVienUseCase;
import com.guppyshop.identity.presentation.request.NhanVienRequests.SuaNhanVienRequest;
import com.guppyshop.identity.presentation.request.NhanVienRequests.TaoNhanVienRequest;
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

@Tag(name = "Admin - Nhân viên", description = "Admin quản lý tài khoản nhân viên")
@RestController
@RequestMapping("/api/admin/nhan-vien")
public class NhanVienController {

    private final QuanLyNhanVienUseCase quanLyNhanVien;

    public NhanVienController(QuanLyNhanVienUseCase quanLyNhanVien) {
        this.quanLyNhanVien = quanLyNhanVien;
    }

    @Operation(summary = "Danh sách nhân viên")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không phải admin")
    @GetMapping
    public ApiResponse<List<NhanVienDto>> danhSach() {
        return ApiResponse.ok(quanLyNhanVien.layTatCa());
    }

    @Operation(summary = "Xem một nhân viên")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @GetMapping("/{id}")
    public ApiResponse<NhanVienDto> chiTiet(@PathVariable Long id) {
        return ApiResponse.ok(quanLyNhanVien.layTheoId(id));
    }

    @Operation(summary = "Tạo nhân viên")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đã tạo")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Email hoặc số điện thoại đã được dùng")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<NhanVienDto> tao(@Valid @RequestBody TaoNhanVienRequest yeuCau) {
        return ApiResponse.ok(quanLyNhanVien.tao(yeuCau.sangLenh()));
    }

    @Operation(summary = "Sửa, khóa hoặc đổi mật khẩu nhân viên")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã sửa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @PutMapping("/{id}")
    public ApiResponse<NhanVienDto> sua(@PathVariable Long id, @Valid @RequestBody SuaNhanVienRequest yeuCau) {
        return ApiResponse.ok(quanLyNhanVien.capNhat(id, yeuCau.sangLenh()));
    }

    @Operation(summary = "Xóa nhân viên")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã xóa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> xoa(@PathVariable Long id) {
        quanLyNhanVien.xoa(id);
        return ApiResponse.ok("Đã xóa nhân viên", null);
    }
}
