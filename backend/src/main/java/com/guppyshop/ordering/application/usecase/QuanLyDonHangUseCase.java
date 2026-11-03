package com.guppyshop.ordering.application.usecase;

import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import com.guppyshop.ordering.application.dto.DonHangDtos.ChuyenTrangThaiCommand;
import com.guppyshop.ordering.application.dto.DonHangDtos.DonHangDto;
import com.guppyshop.ordering.application.mapper.DonHangMapper;
import com.guppyshop.ordering.domain.model.DonHang;
import com.guppyshop.ordering.domain.model.TrangThaiDon;
import com.guppyshop.ordering.domain.repository.DonHangRepository;
import com.guppyshop.payment.application.dto.ThanhToanDto;
import com.guppyshop.payment.application.usecase.ThanhToanUseCase;
import java.util.List;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Tra cứu, hủy đơn và chuyển trạng thái. */
@Service
@Transactional
public class QuanLyDonHangUseCase {

    /** Cùng một thông báo cho sai mã và sai SĐT để không dò được mã đơn nào tồn tại. */
    private static final String KHONG_TIM_THAY = "Không tìm thấy đơn hàng, kiểm tra lại mã đơn và số điện thoại";

    private final DonHangRepository donHangRepository;
    private final ThanhToanUseCase thanhToanUseCase;
    private final DonHangMapper mapper;
    private final ApplicationEventPublisher suKien;

    public QuanLyDonHangUseCase(DonHangRepository donHangRepository, ThanhToanUseCase thanhToanUseCase,
                                DonHangMapper mapper, ApplicationEventPublisher suKien) {
        this.donHangRepository = donHangRepository;
        this.thanhToanUseCase = thanhToanUseCase;
        this.mapper = mapper;
        this.suKien = suKien;
    }

    @Transactional(readOnly = true)
    public DonHangDto traCuu(String maDon, String soDienThoai) {
        DonHang don = donHangRepository.timTheoMaDon(chuanHoaMa(maDon))
                .filter(d -> d.khopSoDienThoai(soDienThoai))
                .orElseThrow(() -> new NotFoundException(KHONG_TIM_THAY));
        return sangDto(don);
    }

    public DonHangDto khachHuy(String maDon, String soDienThoai) {
        DonHang don = donHangRepository.khoaTheoMaDon(chuanHoaMa(maDon))
                .filter(d -> d.khopSoDienThoai(soDienThoai))
                .orElseThrow(() -> new NotFoundException(KHONG_TIM_THAY));
        don.khachHuy();
        return luuVaPhatSuKien(don);
    }

    /** Vào bảo hành phải qua yêu cầu của khách để kiểm tra chủ đơn và hạn 24h. */
    public DonHangDto nhanVienChuyenTrangThai(Long id, ChuyenTrangThaiCommand lenh) {
        if (lenh.trangThai() == TrangThaiDon.BAO_HANH) {
            throw new BusinessException("Đơn chỉ vào bảo hành khi khách gửi yêu cầu");
        }
        DonHang don = donHangRepository.khoaTheoId(id)
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));
        // Kết thúc bảo hành phải ghi lại kết quả xử lý nên đi qua API bảo hành, không qua đây
        if (don.getTrangThai() == TrangThaiDon.BAO_HANH) {
            throw new BusinessException("Đơn đang bảo hành, vui lòng xử lý qua yêu cầu bảo hành");
        }
        don.chuyenTrangThai(lenh.trangThai(), lenh.ghiChu());
        return luuVaPhatSuKien(don);
    }

    @Transactional(readOnly = true)
    public Trang<DonHangDto> danhSachChoNhanVien(TrangThaiDon trangThai, String tuKhoa, PhanTrang phanTrang) {
        return sangTrangDto(donHangRepository.timChoNhanVien(trangThai, tuKhoa, phanTrang));
    }

    @Transactional(readOnly = true)
    public Trang<DonHangDto> lichSuCuaKhach(Long khachHangId, PhanTrang phanTrang) {
        return sangTrangDto(donHangRepository.timTheoKhachHang(khachHangId, phanTrang));
    }

    @Transactional(readOnly = true)
    public DonHangDto chiTietCuaKhach(Long khachHangId, String maDon) {
        DonHang don = donHangRepository.timTheoMaDon(chuanHoaMa(maDon))
                .filter(d -> khachHangId.equals(d.getKhachHangId()))
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));
        return sangDto(don);
    }

    private DonHangDto luuVaPhatSuKien(DonHang don) {
        donHangRepository.luu(don);
        don.laySuKienVaXoa().forEach(suKien::publishEvent);
        return sangDto(don);
    }

    private DonHangDto sangDto(DonHang don) {
        return mapper.sangDto(don, thanhToanUseCase.layTheoCacDon(List.of(don.getId())).get(don.getId()));
    }

    /** Đọc thanh toán một lần cho cả trang để tránh N+1. */
    private Trang<DonHangDto> sangTrangDto(Trang<DonHang> trang) {
        Map<Long, ThanhToanDto> thanhToan = thanhToanUseCase.layTheoCacDon(trang.noiDung().stream().map(DonHang::getId).toList());
        return trang.chuyenDoi(d -> mapper.sangDto(d, thanhToan.get(d.getId())));
    }

    private String chuanHoaMa(String maDon) {
        return maDon.strip().toUpperCase(java.util.Locale.ROOT);
    }
}
