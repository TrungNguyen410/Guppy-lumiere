package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.common.exception.BusinessException;
import java.math.BigDecimal;

/**
 * STRATEGY: mỗi đơn vị bán có cách tính giá và tính tồn khả dụng riêng.
 * Thêm đơn vị mới chỉ cần thêm một lớp, không phải sửa CaGuppy.
 */
public sealed interface ChienLuocBan {

    DonViBan donVi();

    /** Số đơn vị bán được với số cá hiện có. */
    int tonKhaDung(TonKho ton, GioiTinh gioiTinh, int soConMoiLo);

    /** Số cá đực, cái, bột cần xuất cho soLuong đơn vị. */
    TonKho soCaCan(GioiTinh gioiTinh, int soConMoiLo, int soLuong);

    default BigDecimal tinhGia(BigDecimal donGia, int soLuong) {
        if (soLuong <= 0) {
            throw new BusinessException("Số lượng phải lớn hơn 0");
        }
        return donGia.multiply(BigDecimal.valueOf(soLuong));
    }

    /** Con lẻ: đực và cái tính riêng. */
    record BanConLe() implements ChienLuocBan {

        @Override
        public DonViBan donVi() {
            return DonViBan.CON_LE;
        }

        @Override
        public int tonKhaDung(TonKho ton, GioiTinh gioiTinh, int soConMoiLo) {
            return gioiTinh == GioiTinh.CAI ? ton.cai() : ton.duc();
        }

        @Override
        public TonKho soCaCan(GioiTinh gioiTinh, int soConMoiLo, int soLuong) {
            return gioiTinh == GioiTinh.CAI ? new TonKho(0, soLuong, 0) : new TonKho(soLuong, 0, 0);
        }
    }

    /** Cặp: 1 đực + 1 cái. */
    record BanCap() implements ChienLuocBan {

        @Override
        public DonViBan donVi() {
            return DonViBan.CAP;
        }

        @Override
        public int tonKhaDung(TonKho ton, GioiTinh gioiTinh, int soConMoiLo) {
            return Math.min(ton.duc(), ton.cai());
        }

        @Override
        public TonKho soCaCan(GioiTinh gioiTinh, int soConMoiLo, int soLuong) {
            return new TonKho(soLuong, soLuong, 0);
        }
    }

    /** Bộ ba: 1 đực + 2 cái. */
    record BanBoBa() implements ChienLuocBan {

        @Override
        public DonViBan donVi() {
            return DonViBan.BO_BA;
        }

        @Override
        public int tonKhaDung(TonKho ton, GioiTinh gioiTinh, int soConMoiLo) {
            return Math.min(ton.duc(), ton.cai() / 2);
        }

        @Override
        public TonKho soCaCan(GioiTinh gioiTinh, int soConMoiLo, int soLuong) {
            return new TonKho(soLuong, soLuong * 2, 0);
        }
    }

    /** Lô cá bột: số con mỗi lô do từng sản phẩm quy định. */
    record BanLoCaBot() implements ChienLuocBan {

        @Override
        public DonViBan donVi() {
            return DonViBan.LO_CA_BOT;
        }

        @Override
        public int tonKhaDung(TonKho ton, GioiTinh gioiTinh, int soConMoiLo) {
            return ton.bot() / soConMoiLo;
        }

        @Override
        public TonKho soCaCan(GioiTinh gioiTinh, int soConMoiLo, int soLuong) {
            return new TonKho(0, 0, soLuong * soConMoiLo);
        }
    }
}
