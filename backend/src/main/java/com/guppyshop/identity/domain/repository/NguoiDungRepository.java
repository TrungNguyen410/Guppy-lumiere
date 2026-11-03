package com.guppyshop.identity.domain.repository;

import com.guppyshop.identity.domain.model.NguoiDung;
import com.guppyshop.identity.domain.model.NhanVien;
import java.util.List;
import java.util.Optional;

/** REPOSITORY: domain chỉ biết interface này, phần hiện thực nằm ở infrastructure. */
public interface NguoiDungRepository {

    Optional<NguoiDung> findById(Long id);

    List<NguoiDung> findAllById(Iterable<Long> ids);

    Optional<NguoiDung> findByEmail(String email);

    Optional<NguoiDung> findBySoDienThoai(String soDienThoai);

    boolean existsByEmail(String email);

    boolean existsBySoDienThoai(String soDienThoai);

    boolean existsBySoDienThoaiAndIdNot(String soDienThoai, Long id);

    boolean existsByIdAndKichHoatTrue(Long id);

    List<NhanVien> timTatCaNhanVien();

    Optional<NhanVien> timNhanVienTheoId(Long id);

    <S extends NguoiDung> S save(S nguoiDung);

    void delete(NguoiDung nguoiDung);
}
