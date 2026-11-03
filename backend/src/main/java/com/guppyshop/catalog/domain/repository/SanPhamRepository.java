package com.guppyshop.catalog.domain.repository;

import com.guppyshop.catalog.domain.model.BoLocSanPham;
import com.guppyshop.catalog.domain.model.SanPham;
import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface SanPhamRepository {

    Trang<SanPham> timKiem(BoLocSanPham boLoc, PhanTrang phanTrang);

    Optional<SanPham> timTheoId(Long id);

    Optional<SanPham> timTheoSlug(String slug);

    boolean tonTaiSlug(String slug);

    List<SanPham> timTheoCacId(Collection<Long> ids);

    SanPham luu(SanPham sanPham);

    /** Trừ tồn phụ kiện nguyên tử; trả về false khi không đủ hàng. */
    boolean giamTonPhuKien(Long id, int soLuong);

    void tangTonPhuKien(Long id, int soLuong);

    /** Cộng số đã bán nguyên tử khi đơn hoàn tất. */
    void tangDaBan(Long id, int soLuong);

    /** Cộng một đánh giá vào điểm trung bình, nguyên tử để hai đánh giá đồng thời không ghi đè nhau. */
    void ghiNhanDanhGia(Long id, int soSao);
}
