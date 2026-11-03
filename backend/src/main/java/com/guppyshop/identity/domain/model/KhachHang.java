package com.guppyshop.identity.domain.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/** Khách có tài khoản: mua hàng như khách vãng lai, thêm hồ sơ, sổ địa chỉ, đánh giá, bảo hành. */
@Entity
@DiscriminatorValue("KHACH_HANG")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class KhachHang extends NguoiMua {

    public KhachHang(String hoTen, String email, String soDienThoai, String matKhauHash) {
        super(hoTen, email, soDienThoai, matKhauHash);
    }

    @Override
    public VaiTro layVaiTro() {
        return VaiTro.KHACH_HANG;
    }

    @Override
    public boolean laKhachVangLai() {
        return false;
    }
}
