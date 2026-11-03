package com.guppyshop.ordering.infrastructure.persistence;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.ordering.domain.model.DonHang;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import com.guppyshop.ordering.domain.repository.DonHangRepository;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

@Repository
class DonHangRepositoryAdapter implements DonHangRepository {

    private final DonHangJpaRepository jpa;

    DonHangRepositoryAdapter(DonHangJpaRepository jpa) {
        this.jpa = jpa;
    }

    /** Ghi ngay để có id cho sự kiện và các bảng tham chiếu đến đơn. */
    @Override
    public DonHang luu(DonHang donHang) {
        return jpa.saveAndFlush(donHang);
    }

    @Override
    public boolean tonTaiMaDon(String maDon) {
        return jpa.existsByMaDon(maDon);
    }

    @Override
    public Optional<DonHang> timTheoMaDon(String maDon) {
        return jpa.findByMaDon(maDon);
    }

    @Override
    public Optional<DonHang> khoaTheoMaDon(String maDon) {
        return jpa.khoaTheoMaDon(maDon);
    }

    @Override
    public Optional<DonHang> khoaTheoId(Long id) {
        return jpa.khoaTheoId(id);
    }

    @Override
    public List<DonHang> timTheoCacId(Collection<Long> ids) {
        return jpa.findAllById(ids);
    }

    @Override
    public Trang<DonHang> timChoNhanVien(TrangThaiDon trangThai, String tuKhoa, PhanTrang phanTrang) {
        return sangTrang(jpa.timChoNhanVien(trangThai, sangMauLike(tuKhoa), moiNhat(phanTrang)));
    }

    @Override
    public Trang<DonHang> timTheoKhachHang(Long khachHangId, PhanTrang phanTrang) {
        return sangTrang(jpa.findByKhachHangId(khachHangId, moiNhat(phanTrang)));
    }

    private String sangMauLike(String tuKhoa) {
        if (tuKhoa == null || tuKhoa.isBlank()) {
            return null;
        }
        String thoat = tuKhoa.strip().toLowerCase(Locale.ROOT)
                .replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
        return "%" + thoat + "%";
    }

    private Pageable moiNhat(PhanTrang phanTrang) {
        return PageRequest.of(phanTrang.trang(), phanTrang.kichThuoc(), Sort.by(Sort.Direction.DESC, "id"));
    }

    private Trang<DonHang> sangTrang(Page<DonHang> trang) {
        return new Trang<>(trang.getContent(), trang.getNumber(), trang.getSize(), trang.getTotalElements());
    }
}
