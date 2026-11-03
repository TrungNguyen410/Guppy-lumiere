package com.guppyshop.catalog.domain.model;

import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;

/** FACTORY: chọn Strategy theo đơn vị bán, switch trên enum bắt buộc xử lý đủ mọi giá trị. */
public final class ChienLuocBanFactory {

    private ChienLuocBanFactory() {
    }

    public static ChienLuocBan theoDonVi(DonViBan donVi) {
        return switch (donVi) {
            case CON_LE -> new ChienLuocBan.BanConLe();
            case CAP -> new ChienLuocBan.BanCap();
            case BO_BA -> new ChienLuocBan.BanBoBa();
            case LO_CA_BOT -> new ChienLuocBan.BanLoCaBot();
        };
    }
}
