package com.guppyshop.ordering.infrastructure.listener;

import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.ordering.domain.event.DonHangDaHoanTatEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/** OBSERVER: số đã bán của sản phẩm chỉ tăng khi đơn giao xong. */
@Component
class CapNhatDaBanListener {

    private final SanPhamRepository sanPhamRepository;

    CapNhatDaBanListener(SanPhamRepository sanPhamRepository) {
        this.sanPhamRepository = sanPhamRepository;
    }

    @EventListener
    @Transactional(propagation = Propagation.MANDATORY)
    void khiDonHoanTat(DonHangDaHoanTatEvent suKien) {
        suKien.chiTiet().forEach(d -> sanPhamRepository.tangDaBan(d.sanPhamId(), d.soLuong()));
    }
}
