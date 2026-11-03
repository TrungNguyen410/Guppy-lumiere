package com.guppyshop.inventory.domain.model;

import com.guppyshop.catalog.domain.model.TonKho;
import com.guppyshop.common.domain.BaseEntity;
import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Lô cá nuôi, nơi lưu tồn kho thật. Số lượng không có setter: mọi thay đổi đi qua phương thức nghiệp vụ,
 * mỗi phương thức trả về dòng nhật ký tương ứng để kho luôn truy vết được.
 */
@Getter
@Entity
@Table(name = "lo_ca")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LoCa extends BaseEntity {

    @Column(name = "ma_lo", nullable = false, updatable = false)
    private String maLo;

    @Column(name = "ca_guppy_id", nullable = false, updatable = false)
    private Long caGuppyId;

    @Column(name = "bo_me")
    private String boMe;

    @Column(name = "be_nuoi", nullable = false)
    private String beNuoi;

    @Column(name = "ngay_no", nullable = false)
    private LocalDate ngayNo;

    @Column(name = "so_duc", nullable = false)
    private int soDuc;

    @Column(name = "so_cai", nullable = false)
    private int soCai;

    @Column(name = "so_ca_bot", nullable = false)
    private int soCaBot;

    @Column(name = "hao_hut", nullable = false)
    private int haoHut;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "giai_doan", nullable = false)
    private GiaiDoanLo giaiDoan;

    /** Hai nhân viên sửa cùng lúc thì người sau nhận lỗi xung đột thay vì ghi đè. */
    @Version
    @Column(name = "phien_ban", nullable = false)
    private long phienBan;

    public LoCa(String maLo, Long caGuppyId, String boMe, String beNuoi, LocalDate ngayNo, int soDuc, int soCai, int soCaBot) {
        kiemTraKhongAm(soDuc, soCai, soCaBot);
        this.maLo = maLo;
        this.caGuppyId = caGuppyId;
        this.soDuc = soDuc;
        this.soCai = soCai;
        this.soCaBot = soCaBot;
        capNhatThongTin(boMe, beNuoi, ngayNo);
        tinhLaiGiaiDoan();
    }

    public final void capNhatThongTin(String boMe, String beNuoi, LocalDate ngayNo) {
        if (ngayNo.isAfter(LocalDate.now())) {
            throw new BusinessException("Ngày nở không được ở tương lai");
        }
        this.boMe = boMe;
        this.beNuoi = beNuoi;
        this.ngayNo = ngayNo;
    }

    public int tongCa() {
        return soDuc + soCai + soCaBot;
    }

    /** Dòng nhật ký cho số cá ban đầu khi tạo lô. */
    public BienDongKho ghiNhapBanDau() {
        return new BienDongKho(getId(), null, LoaiBienDong.NHAP_DE, soDuc, soCai, soCaBot, "Tạo lô mới");
    }

    public BienDongKho nhapDe(int soBot, String ghiChu) {
        if (soBot <= 0) {
            throw new BusinessException("Số cá bột nhập phải lớn hơn 0");
        }
        soCaBot += soBot;
        tinhLaiGiaiDoan();
        return new BienDongKho(getId(), null, LoaiBienDong.NHAP_DE, 0, 0, soBot, ghiChu);
    }

    /** Cá bột lớn lên, phân thành đực và cái; tổng số cá của lô không đổi. */
    public BienDongKho phanGioi(int soDucMoi, int soCaiMoi, String ghiChu) {
        kiemTraKhongAm(soDucMoi, soCaiMoi, 0);
        int tong = soDucMoi + soCaiMoi;
        if (tong == 0) {
            throw new BusinessException("Phải phân giới ít nhất 1 con");
        }
        if (tong > soCaBot) {
            throw new BusinessException("Lô chỉ còn " + soCaBot + " cá bột để phân giới");
        }
        soCaBot -= tong;
        soDuc += soDucMoi;
        soCai += soCaiMoi;
        tinhLaiGiaiDoan();
        return new BienDongKho(getId(), null, LoaiBienDong.PHAN_GIOI, soDucMoi, soCaiMoi, -tong, ghiChu);
    }

    public BienDongKho ghiHaoHut(int chetDuc, int chetCai, int chetBot, String ghiChu) {
        kiemTraKhongAm(chetDuc, chetCai, chetBot);
        int tong = chetDuc + chetCai + chetBot;
        if (tong == 0) {
            throw new BusinessException("Phải ghi nhận ít nhất 1 con");
        }
        if (chetDuc > soDuc || chetCai > soCai || chetBot > soCaBot) {
            throw new BusinessException("Số cá hao hụt vượt quá số cá đang có trong lô");
        }
        soDuc -= chetDuc;
        soCai -= chetCai;
        soCaBot -= chetBot;
        haoHut += tong;
        return new BienDongKho(getId(), null, LoaiBienDong.HAO_HUT, -chetDuc, -chetCai, -chetBot, ghiChu);
    }

    /** Lấy tối đa số cá cần từ lô này; trả về phần đã lấy thực tế. */
    TonKho layToiDa(TonKho canLay) {
        TonKho lay = new TonKho(Math.min(canLay.duc(), soDuc), Math.min(canLay.cai(), soCai), Math.min(canLay.bot(), soCaBot));
        soDuc -= lay.duc();
        soCai -= lay.cai();
        soCaBot -= lay.bot();
        return lay;
    }

    /** Trả lại đúng số cá theo một dòng BAN khi đơn bị hủy. */
    public BienDongKho traLai(BienDongKho dongBan, String ghiChu) {
        soDuc -= dongBan.getDeltaDuc();
        soCai -= dongBan.getDeltaCai();
        soCaBot -= dongBan.getDeltaBot();
        return new BienDongKho(getId(), dongBan.getDonHangId(), LoaiBienDong.TRA_TON,
                -dongBan.getDeltaDuc(), -dongBan.getDeltaCai(), -dongBan.getDeltaBot(), ghiChu);
    }

    private void tinhLaiGiaiDoan() {
        boolean coTruongThanh = soDuc > 0 || soCai > 0;
        if (soCaBot == 0) {
            giaiDoan = GiaiDoanLo.TRUONG_THANH;
        } else {
            giaiDoan = coTruongThanh ? GiaiDoanLo.DANG_PHAN_GIOI : GiaiDoanLo.CA_BOT;
        }
    }

    private static void kiemTraKhongAm(int duc, int cai, int bot) {
        if (duc < 0 || cai < 0 || bot < 0) {
            throw new BusinessException("Số cá không được âm");
        }
    }
}
