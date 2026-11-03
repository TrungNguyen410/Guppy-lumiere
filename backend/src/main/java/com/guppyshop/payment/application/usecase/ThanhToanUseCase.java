package com.guppyshop.payment.application.usecase;

import com.guppyshop.common.exception.NotFoundException;
import com.guppyshop.payment.application.dto.ThanhToanDto;
import com.guppyshop.payment.domain.model.CongThanhToan;
import com.guppyshop.payment.domain.model.PhuongThucThanhToan;
import com.guppyshop.payment.domain.model.ThanhToan;
import com.guppyshop.payment.domain.model.ThanhToanFactory;
import com.guppyshop.payment.domain.repository.ThanhToanRepository;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ThanhToanUseCase {

    private final ThanhToanRepository thanhToanRepository;
    private final CongThanhToan congThanhToan;

    public ThanhToanUseCase(ThanhToanRepository thanhToanRepository, CongThanhToan congThanhToan) {
        this.thanhToanRepository = thanhToanRepository;
        this.congThanhToan = congThanhToan;
    }

    public ThanhToanDto khoiTao(PhuongThucThanhToan phuongThuc, Long donHangId, String maDon, String soDienThoai, BigDecimal soTien) {
        ThanhToan thanhToan = ThanhToanFactory.tao(phuongThuc, donHangId, soTien);
        thanhToan.thucHien(congThanhToan, maDon, soDienThoai);
        return sangDto(thanhToanRepository.save(thanhToan));
    }

    public ThanhToanDto xacNhanDaNhanTien(Long donHangId) {
        ThanhToan thanhToan = thanhToanRepository.findByDonHangId(donHangId)
                .orElseThrow(() -> new NotFoundException("Đơn hàng không có thanh toán"));
        thanhToan.xacNhanDaNhanTien();
        return sangDto(thanhToan);
    }

    public void khiDonHoanTat(Long donHangId) {
        thanhToanRepository.findByDonHangId(donHangId).ifPresent(ThanhToan::khiDonHoanTat);
    }

    public void khiDonBiHuy(Long donHangId) {
        thanhToanRepository.findByDonHangId(donHangId).ifPresent(ThanhToan::khiDonBiHuy);
    }

    @Transactional(readOnly = true)
    public Map<Long, ThanhToanDto> layTheoCacDon(Collection<Long> donHangIds) {
        return thanhToanRepository.findByDonHangIdIn(donHangIds).stream()
                .collect(Collectors.toMap(ThanhToan::getDonHangId, this::sangDto));
    }

    private ThanhToanDto sangDto(ThanhToan thanhToan) {
        boolean chuyenKhoan = thanhToan.layPhuongThuc() == PhuongThucThanhToan.CHUYEN_KHOAN;
        CongThanhToan.ThongTinChuyenKhoan tk = chuyenKhoan ? congThanhToan.thongTinNhanTien() : null;
        return new ThanhToanDto(thanhToan.layPhuongThuc(), thanhToan.getTrangThai(), thanhToan.getSoTien(), thanhToan.getDaTraLuc(),
                thanhToan.getNoiDungCk(),
                tk == null ? null : tk.nganHang(),
                tk == null ? null : tk.soTaiKhoan(),
                tk == null ? null : tk.chuTaiKhoan());
    }
}
