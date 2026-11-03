package com.guppyshop.catalog.domain.repository;

import com.guppyshop.catalog.domain.model.DongCa;
import java.util.List;
import java.util.Optional;

public interface DongCaRepository {

    List<DongCa> findAllByOrderByIdAsc();

    Optional<DongCa> findById(Long id);

    boolean existsByMa(String ma);

    <S extends DongCa> S save(S dongCa);

    void delete(DongCa dongCa);
}
