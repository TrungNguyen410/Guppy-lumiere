package com.guppyshop.review.infrastructure.persistence;

import com.guppyshop.review.domain.model.YeuCauBaoHanh;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

interface YeuCauBaoHanhJpaRepository extends JpaRepository<YeuCauBaoHanh, Long> {

    boolean existsByDonHangId(Long donHangId);

    Page<YeuCauBaoHanh> findByXuLyLucIsNull(Pageable pageable);

    Page<YeuCauBaoHanh> findByKhachHangId(Long khachHangId, Pageable pageable);
}
