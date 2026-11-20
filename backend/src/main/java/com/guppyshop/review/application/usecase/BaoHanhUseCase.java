package com.guppyshop.review.application.usecase;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import com.guppyshop.inventory.application.usecase.GiuTraTonUseCase;
import com.guppyshop.ordering.domain.model.DonHang;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import com.guppyshop.ordering.domain.repository.DonHangRepository;
import com.guppyshop.payment.application.usecase.ThanhToanUseCase;
import com.guppyshop.review.application.dto.ReviewDtos.BaoHanhDto;
import com.guppyshop.review.application.dto.ReviewDtos.TaoBaoHanhCommand;
import com.guppyshop.review.application.dto.ReviewDtos.XuLyBaoHanhCommand;
import com.guppyshop.review.domain.model.HinhThucBaoHanh;
import com.guppyshop.review.domain.model.YeuCauBaoHanh;
import com.guppyshop.review.domain.repository.YeuCauBaoHanhRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Luồng HOAN_TAT → BAO_HANH → HOAN_TAT. Đơn được khóa để hai yêu cầu đồng thời chỉ một yêu cầu thành công. */
@Service
@Transactional
public class BaoHanhUseCase {

    private static final int GHI_CHU_TOI_DA = 255;

    private final YeuCauBaoHanhRepository baoHanhRepository;
    private final DonHangRepository donHangRepository;
    private final ThanhToanUseCase thanhToanUseCase;
    private final GiuTraTonUseCase giuTraTonUseCase;

    public BaoHanhUseCase(YeuCauBaoHanhRepository baoHanhRepository, DonHangRepository donHangRepository,
                          ThanhToanUseCase thanhToanUseCase, GiuTraTonUseCase giuTraTonUseCase) {
        this.giuTraTonUseCase = giuTraTonUseCase;
        this.baoHanhRepository = baoHanhRepository;
        this.donHangRepository = donHangRepository;
        this.thanhToanUseCase = thanhToanUseCase;
    }

    /** Mỗi đơn chỉ được yêu cầu bảo hành một lần. */
    public BaoHanhDto taoYeuCau(Long khachHangId, TaoBaoHanhCommand lenh) {
        DonHang don = donHangRepository.khoaTheoMaDon(lenh.maDon().strip().toUpperCase(Locale.ROOT))
                .filter(d -> khachHangId.equals(d.getKhachHangId()))
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));
        if (baoHanhRepository.daCoYeuCau(don.getId())) {
            throw new BusinessException("Đơn này đã có yêu cầu bảo hành");
        }
        don.vaoBaoHanh(LocalDateTime.now());
        donHangRepository.luu(don);
        YeuCauBaoHanh yeuCau = baoHanhRepository.luu(
                new YeuCauBaoHanh(don.getId(), khachHangId, lenh.moTa().strip(), lenh.duongDanVideo().strip(), lenh.soCaChet()));
        return sangDto(yeuCau, don);
    }

    /**
     * Nhân viên xử lý xong thì đơn quay về HOAN_TAT, kết quả được ghi vào lịch sử đơn.
     * Hoàn tiền và xuất cá đổi chạy cùng transaction: thanh toán chưa thu hoặc kho thiếu cá thì yêu cầu vẫn chờ xử lý.
     * Hai nhân viên xử lý cùng lúc: đơn bị khóa, người sau gặp đơn đã HOAN_TAT nên bị từ chối và rollback.
     */
    public BaoHanhDto xuLy(Long yeuCauId, XuLyBaoHanhCommand lenh) {
        YeuCauBaoHanh yeuCau = baoHanhRepository.timTheoId(yeuCauId)
                .orElseThrow(() -> new NotFoundException("Yêu cầu bảo hành không tồn tại"));
        DonHang don = donHangRepository.khoaTheoId(yeuCau.getDonHangId())
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));
        yeuCau.xuLy(lenh.hinhThuc(), lenh.soTienHoan(), don.tienHang(), lenh.ghiChu(), LocalDateTime.now());
        don.chuyenTrangThai(TrangThaiDon.HOAN_TAT, catNgan("Bảo hành: " + yeuCau.tomTat()));
        donHangRepository.luu(don);
        if (yeuCau.getHinhThuc() == HinhThucBaoHanh.HOAN_TIEN) {
            thanhToanUseCase.hoanTienBaoHanh(don.getId(), yeuCau.getSoTienHoan());
        } else if (yeuCau.getHinhThuc() == HinhThucBaoHanh.DOI_CA) {
            giuTraTonUseCase.xuatDoiCaBaoHanh(don.getId(), don.getMaDon(), yeuCau.getSoCaChet());
        }
        return sangDto(yeuCau, don);
    }

    /** Cột ghi chú của lịch sử trạng thái chỉ chứa 255 ký tự. */
    private static String catNgan(String ghiChu) {
        return ghiChu.length() <= GHI_CHU_TOI_DA ? ghiChu : ghiChu.substring(0, GHI_CHU_TOI_DA - 1) + "…";
    }

    @Transactional(readOnly = true)
    public Trang<BaoHanhDto> danhSachChoNhanVien(boolean chuaXuLy, PhanTrang phanTrang) {
        return sangTrangDto(baoHanhRepository.timChoNhanVien(chuaXuLy, phanTrang));
    }

    @Transactional(readOnly = true)
    public Trang<BaoHanhDto> cuaKhach(Long khachHangId, PhanTrang phanTrang) {
        return sangTrangDto(baoHanhRepository.timTheoKhachHang(khachHangId, phanTrang));
    }

    private Trang<BaoHanhDto> sangTrangDto(Trang<YeuCauBaoHanh> trang) {
        List<Long> ids = trang.noiDung().stream().map(YeuCauBaoHanh::getDonHangId).distinct().toList();
        Map<Long, DonHang> don = donHangRepository.timTheoCacId(ids).stream()
                .collect(Collectors.toMap(DonHang::getId, Function.identity()));
        return trang.chuyenDoi(y -> sangDto(y, don.get(y.getDonHangId())));
    }

    private BaoHanhDto sangDto(YeuCauBaoHanh yeuCau, DonHang don) {
        return new BaoHanhDto(yeuCau.getId(), don.getMaDon(), don.getTrangThai(), don.getNguoiNhan().getHoTen(),
                don.getNguoiNhan().getSoDienThoai(), yeuCau.getMoTa(), yeuCau.getDuongDanVideo(), yeuCau.getSoCaChet(),
                yeuCau.getHinhThuc(), yeuCau.getSoTienHoan(), don.tienHang(), yeuCau.getKetQua(),
                yeuCau.getXuLyLuc(), yeuCau.getCreatedAt());
    }
}
