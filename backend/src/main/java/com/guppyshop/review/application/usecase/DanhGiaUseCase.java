package com.guppyshop.review.application.usecase;

import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import com.guppyshop.identity.domain.model.NguoiDung;
import com.guppyshop.identity.domain.repository.NguoiDungRepository;
import com.guppyshop.ordering.domain.model.DonHang;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import com.guppyshop.ordering.domain.repository.DonHangRepository;
import com.guppyshop.review.application.dto.ReviewDtos.DanhGiaDto;
import com.guppyshop.review.application.dto.ReviewDtos.TaoDanhGiaCommand;
import com.guppyshop.review.domain.model.DanhGia;
import com.guppyshop.review.domain.repository.DanhGiaRepository;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DanhGiaUseCase {

    private final DanhGiaRepository danhGiaRepository;
    private final DonHangRepository donHangRepository;
    private final SanPhamRepository sanPhamRepository;
    private final NguoiDungRepository nguoiDungRepository;

    public DanhGiaUseCase(DanhGiaRepository danhGiaRepository, DonHangRepository donHangRepository,
                          SanPhamRepository sanPhamRepository, NguoiDungRepository nguoiDungRepository) {
        this.danhGiaRepository = danhGiaRepository;
        this.donHangRepository = donHangRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.nguoiDungRepository = nguoiDungRepository;
    }

    /** Chỉ khách đã mua và đã nhận hàng mới được đánh giá, mỗi sản phẩm trong một đơn một lần. */
    public DanhGiaDto danhGia(Long khachHangId, TaoDanhGiaCommand lenh) {
        DonHang don = donHangRepository.timTheoMaDon(lenh.maDon().strip().toUpperCase(Locale.ROOT))
                .filter(d -> khachHangId.equals(d.getKhachHangId()))
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));
        if (don.getTrangThai() != TrangThaiDon.HOAN_TAT) {
            throw new BusinessException("Chỉ đánh giá được đơn đã hoàn tất");
        }
        if (!don.coSanPham(lenh.sanPhamId())) {
            throw new BusinessException("Sản phẩm này không có trong đơn");
        }
        if (danhGiaRepository.daDanhGia(khachHangId, lenh.sanPhamId(), don.getId())) {
            throw new BusinessException("Bạn đã đánh giá sản phẩm này trong đơn này");
        }
        DanhGia moi = danhGiaRepository.luu(new DanhGia(khachHangId, lenh.sanPhamId(), don.getId(), lenh.soSao(), lenh.noiDung()));
        sanPhamRepository.ghiNhanDanhGia(lenh.sanPhamId(), lenh.soSao());
        return sangDto(moi, tenTheoId(List.of(khachHangId)));
    }

    @Transactional(readOnly = true)
    public Trang<DanhGiaDto> theoSanPham(Long sanPhamId, PhanTrang phanTrang) {
        Trang<DanhGia> ketQua = danhGiaRepository.timTheoSanPham(sanPhamId, phanTrang);
        Map<Long, String> ten = tenTheoId(ketQua.noiDung().stream().map(DanhGia::getKhachHangId).distinct().toList());
        return ketQua.chuyenDoi(d -> sangDto(d, ten));
    }

    private Map<Long, String> tenTheoId(List<Long> ids) {
        return nguoiDungRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(NguoiDung::getId, NguoiDung::getHoTen));
    }

    private DanhGiaDto sangDto(DanhGia danhGia, Map<Long, String> ten) {
        return new DanhGiaDto(danhGia.getId(), DanhGia.anTen(ten.get(danhGia.getKhachHangId())), danhGia.getSoSao(),
                danhGia.getNoiDung(), danhGia.getCreatedAt());
    }
}
