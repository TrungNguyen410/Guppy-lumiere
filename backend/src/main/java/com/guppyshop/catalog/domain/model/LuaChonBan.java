package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;

/** Người mua chọn gì: đơn vị và giới tính. Phụ kiện có donVi null, gioiTinh KHONG_AP_DUNG. */
public record LuaChonBan(DonViBan donVi, GioiTinh gioiTinh) {

    public static final LuaChonBan PHU_KIEN = new LuaChonBan(null, GioiTinh.KHONG_AP_DUNG);
}
