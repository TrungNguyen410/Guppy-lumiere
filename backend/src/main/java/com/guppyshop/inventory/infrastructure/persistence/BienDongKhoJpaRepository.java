package com.guppyshop.inventory.infrastructure.persistence;

import com.guppyshop.inventory.domain.model.BienDongKho;
import com.guppyshop.inventory.domain.model.LoaiBienDong;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface BienDongKhoJpaRepository extends JpaRepository<BienDongKho, Long> {

    Page<BienDongKho> findByLoCaId(Long loCaId, Pageable pageable);

    List<BienDongKho> findByDonHangIdAndLoai(Long donHangId, LoaiBienDong loai);

    boolean existsByLoCaIdAndLoaiIn(Long loCaId, Collection<LoaiBienDong> cacLoai);

    @Modifying(flushAutomatically = true)
    @Query("delete from BienDongKho b where b.loCaId = :loCaId")
    void xoaTheoLo(@Param("loCaId") Long loCaId);
}
