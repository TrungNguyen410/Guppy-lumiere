package com.guppyshop.inventory.infrastructure.persistence;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.inventory.domain.model.BienDongKho;
import com.guppyshop.inventory.domain.model.LoaiBienDong;
import com.guppyshop.inventory.domain.repository.BienDongKhoRepository;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
class BienDongKhoRepositoryAdapter implements BienDongKhoRepository {

    private final BienDongKhoJpaRepository jpa;

    BienDongKhoRepositoryAdapter(BienDongKhoJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Trang<BienDongKho> timMoiNhat(Long loCaId, PhanTrang phanTrang) {
        PageRequest yeuCau = PageRequest.of(phanTrang.trang(), phanTrang.kichThuoc(), Sort.by(Sort.Direction.DESC, "id"));
        Page<BienDongKho> trang = loCaId == null ? jpa.findAll(yeuCau) : jpa.findByLoCaId(loCaId, yeuCau);
        return new Trang<>(trang.getContent(), trang.getNumber(), trang.getSize(), trang.getTotalElements());
    }

    @Override
    public List<BienDongKho> timTheoDon(Long donHangId, LoaiBienDong loai) {
        return jpa.findByDonHangIdAndLoai(donHangId, loai);
    }

    @Override
    public boolean coBienDongLoai(Long loCaId, Collection<LoaiBienDong> cacLoai) {
        return jpa.existsByLoCaIdAndLoaiIn(loCaId, cacLoai);
    }

    @Override
    public void luu(BienDongKho bienDong) {
        jpa.save(bienDong);
    }

    @Override
    public void luuTatCa(Collection<BienDongKho> bienDong) {
        jpa.saveAll(bienDong);
    }

    @Override
    public void xoaTheoLo(Long loCaId) {
        jpa.xoaTheoLo(loCaId);
    }
}
