package com.guppyshop.cart.application.usecase;

import com.guppyshop.cart.application.dto.GioHangDtos.ChuGioHang;
import com.guppyshop.cart.application.dto.GioHangDtos.DongGioDto;
import com.guppyshop.cart.application.dto.GioHangDtos.GioHangDto;
import com.guppyshop.cart.application.dto.GioHangDtos.ThemVaoGioCommand;
import com.guppyshop.cart.domain.model.ChiTietGioHang;
import com.guppyshop.cart.domain.model.GioHang;
import com.guppyshop.cart.domain.repository.GioHangRepository;
import com.guppyshop.catalog.application.mapper.SanPhamMapper;
import com.guppyshop.catalog.domain.model.CaGuppy;
import com.guppyshop.catalog.domain.model.LuaChonBan;
import com.guppyshop.catalog.domain.model.SanPham;
import com.guppyshop.catalog.domain.model.TonKho;
import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.catalog.domain.repository.TonKhoReader;
import com.guppyshop.common.domain.PhiGiaoHang;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GioHangUseCase {

    private static final String CHUOI_SESSION_HOP_LE = "[A-Za-z0-9-]{8,64}";

    private final GioHangRepository gioHangRepository;
    private final SanPhamRepository sanPhamRepository;
    private final TonKhoReader tonKhoReader;
    private final SanPhamMapper sanPhamMapper;

    public GioHangUseCase(GioHangRepository gioHangRepository, SanPhamRepository sanPhamRepository,
                          TonKhoReader tonKhoReader, SanPhamMapper sanPhamMapper) {
        this.gioHangRepository = gioHangRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.tonKhoReader = tonKhoReader;
        this.sanPhamMapper = sanPhamMapper;
    }

    /** Chưa có giỏ thì trả về giỏ rỗng, không tạo dòng trong CSDL chỉ vì khách xem trang. */
    @Transactional(readOnly = true)
    public GioHangDto xem(ChuGioHang chu) {
        return sangDto(timGio(chu).map(GioHang::getChiTiet).orElse(List.of()));
    }

    public GioHangDto them(ChuGioHang chu, ThemVaoGioCommand lenh) {
        SanPham sanPham = sanPhamRepository.timTheoId(lenh.sanPhamId())
                .filter(SanPham::isDangBan)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));
        LuaChonBan luaChon = sanPham.chuanHoaLuaChon(lenh.donVi(), lenh.gioiTinh());
        GioHang gio = timGio(chu).orElseGet(() -> taoGio(chu));
        int daCo = gio.timDong(sanPham.getId(), luaChon).map(ChiTietGioHang::getSoLuong).orElse(0);
        kiemTraTon(sanPham, luaChon, daCo + lenh.soLuong());
        gio.them(sanPham.getId(), luaChon, lenh.soLuong());
        return luuVaTraVe(gio);
    }

    public GioHangDto doiSoLuong(ChuGioHang chu, Long chiTietId, int soLuong) {
        GioHang gio = layGio(chu);
        ChiTietGioHang dong = gio.layDong(chiTietId);
        // Giảm số lượng luôn được phép, kể cả khi sản phẩm đã hết hàng hoặc ngừng bán
        if (soLuong > dong.getSoLuong()) {
            SanPham sanPham = sanPhamRepository.timTheoId(dong.getSanPhamId())
                    .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));
            kiemTraTon(sanPham, dong.layLuaChon(), soLuong);
        }
        gio.doiSoLuong(chiTietId, soLuong);
        return luuVaTraVe(gio);
    }

    public GioHangDto xoaDong(ChuGioHang chu, Long chiTietId) {
        GioHang gio = layGio(chu);
        gio.xoaDong(chiTietId);
        return luuVaTraVe(gio);
    }

    public GioHangDto lamTrong(ChuGioHang chu) {
        timGio(chu).ifPresent(GioHang::lamTrong);
        return sangDto(List.of());
    }

    /**
     * Gộp giỏ session vào tài khoản sau khi đăng nhập. Không chặn theo tồn: khách không nên mất
     * hàng đã chọn chỉ vì đăng nhập, phần vượt tồn được đánh dấu vuotTon để khách tự chỉnh.
     */
    public GioHangDto gopGio(Long khachHangId, String sessionId) {
        ChuGioHang chuTaiKhoan = new ChuGioHang(khachHangId, null);
        if (sessionId == null || sessionId.isBlank()) {
            return xem(chuTaiKhoan);
        }
        kiemTraSession(sessionId);
        Optional<GioHang> gioSession = gioHangRepository.findBySessionId(sessionId);
        if (gioSession.isEmpty()) {
            return xem(chuTaiKhoan);
        }
        GioHang gioTaiKhoan = timGio(chuTaiKhoan).orElseGet(() -> taoGio(chuTaiKhoan));
        gioTaiKhoan.gopTu(gioSession.get());
        gioHangRepository.delete(gioSession.get());
        return luuVaTraVe(gioTaiKhoan);
    }

    private GioHangDto luuVaTraVe(GioHang gio) {
        gioHangRepository.save(gio);
        gioHangRepository.flush();
        return sangDto(gio.getChiTiet());
    }

    private void kiemTraTon(SanPham sanPham, LuaChonBan luaChon, int soLuongCan) {
        int conLai = sanPham.conLai(luaChon, tonKho(sanPham));
        if (conLai == 0) {
            throw new BusinessException("Sản phẩm đã hết hàng");
        }
        if (soLuongCan > conLai) {
            throw new BusinessException("Chỉ còn " + conLai + " đơn vị trong kho");
        }
    }

    private TonKho tonKho(SanPham sanPham) {
        if (!(sanPham instanceof CaGuppy)) {
            return TonKho.TRONG;
        }
        return tonKhoReader.layTonKho(List.of(sanPham.getId())).getOrDefault(sanPham.getId(), TonKho.TRONG);
    }

    private GioHang taoGio(ChuGioHang chu) {
        return gioHangRepository.save(chu.khachHangId() != null
                ? GioHang.choKhachHang(chu.khachHangId())
                : GioHang.choSession(chu.sessionId()));
    }

    private GioHang layGio(ChuGioHang chu) {
        return timGio(chu).orElseThrow(() -> new NotFoundException("Dòng này không có trong giỏ hàng"));
    }

    private Optional<GioHang> timGio(ChuGioHang chu) {
        if (chu.khachHangId() != null) {
            return gioHangRepository.findByKhachHangId(chu.khachHangId());
        }
        kiemTraSession(chu.sessionId());
        return gioHangRepository.findBySessionId(chu.sessionId());
    }

    private void kiemTraSession(String sessionId) {
        if (sessionId == null || !sessionId.matches(CHUOI_SESSION_HOP_LE)) {
            throw new BusinessException("Thiếu hoặc sai header X-Session-Id");
        }
    }

    private GioHangDto sangDto(List<ChiTietGioHang> cacDong) {
        List<Long> idSanPham = cacDong.stream().map(ChiTietGioHang::getSanPhamId).distinct().toList();
        Map<Long, SanPham> sanPham = sanPhamRepository.timTheoCacId(idSanPham).stream()
                .collect(Collectors.toMap(SanPham::getId, Function.identity()));
        Map<Long, TonKho> tonKho = tonKhoReader.layTonKho(sanPham.values().stream()
                .filter(CaGuppy.class::isInstance).map(SanPham::getId).toList());

        List<DongGioDto> dong = cacDong.stream()
                .map(d -> sangDong(d, sanPham.get(d.getSanPhamId()), tonKho.getOrDefault(d.getSanPhamId(), TonKho.TRONG)))
                .toList();
        BigDecimal tamTinh = dong.stream().filter(DongGioDto::conBan).map(DongGioDto::thanhTien).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal phiGiao = PhiGiaoHang.tinh(tamTinh);
        return new GioHangDto(dong, cacDong.stream().mapToInt(ChiTietGioHang::getSoLuong).sum(), tamTinh, phiGiao, tamTinh.add(phiGiao));
    }

    private DongGioDto sangDong(ChiTietGioHang dong, SanPham sanPham, TonKho ton) {
        LuaChonBan luaChon = dong.layLuaChon();
        boolean conBan = sanPham.isDangBan() && sanPham.coBan(luaChon);
        BigDecimal donGia = conBan ? sanPham.tinhGia(luaChon, 1) : null;
        BigDecimal thanhTien = conBan ? sanPham.tinhGia(luaChon, dong.getSoLuong()) : BigDecimal.ZERO;
        int conLai = conBan ? sanPham.conLai(luaChon, ton) : 0;
        return new DongGioDto(dong.getId(), sanPhamMapper.sangTomTat(sanPham, ton), dong.getDonVi(), dong.getGioiTinh(),
                dong.getSoLuong(), donGia, thanhTien, conLai, conBan, dong.getSoLuong() > conLai);
    }
}
