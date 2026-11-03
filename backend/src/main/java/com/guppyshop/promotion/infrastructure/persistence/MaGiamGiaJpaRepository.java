package com.guppyshop.promotion.infrastructure.persistence;

import com.guppyshop.promotion.domain.model.MaGiamGia;
import com.guppyshop.promotion.domain.repository.MaGiamGiaRepository;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface MaGiamGiaJpaRepository extends JpaRepository<MaGiamGia, Long>, MaGiamGiaRepository {

    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from MaGiamGia m where m.ma = :ma")
    Optional<MaGiamGia> khoaTheoMa(@Param("ma") String ma);

    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from MaGiamGia m where m.id = :id")
    Optional<MaGiamGia> khoaTheoId(@Param("id") Long id);
}
