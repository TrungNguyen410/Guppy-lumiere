package com.guppyshop.identity.domain.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/** Quyền kế thừa từ Nhân viên được khai báo bằng phân cấp vai trò ở SecurityConfig. */
@Entity
@DiscriminatorValue("ADMIN")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Admin extends NhanSu {

    public Admin(String hoTen, String email, String soDienThoai, String matKhauHash) {
        super(hoTen, email, soDienThoai, matKhauHash);
    }

    @Override
    public VaiTro layVaiTro() {
        return VaiTro.ADMIN;
    }
}
