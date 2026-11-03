package com.guppyshop.ordering.domain.event;

import java.util.List;

/** OBSERVER: đơn hoàn tất lần đầu; đơn quay lại HOAN_TAT sau bảo hành không phát lại sự kiện này. */
public record DonHangDaHoanTatEvent(Long donHangId, String maDon, List<DongDonHang> chiTiet) {
}
