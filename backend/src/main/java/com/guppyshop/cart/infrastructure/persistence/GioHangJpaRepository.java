package com.guppyshop.cart.infrastructure.persistence;

import com.guppyshop.cart.domain.model.GioHang;
import com.guppyshop.cart.domain.repository.GioHangRepository;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface GioHangJpaRepository extends JpaRepository<GioHang, Long>, GioHangRepository {

    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select g from GioHang g where g.sessionId = :sessionId")
    Optional<GioHang> khoaTheoSessionId(@Param("sessionId") String sessionId);

    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select g from GioHang g where g.khachHangId = :khachHangId")
    Optional<GioHang> khoaTheoKhachHangId(@Param("khachHangId") Long khachHangId);
}
