package com.guppyshop.identity.domain.model;

import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/** KẾ THỪA + ABSTRACT: người mua hàng, gồm KhachVangLai và KhachHang. */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class NguoiMua extends NguoiDung {

    protected NguoiMua(String hoTen, String email, String soDienThoai, String matKhauHash) {
        super(hoTen, email, soDienThoai, matKhauHash);
    }

    /** Đa hình: quyết định đơn hàng có được liên kết với tài khoản hay không. */
    public abstract boolean laKhachVangLai();
}
