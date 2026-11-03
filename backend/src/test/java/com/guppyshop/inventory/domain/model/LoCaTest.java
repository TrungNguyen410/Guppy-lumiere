package com.guppyshop.inventory.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.guppyshop.catalog.domain.model.TonKho;
import com.guppyshop.common.exception.BusinessException;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;

class LoCaTest {

    private static LoCa lo(int duc, int cai, int bot) {
        return new LoCa("LO-1", 1L, null, "Bể A", LocalDate.now().minusDays(30), duc, cai, bot);
    }

    @Test
    void giaiDoanTinhTheoSoCa() {
        assertThat(lo(5, 5, 0).getGiaiDoan()).isEqualTo(GiaiDoanLo.TRUONG_THANH);
        assertThat(lo(0, 0, 50).getGiaiDoan()).isEqualTo(GiaiDoanLo.CA_BOT);
        assertThat(lo(1, 0, 50).getGiaiDoan()).isEqualTo(GiaiDoanLo.DANG_PHAN_GIOI);
    }

    @Test
    void nhapDeTangCaBotVaGhiNhatKy() {
        LoCa lo = lo(5, 5, 0);

        BienDongKho nhatKy = lo.nhapDe(85, "Lứa 1");

        assertThat(lo.getSoCaBot()).isEqualTo(85);
        assertThat(lo.getGiaiDoan()).isEqualTo(GiaiDoanLo.DANG_PHAN_GIOI);
        assertThat(nhatKy.getLoai()).isEqualTo(LoaiBienDong.NHAP_DE);
        assertThat(nhatKy.getDeltaBot()).isEqualTo(85);
    }

    @Test
    void phanGioiChuyenBotThanhDucCaiTongKhongDoi() {
        LoCa lo = lo(15, 9, 150);

        BienDongKho nhatKy = lo.phanGioi(6, 4, "Cá 9 tuần");

        assertThat(lo.tongCa()).isEqualTo(174);
        assertThat(lo.getSoDuc()).isEqualTo(21);
        assertThat(lo.getSoCai()).isEqualTo(13);
        assertThat(lo.getSoCaBot()).isEqualTo(140);
        assertThat(nhatKy.getDeltaBot()).isEqualTo(-10);
    }

    @Test
    void phanGioiHetCaBotThiTruongThanh() {
        LoCa lo = lo(0, 0, 10);

        lo.phanGioi(5, 5, null);

        assertThat(lo.getGiaiDoan()).isEqualTo(GiaiDoanLo.TRUONG_THANH);
    }

    @Test
    void phanGioiVuotCaBotHoacBangKhongBiTuChoi() {
        assertThatThrownBy(() -> lo(0, 0, 5).phanGioi(3, 3, null)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> lo(0, 0, 5).phanGioi(0, 0, null)).isInstanceOf(BusinessException.class);
    }

    @Test
    void haoHutGiamCaVaCongDon() {
        LoCa lo = lo(10, 10, 10);

        lo.ghiHaoHut(1, 2, 3, "Nhiệt độ giảm");
        BienDongKho nhatKy = lo.ghiHaoHut(1, 0, 0, null);

        assertThat(lo.getHaoHut()).isEqualTo(7);
        assertThat(lo.tongCa()).isEqualTo(23);
        assertThat(nhatKy.getDeltaDuc()).isEqualTo(-1);
    }

    @Test
    void haoHutVuotSoCaHoacBangKhongBiTuChoi() {
        assertThatThrownBy(() -> lo(1, 0, 0).ghiHaoHut(2, 0, 0, null)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> lo(1, 1, 1).ghiHaoHut(0, 0, 0, null)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> lo(1, 1, 1).ghiHaoHut(-1, 0, 0, null)).isInstanceOf(BusinessException.class);
    }

    @Test
    void ngayNoTuongLaiBiTuChoi() {
        assertThatThrownBy(() -> new LoCa("L", 1L, null, "B", LocalDate.now().plusDays(1), 0, 0, 0))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void xuatChoDonLayLanLuotQuaCacLo() {
        LoCa cu = lo(3, 2, 0);
        LoCa moi = lo(10, 10, 0);

        List<BienDongKho> nhatKy = PhanBoTonKho.xuatChoDon(List.of(cu, moi), new TonKho(5, 2, 0), 9L, "Đơn X");

        assertThat(cu.getSoDuc()).isZero();
        assertThat(cu.getSoCai()).isZero();
        assertThat(moi.getSoDuc()).isEqualTo(8);
        assertThat(moi.getSoCai()).isEqualTo(10);
        assertThat(nhatKy).hasSize(2);
        assertThat(nhatKy.get(0).getDeltaDuc()).isEqualTo(-3);
        assertThat(nhatKy.get(1).getDeltaDuc()).isEqualTo(-2);
        assertThat(nhatKy).allMatch(b -> b.getLoai() == LoaiBienDong.BAN && b.getDonHangId().equals(9L));
    }

    @Test
    void xuatKhongDuBaoLoiDuTongCaConDu() {
        LoCa chiCoDuc = lo(100, 0, 100);

        assertThatThrownBy(() -> PhanBoTonKho.xuatChoDon(List.of(chiCoDuc), new TonKho(1, 1, 0), 1L, "x"))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void traLaiKhoiPhucDungSoCaVaGhiNhatKyNguoc() {
        LoCa lo = lo(10, 10, 20);
        BienDongKho ban = PhanBoTonKho.xuatChoDon(List.of(lo), new TonKho(2, 3, 10), 9L, "Đơn X").getFirst();

        BienDongKho tra = lo.traLai(ban, "Hủy đơn X");

        assertThat(lo.getSoDuc()).isEqualTo(10);
        assertThat(lo.getSoCai()).isEqualTo(10);
        assertThat(lo.getSoCaBot()).isEqualTo(20);
        assertThat(tra.getLoai()).isEqualTo(LoaiBienDong.TRA_TON);
        assertThat(tra.getDeltaDuc()).isEqualTo(2);
        assertThat(tra.getDonHangId()).isEqualTo(9L);
    }
}
