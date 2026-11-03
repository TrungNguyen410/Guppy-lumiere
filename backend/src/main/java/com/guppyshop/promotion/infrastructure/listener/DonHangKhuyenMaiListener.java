package com.guppyshop.promotion.infrastructure.listener;

import com.guppyshop.ordering.domain.event.DonHangDaHuyEvent;
import com.guppyshop.promotion.application.usecase.QuanLyMaGiamGiaUseCase;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/** OBSERVER: đơn bị hủy thì trả lại lượt dùng của mã giảm giá. */
@Component
class DonHangKhuyenMaiListener {

    private final QuanLyMaGiamGiaUseCase maGiamGiaUseCase;

    DonHangKhuyenMaiListener(QuanLyMaGiamGiaUseCase maGiamGiaUseCase) {
        this.maGiamGiaUseCase = maGiamGiaUseCase;
    }

    @EventListener
    void khiDonBiHuy(DonHangDaHuyEvent suKien) {
        if (suKien.maGiamGiaId() != null) {
            maGiamGiaUseCase.traLuot(suKien.maGiamGiaId());
        }
    }
}
