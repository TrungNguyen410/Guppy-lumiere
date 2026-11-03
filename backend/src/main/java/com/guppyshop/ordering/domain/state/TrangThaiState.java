package com.guppyshop.ordering.domain.state;

import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import java.util.EnumSet;
import java.util.Set;

/**
 * STATE: mỗi trạng thái tự quyết định được chuyển sang đâu, DonHang không cần chuỗi if-else.
 * <pre>
 * CHO_XAC_NHAN → DA_XAC_NHAN → DANG_DONG_GOI → DANG_GIAO → HOAN_TAT ⇄ BAO_HANH
 * Hủy được ở CHO_XAC_NHAN, DA_XAC_NHAN, DANG_GIAO → DA_HUY
 * </pre>
 */
public sealed interface TrangThaiState {

    TrangThaiDon ma();

    Set<TrangThaiDon> coTheChuyenSang();

    /** Khách vãng lai và khách hàng chỉ tự hủy được khi đơn còn chờ xác nhận. */
    default boolean khachDuocHuy() {
        return false;
    }

    /** Trả về trạng thái đích nếu hợp lệ, ngược lại báo lỗi nghiệp vụ. */
    default TrangThaiDon chuyenSang(TrangThaiDon dich) {
        if (!coTheChuyenSang().contains(dich)) {
            throw new BusinessException("Không thể chuyển đơn từ " + ma() + " sang " + dich);
        }
        return dich;
    }

    /** FACTORY: lấy đối tượng trạng thái từ giá trị lưu trong CSDL. */
    static TrangThaiState cua(TrangThaiDon trangThai) {
        return switch (trangThai) {
            case CHO_XAC_NHAN -> new ChoXacNhan();
            case DA_XAC_NHAN -> new DaXacNhan();
            case DANG_DONG_GOI -> new DangDongGoi();
            case DANG_GIAO -> new DangGiao();
            case HOAN_TAT -> new HoanTat();
            case DA_HUY -> new DaHuy();
            case BAO_HANH -> new BaoHanh();
        };
    }

    record ChoXacNhan() implements TrangThaiState {

        @Override
        public TrangThaiDon ma() {
            return TrangThaiDon.CHO_XAC_NHAN;
        }

        @Override
        public Set<TrangThaiDon> coTheChuyenSang() {
            return EnumSet.of(TrangThaiDon.DA_XAC_NHAN, TrangThaiDon.DA_HUY);
        }

        @Override
        public boolean khachDuocHuy() {
            return true;
        }
    }

    record DaXacNhan() implements TrangThaiState {

        @Override
        public TrangThaiDon ma() {
            return TrangThaiDon.DA_XAC_NHAN;
        }

        @Override
        public Set<TrangThaiDon> coTheChuyenSang() {
            return EnumSet.of(TrangThaiDon.DANG_DONG_GOI, TrangThaiDon.DA_HUY);
        }
    }

    /** Theo đề bài: không hủy được khi đang đóng gói. */
    record DangDongGoi() implements TrangThaiState {

        @Override
        public TrangThaiDon ma() {
            return TrangThaiDon.DANG_DONG_GOI;
        }

        @Override
        public Set<TrangThaiDon> coTheChuyenSang() {
            return EnumSet.of(TrangThaiDon.DANG_GIAO);
        }
    }

    record DangGiao() implements TrangThaiState {

        @Override
        public TrangThaiDon ma() {
            return TrangThaiDon.DANG_GIAO;
        }

        @Override
        public Set<TrangThaiDon> coTheChuyenSang() {
            return EnumSet.of(TrangThaiDon.HOAN_TAT, TrangThaiDon.DA_HUY);
        }
    }

    record HoanTat() implements TrangThaiState {

        @Override
        public TrangThaiDon ma() {
            return TrangThaiDon.HOAN_TAT;
        }

        @Override
        public Set<TrangThaiDon> coTheChuyenSang() {
            return EnumSet.of(TrangThaiDon.BAO_HANH);
        }
    }

    record DaHuy() implements TrangThaiState {

        @Override
        public TrangThaiDon ma() {
            return TrangThaiDon.DA_HUY;
        }

        @Override
        public Set<TrangThaiDon> coTheChuyenSang() {
            return EnumSet.noneOf(TrangThaiDon.class);
        }
    }

    record BaoHanh() implements TrangThaiState {

        @Override
        public TrangThaiDon ma() {
            return TrangThaiDon.BAO_HANH;
        }

        @Override
        public Set<TrangThaiDon> coTheChuyenSang() {
            return EnumSet.of(TrangThaiDon.HOAN_TAT);
        }
    }
}
