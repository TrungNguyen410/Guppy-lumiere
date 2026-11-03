package com.guppyshop.identity.infrastructure.persistence;

import com.guppyshop.identity.domain.model.NguoiDung;
import com.guppyshop.identity.domain.model.NhanVien;
import com.guppyshop.identity.domain.repository.NguoiDungRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** Spring Data tự hiện thực các phương thức của interface domain. */
interface NguoiDungJpaRepository extends JpaRepository<NguoiDung, Long>, NguoiDungRepository {

    @Override
    @Query("select n from NhanVien n order by n.id")
    List<NhanVien> timTatCaNhanVien();

    @Override
    @Query("select n from NhanVien n where n.id = :id")
    Optional<NhanVien> timNhanVienTheoId(@Param("id") Long id);
}
