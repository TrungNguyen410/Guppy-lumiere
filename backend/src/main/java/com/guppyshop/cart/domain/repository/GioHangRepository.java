package com.guppyshop.cart.domain.repository;

import com.guppyshop.cart.domain.model.GioHang;
import java.util.Optional;

public interface GioHangRepository {

    Optional<GioHang> findBySessionId(String sessionId);

    Optional<GioHang> findByKhachHangId(Long khachHangId);

    /** Khóa giỏ khi đặt hàng: bấm đặt hàng hai lần cũng chỉ tạo một đơn. */
    Optional<GioHang> khoaTheoSessionId(String sessionId);

    Optional<GioHang> khoaTheoKhachHangId(Long khachHangId);

    <S extends GioHang> S save(S gioHang);

    void delete(GioHang gioHang);

    /** Ghi xuống CSDL ngay để dòng mới có id trả về cho client. */
    void flush();
}
