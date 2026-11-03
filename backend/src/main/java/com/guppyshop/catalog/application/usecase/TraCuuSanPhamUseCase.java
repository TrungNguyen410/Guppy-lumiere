package com.guppyshop.catalog.application.usecase;

import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamChiTietDto;
import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamTomTatDto;
import com.guppyshop.catalog.application.mapper.SanPhamMapper;
import com.guppyshop.catalog.domain.model.BoLocSanPham;
import com.guppyshop.catalog.domain.model.CaGuppy;
import com.guppyshop.catalog.domain.model.SanPham;
import com.guppyshop.catalog.domain.model.TonKho;
import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.catalog.domain.repository.TonKhoReader;
import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.common.exception.NotFoundException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Đọc sản phẩm cho khách. Sản phẩm đã ngừng bán được coi như không tồn tại. */
@Service
@Transactional(readOnly = true)
public class TraCuuSanPhamUseCase {

    private final SanPhamRepository sanPhamRepository;
    private final TonKhoReader tonKhoReader;
    private final SanPhamMapper mapper;

    public TraCuuSanPhamUseCase(SanPhamRepository sanPhamRepository, TonKhoReader tonKhoReader, SanPhamMapper mapper) {
        this.sanPhamRepository = sanPhamRepository;
        this.tonKhoReader = tonKhoReader;
        this.mapper = mapper;
    }

    public Trang<SanPhamTomTatDto> timKiem(BoLocSanPham boLoc, PhanTrang phanTrang) {
        Trang<SanPham> ketQua = sanPhamRepository.timKiem(boLoc, phanTrang);
        // Đọc tồn kho một lần cho cả trang để tránh N+1
        List<Long> idCa = ketQua.noiDung().stream().filter(CaGuppy.class::isInstance).map(SanPham::getId).toList();
        Map<Long, TonKho> tonKho = tonKhoReader.layTonKho(idCa);
        return ketQua.chuyenDoi(sp -> mapper.sangTomTat(sp, tonKho.getOrDefault(sp.getId(), TonKho.TRONG)));
    }

    public SanPhamChiTietDto layTheoId(Long id) {
        return sangChiTiet(sanPhamRepository.timTheoId(id));
    }

    public SanPhamChiTietDto layTheoSlug(String slug) {
        return sangChiTiet(sanPhamRepository.timTheoSlug(slug));
    }

    private SanPhamChiTietDto sangChiTiet(Optional<SanPham> timThay) {
        SanPham sanPham = timThay.filter(SanPham::isDangBan)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));
        if (sanPham instanceof CaGuppy) {
            TonKho ton = tonKhoReader.layTonKho(List.of(sanPham.getId())).getOrDefault(sanPham.getId(), TonKho.TRONG);
            return mapper.sangChiTiet(sanPham, ton, tonKhoReader.layMaLo(sanPham.getId()));
        }
        return mapper.sangChiTiet(sanPham, TonKho.TRONG, List.of());
    }
}
