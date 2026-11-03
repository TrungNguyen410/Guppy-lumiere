package com.guppyshop.common.response;

import io.swagger.v3.oas.annotations.media.Schema;

/** Định dạng phản hồi chung của mọi API. */
@Schema(description = "Phản hồi chung của API")
public record ApiResponse<T>(
        @Schema(description = "Yêu cầu có thành công hay không") boolean thanhCong,
        @Schema(description = "Thông báo cho người dùng") String thongBao,
        @Schema(description = "Dữ liệu trả về") T duLieu) {

    public static <T> ApiResponse<T> ok(T duLieu) {
        return new ApiResponse<>(true, "Thành công", duLieu);
    }

    public static <T> ApiResponse<T> ok(String thongBao, T duLieu) {
        return new ApiResponse<>(true, thongBao, duLieu);
    }

    public static <T> ApiResponse<T> loi(String thongBao) {
        return new ApiResponse<>(false, thongBao, null);
    }

    public static <T> ApiResponse<T> loi(String thongBao, T chiTiet) {
        return new ApiResponse<>(false, thongBao, chiTiet);
    }
}
