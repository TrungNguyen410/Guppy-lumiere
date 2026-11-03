package com.guppyshop.report.infrastructure.persistence;

import com.guppyshop.report.domain.model.SoLieuThongKe.DemTrangThai;
import com.guppyshop.report.domain.model.SoLieuThongKe.DoanhThuNgay;
import com.guppyshop.report.domain.model.SoLieuThongKe.DonGanDay;
import com.guppyshop.report.domain.model.SoLieuThongKe.DongBanChay;
import com.guppyshop.report.domain.model.SoLieuThongKe.TonKhoTong;
import com.guppyshop.report.domain.repository.ThongKeRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/** Truy vấn tổng hợp viết bằng SQL để CSDL tự tính, không phải nạp toàn bộ đơn vào bộ nhớ. */
@Repository
class ThongKeRepositoryJdbc implements ThongKeRepository {

    private final NamedParameterJdbcTemplate jdbc;

    ThongKeRepositoryJdbc(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<DoanhThuNgay> doanhThuTheoNgay(LocalDate tuNgay, LocalDate denNgay) {
        return jdbc.query("""
                SELECT DATE(hoan_tat_luc) AS ngay, SUM(tong_tien) AS doanh_thu
                FROM don_hang
                WHERE hoan_tat_luc >= :tu AND hoan_tat_luc < :den AND trang_thai <> 'DA_HUY'
                GROUP BY DATE(hoan_tat_luc)
                """, Map.of("tu", tuNgay.atStartOfDay(), "den", denNgay.plusDays(1).atStartOfDay()),
                (hang, i) -> new DoanhThuNgay(hang.getDate("ngay").toLocalDate(), hang.getBigDecimal("doanh_thu")));
    }

    @Override
    public List<DemTrangThai> demDonTheoTrangThai() {
        return jdbc.query("SELECT trang_thai, COUNT(*) AS so_don FROM don_hang GROUP BY trang_thai",
                (hang, i) -> new DemTrangThai(hang.getString("trang_thai"), hang.getLong("so_don")));
    }

    @Override
    public TonKhoTong tonKho() {
        return jdbc.queryForObject("SELECT COUNT(*) AS so_lo, COALESCE(SUM(so_duc + so_cai + so_ca_bot), 0) AS tong_ca FROM lo_ca",
                Map.of(), (hang, i) -> new TonKhoTong(hang.getLong("so_lo"), hang.getLong("tong_ca")));
    }

    @Override
    public long haoHutTrongKhoang(LocalDate tuNgay, LocalDate denNgay) {
        Long tong = jdbc.queryForObject("""
                SELECT COALESCE(-SUM(delta_duc + delta_cai + delta_bot), 0)
                FROM bien_dong_kho
                WHERE loai = 'HAO_HUT' AND created_at >= :tu AND created_at < :den
                """, Map.of("tu", tuNgay.atStartOfDay(), "den", denNgay.plusDays(1).atStartOfDay()), Long.class);
        return tong == null ? 0 : tong;
    }

    @Override
    public List<DongBanChay> dongBanChay(int gioiHan) {
        return jdbc.query("""
                SELECT d.ten, SUM(s.da_ban) AS da_ban
                FROM dong_ca d
                JOIN ca_guppy c ON c.dong_ca_id = d.id
                JOIN san_pham s ON s.id = c.san_pham_id
                GROUP BY d.id, d.ten
                ORDER BY da_ban DESC, d.id
                LIMIT :gioiHan
                """, Map.of("gioiHan", gioiHan), (hang, i) -> new DongBanChay(hang.getString("ten"), hang.getLong("da_ban")));
    }

    @Override
    public List<DonGanDay> donGanDay(int gioiHan) {
        return jdbc.query("""
                SELECT ma_don, ho_ten_nhan, thanh_pho_nhan, tong_tien, trang_thai, created_at
                FROM don_hang
                ORDER BY created_at DESC, id DESC
                LIMIT :gioiHan
                """, Map.of("gioiHan", gioiHan), (hang, i) -> new DonGanDay(hang.getString("ma_don"), hang.getString("ho_ten_nhan"),
                hang.getString("thanh_pho_nhan"), hang.getBigDecimal("tong_tien"), hang.getString("trang_thai"),
                hang.getTimestamp("created_at").toLocalDateTime()));
    }
}
