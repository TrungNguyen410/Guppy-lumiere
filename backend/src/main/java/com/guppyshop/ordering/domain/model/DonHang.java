package com.guppyshop.ordering.domain.model;

import com.guppyshop.common.domain.AggregateRoot;
import com.guppyshop.common.domain.PhiGiaoHang;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.ordering.domain.event.DonHangDaHoanTatEvent;
import com.guppyshop.ordering.domain.event.DonHangDaHuyEvent;
import com.guppyshop.ordering.domain.event.DonHangDaTaoEvent;
import com.guppyshop.ordering.domain.event.DongDonHang;
import com.guppyshop.ordering.domain.state.TrangThaiState;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * AGGREGATE ROOT: mọi thay đổi của đơn, dòng đơn và lịch sử đều đi qua lớp này.
 * Composition: ChiTietDonHang, LichSuTrangThai, ThongTinNguoiNhan không tồn tại ngoài đơn.
 * Không có setter cho trangThai, chỉ đổi được qua State.
 */
@Getter
@Entity
@Table(name = "don_hang")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DonHang extends AggregateRoot {

    private static final int GIO_BAO_HANH = 24;

    @Column(name = "ma_don", nullable = false, updatable = false)
    private String maDon;

    /** Null với khách vãng lai. */
    @Column(name = "khach_hang_id", updatable = false)
    private Long khachHangId;

    @Embedded
    private ThongTinNguoiNhan nguoiNhan;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiDon trangThai;

    @Column(name = "tam_tinh", nullable = false, updatable = false)
    private BigDecimal tamTinh;

    @Column(name = "phi_giao", nullable = false, updatable = false)
    private BigDecimal phiGiao;

    @Column(name = "giam_gia", nullable = false, updatable = false)
    private BigDecimal giamGia;

    @Column(name = "tong_tien", nullable = false, updatable = false)
    private BigDecimal tongTien;

    @Column(name = "ma_giam_gia_id", updatable = false)
    private Long maGiamGiaId;

    /** Lần hoàn tất đầu tiên, dùng để tính hạn bảo hành 24h. */
    @Column(name = "hoan_tat_luc")
    private LocalDateTime hoanTatLuc;

    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id asc")
    private List<ChiTietDonHang> chiTiet = new ArrayList<>();

    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("thoiDiem asc, id asc")
    private List<LichSuTrangThai> lichSu = new ArrayList<>();

    /** BUILDER: đơn nhiều thông tin; hàm tạo tự tính tiền nên không thể tạo đơn sai tổng. */
    @Builder
    private DonHang(String maDon, Long khachHangId, ThongTinNguoiNhan nguoiNhan,
                    List<ChiTietDonHang.DongMoi> cacDong, BigDecimal giamGia, Long maGiamGiaId) {
        if (cacDong == null || cacDong.isEmpty()) {
            throw new BusinessException("Đơn hàng phải có ít nhất một sản phẩm");
        }
        this.maDon = maDon;
        this.khachHangId = khachHangId;
        this.nguoiNhan = nguoiNhan;
        this.maGiamGiaId = maGiamGiaId;
        cacDong.forEach(dong -> chiTiet.add(new ChiTietDonHang(this, dong)));
        this.tamTinh = chiTiet.stream().map(ChiTietDonHang::thanhTien).reduce(BigDecimal.ZERO, BigDecimal::add);
        this.phiGiao = PhiGiaoHang.tinh(tamTinh);
        this.giamGia = giamGia == null ? BigDecimal.ZERO : giamGia;
        this.tongTien = tamTinh.subtract(this.giamGia).add(phiGiao);
        this.trangThai = TrangThaiDon.CHO_XAC_NHAN;
        lichSu.add(new LichSuTrangThai(this, trangThai, LocalDateTime.now(), null));
    }

    public List<ChiTietDonHang> getChiTiet() {
        return Collections.unmodifiableList(chiTiet);
    }

    public List<LichSuTrangThai> getLichSu() {
        return Collections.unmodifiableList(lichSu);
    }

    public boolean laKhachVangLai() {
        return khachHangId == null;
    }

    public boolean khopSoDienThoai(String soDienThoai) {
        return nguoiNhan.getSoDienThoai().equals(soDienThoai);
    }

    public boolean khachDuocHuy() {
        return trangThaiHienTai().khachDuocHuy();
    }

    /** Gọi sau khi đã lưu để sự kiện có id đơn. */
    public void ghiNhanDaTao() {
        ghiNhanSuKien(new DonHangDaTaoEvent(getId(), maDon, dongSuKien()));
    }

    public void chuyenTrangThai(TrangThaiDon dich, String ghiChu) {
        trangThai = trangThaiHienTai().chuyenSang(dich);
        LocalDateTime bayGio = LocalDateTime.now();
        lichSu.add(new LichSuTrangThai(this, trangThai, bayGio, ghiChu));
        if (trangThai == TrangThaiDon.DA_HUY) {
            ghiNhanSuKien(new DonHangDaHuyEvent(getId(), maDon, maGiamGiaId, dongSuKien()));
        }
        if (trangThai == TrangThaiDon.HOAN_TAT && hoanTatLuc == null) {
            hoanTatLuc = bayGio;
            ghiNhanSuKien(new DonHangDaHoanTatEvent(getId(), maDon, dongSuKien()));
        }
    }

    public void khachHuy() {
        if (!khachDuocHuy()) {
            throw new BusinessException("Đơn đã được xác nhận, vui lòng liên hệ cửa hàng để hủy");
        }
        chuyenTrangThai(TrangThaiDon.DA_HUY, "Khách tự hủy");
    }

    /** Bảo hành cá chết trong 24h kể từ lần hoàn tất đầu tiên. */
    public boolean conHanBaoHanh(LocalDateTime bayGio) {
        return trangThai == TrangThaiDon.HOAN_TAT && hoanTatLuc != null
                && !bayGio.isAfter(hoanTatLuc.plusHours(GIO_BAO_HANH));
    }

    public void vaoBaoHanh(LocalDateTime bayGio) {
        if (!conHanBaoHanh(bayGio)) {
            throw new BusinessException("Đơn chỉ được bảo hành trong 24 giờ sau khi hoàn tất");
        }
        chuyenTrangThai(TrangThaiDon.BAO_HANH, "Khách yêu cầu bảo hành");
    }

    public boolean coSanPham(Long sanPhamId) {
        return chiTiet.stream().anyMatch(d -> d.getSanPhamId().equals(sanPhamId));
    }

    private TrangThaiState trangThaiHienTai() {
        return TrangThaiState.cua(trangThai);
    }

    private List<DongDonHang> dongSuKien() {
        return chiTiet.stream()
                .map(d -> new DongDonHang(d.getSanPhamId(), d.getDonVi(), d.getGioiTinh(), d.getSoLuong()))
                .toList();
    }
}
