package com.guppyshop.identity.domain.repository;

import com.guppyshop.identity.domain.model.DiaChi;
import java.util.List;
import java.util.Optional;

public interface DiaChiRepository {

    List<DiaChi> findByKhachHangIdOrderByMacDinhDescIdAsc(Long khachHangId);

    Optional<DiaChi> findByIdAndKhachHangId(Long id, Long khachHangId);

    <S extends DiaChi> S save(S diaChi);

    void delete(DiaChi diaChi);
}
