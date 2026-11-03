package com.guppyshop.catalog.application.mapper;

import com.guppyshop.catalog.application.dto.SanPhamDtos.DongCaDto;
import com.guppyshop.catalog.application.dto.SanPhamDtos.GiaBanDto;
import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamChiTietDto;
import com.guppyshop.catalog.application.dto.SanPhamDtos.SanPhamTomTatDto;
import com.guppyshop.catalog.application.dto.SanPhamDtos.ThongSoNuocDto;
import com.guppyshop.catalog.domain.model.CaGuppy;
import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.DongCa;
import com.guppyshop.catalog.domain.model.GiaBanCa;
import com.guppyshop.catalog.domain.model.PhuKien;
import com.guppyshop.catalog.domain.model.SanPham;
import com.guppyshop.catalog.domain.model.ThongSoNuoc;
import com.guppyshop.catalog.domain.model.TonKho;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;

/** MapStruct sinh các phép chép trường; phần phân nhánh theo loại sản phẩm viết tay. */
@Mapper
public interface SanPhamMapper {

    DongCaDto sangDongCa(DongCa dongCa);

    ThongSoNuocDto sangThongSoNuoc(ThongSoNuoc thongSoNuoc);

    default SanPhamTomTatDto sangTomTat(SanPham sanPham, TonKho ton) {
        CaGuppy ca = sanPham instanceof CaGuppy c ? c : null;
        PhuKien phuKien = sanPham instanceof PhuKien p ? p : null;
        Set<DonViBan> donVi = ca == null ? null : ca.getBangGia().stream().map(GiaBanCa::getDonVi)
                .collect(Collectors.toCollection(() -> EnumSet.noneOf(DonViBan.class)));
        return new SanPhamTomTatDto(sanPham.getId(), sanPham.layLoai(), sanPham.getTen(), sanPham.getSlug(),
                sanPham.getDiemDanhGia(), sanPham.getDaBan(), Set.copyOf(sanPham.getNhan()), sanPham.getGiaThapNhat(),
                sanPham.conHang(ton), sanPham.isDangBan(),
                ca == null ? null : sangDongCa(ca.getDongCa()),
                ca == null ? null : ca.getKieuDuoi(),
                donVi,
                phuKien == null ? null : phuKien.getLoaiPhuKien());
    }

    default SanPhamChiTietDto sangChiTiet(SanPham sanPham, TonKho ton, List<String> maLo) {
        SanPhamTomTatDto tomTat = sangTomTat(sanPham, ton);
        if (sanPham instanceof CaGuppy ca) {
            List<GiaBanDto> bangGia = ca.getBangGia().stream()
                    .sorted(Comparator.comparing(GiaBanCa::getDonVi).thenComparing(GiaBanCa::getGioiTinh))
                    .map(g -> new GiaBanDto(g.getDonVi(), g.getGioiTinh(), g.getGia(),
                            ca.tonKhaDung(g.getDonVi(), g.getGioiTinh(), ton)))
                    .toList();
            return new SanPhamChiTietDto(tomTat, ca.getMoTa(), ca.getSoDanhGia(), bangGia, ca.getMauSac(),
                    ca.isThuanChung(), ca.getKichThuoc(), ca.getTuoiTuan(), ca.getSoConMoiLo(),
                    sangThongSoNuoc(ca.getThongSoNuoc()), maLo, null);
        }
        PhuKien phuKien = (PhuKien) sanPham;
        return new SanPhamChiTietDto(tomTat, phuKien.getMoTa(), phuKien.getSoDanhGia(), null, null, null, null, null,
                null, null, null, phuKien.getTonKho());
    }
}
