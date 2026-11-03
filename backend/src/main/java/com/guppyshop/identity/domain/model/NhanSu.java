package com.guppyshop.identity.domain.model;

import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/** KẾ THỪA + ABSTRACT: nhân sự của cửa hàng, gồm NhanVien và Admin. */
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class NhanSu extends NguoiDung {

    protected NhanSu(String hoTen, String email, String soDienThoai, String matKhauHash) {
        super(hoTen, email, soDienThoai, matKhauHash);
    }
}
