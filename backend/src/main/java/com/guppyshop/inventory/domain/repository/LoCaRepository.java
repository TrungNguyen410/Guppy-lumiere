package com.guppyshop.inventory.domain.repository;

import com.guppyshop.inventory.domain.model.LoCa;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface LoCaRepository {

    List<LoCa> timTatCa();

    /** Tìm theo mã lô hoặc bể nuôi. */
    List<LoCa> timTheoTuKhoa(String tuKhoa);

    Optional<LoCa> timTheoId(Long id);

    List<LoCa> timTheoCacId(Collection<Long> ids);

    boolean tonTaiMaLo(String maLo);

    /** Khóa các lô của sản phẩm đến hết transaction, lô nở sớm xếp trước để cá lớn được bán trước. */
    List<LoCa> khoaTheoSanPham(Long caGuppyId);

    /** Khóa theo thứ tự id cố định để hai đơn hủy đồng thời không gây deadlock. */
    List<LoCa> khoaTheoCacId(Collection<Long> ids);

    LoCa luu(LoCa loCa);

    void xoa(LoCa loCa);
}
