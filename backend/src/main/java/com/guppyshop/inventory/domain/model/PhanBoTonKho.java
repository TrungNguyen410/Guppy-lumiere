package com.guppyshop.inventory.domain.model;

import com.guppyshop.catalog.domain.model.TonKho;
import com.guppyshop.common.exception.BusinessException;
import java.util.ArrayList;
import java.util.List;

/**
 * Lấy cá lần lượt từ các lô theo thứ tự truyền vào. Phép tính hoàn toàn trong bộ nhớ nên dễ kiểm thử;
 * khi không đủ cá thì báo lỗi và transaction bên ngoài rollback mọi thay đổi trên các lô.
 */
public final class PhanBoTonKho {

    private PhanBoTonKho() {
    }

    public static List<BienDongKho> xuatChoDon(List<LoCa> cacLo, TonKho canXuat, Long donHangId, String ghiChu) {
        List<BienDongKho> nhatKy = new ArrayList<>();
        TonKho conThieu = canXuat;
        for (LoCa lo : cacLo) {
            if (conThieu.equals(TonKho.TRONG)) {
                break;
            }
            TonKho daLay = lo.layToiDa(conThieu);
            if (!daLay.equals(TonKho.TRONG)) {
                nhatKy.add(new BienDongKho(lo.getId(), donHangId, LoaiBienDong.BAN,
                        -daLay.duc(), -daLay.cai(), -daLay.bot(), ghiChu));
                conThieu = new TonKho(conThieu.duc() - daLay.duc(), conThieu.cai() - daLay.cai(), conThieu.bot() - daLay.bot());
            }
        }
        if (!conThieu.equals(TonKho.TRONG)) {
            throw new BusinessException("Không đủ cá trong kho, vui lòng giảm số lượng");
        }
        return nhatKy;
    }
}
