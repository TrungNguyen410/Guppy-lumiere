package com.guppyshop.common.response;

import com.guppyshop.common.domain.Trang;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/** Kết quả phân trang trả về cho client. */
@Schema(description = "Kết quả phân trang")
public record PageResponse<T>(
        @Schema(description = "Danh sách phần tử của trang") List<T> noiDung,
        @Schema(description = "Số trang, bắt đầu từ 0") int trang,
        @Schema(description = "Số phần tử mỗi trang") int kichThuoc,
        @Schema(description = "Tổng số phần tử") long tongPhanTu,
        @Schema(description = "Tổng số trang") int tongTrang) {

    public static <T> PageResponse<T> tu(Trang<T> ketQua) {
        return new PageResponse<>(ketQua.noiDung(), ketQua.trang(), ketQua.kichThuoc(),
                ketQua.tongPhanTu(), ketQua.tongTrang());
    }
}
