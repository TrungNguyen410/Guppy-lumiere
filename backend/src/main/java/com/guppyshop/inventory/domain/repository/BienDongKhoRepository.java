package com.guppyshop.inventory.domain.repository;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.inventory.domain.model.BienDongKho;
import com.guppyshop.inventory.domain.model.LoaiBienDong;
import java.util.Collection;
import java.util.List;

public interface BienDongKhoRepository {

    Trang<BienDongKho> timMoiNhat(Long loCaId, PhanTrang phanTrang);

    List<BienDongKho> timTheoDon(Long donHangId, LoaiBienDong loai);

    boolean coBienDongLoai(Long loCaId, Collection<LoaiBienDong> cacLoai);

    void luu(BienDongKho bienDong);

    void luuTatCa(Collection<BienDongKho> bienDong);

    void xoaTheoLo(Long loCaId);
}
