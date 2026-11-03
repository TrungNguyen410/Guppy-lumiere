package com.guppyshop.ordering.domain.event;

import java.util.List;

/** OBSERVER: đơn mới được tạo. Module khác lắng nghe mà module ordering không cần biết đến họ. */
public record DonHangDaTaoEvent(Long donHangId, String maDon, List<DongDonHang> chiTiet) {
}
