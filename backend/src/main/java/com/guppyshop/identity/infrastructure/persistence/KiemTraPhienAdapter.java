package com.guppyshop.identity.infrastructure.persistence;

import com.guppyshop.common.config.KiemTraPhien;
import com.guppyshop.identity.domain.repository.NguoiDungRepository;
import org.springframework.stereotype.Component;

/** Token của tài khoản đã khóa hoặc đã xóa mất hiệu lực ngay, không chờ đến hạn. */
@Component
class KiemTraPhienAdapter implements KiemTraPhien {

    private final NguoiDungRepository nguoiDungRepository;

    KiemTraPhienAdapter(NguoiDungRepository nguoiDungRepository) {
        this.nguoiDungRepository = nguoiDungRepository;
    }

    @Override
    public boolean conHoatDong(Long nguoiDungId) {
        return nguoiDungRepository.existsByIdAndKichHoatTrue(nguoiDungId);
    }
}
