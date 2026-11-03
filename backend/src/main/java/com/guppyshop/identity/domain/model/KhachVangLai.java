package com.guppyshop.identity.domain.model;

/**
 * Khách đặt hàng không có tài khoản. Cố ý không có @Entity nên không lưu vào bảng nguoi_dung:
 * thông tin của khách chỉ nằm trong đơn hàng.
 */
public class KhachVangLai extends NguoiMua {

    public KhachVangLai(String hoTen, String soDienThoai) {
        super(hoTen, null, soDienThoai, null);
    }

    @Override
    public VaiTro layVaiTro() {
        return VaiTro.KHACH_VANG_LAI;
    }

    @Override
    public boolean laKhachVangLai() {
        return true;
    }
}
