package com.guppyshop.payment.domain.repository;

import com.guppyshop.payment.domain.model.ThanhToan;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ThanhToanRepository {

    Optional<ThanhToan> findByDonHangId(Long donHangId);

    List<ThanhToan> findByDonHangIdIn(Collection<Long> donHangIds);

    <S extends ThanhToan> S save(S thanhToan);
}
