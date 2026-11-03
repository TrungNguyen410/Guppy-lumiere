package com.guppyshop.identity.infrastructure.persistence;

import com.guppyshop.identity.domain.model.DiaChi;
import com.guppyshop.identity.domain.repository.DiaChiRepository;
import org.springframework.data.jpa.repository.JpaRepository;

interface DiaChiJpaRepository extends JpaRepository<DiaChi, Long>, DiaChiRepository {
}
