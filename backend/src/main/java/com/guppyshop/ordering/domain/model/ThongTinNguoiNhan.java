package com.guppyshop.ordering.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** Value object nhúng trong DonHang: giữ thông tin giao hàng tại thời điểm đặt. */
@Getter
@Embeddable
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ThongTinNguoiNhan {

    @Column(name = "ho_ten_nhan", nullable = false)
    private String hoTen;

    @Column(name = "sdt_nhan", nullable = false)
    private String soDienThoai;

    @Column(name = "dia_chi_nhan", nullable = false)
    private String diaChi;

    @Column(name = "thanh_pho_nhan", nullable = false)
    private String thanhPho;

    @Column(name = "ghi_chu")
    private String ghiChu;
}
