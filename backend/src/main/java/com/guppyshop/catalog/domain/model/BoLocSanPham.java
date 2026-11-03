package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.CatalogEnums.KieuDuoi;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiSanPham;
import com.guppyshop.catalog.domain.model.CatalogEnums.SapXepSanPham;
import java.math.BigDecimal;
import java.util.List;

/** Điều kiện lọc; danh sách rỗng hoặc null nghĩa là không lọc theo tiêu chí đó. */
public record BoLocSanPham(
        String tuKhoa,
        LoaiSanPham loai,
        List<String> dong,
        List<GioiTinh> gioiTinh,
        List<KieuDuoi> kieuDuoi,
        List<DonViBan> donVi,
        BigDecimal giaMin,
        BigDecimal giaMax,
        SapXepSanPham sapXep,
        boolean chiDangBan) {
}
