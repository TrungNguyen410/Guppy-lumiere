package com.guppyshop.payment.domain.model;

/** Tác nhân Cổng thanh toán. Domain chỉ biết interface này, có thể thay bằng cổng thật mà không sửa nghiệp vụ. */
public interface CongThanhToan {

    record ThongTinChuyenKhoan(String nganHang, String soTaiKhoan, String chuTaiKhoan) {
    }

    ThongTinChuyenKhoan thongTinNhanTien();

    /** Nội dung khách phải ghi khi chuyển khoản để đối soát với đơn. */
    String taoNoiDung(String maDon, String soDienThoai);
}
