package com.guppyshop.promotion.domain.repository;

import com.guppyshop.promotion.domain.model.MaGiamGia;
import java.util.List;
import java.util.Optional;

public interface MaGiamGiaRepository {

    List<MaGiamGia> findAllByOrderByIdDesc();

    Optional<MaGiamGia> findById(Long id);

    Optional<MaGiamGia> findByMa(String ma);

    boolean existsByMa(String ma);

    /** Khóa dòng để hai đơn đồng thời không dùng vượt số lượt. */
    Optional<MaGiamGia> khoaTheoMa(String ma);

    Optional<MaGiamGia> khoaTheoId(Long id);

    <S extends MaGiamGia> S save(S maGiamGia);

    void delete(MaGiamGia maGiamGia);
}
