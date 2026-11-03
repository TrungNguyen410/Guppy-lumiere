package com.guppyshop.inventory.infrastructure.persistence;

import com.guppyshop.inventory.domain.model.LoCa;
import jakarta.persistence.LockModeType;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface LoCaJpaRepository extends JpaRepository<LoCa, Long> {

    boolean existsByMaLo(String maLo);

    List<LoCa> findAllByOrderByNgayNoDescIdDesc();

    @Query("""
            select l from LoCa l
            where lower(l.maLo) like :mau escape '\\' or lower(l.beNuoi) like :mau escape '\\'
            order by l.ngayNo desc, l.id desc
            """)
    List<LoCa> timTheoMau(@Param("mau") String mau);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select l from LoCa l where l.caGuppyId = :caGuppyId order by l.ngayNo asc, l.id asc")
    List<LoCa> khoaTheoSanPham(@Param("caGuppyId") Long caGuppyId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select l from LoCa l where l.id in :ids order by l.id asc")
    List<LoCa> khoaTheoCacId(@Param("ids") Collection<Long> ids);
}
