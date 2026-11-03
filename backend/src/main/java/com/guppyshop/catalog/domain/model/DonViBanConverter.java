package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Cột don_vi không được null để khóa duy nhất của giỏ hàng có tác dụng (MySQL coi các NULL là khác nhau),
 * nên phụ kiện lưu KHONG_AP_DUNG. Trong Java giá trị này là null.
 */
@Converter
public class DonViBanConverter implements AttributeConverter<DonViBan, String> {

    private static final String KHONG_AP_DUNG = "KHONG_AP_DUNG";

    @Override
    public String convertToDatabaseColumn(DonViBan donVi) {
        return donVi == null ? KHONG_AP_DUNG : donVi.name();
    }

    @Override
    public DonViBan convertToEntityAttribute(String giaTri) {
        return giaTri == null || KHONG_AP_DUNG.equals(giaTri) ? null : DonViBan.valueOf(giaTri);
    }
}
