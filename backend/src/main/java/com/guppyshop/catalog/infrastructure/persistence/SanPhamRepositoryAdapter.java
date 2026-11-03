package com.guppyshop.catalog.infrastructure.persistence;

import com.guppyshop.catalog.domain.model.BoLocSanPham;
import com.guppyshop.catalog.domain.model.CaGuppy;
import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.SapXepSanPham;
import com.guppyshop.catalog.domain.model.GiaBanCa;
import com.guppyshop.catalog.domain.model.SanPham;
import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

/** Hiện thực REPOSITORY cho sản phẩm, dựng truy vấn lọc bằng Criteria API. */
@Repository
class SanPhamRepositoryAdapter implements SanPhamRepository {

    private final SanPhamJpaRepository jpa;

    SanPhamRepositoryAdapter(SanPhamJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Trang<SanPham> timKiem(BoLocSanPham boLoc, PhanTrang phanTrang) {
        Page<SanPham> trang = jpa.findAll(theoBoLoc(boLoc),
                PageRequest.of(phanTrang.trang(), phanTrang.kichThuoc(), thuTu(boLoc.sapXep())));
        return new Trang<>(trang.getContent(), trang.getNumber(), trang.getSize(), trang.getTotalElements());
    }

    @Override
    public Optional<SanPham> timTheoId(Long id) {
        return jpa.findById(id);
    }

    @Override
    public Optional<SanPham> timTheoSlug(String slug) {
        return jpa.findBySlug(slug);
    }

    @Override
    public boolean tonTaiSlug(String slug) {
        return jpa.existsBySlug(slug);
    }

    @Override
    public List<SanPham> timTheoCacId(Collection<Long> ids) {
        return jpa.findAllById(ids);
    }

    @Override
    public SanPham luu(SanPham sanPham) {
        return jpa.save(sanPham);
    }

    @Override
    public boolean giamTonPhuKien(Long id, int soLuong) {
        return jpa.giamTonPhuKien(id, soLuong) == 1;
    }

    @Override
    public void tangTonPhuKien(Long id, int soLuong) {
        jpa.tangTonPhuKien(id, soLuong);
    }

    @Override
    public void tangDaBan(Long id, int soLuong) {
        jpa.tangDaBan(id, soLuong);
    }

    @Override
    public void ghiNhanDanhGia(Long id, int soSao) {
        jpa.ghiNhanDanhGia(id, soSao);
    }

    /** Thêm id vào cuối để thứ tự ổn định khi phân trang. */
    private Sort thuTu(SapXepSanPham sapXep) {
        SapXepSanPham chon = sapXep == null ? SapXepSanPham.BAN_CHAY : sapXep;
        Sort chinh = switch (chon) {
            case BAN_CHAY -> Sort.by(Sort.Direction.DESC, "daBan");
            case DANH_GIA -> Sort.by(Sort.Direction.DESC, "diemDanhGia");
            case GIA_TANG -> Sort.by(Sort.Direction.ASC, "giaThapNhat");
            case GIA_GIAM -> Sort.by(Sort.Direction.DESC, "giaThapNhat");
        };
        return chinh.and(Sort.by(Sort.Direction.ASC, "id"));
    }

    private Specification<SanPham> theoBoLoc(BoLocSanPham boLoc) {
        return (root, query, cb) -> {
            List<Predicate> dieuKien = new ArrayList<>();
            if (boLoc.chiDangBan()) {
                dieuKien.add(cb.isTrue(root.get("dangBan")));
            }
            if (boLoc.tuKhoa() != null && !boLoc.tuKhoa().isBlank()) {
                dieuKien.add(cb.like(cb.lower(root.get("ten")), "%" + thoatKyTuLike(boLoc.tuKhoa()) + "%", '\\'));
            }
            if (boLoc.giaMin() != null) {
                dieuKien.add(cb.greaterThanOrEqualTo(root.get("giaThapNhat"), boLoc.giaMin()));
            }
            if (boLoc.giaMax() != null) {
                dieuKien.add(cb.lessThanOrEqualTo(root.get("giaThapNhat"), boLoc.giaMax()));
            }
            if (boLoc.loai() != null) {
                dieuKien.add(cb.equal(root.type(), boLoc.loai() == com.guppyshop.catalog.domain.model.CatalogEnums.LoaiSanPham.CA_GUPPY
                        ? CaGuppy.class : com.guppyshop.catalog.domain.model.PhuKien.class));
            }
            if (coGiaTri(boLoc.dong())) {
                Subquery<Long> ca = query.subquery(Long.class);
                Root<CaGuppy> c = ca.from(CaGuppy.class);
                ca.select(c.get("id")).where(c.get("dongCa").get("ma").in(boLoc.dong()));
                dieuKien.add(root.get("id").in(ca));
            }
            if (coGiaTri(boLoc.kieuDuoi())) {
                Subquery<Long> ca = query.subquery(Long.class);
                Root<CaGuppy> c = ca.from(CaGuppy.class);
                ca.select(c.get("id")).where(c.get("kieuDuoi").in(boLoc.kieuDuoi()));
                dieuKien.add(root.get("id").in(ca));
            }
            if (coGiaTri(boLoc.donVi())) {
                dieuKien.add(root.get("id").in(banTheoDonVi(query, boLoc.donVi())));
            }
            if (coGiaTri(boLoc.gioiTinh())) {
                Subquery<Long> gia = query.subquery(Long.class);
                Root<GiaBanCa> g = gia.from(GiaBanCa.class);
                gia.select(g.get("caGuppy").get("id")).where(g.get("gioiTinh").in(boLoc.gioiTinh()));
                dieuKien.add(root.get("id").in(gia));
            }
            return cb.and(dieuKien.toArray(Predicate[]::new));
        };
    }

    private Subquery<Long> banTheoDonVi(CriteriaQuery<?> query, List<DonViBan> donVi) {
        Subquery<Long> gia = query.subquery(Long.class);
        Root<GiaBanCa> g = gia.from(GiaBanCa.class);
        gia.select(g.get("caGuppy").get("id")).where(g.get("donVi").in(donVi));
        return gia;
    }

    private boolean coGiaTri(List<?> danhSach) {
        return danhSach != null && !danhSach.isEmpty();
    }

    private String thoatKyTuLike(String tuKhoa) {
        return tuKhoa.strip().toLowerCase(Locale.ROOT)
                .replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}
