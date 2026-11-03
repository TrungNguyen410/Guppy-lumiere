package com.guppyshop.inventory.presentation;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.common.response.PageResponse;
import com.guppyshop.inventory.application.dto.LoCaDtos.BienDongKhoDto;
import com.guppyshop.inventory.application.dto.LoCaDtos.LoCaDto;
import com.guppyshop.inventory.application.usecase.QuanLyLoCaUseCase;
import com.guppyshop.inventory.presentation.request.LoCaRequests.HaoHutRequest;
import com.guppyshop.inventory.presentation.request.LoCaRequests.NhapDeRequest;
import com.guppyshop.inventory.presentation.request.LoCaRequests.PhanGioiRequest;
import com.guppyshop.inventory.presentation.request.LoCaRequests.SuaLoCaRequest;
import com.guppyshop.inventory.presentation.request.LoCaRequests.TaoLoCaRequest;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Nhân viên - Lô cá", description = "Quản lý lô cá, tồn kho, hao hụt và nhật ký kho")
@RestController
@RequestMapping("/api/nv/lo-ca")
public class LoCaController {

    private final QuanLyLoCaUseCase quanLyLoCa;

    public LoCaController(QuanLyLoCaUseCase quanLyLoCa) {
        this.quanLyLoCa = quanLyLoCa;
    }

    @Operation(summary = "Danh sách lô cá", description = "tuKhoa tìm theo mã lô hoặc bể nuôi")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không phải nhân viên")
    @GetMapping
    public ApiResponse<List<LoCaDto>> danhSach(@RequestParam(required = false) String tuKhoa) {
        return ApiResponse.ok(quanLyLoCa.timKiem(tuKhoa));
    }

    @Operation(summary = "Nhật ký biến động kho, mới nhất trước")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @GetMapping("/bien-dong")
    public ApiResponse<PageResponse<BienDongKhoDto>> nhatKy(@RequestParam(required = false) Long loCaId,
                                                            @RequestParam(defaultValue = "0") int trang,
                                                            @RequestParam(defaultValue = "20") int kichThuoc) {
        return ApiResponse.ok(PageResponse.tu(quanLyLoCa.nhatKy(loCaId, new PhanTrang(trang, kichThuoc))));
    }

    @Operation(summary = "Xem một lô cá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @GetMapping("/{id}")
    public ApiResponse<LoCaDto> chiTiet(@PathVariable Long id) {
        return ApiResponse.ok(quanLyLoCa.layTheoId(id));
    }

    @Operation(summary = "Tạo lô cá")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đã tạo")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Mã lô trùng hoặc sản phẩm không phải cá")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LoCaDto> tao(@Valid @RequestBody TaoLoCaRequest yeuCau) {
        return ApiResponse.ok(quanLyLoCa.tao(yeuCau.sangLenh()));
    }

    @Operation(summary = "Sửa thông tin mô tả của lô", description = "Số lượng thay đổi qua nhập đẻ, phân giới, hao hụt để có nhật ký")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã sửa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @PutMapping("/{id}")
    public ApiResponse<LoCaDto> sua(@PathVariable Long id, @Valid @RequestBody SuaLoCaRequest yeuCau) {
        return ApiResponse.ok(quanLyLoCa.capNhat(id, yeuCau.sangLenh()));
    }

    @Operation(summary = "Xóa lô cá", description = "Không xóa được lô đã có đơn hàng")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã xóa")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Lô đã có đơn hàng")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> xoa(@PathVariable Long id) {
        quanLyLoCa.xoa(id);
        return ApiResponse.ok("Đã xóa lô cá", null);
    }

    @Operation(summary = "Ghi nhận hao hụt")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã ghi nhận")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Số cá chết vượt số đang có")
    @PutMapping("/{id}/hao-hut")
    public ApiResponse<LoCaDto> haoHut(@PathVariable Long id, @Valid @RequestBody HaoHutRequest yeuCau) {
        return ApiResponse.ok(quanLyLoCa.ghiHaoHut(id, yeuCau.sangLenh()));
    }

    @Operation(summary = "Nhập cá bột mới đẻ")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã nhập")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tồn tại")
    @PostMapping("/{id}/nhap-de")
    public ApiResponse<LoCaDto> nhapDe(@PathVariable Long id, @Valid @RequestBody NhapDeRequest yeuCau) {
        return ApiResponse.ok(quanLyLoCa.nhapDe(id, yeuCau.sangLenh()));
    }

    @Operation(summary = "Phân cá bột thành đực và cái")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã phân giới")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Vượt số cá bột đang có")
    @PostMapping("/{id}/phan-gioi")
    public ApiResponse<LoCaDto> phanGioi(@PathVariable Long id, @Valid @RequestBody PhanGioiRequest yeuCau) {
        return ApiResponse.ok(quanLyLoCa.phanGioi(id, yeuCau.sangLenh()));
    }
}
