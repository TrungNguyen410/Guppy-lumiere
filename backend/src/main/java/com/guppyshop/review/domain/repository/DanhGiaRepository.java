package com.guppyshop.review.domain.repository;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.review.domain.model.DanhGia;

public interface DanhGiaRepository {

    boolean daDanhGia(Long khachHangId, Long sanPhamId, Long donHangId);

    DanhGia luu(DanhGia danhGia);

    Trang<DanhGia> timTheoSanPham(Long sanPhamId, PhanTrang phanTrang);
}
