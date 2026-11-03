package com.guppyshop.payment.infrastructure.persistence;

import com.guppyshop.payment.domain.model.ThanhToan;
import com.guppyshop.payment.domain.repository.ThanhToanRepository;
import org.springframework.data.jpa.repository.JpaRepository;

interface ThanhToanJpaRepository extends JpaRepository<ThanhToan, Long>, ThanhToanRepository {
}
