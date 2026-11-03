package com.guppyshop.inventory.infrastructure.persistence;

import com.guppyshop.inventory.domain.model.LoCa;
import com.guppyshop.inventory.domain.repository.LoCaRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
class LoCaRepositoryAdapter implements LoCaRepository {

    private final LoCaJpaRepository jpa;

    LoCaRepositoryAdapter(LoCaJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public List<LoCa> timTatCa() {
        return jpa.findAllByOrderByNgayNoDescIdDesc();
    }

    @Override
    public List<LoCa> timTheoTuKhoa(String tuKhoa) {
        String thoat = tuKhoa.strip().toLowerCase(java.util.Locale.ROOT)
                .replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
        return jpa.timTheoMau("%" + thoat + "%");
    }

    @Override
    public Optional<LoCa> timTheoId(Long id) {
        return jpa.findById(id);
    }

    @Override
    public List<LoCa> timTheoCacId(Collection<Long> ids) {
        return jpa.findAllById(ids);
    }

    @Override
    public boolean tonTaiMaLo(String maLo) {
        return jpa.existsByMaLo(maLo);
    }

    @Override
    public List<LoCa> khoaTheoSanPham(Long caGuppyId) {
        return jpa.khoaTheoSanPham(caGuppyId);
    }

    @Override
    public List<LoCa> khoaTheoCacId(Collection<Long> ids) {
        return jpa.khoaTheoCacId(ids);
    }

    /** Ghi ngay để có id cho dòng nhật ký đầu tiên của lô. */
    @Override
    public LoCa luu(LoCa loCa) {
        return jpa.saveAndFlush(loCa);
    }

    @Override
    public void xoa(LoCa loCa) {
        jpa.delete(loCa);
    }
}
