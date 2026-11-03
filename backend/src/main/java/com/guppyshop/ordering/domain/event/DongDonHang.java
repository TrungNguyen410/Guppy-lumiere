package com.guppyshop.ordering.domain.event;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;

/** Một dòng đơn trong sự kiện. Phụ kiện có donVi null. */
public record DongDonHang(Long sanPhamId, DonViBan donVi, GioiTinh gioiTinh, int soLuong) {
}
