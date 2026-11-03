package com.guppyshop.ordering.presentation;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.response.ApiResponse;
import com.guppyshop.common.response.PageResponse;
import com.guppyshop.ordering.application.dto.DonHangDtos.DonHangDto;
import com.guppyshop.ordering.application.usecase.QuanLyDonHangUseCase;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import com.guppyshop.ordering.presentation.request.DonHangRequests.ChuyenTrangThaiRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Nhân viên - Đơn hàng", description = "Xem và xử lý đơn hàng")
@RestController
@RequestMapping("/api/nv/don-hang")
public class NhanVienDonHangController {

    private final QuanLyDonHangUseCase quanLyDonHang;

    public NhanVienDonHangController(QuanLyDonHangUseCase quanLyDonHang) {
        this.quanLyDonHang = quanLyDonHang;
    }

    @Operation(summary = "Danh sách đơn, mới nhất trước", description = "Bỏ trống trangThai để lấy tất cả; tuKhoa tìm theo mã đơn, SĐT hoặc tên người nhận")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không phải nhân viên")
    @GetMapping
    public ApiResponse<PageResponse<DonHangDto>> danhSach(@RequestParam(required = false) TrangThaiDon trangThai,
                                                          @RequestParam(required = false) String tuKhoa,
                                                          @RequestParam(defaultValue = "0") int trang,
                                                          @RequestParam(defaultValue = "50") int kichThuoc) {
        return ApiResponse.ok(PageResponse.tu(quanLyDonHang.danhSachChoNhanVien(trangThai, tuKhoa, new PhanTrang(trang, kichThuoc))));
    }

    @Operation(summary = "Chuyển trạng thái đơn", description = "Hủy được ở CHO_XAC_NHAN, DA_XAC_NHAN, DANG_GIAO; hủy sẽ trả tồn và hoàn tiền nếu đã thu")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đã chuyển")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Đơn không tồn tại")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Không được chuyển sang trạng thái này")
    @PutMapping("/{id}/trang-thai")
    public ApiResponse<DonHangDto> chuyenTrangThai(@PathVariable Long id, @Valid @RequestBody ChuyenTrangThaiRequest yeuCau) {
        return ApiResponse.ok(quanLyDonHang.nhanVienChuyenTrangThai(id, yeuCau.sangLenh()));
    }
}
