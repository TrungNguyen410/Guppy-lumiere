package com.guppyshop.catalog.application.usecase;

import com.guppyshop.catalog.application.dto.SanPhamDtos.LuuCaGuppyCommand;
import com.guppyshop.catalog.application.dto.SanPhamDtos.LuuPhuKienCommand;
import com.guppyshop.catalog.application.dto.SanPhamDtos.LuuSanPhamCommand;
import com.guppyshop.catalog.application.dto.SanPhamDtos.MucGiaCommand;
import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamChiTietDto;
import com.guppyshop.catalog.application.mapper.SanPhamMapper;
import com.guppyshop.catalog.domain.model.CaGuppy;
import com.guppyshop.catalog.domain.model.DongCa;
import com.guppyshop.catalog.domain.model.MucGia;
import com.guppyshop.catalog.domain.model.PhuKien;
import com.guppyshop.catalog.domain.model.SanPham;
import com.guppyshop.catalog.domain.model.TaoSlug;
import com.guppyshop.catalog.domain.model.ThongSoNuoc;
import com.guppyshop.catalog.domain.model.TonKho;
import com.guppyshop.catalog.domain.repository.DongCaRepository;
import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.catalog.domain.repository.TonKhoReader;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Admin quản lý sản phẩm. Xóa là ngừng bán, vì đơn cũ và lô cá vẫn tham chiếu đến sản phẩm. */
@Service
@Transactional
public class QuanLySanPhamUseCase {

    private final SanPhamRepository sanPhamRepository;
    private final DongCaRepository dongCaRepository;
    private final TonKhoReader tonKhoReader;
    private final SanPhamMapper mapper;

    public QuanLySanPhamUseCase(SanPhamRepository sanPhamRepository, DongCaRepository dongCaRepository,
                                TonKhoReader tonKhoReader, SanPhamMapper mapper) {
        this.sanPhamRepository = sanPhamRepository;
        this.dongCaRepository = dongCaRepository;
        this.tonKhoReader = tonKhoReader;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public SanPhamChiTietDto layTheoId(Long id) {
        return sangDto(laySanPham(id));
    }

    public SanPhamChiTietDto tao(LuuSanPhamCommand lenh) {
        String slug = taoSlugKhongTrung(lenh.ten());
        SanPham moi = switch (lenh) {
            case LuuCaGuppyCommand ca -> CaGuppy.builder()
                    .ten(ca.ten().strip()).slug(slug).moTa(ca.moTa()).nhan(ca.nhan())
                    .dongCa(layDongCa(ca.dongCaId())).kieuDuoi(ca.kieuDuoi()).mauSac(ca.mauSac())
                    .thuanChung(ca.thuanChung()).kichThuoc(ca.kichThuoc()).tuoiTuan(ca.tuoiTuan())
                    .soConMoiLo(ca.soConMoiLo()).thongSoNuoc(thongSoNuoc(ca)).bangGia(mucGia(ca.bangGia()))
                    .build();
            case LuuPhuKienCommand pk -> new PhuKien(pk.ten().strip(), slug, pk.moTa(), pk.nhan(),
                    pk.loaiPhuKien(), pk.gia(), pk.tonKho());
        };
        return sangDto(sanPhamRepository.luu(moi));
    }

    /** Slug giữ nguyên khi đổi tên để các đường dẫn đã chia sẻ không bị hỏng. */
    public SanPhamChiTietDto capNhat(Long id, LuuSanPhamCommand lenh) {
        SanPham sanPham = laySanPham(id);
        switch (lenh) {
            case LuuCaGuppyCommand ca when sanPham instanceof CaGuppy hienTai -> {
                hienTai.capNhatThongTinCa(layDongCa(ca.dongCaId()), ca.kieuDuoi(), ca.mauSac(), ca.thuanChung(),
                        ca.kichThuoc(), ca.tuoiTuan(), ca.soConMoiLo(), thongSoNuoc(ca));
                hienTai.capNhatBangGia(mucGia(ca.bangGia()));
            }
            case LuuPhuKienCommand pk when sanPham instanceof PhuKien hienTai ->
                    hienTai.capNhatThongTinPhuKien(pk.loaiPhuKien(), pk.gia(), pk.tonKho());
            default -> throw new BusinessException("Không thể đổi loại của sản phẩm đã có");
        }
        sanPham.capNhatThongTinChung(lenh.ten().strip(), lenh.moTa(), lenh.nhan());
        return sangDto(sanPham);
    }

    public void ngungBan(Long id) {
        laySanPham(id).ngungBan();
    }

    public SanPhamChiTietDto moBanLai(Long id) {
        SanPham sanPham = laySanPham(id);
        sanPham.moBanLai();
        return sangDto(sanPham);
    }

    private String taoSlugKhongTrung(String ten) {
        String goc = TaoSlug.tu(ten);
        if (goc.isEmpty()) {
            throw new BusinessException("Tên sản phẩm phải có chữ hoặc số");
        }
        String slug = goc;
        for (int soThuTu = 2; sanPhamRepository.tonTaiSlug(slug); soThuTu++) {
            slug = goc + "-" + soThuTu;
        }
        return slug;
    }

    private ThongSoNuoc thongSoNuoc(LuuCaGuppyCommand ca) {
        return new ThongSoNuoc(ca.nhietDoMin(), ca.nhietDoMax(), ca.phMin(), ca.phMax(), ca.doCung());
    }

    private List<MucGia> mucGia(List<MucGiaCommand> bangGia) {
        return bangGia.stream().map(m -> new MucGia(m.donVi(), m.gioiTinh(), m.gia())).toList();
    }

    private DongCa layDongCa(Long id) {
        return dongCaRepository.findById(id).orElseThrow(() -> new NotFoundException("Dòng cá không tồn tại"));
    }

    private SanPham laySanPham(Long id) {
        return sanPhamRepository.timTheoId(id).orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));
    }

    private SanPhamChiTietDto sangDto(SanPham sanPham) {
        if (sanPham instanceof CaGuppy && sanPham.getId() != null) {
            TonKho ton = tonKhoReader.layTonKho(List.of(sanPham.getId())).getOrDefault(sanPham.getId(), TonKho.TRONG);
            return mapper.sangChiTiet(sanPham, ton, tonKhoReader.layMaLo(sanPham.getId()));
        }
        return mapper.sangChiTiet(sanPham, TonKho.TRONG, List.of());
    }
}
