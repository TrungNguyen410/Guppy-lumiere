package com.guppyshop.identity.domain.model;

import com.guppyshop.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** Một địa chỉ trong sổ địa chỉ của khách hàng. */
@Getter
@Entity
@Table(name = "dia_chi")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DiaChi extends BaseEntity {

    @Column(name = "khach_hang_id", nullable = false, updatable = false)
    private Long khachHangId;

    @Column(name = "ho_ten_nhan", nullable = false)
    private String hoTenNhan;

    @Column(name = "so_dien_thoai", nullable = false)
    private String soDienThoai;

    @Column(name = "dia_chi", nullable = false)
    private String diaChi;

    @Column(name = "thanh_pho", nullable = false)
    private String thanhPho;

    @Column(name = "mac_dinh", nullable = false)
    private boolean macDinh;

    public DiaChi(Long khachHangId, String hoTenNhan, String soDienThoai, String diaChi, String thanhPho) {
        this.khachHangId = khachHangId;
        capNhat(hoTenNhan, soDienThoai, diaChi, thanhPho);
    }

    public final void capNhat(String hoTenNhan, String soDienThoai, String diaChi, String thanhPho) {
        this.hoTenNhan = hoTenNhan;
        this.soDienThoai = soDienThoai;
        this.diaChi = diaChi;
        this.thanhPho = thanhPho;
    }

    public void datMacDinh(boolean macDinh) {
        this.macDinh = macDinh;
    }
}
