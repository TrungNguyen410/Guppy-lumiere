package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.common.exception.BusinessException;
import java.math.BigDecimal;

/** Một mức giá khi nhập liệu; hàm tạo bảo đảm CON_LE có giới tính, đơn vị khác thì không. */
public record MucGia(DonViBan donVi, GioiTinh gioiTinh, BigDecimal gia) {

    public MucGia {
        boolean laConLe = donVi == DonViBan.CON_LE;
        boolean coGioiTinh = gioiTinh == GioiTinh.DUC || gioiTinh == GioiTinh.CAI;
        if (laConLe && !coGioiTinh) {
            throw new BusinessException("Giá con lẻ phải chọn giới tính đực hoặc cái");
        }
        if (!laConLe && coGioiTinh) {
            throw new BusinessException("Chỉ giá con lẻ mới có giới tính");
        }
        if (!laConLe) {
            gioiTinh = GioiTinh.KHONG_AP_DUNG;
        }
        if (gia.signum() <= 0) {
            throw new BusinessException("Giá phải lớn hơn 0");
        }
    }
}
