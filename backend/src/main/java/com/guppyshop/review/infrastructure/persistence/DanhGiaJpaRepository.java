package com.guppyshop.review.infrastructure.persistence;

import com.guppyshop.review.domain.model.DanhGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

interface DanhGiaJpaRepository extends JpaRepository<DanhGia, Long> {

    boolean existsByKhachHangIdAndSanPhamIdAndDonHangId(Long khachHangId, Long sanPhamId, Long donHangId);

    Page<DanhGia> findBySanPhamId(Long sanPhamId, Pageable pageable);
}
