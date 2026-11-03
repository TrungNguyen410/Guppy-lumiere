package com.guppyshop.report.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Các dòng số liệu đọc từ CSDL. */
public final class SoLieuThongKe {

    private SoLieuThongKe() {
    }

    public record TonKhoTong(long soLo, long tongCa) {
    }

    public record DoanhThuNgay(java.time.LocalDate ngay, BigDecimal doanhThu) {
    }

    public record DemTrangThai(String trangThai, long soDon) {
    }

    public record DongBanChay(String tenDong, long daBan) {
    }

    public record DonGanDay(String maDon, String hoTen, String thanhPho, BigDecimal tongTien, String trangThai, LocalDateTime taoLuc) {
    }
}
