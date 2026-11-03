package com.guppyshop.review.domain.repository;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.review.domain.model.YeuCauBaoHanh;
import java.util.Optional;

public interface YeuCauBaoHanhRepository {

    boolean daCoYeuCau(Long donHangId);

    YeuCauBaoHanh luu(YeuCauBaoHanh yeuCau);

    Optional<YeuCauBaoHanh> timTheoId(Long id);

    /** chuaXuLy là true thì chỉ lấy yêu cầu đang chờ. */
    Trang<YeuCauBaoHanh> timChoNhanVien(boolean chuaXuLy, PhanTrang phanTrang);

    Trang<YeuCauBaoHanh> timTheoKhachHang(Long khachHangId, PhanTrang phanTrang);
}
