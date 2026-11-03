package com.guppyshop.promotion.presentation;

import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.promotion.application.dto.MaGiamGiaDtos.KetQuaApMaDto;
import com.guppyshop.promotion.application.dto.MaGiamGiaDtos.MaGiamGiaDto;
import com.guppyshop.promotion.application.usecase.QuanLyMaGiamGiaUseCase;
import com.guppyshop.promotion.presentation.request.LuuMaGiamGiaRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Mã giảm giá", description = "Khách kiểm tra mã; admin quản lý mã")
@RestController
@RequestMapping("/api")
@Validated
public class MaGiamGiaController {

    private final QuanLyMaGiamGiaUseCase maGiamGia;

    public MaGiamGiaController(QuanLyMaGiamGiaUseCase maGiamGia) {
        this.maGiamGia = maGiamGia;
    }

    @Operation(summary = "Kiểm tra mã và xem số tiền được giảm", description = "Chưa tính là đã dùng; khi đặt hàng mã được kiểm tra lại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Mã dùng được")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Mã không tồn tại, hết hạn hoặc hết lượt")
    @SecurityRequirements
    @GetMapping("/ma-giam-gia/kiem-tra")
    public ApiResponse<KetQuaApMaDto> kiemTra(@RequestParam String ma, @RequestParam @DecimalMin("0") BigDecimal tamTinh) {
        return ApiResponse.ok(maGiamGia.xemTruoc(ma, tamTinh));
    }

    @Operation(summary = "Danh sách mã giảm giá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không phải admin")
    @GetMapping("/admin/ma-giam-gia")
    public ApiResponse<List<MaGiamGiaDto>> danhSach() {
        return ApiResponse.ok(maGiamGia.layTatCa());
    }

    @Operation(summary = "Xem một mã giảm giá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @GetMapping("/admin/ma-giam-gia/{id}")
    public ApiResponse<MaGiamGiaDto> chiTiet(@PathVariable Long id) {
        return ApiResponse.ok(maGiamGia.layTheoId(id));
    }

    @Operation(summary = "Thêm mã giảm giá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đã thêm")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Trùng mã hoặc sai ngày")
    @PostMapping("/admin/ma-giam-gia")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MaGiamGiaDto> tao(@Valid @RequestBody LuuMaGiamGiaRequest yeuCau) {
        return ApiResponse.ok(maGiamGia.tao(yeuCau.sangLenh()));
    }

    @Operation(summary = "Sửa mã giảm giá", description = "Chuỗi mã được giữ nguyên")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã sửa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @PutMapping("/admin/ma-giam-gia/{id}")
    public ApiResponse<MaGiamGiaDto> sua(@PathVariable Long id, @Valid @RequestBody LuuMaGiamGiaRequest yeuCau) {
        return ApiResponse.ok(maGiamGia.capNhat(id, yeuCau.sangLenh()));
    }

    @Operation(summary = "Xóa mã giảm giá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã xóa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Mã đã được dùng trong đơn")
    @DeleteMapping("/admin/ma-giam-gia/{id}")
    public ApiResponse<Void> xoa(@PathVariable Long id) {
        maGiamGia.xoa(id);
        return ApiResponse.ok("Đã xóa mã giảm giá", null);
    }
}
