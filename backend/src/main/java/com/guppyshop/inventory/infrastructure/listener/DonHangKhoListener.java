package com.guppyshop.inventory.infrastructure.listener;

import com.guppyshop.inventory.application.usecase.GiuTraTonUseCase;
import com.guppyshop.inventory.application.usecase.GiuTraTonUseCase.DongCanXuat;
import com.guppyshop.ordering.domain.event.DonHangDaHuyEvent;
import com.guppyshop.ordering.domain.event.DonHangDaTaoEvent;
import com.guppyshop.ordering.domain.event.DongDonHang;
import java.util.List;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * OBSERVER: kho lắng nghe sự kiện đơn hàng, ordering không biết đến inventory.
 * Dùng @EventListener đồng bộ thay vì @TransactionalEventListener(AFTER_COMMIT):
 * lỗi thiếu tồn phải làm rollback chính đơn hàng đó.
 */
@Component
class DonHangKhoListener {

    private final GiuTraTonUseCase giuTraTon;

    DonHangKhoListener(GiuTraTonUseCase giuTraTon) {
        this.giuTraTon = giuTraTon;
    }

    @EventListener
    void khiDonDuocTao(DonHangDaTaoEvent suKien) {
        giuTraTon.giuTon(suKien.donHangId(), suKien.maDon(), sangDongXuat(suKien.chiTiet()));
    }

    @EventListener
    void khiDonBiHuy(DonHangDaHuyEvent suKien) {
        giuTraTon.traTon(suKien.donHangId(), suKien.maDon(), sangDongXuat(suKien.chiTiet()));
    }

    private List<DongCanXuat> sangDongXuat(List<DongDonHang> chiTiet) {
        return chiTiet.stream()
                .map(d -> new DongCanXuat(d.sanPhamId(), d.donVi(), d.gioiTinh(), d.soLuong()))
                .toList();
    }
}
