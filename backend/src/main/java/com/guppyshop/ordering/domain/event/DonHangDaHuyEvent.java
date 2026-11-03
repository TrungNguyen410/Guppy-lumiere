package com.guppyshop.ordering.domain.event;

import java.util.List;

/** OBSERVER: đơn đã bị hủy. maGiamGiaId null khi đơn không dùng mã. */
public record DonHangDaHuyEvent(Long donHangId, String maDon, Long maGiamGiaId, List<DongDonHang> chiTiet) {
}
