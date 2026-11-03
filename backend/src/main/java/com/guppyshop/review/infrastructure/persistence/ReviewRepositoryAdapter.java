package com.guppyshop.review.infrastructure.persistence;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.review.domain.model.DanhGia;
import com.guppyshop.review.domain.model.YeuCauBaoHanh;
import com.guppyshop.review.domain.repository.DanhGiaRepository;
import com.guppyshop.review.domain.repository.YeuCauBaoHanhRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

/** Hiện thực repository của đánh giá và bảo hành; cả hai đều chỉ cần truy vấn đơn giản. */
@Repository
class ReviewRepositoryAdapter implements DanhGiaRepository, YeuCauBaoHanhRepository {

    private final DanhGiaJpaRepository danhGiaJpa;
    private final YeuCauBaoHanhJpaRepository baoHanhJpa;

    ReviewRepositoryAdapter(DanhGiaJpaRepository danhGiaJpa, YeuCauBaoHanhJpaRepository baoHanhJpa) {
        this.danhGiaJpa = danhGiaJpa;
        this.baoHanhJpa = baoHanhJpa;
    }

    @Override
    public boolean daDanhGia(Long khachHangId, Long sanPhamId, Long donHangId) {
        return danhGiaJpa.existsByKhachHangIdAndSanPhamIdAndDonHangId(khachHangId, sanPhamId, donHangId);
    }

    @Override
    public DanhGia luu(DanhGia danhGia) {
        return danhGiaJpa.saveAndFlush(danhGia);
    }

    @Override
    public Trang<DanhGia> timTheoSanPham(Long sanPhamId, PhanTrang phanTrang) {
        return sangTrang(danhGiaJpa.findBySanPhamId(sanPhamId, moiNhat(phanTrang)));
    }

    @Override
    public boolean daCoYeuCau(Long donHangId) {
        return baoHanhJpa.existsByDonHangId(donHangId);
    }

    @Override
    public YeuCauBaoHanh luu(YeuCauBaoHanh yeuCau) {
        return baoHanhJpa.saveAndFlush(yeuCau);
    }

    @Override
    public Optional<YeuCauBaoHanh> timTheoId(Long id) {
        return baoHanhJpa.findById(id);
    }

    @Override
    public Trang<YeuCauBaoHanh> timChoNhanVien(boolean chuaXuLy, PhanTrang phanTrang) {
        Pageable yeuCau = moiNhat(phanTrang);
        return sangTrang(chuaXuLy ? baoHanhJpa.findByXuLyLucIsNull(yeuCau) : baoHanhJpa.findAll(yeuCau));
    }

    @Override
    public Trang<YeuCauBaoHanh> timTheoKhachHang(Long khachHangId, PhanTrang phanTrang) {
        return sangTrang(baoHanhJpa.findByKhachHangId(khachHangId, moiNhat(phanTrang)));
    }

    private Pageable moiNhat(PhanTrang phanTrang) {
        return PageRequest.of(phanTrang.trang(), phanTrang.kichThuoc(), Sort.by(Sort.Direction.DESC, "id"));
    }

    private <T> Trang<T> sangTrang(Page<T> trang) {
        return new Trang<>(trang.getContent(), trang.getNumber(), trang.getSize(), trang.getTotalElements());
    }
}
