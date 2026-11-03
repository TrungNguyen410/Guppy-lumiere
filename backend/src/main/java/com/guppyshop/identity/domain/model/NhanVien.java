package com.guppyshop.identity.domain.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("NHAN_VIEN")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NhanVien extends NhanSu {

    public NhanVien(String hoTen, String email, String soDienThoai, String matKhauHash) {
        super(hoTen, email, soDienThoai, matKhauHash);
    }

    @Override
    public VaiTro layVaiTro() {
        return VaiTro.NHAN_VIEN;
    }
}
