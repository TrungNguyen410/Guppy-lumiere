package com.guppyshop.identity.domain.model;

import com.guppyshop.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * KẾ THỪA + ABSTRACT, JPA SINGLE_TABLE: mọi người dùng nằm chung bảng nguoi_dung,
 * phân biệt bằng cột loai_nguoi_dung. Field private, chỉ đổi qua phương thức nghiệp vụ.
 */
@Getter
@Entity
@Table(name = "nguoi_dung")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "loai_nguoi_dung", length = 31)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class NguoiDung extends BaseEntity {

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "mat_khau_hash", nullable = false)
    private String matKhauHash;

    @Column(name = "kich_hoat", nullable = false)
    private boolean kichHoat = true;

    protected NguoiDung(String hoTen, String email, String soDienThoai, String matKhauHash) {
        this.hoTen = hoTen;
        this.email = email;
        this.soDienThoai = soDienThoai;
        this.matKhauHash = matKhauHash;
    }

    /** Đa hình: mỗi lớp con tự cho biết vai trò của mình. */
    public abstract VaiTro layVaiTro();

    public void capNhatThongTin(String hoTen, String soDienThoai) {
        this.hoTen = hoTen;
        this.soDienThoai = soDienThoai;
    }

    public void doiMatKhau(String matKhauHash) {
        this.matKhauHash = matKhauHash;
    }

    public void datKichHoat(boolean kichHoat) {
        this.kichHoat = kichHoat;
    }
}
