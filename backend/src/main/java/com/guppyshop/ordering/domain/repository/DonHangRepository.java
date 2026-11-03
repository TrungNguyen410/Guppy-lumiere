package com.guppyshop.ordering.domain.repository;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.ordering.domain.model.DonHang;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface DonHangRepository {

    DonHang luu(DonHang donHang);

    boolean tonTaiMaDon(String maDon);

    Optional<DonHang> timTheoMaDon(String maDon);

    /** Khóa dòng đơn: hai yêu cầu hủy đồng thời không thể cùng trả tồn. */
    Optional<DonHang> khoaTheoMaDon(String maDon);

    Optional<DonHang> khoaTheoId(Long id);

    List<DonHang> timTheoCacId(Collection<Long> ids);

    /** Lọc theo trạng thái và từ khóa (mã đơn, SĐT, tên người nhận); tham số null là bỏ qua điều kiện đó. */
    Trang<DonHang> timChoNhanVien(TrangThaiDon trangThai, String tuKhoa, PhanTrang phanTrang);

    Trang<DonHang> timTheoKhachHang(Long khachHangId, PhanTrang phanTrang);
}
