package com.guppyshop.cart.domain.model;

import com.guppyshop.catalog.domain.model.LuaChonBan;
import com.guppyshop.common.domain.AggregateRoot;
import com.guppyshop.common.exception.NotFoundException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** Aggregate Root: giỏ thuộc về session của khách vãng lai hoặc tài khoản khách hàng, không đồng thời cả hai. */
@Getter
@Entity
@Table(name = "gio_hang")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GioHang extends AggregateRoot {

    @Column(name = "session_id")
    private String sessionId;

    @Column(name = "khach_hang_id")
    private Long khachHangId;

    @OneToMany(mappedBy = "gioHang", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id asc")
    private List<ChiTietGioHang> chiTiet = new ArrayList<>();

    private GioHang(String sessionId, Long khachHangId) {
        this.sessionId = sessionId;
        this.khachHangId = khachHangId;
    }

    public static GioHang choSession(String sessionId) {
        return new GioHang(sessionId, null);
    }

    public static GioHang choKhachHang(Long khachHangId) {
        return new GioHang(null, khachHangId);
    }

    public List<ChiTietGioHang> getChiTiet() {
        return Collections.unmodifiableList(chiTiet);
    }

    public Optional<ChiTietGioHang> timDong(Long sanPhamId, LuaChonBan luaChon) {
        return chiTiet.stream().filter(d -> d.cungSanPham(sanPhamId, luaChon)).findFirst();
    }

    /** Trùng sản phẩm và lựa chọn thì cộng dồn số lượng. */
    public void them(Long sanPhamId, LuaChonBan luaChon, int soLuong) {
        timDong(sanPhamId, luaChon).ifPresentOrElse(
                d -> d.doiSoLuong(d.getSoLuong() + soLuong),
                () -> chiTiet.add(new ChiTietGioHang(this, sanPhamId, luaChon, soLuong)));
    }

    public void doiSoLuong(Long chiTietId, int soLuong) {
        layDong(chiTietId).doiSoLuong(soLuong);
    }

    public void xoaDong(Long chiTietId) {
        chiTiet.remove(layDong(chiTietId));
    }

    public void lamTrong() {
        chiTiet.clear();
    }

    /** Khách đăng nhập: chép các dòng từ giỏ session sang giỏ này. */
    public void gopTu(GioHang khac) {
        khac.chiTiet.forEach(d -> them(d.getSanPhamId(), d.layLuaChon(), d.getSoLuong()));
    }

    public ChiTietGioHang layDong(Long chiTietId) {
        return chiTiet.stream().filter(d -> chiTietId.equals(d.getId())).findFirst()
                .orElseThrow(() -> new NotFoundException("Dòng này không có trong giỏ hàng"));
    }
}
