package com.guppyshop.ordering.application.usecase;

import com.guppyshop.cart.application.dto.GioHangDtos.ChuGioHang;
import com.guppyshop.cart.domain.model.ChiTietGioHang;
import com.guppyshop.cart.domain.model.GioHang;
import com.guppyshop.cart.domain.repository.GioHangRepository;
import com.guppyshop.catalog.domain.model.LuaChonBan;
import com.guppyshop.catalog.domain.model.SanPham;
import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import com.guppyshop.identity.domain.model.KhachVangLai;
import com.guppyshop.identity.domain.model.NguoiMua;
import com.guppyshop.identity.domain.repository.NguoiDungRepository;
import com.guppyshop.ordering.application.dto.DonHangDtos.DatHangCommand;
import com.guppyshop.ordering.application.dto.DonHangDtos.DonHangDto;
import com.guppyshop.ordering.application.mapper.DonHangMapper;
import com.guppyshop.ordering.domain.model.ChiTietDonHang.DongMoi;
import com.guppyshop.ordering.domain.model.DonHang;
import com.guppyshop.ordering.domain.model.ThongTinNguoiNhan;
import com.guppyshop.ordering.domain.repository.DonHangRepository;
import com.guppyshop.payment.application.dto.ThanhToanDto;
import com.guppyshop.payment.application.usecase.ThanhToanUseCase;
import com.guppyshop.promotion.application.dto.MaGiamGiaDtos.KetQuaApMaDto;
import com.guppyshop.promotion.application.usecase.QuanLyMaGiamGiaUseCase;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Đặt hàng từ giỏ, cho cả khách vãng lai và khách hàng. Toàn bộ nằm trong một transaction:
 * thiếu tồn hoặc mã giảm giá lỗi thì đơn, lượt dùng mã và giỏ hàng đều giữ nguyên như trước.
 */
@Service
public class DatHangUseCase {

    private final GioHangRepository gioHangRepository;
    private final SanPhamRepository sanPhamRepository;
    private final DonHangRepository donHangRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final QuanLyMaGiamGiaUseCase maGiamGiaUseCase;
    private final ThanhToanUseCase thanhToanUseCase;
    private final TaoMaDon taoMaDon;
    private final DonHangMapper mapper;
    private final ApplicationEventPublisher suKien;

    public DatHangUseCase(GioHangRepository gioHangRepository, SanPhamRepository sanPhamRepository,
                          DonHangRepository donHangRepository, NguoiDungRepository nguoiDungRepository,
                          QuanLyMaGiamGiaUseCase maGiamGiaUseCase, ThanhToanUseCase thanhToanUseCase,
                          TaoMaDon taoMaDon, DonHangMapper mapper, ApplicationEventPublisher suKien) {
        this.gioHangRepository = gioHangRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.donHangRepository = donHangRepository;
        this.nguoiDungRepository = nguoiDungRepository;
        this.maGiamGiaUseCase = maGiamGiaUseCase;
        this.thanhToanUseCase = thanhToanUseCase;
        this.taoMaDon = taoMaDon;
        this.mapper = mapper;
        this.suKien = suKien;
    }

    @Transactional
    public DonHangDto datHang(DatHangCommand lenh) {
        GioHang gio = khoaGio(lenh.chu())
                .filter(g -> !g.getChiTiet().isEmpty())
                .orElseThrow(() -> new BusinessException("Giỏ hàng đang trống"));

        List<DongMoi> cacDong = taoCacDong(gio);
        BigDecimal tamTinh = cacDong.stream()
                .map(d -> d.donGia().multiply(BigDecimal.valueOf(d.soLuong())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Optional<KetQuaApMaDto> apMa = apMaGiamGia(lenh.maGiamGia(), tamTinh);

        NguoiMua nguoiMua = xacDinhNguoiMua(lenh);
        DonHang don = donHangRepository.luu(DonHang.builder()
                .maDon(taoMaDon.taoMoi())
                .khachHangId(nguoiMua.laKhachVangLai() ? null : nguoiMua.getId())
                .nguoiNhan(new ThongTinNguoiNhan(lenh.hoTen().strip(), lenh.soDienThoai(), lenh.diaChi().strip(),
                        lenh.thanhPho(), lenh.ghiChu()))
                .cacDong(cacDong)
                .giamGia(apMa.map(KetQuaApMaDto::tienGiam).orElse(null))
                .maGiamGiaId(apMa.map(KetQuaApMaDto::id).orElse(null))
                .build());

        ThanhToanDto thanhToan = thanhToanUseCase.khoiTao(lenh.phuongThuc(), don.getId(), don.getMaDon(),
                lenh.soDienThoai(), don.getTongTien());

        // OBSERVER: kho lắng nghe sự kiện này và giữ tồn ngay trong transaction hiện tại
        don.ghiNhanDaTao();
        don.laySuKienVaXoa().forEach(suKien::publishEvent);

        gio.lamTrong();
        return mapper.sangDto(don, thanhToan);
    }

    private Optional<GioHang> khoaGio(ChuGioHang chu) {
        return chu.khachHangId() != null
                ? gioHangRepository.khoaTheoKhachHangId(chu.khachHangId())
                : gioHangRepository.khoaTheoSessionId(chu.sessionId());
    }

    /** Giá lấy mới từ sản phẩm tại thời điểm đặt, không tin bất kỳ con số nào từ client. */
    private List<DongMoi> taoCacDong(GioHang gio) {
        List<Long> ids = gio.getChiTiet().stream().map(ChiTietGioHang::getSanPhamId).distinct().toList();
        Map<Long, SanPham> sanPham = sanPhamRepository.timTheoCacId(ids).stream()
                .collect(Collectors.toMap(SanPham::getId, Function.identity()));
        List<DongMoi> ketQua = new ArrayList<>();
        for (ChiTietGioHang dong : gio.getChiTiet()) {
            SanPham sp = sanPham.get(dong.getSanPhamId());
            LuaChonBan luaChon = dong.layLuaChon();
            if (sp == null || !sp.isDangBan() || !sp.coBan(luaChon)) {
                throw new BusinessException("Có sản phẩm trong giỏ đã ngừng bán, vui lòng xóa khỏi giỏ");
            }
            ketQua.add(new DongMoi(sp.getId(), sp.getTen(), luaChon.donVi(), luaChon.gioiTinh(), dong.getSoLuong(),
                    sp.tinhGia(luaChon, 1)));
        }
        return ketQua;
    }

    private Optional<KetQuaApMaDto> apMaGiamGia(String ma, BigDecimal tamTinh) {
        if (ma == null || ma.isBlank()) {
            return Optional.empty();
        }
        return Optional.of(maGiamGiaUseCase.apDung(ma, tamTinh));
    }

    /** ĐA HÌNH: DonHang chỉ cần biết NguoiMua có phải vãng lai không. */
    private NguoiMua xacDinhNguoiMua(DatHangCommand lenh) {
        Long khachHangId = lenh.chu().khachHangId();
        if (khachHangId == null) {
            return new KhachVangLai(lenh.hoTen(), lenh.soDienThoai());
        }
        return nguoiDungRepository.findById(khachHangId)
                .filter(NguoiMua.class::isInstance)
                .map(NguoiMua.class::cast)
                .orElseThrow(() -> new NotFoundException("Khách hàng không tồn tại"));
    }
}
