package com.guppyshop.ordering.infrastructure.persistence;

import com.guppyshop.ordering.domain.model.DonHang;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface DonHangJpaRepository extends JpaRepository<DonHang, Long> {

    boolean existsByMaDon(String maDon);

    Optional<DonHang> findByMaDon(String maDon);

    Page<DonHang> findByKhachHangId(Long khachHangId, Pageable pageable);

    @Query("""
            select d from DonHang d
            where (:trangThai is null or d.trangThai = :trangThai)
              and (:mau is null
                   or lower(d.maDon) like :mau escape '\\'
                   or d.nguoiNhan.soDienThoai like :mau escape '\\'
                   or lower(d.nguoiNhan.hoTen) like :mau escape '\\')
            """)
    Page<DonHang> timChoNhanVien(@Param("trangThai") TrangThaiDon trangThai, @Param("mau") String mau, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from DonHang d where d.maDon = :maDon")
    Optional<DonHang> khoaTheoMaDon(@Param("maDon") String maDon);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from DonHang d where d.id = :id")
    Optional<DonHang> khoaTheoId(@Param("id") Long id);
}
