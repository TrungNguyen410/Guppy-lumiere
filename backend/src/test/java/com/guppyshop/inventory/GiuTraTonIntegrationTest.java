package com.guppyshop.inventory;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.ordering.domain.event.DonHangDaHuyEvent;
import com.guppyshop.ordering.domain.event.DonHangDaTaoEvent;
import com.guppyshop.ordering.domain.event.DongDonHang;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Chạy với MySQL thật (cần CSDL seed sẵn), xem lệnh trong README.
 * Mỗi test tự rollback hoặc tự dọn nên có thể chạy trên CSDL dev.
 */
@Tag("tich-hop")
@SpringBootTest
class GiuTraTonIntegrationTest {

    private static final String SP_FULL_GOLD = "full-gold-duoi-quat";
    private static final String PK_CAM = "cam-vi-sinh-len-mau-50g";

    @Autowired
    private ApplicationEventPublisher publisher;
    @Autowired
    private JdbcTemplate jdbc;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private TransactionTemplate transaction;

    private Long idSanPham(String slug) {
        return jdbc.queryForObject("SELECT id FROM san_pham WHERE slug = ?", Long.class, slug);
    }

    private Long taoDon(String maDon) {
        jdbc.update("""
                INSERT INTO don_hang (ma_don, ho_ten_nhan, sdt_nhan, dia_chi_nhan, thanh_pho_nhan, trang_thai, tam_tinh, tong_tien)
                VALUES (?, 'Test', '0900000000', 'Test', 'Hà Nội', 'CHO_XAC_NHAN', 1, 1)
                """, maDon);
        return jdbc.queryForObject("SELECT id FROM don_hang WHERE ma_don = ?", Long.class, maDon);
    }

    private Map<String, Object> ton(String maLo) {
        return jdbc.queryForMap("SELECT so_duc, so_cai, so_ca_bot FROM lo_ca WHERE ma_lo = ?", maLo);
    }

    private int tonPhuKien(Long id) {
        return jdbc.queryForObject("SELECT ton_kho FROM phu_kien WHERE san_pham_id = ?", Integer.class, id);
    }

    /** Chạy trong transaction rồi rollback để CSDL giữ nguyên. */
    private void trongTransactionRollback(Runnable viec) {
        transaction.executeWithoutResult(trangThai -> {
            viec.run();
            entityManager.flush();
            trangThai.setRollbackOnly();
        });
    }

    @Test
    void datDonTruDungLoVaGhiNhatKyHuyDonTraLaiNguyenVen() {
        trongTransactionRollback(() -> {
            Long sp = idSanPham(SP_FULL_GOLD);
            Long pk = idSanPham(PK_CAM);
            Long don = taoDon("TEST-1");
            int tonPkBanDau = tonPhuKien(pk);
            Map<String, Object> tonBanDau = ton("LO-2410-FG");
            List<DongDonHang> dong = List.of(
                    new DongDonHang(sp, DonViBan.BO_BA, GioiTinh.KHONG_AP_DUNG, 2),
                    new DongDonHang(sp, DonViBan.LO_CA_BOT, GioiTinh.KHONG_AP_DUNG, 1),
                    new DongDonHang(pk, null, GioiTinh.KHONG_AP_DUNG, 3));

            publisher.publishEvent(new DonHangDaTaoEvent(don, "TEST-1", dong));
            entityManager.flush();
            assertThat(ton("LO-2410-FG")).containsEntry("so_duc", 22).containsEntry("so_cai", 27).containsEntry("so_ca_bot", 110);
            assertThat(tonPhuKien(pk)).isEqualTo(tonPkBanDau - 3);
            assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM bien_dong_kho WHERE don_hang_id = ? AND loai = 'BAN'", Integer.class, don)).isEqualTo(2);

            publisher.publishEvent(new DonHangDaHuyEvent(don, "TEST-1", null, dong));
            entityManager.flush();
            entityManager.clear();
            assertThat(ton("LO-2410-FG")).isEqualTo(tonBanDau);
            assertThat(tonPhuKien(pk)).isEqualTo(tonPkBanDau);

            // Phát lại sự kiện hủy không được trả thêm
            publisher.publishEvent(new DonHangDaHuyEvent(don, "TEST-1", null, dong));
            entityManager.flush();
            assertThat(ton("LO-2410-FG")).isEqualTo(tonBanDau);
            assertThat(tonPhuKien(pk)).isEqualTo(tonPkBanDau);
        });
    }

    @Test
    void khongDuTonThiBaoLoi() {
        trongTransactionRollback(() -> {
            Long don = taoDon("TEST-2");
            List<DongDonHang> dong = List.of(new DongDonHang(idSanPham(SP_FULL_GOLD), DonViBan.CON_LE, GioiTinh.DUC, 999));
            assertThatThrownBy(() -> publisher.publishEvent(new DonHangDaTaoEvent(don, "TEST-2", dong)))
                    .isInstanceOf(BusinessException.class);
        });
    }

    @Test
    void phuKienKhongDuHangThiBaoLoi() {
        trongTransactionRollback(() -> {
            Long don = taoDon("TEST-3");
            List<DongDonHang> dong = List.of(new DongDonHang(idSanPham("thuoc-xanh-methylen-20ml"), null, GioiTinh.KHONG_AP_DUNG, 1));
            assertThatThrownBy(() -> publisher.publishEvent(new DonHangDaTaoEvent(don, "TEST-3", dong)))
                    .isInstanceOf(BusinessException.class);
        });
    }

    /** Lô chỉ còn 3 con, 8 đơn đồng thời mỗi đơn mua 1: đúng 3 đơn thành công và tồn không âm. */
    @Test
    void nhieuDonDongThoiKhongBanVuotTon() throws Exception {
        Long sp = idSanPham("rong-do-duoi-voan");
        Map<String, Object> tonBanDau = ton("LO-2409-RD");
        assertThat(tonBanDau).containsEntry("so_duc", 3);
        List<Long> cacDon = new ArrayList<>();
        for (int i = 0; i < 8; i++) {
            cacDon.add(taoDon("TEST-DT-" + i));
        }
        ExecutorService pool = Executors.newFixedThreadPool(8);
        CountDownLatch batDau = new CountDownLatch(1);
        try {
            List<Future<Boolean>> ketQua = new ArrayList<>();
            for (int i = 0; i < cacDon.size(); i++) {
                Long don = cacDon.get(i);
                String ma = "TEST-DT-" + i;
                ketQua.add(pool.submit(() -> {
                    batDau.await();
                    try {
                        transaction.executeWithoutResult(t -> publisher.publishEvent(new DonHangDaTaoEvent(don, ma,
                                List.of(new DongDonHang(sp, DonViBan.CON_LE, GioiTinh.DUC, 1)))));
                        return true;
                    } catch (BusinessException ex) {
                        return false;
                    }
                }));
            }
            batDau.countDown();
            int thanhCong = 0;
            for (Future<Boolean> f : ketQua) {
                thanhCong += f.get() ? 1 : 0;
            }
            assertThat(thanhCong).isEqualTo(3);
            assertThat(ton("LO-2409-RD")).containsEntry("so_duc", 0);
        } finally {
            pool.shutdownNow();
            // Dọn dữ liệu đã commit để CSDL trở về như ban đầu
            jdbc.update("DELETE FROM bien_dong_kho WHERE don_hang_id IN (SELECT id FROM don_hang WHERE ma_don LIKE 'TEST-DT-%')");
            jdbc.update("DELETE FROM don_hang WHERE ma_don LIKE 'TEST-DT-%'");
            jdbc.update("UPDATE lo_ca SET so_duc = ? WHERE ma_lo = 'LO-2409-RD'", tonBanDau.get("so_duc"));
        }
    }
}
