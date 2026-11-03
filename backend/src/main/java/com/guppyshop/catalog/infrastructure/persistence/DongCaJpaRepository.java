package com.guppyshop.catalog.infrastructure.persistence;

import com.guppyshop.catalog.domain.model.DongCa;
import com.guppyshop.catalog.domain.repository.DongCaRepository;
import org.springframework.data.jpa.repository.JpaRepository;

interface DongCaJpaRepository extends JpaRepository<DongCa, Long>, DongCaRepository {
}
