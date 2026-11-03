package com.guppyshop.payment.infrastructure.listener;

import com.guppyshop.ordering.domain.event.DonHangDaHoanTatEvent;
import com.guppyshop.ordering.domain.event.DonHangDaHuyEvent;
import com.guppyshop.payment.application.usecase.ThanhToanUseCase;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/** OBSERVER: cập nhật thanh toán theo vòng đời đơn hàng. */
@Component
class DonHangThanhToanListener {

    private final ThanhToanUseCase thanhToanUseCase;

    DonHangThanhToanListener(ThanhToanUseCase thanhToanUseCase) {
        this.thanhToanUseCase = thanhToanUseCase;
    }

    @EventListener
    void khiDonHoanTat(DonHangDaHoanTatEvent suKien) {
        thanhToanUseCase.khiDonHoanTat(suKien.donHangId());
    }

    @EventListener
    void khiDonBiHuy(DonHangDaHuyEvent suKien) {
        thanhToanUseCase.khiDonBiHuy(suKien.donHangId());
    }
}
