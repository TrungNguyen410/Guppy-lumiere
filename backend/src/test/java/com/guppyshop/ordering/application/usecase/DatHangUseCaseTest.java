package com.guppyshop.ordering.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.guppyshop.cart.application.dto.GioHangDtos.ChuGioHang;
import com.guppyshop.cart.domain.model.GioHang;
import com.guppyshop.cart.domain.repository.GioHangRepository;
import com.guppyshop.catalog.domain.model.CaGuppy;
import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.CatalogEnums.KieuDuoi;
import com.guppyshop.catalog.domain.model.CatalogEnums.LoaiPhuKien;
import com.guppyshop.catalog.domain.model.LuaChonBan;
import com.guppyshop.catalog.domain.model.MucGia;
import com.guppyshop.catalog.domain.model.PhuKien;
import com.guppyshop.catalog.domain.model.ThongSoNuoc;
import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.identity.domain.model.KhachHang;
import com.guppyshop.identity.domain.model.NhanVien;
import com.guppyshop.identity.domain.repository.NguoiDungRepository;
import com.guppyshop.ordering.application.dto.DonHangDtos.DatHangCommand;
import com.guppyshop.ordering.application.mapper.DonHangMapper;
import com.guppyshop.ordering.domain.event.DonHangDaTaoEvent;
import com.guppyshop.ordering.domain.model.DonHang;
import com.guppyshop.ordering.domain.repository.DonHangRepository;
import com.guppyshop.payment.application.dto.ThanhToanDto;
import com.guppyshop.payment.application.usecase.ThanhToanUseCase;
import com.guppyshop.payment.domain.model.PhuongThucThanhToan;
import com.guppyshop.promotion.application.dto.MaGiamGiaDtos.KetQuaApMaDto;
import com.guppyshop.promotion.application.usecase.QuanLyMaGiamGiaUseCase;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.mapstruct.factory.Mappers;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class DatHangUseCaseTest {

    private static final Long ID_SP = 10L;
    private static final Long ID_CA = 20L;
    private static final String SESSION = "session-khach-1";

    @Mock
    private GioHangRepository gioHangRepository;
    @Mock
    private SanPhamRepository sanPhamRepository;
    @Mock
    private DonHangRepository donHangRepository;
    @Mock
    private NguoiDungRepository nguoiDungRepository;
    @Mock
    private QuanLyMaGiamGiaUseCase maGiamGiaUseCase;
    @Mock
    private ThanhToanUseCase thanhToanUseCase;
    @Mock
    private TaoMaDon taoMaDon;
    @Mock
    private ApplicationEventPublisher suKien;
    @Spy
    private DonHangMapper mapper = Mappers.getMapper(DonHangMapper.class);

    @InjectMocks
    private DatHangUseCase useCase;

    private PhuKien sanPham;
    private GioHang gio;

    @BeforeEach
    void setUp() {
        sanPham = new PhuKien("Cám", "cam", null, Set.of(), LoaiPhuKien.THUC_AN, new BigDecimal("100000"), 50);
        ReflectionTestUtils.setField(sanPham, "id", ID_SP);
        gio = GioHang.choSession(SESSION);
        gio.them(ID_SP, LuaChonBan.PHU_KIEN, 2);

        when(gioHangRepository.khoaTheoSessionId(SESSION)).thenReturn(Optional.of(gio));
        when(sanPhamRepository.timTheoCacId(any())).thenReturn(List.of(sanPham));
        when(taoMaDon.taoMoi()).thenReturn("GP12345678");
        when(donHangRepository.luu(any(DonHang.class))).thenAnswer(lenh -> {
            DonHang don = lenh.getArgument(0);
            ReflectionTestUtils.setField(don, "id", 99L);
            return don;
        });
        when(thanhToanUseCase.khoiTao(any(), any(), any(), any(), any())).thenReturn(
                new ThanhToanDto(PhuongThucThanhToan.COD, null, null, null, null, null, null, null));
    }

    private DatHangCommand lenhKhachVangLai(String maGiamGia) {
        return new DatHangCommand(new ChuGioHang(null, SESSION), " Nguyễn A ", "0901234567", " 12 Lê Lợi ", "Hà Nội",
                null, PhuongThucThanhToan.COD, maGiamGia);
    }

    private DonHang donDaLuu() {
        ArgumentCaptor<DonHang> don = ArgumentCaptor.forClass(DonHang.class);
        verify(donHangRepository).luu(don.capture());
        return don.getValue();
    }

    @Test
    void khachVangLaiDatDuocDonKhongGanTaiKhoan() {
        var ketQua = useCase.datHang(lenhKhachVangLai(null));

        DonHang don = donDaLuu();
        assertThat(don.getKhachHangId()).isNull();
        assertThat(don.laKhachVangLai()).isTrue();
        assertThat(don.getNguoiNhan().getHoTen()).isEqualTo("Nguyễn A");
        assertThat(ketQua.maDon()).isEqualTo("GP12345678");
        assertThat(ketQua.khachVangLai()).isTrue();
        verify(nguoiDungRepository, never()).findById(any());
    }

    @Test
    void khachHangDatDonGanVaoTaiKhoan() {
        GioHang gioKhach = GioHang.choKhachHang(5L);
        gioKhach.them(ID_SP, LuaChonBan.PHU_KIEN, 1);
        KhachHang khach = new KhachHang("B", "b@x.vn", "0900000000", "hash");
        ReflectionTestUtils.setField(khach, "id", 5L);
        when(gioHangRepository.khoaTheoKhachHangId(5L)).thenReturn(Optional.of(gioKhach));
        when(nguoiDungRepository.findById(5L)).thenReturn(Optional.of(khach));

        useCase.datHang(new DatHangCommand(new ChuGioHang(5L, null), "B", "0900000000", "1 Lê Lợi", "Hà Nội",
                null, PhuongThucThanhToan.COD, null));

        assertThat(donDaLuu().getKhachHangId()).isEqualTo(5L);
    }

    @Test
    void taiKhoanKhongPhaiNguoiMuaBiTuChoi() {
        GioHang gioKhach = GioHang.choKhachHang(5L);
        gioKhach.them(ID_SP, LuaChonBan.PHU_KIEN, 1);
        when(gioHangRepository.khoaTheoKhachHangId(5L)).thenReturn(Optional.of(gioKhach));
        when(nguoiDungRepository.findById(5L)).thenReturn(Optional.of(new NhanVien("NV", "n@x.vn", null, "hash")));

        assertThatThrownBy(() -> useCase.datHang(new DatHangCommand(new ChuGioHang(5L, null), "B", "0900000000", "1", "Hà Nội",
                null, PhuongThucThanhToan.COD, null))).isInstanceOf(com.guppyshop.common.exception.NotFoundException.class);
    }

    @Test
    void giaTinhTuSanPhamLucDatVaLamTrongGio() {
        useCase.datHang(lenhKhachVangLai(null));

        DonHang don = donDaLuu();
        assertThat(don.getTamTinh()).isEqualByComparingTo("200000");
        assertThat(don.getPhiGiao()).isEqualByComparingTo("50000");
        assertThat(don.getTongTien()).isEqualByComparingTo("250000");
        assertThat(don.getChiTiet().getFirst().getTenSanPham()).isEqualTo("Cám");
        assertThat(gio.getChiTiet()).isEmpty();
    }

    @Test
    void phatSuKienDaTaoDeKhoGiuTon() {
        useCase.datHang(lenhKhachVangLai(null));

        ArgumentCaptor<Object> daPhat = ArgumentCaptor.forClass(Object.class);
        verify(suKien).publishEvent(daPhat.capture());
        assertThat(daPhat.getValue()).isInstanceOfSatisfying(DonHangDaTaoEvent.class, e -> {
            assertThat(e.donHangId()).isEqualTo(99L);
            assertThat(e.maDon()).isEqualTo("GP12345678");
            assertThat(e.chiTiet()).singleElement().satisfies(d -> {
                assertThat(d.sanPhamId()).isEqualTo(ID_SP);
                assertThat(d.soLuong()).isEqualTo(2);
            });
        });
    }

    @Test
    void khoiTaoThanhToanTheoTongTienSauGiam() {
        when(maGiamGiaUseCase.apDung("GUPPY10", new BigDecimal("200000")))
                .thenReturn(new KetQuaApMaDto(3L, "GUPPY10", 10, new BigDecimal("20000")));

        var ketQua = useCase.datHang(lenhKhachVangLai("GUPPY10"));

        assertThat(ketQua.giamGia()).isEqualByComparingTo("20000");
        assertThat(ketQua.tongTien()).isEqualByComparingTo("230000");
        assertThat(donDaLuu().getMaGiamGiaId()).isEqualTo(3L);
        verify(thanhToanUseCase).khoiTao(PhuongThucThanhToan.COD, 99L, "GP12345678", "0901234567", new BigDecimal("230000"));
    }

    @Test
    void maGiamGiaBoTrongThiKhongApMa() {
        useCase.datHang(lenhKhachVangLai("  "));

        verify(maGiamGiaUseCase, never()).apDung(any(), any());
    }

    @Test
    void maGiamGiaLoiThiKhongTaoDon() {
        when(maGiamGiaUseCase.apDung(any(), any())).thenThrow(new BusinessException("Mã giảm giá đã hết hạn"));

        assertThatThrownBy(() -> useCase.datHang(lenhKhachVangLai("HETHAN")))
                .isInstanceOf(BusinessException.class).hasMessageContaining("hết hạn");

        verify(donHangRepository, never()).luu(any());
        assertThat(gio.getChiTiet()).hasSize(1);
    }

    @Test
    void gioTrongHoacChuaCoGioBiTuChoi() {
        gio.lamTrong();
        assertThatThrownBy(() -> useCase.datHang(lenhKhachVangLai(null))).isInstanceOf(BusinessException.class);

        when(gioHangRepository.khoaTheoSessionId(SESSION)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> useCase.datHang(lenhKhachVangLai(null))).isInstanceOf(BusinessException.class);

        verify(donHangRepository, never()).luu(any());
    }

    @Test
    void sanPhamNgungBanTrongGioBiTuChoi() {
        sanPham.ngungBan();

        assertThatThrownBy(() -> useCase.datHang(lenhKhachVangLai(null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("ngừng bán");
        verify(donHangRepository, never()).luu(any());
    }

    @Test
    void khoBaoThieuHangThiLoiLanRaDeRollbackVaGioConNguyen() {
        org.mockito.Mockito.doThrow(new BusinessException("Không đủ hàng: Cám")).when(suKien).publishEvent(any(Object.class));

        assertThatThrownBy(() -> useCase.datHang(lenhKhachVangLai(null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("Không đủ hàng");

        assertThat(gio.getChiTiet()).hasSize(1);
    }

    /** Cá có 3 mức giá: đực 45k, cái 35k, cặp 75k. Không bán bộ ba. */
    private CaGuppy taoCa() {
        CaGuppy ca = CaGuppy.builder().ten("Full Gold").slug("full-gold").nhan(Set.of()).kieuDuoi(KieuDuoi.DELTA)
                .mauSac("Vàng").thuanChung(true).kichThuoc("3 cm").tuoiTuan(14).soConMoiLo(10)
                .thongSoNuoc(new ThongSoNuoc(new BigDecimal("22.0"), new BigDecimal("28.0"),
                        new BigDecimal("6.8"), new BigDecimal("7.8"), "8–12 dGH"))
                .bangGia(List.of(new MucGia(DonViBan.CON_LE, GioiTinh.DUC, new BigDecimal("45000")),
                        new MucGia(DonViBan.CON_LE, GioiTinh.CAI, new BigDecimal("35000")),
                        new MucGia(DonViBan.CAP, null, new BigDecimal("75000"))))
                .build();
        ReflectionTestUtils.setField(ca, "id", ID_CA);
        when(sanPhamRepository.timTheoCacId(any())).thenReturn(List.of(ca));
        gio.lamTrong();
        return ca;
    }

    @Test
    void caTinhGiaTheoDonViVaGioiTinhDaChon() {
        taoCa();
        gio.them(ID_CA, new LuaChonBan(DonViBan.CON_LE, GioiTinh.DUC), 2);
        gio.them(ID_CA, new LuaChonBan(DonViBan.CON_LE, GioiTinh.CAI), 1);
        gio.them(ID_CA, new LuaChonBan(DonViBan.CAP, GioiTinh.KHONG_AP_DUNG), 1);

        useCase.datHang(lenhKhachVangLai(null));

        DonHang don = donDaLuu();
        assertThat(don.getChiTiet()).hasSize(3);
        assertThat(don.getChiTiet().stream().map(d -> d.getDonGia().longValue()))
                .containsExactlyInAnyOrder(45000L, 35000L, 75000L);
        assertThat(don.getTamTinh()).isEqualByComparingTo("200000");
        assertThat(don.getTongTien()).isEqualByComparingTo("250000");
    }

    @Test
    void giaDoiSauKhiThemVaoGioThiLayGiaMoiNhat() {
        CaGuppy ca = taoCa();
        gio.them(ID_CA, new LuaChonBan(DonViBan.CAP, GioiTinh.KHONG_AP_DUNG), 1);

        ca.capNhatBangGia(List.of(new MucGia(DonViBan.CAP, null, new BigDecimal("90000"))));
        useCase.datHang(lenhKhachVangLai(null));

        assertThat(donDaLuu().getTamTinh()).isEqualByComparingTo("90000");
    }

    @Test
    void donViKhongConBanTrongGioBiTuChoi() {
        taoCa();
        gio.them(ID_CA, new LuaChonBan(DonViBan.BO_BA, GioiTinh.KHONG_AP_DUNG), 1);

        // Kiểm tra cả thông báo: bước tính giá phía sau cũng ném BusinessException, chỉ khác nội dung
        assertThatThrownBy(() -> useCase.datHang(lenhKhachVangLai(null)))
                .isInstanceOf(BusinessException.class).hasMessageContaining("ngừng bán");

        verify(donHangRepository, never()).luu(any());
    }

    @Test
    void sanPhamKhongConTrongCsdlBiTuChoi() {
        when(sanPhamRepository.timTheoCacId(any())).thenReturn(List.of());

        assertThatThrownBy(() -> useCase.datHang(lenhKhachVangLai(null))).isInstanceOf(BusinessException.class);

        verify(donHangRepository, never()).luu(any());
    }

    @Test
    void mienPhiGiaoKhiTamTinhTu500Nghin() {
        gio.lamTrong();
        gio.them(ID_SP, LuaChonBan.PHU_KIEN, 5);

        var ketQua = useCase.datHang(lenhKhachVangLai(null));

        assertThat(ketQua.phiGiao()).isEqualByComparingTo("0");
        assertThat(ketQua.tongTien()).isEqualByComparingTo("500000");
    }

    @Test
    void khachHangDungGioTaiKhoanKhongDungGioSession() {
        GioHang gioKhach = GioHang.choKhachHang(5L);
        gioKhach.them(ID_SP, LuaChonBan.PHU_KIEN, 1);
        KhachHang khach = new KhachHang("B", "b@x.vn", "0900000000", "hash");
        ReflectionTestUtils.setField(khach, "id", 5L);
        when(gioHangRepository.khoaTheoKhachHangId(5L)).thenReturn(Optional.of(gioKhach));
        when(nguoiDungRepository.findById(5L)).thenReturn(Optional.of(khach));

        useCase.datHang(new DatHangCommand(new ChuGioHang(5L, SESSION), "B", "0900000000", "1 Lê Lợi", "Hà Nội",
                null, PhuongThucThanhToan.COD, null));

        assertThat(gioKhach.getChiTiet()).isEmpty();
        assertThat(gio.getChiTiet()).hasSize(1);
        verify(gioHangRepository, never()).khoaTheoSessionId(any());
    }

    @Test
    void chuyenKhoanTraVeThongTinNganHangChoKhach() {
        when(thanhToanUseCase.khoiTao(any(), any(), any(), any(), any())).thenReturn(new ThanhToanDto(
                PhuongThucThanhToan.CHUYEN_KHOAN, null, new BigDecimal("250000"), null, "GP12345678", "VCB", "0123", "GUPPY"));

        var ketQua = useCase.datHang(new DatHangCommand(new ChuGioHang(null, SESSION), "A", "0901234567", "1 Lê Lợi", "Hà Nội",
                null, PhuongThucThanhToan.CHUYEN_KHOAN, null));

        assertThat(ketQua.thanhToan().noiDungChuyenKhoan()).isEqualTo("GP12345678");
        assertThat(ketQua.thanhToan().soTaiKhoan()).isEqualTo("0123");
    }

    @Test
    void luuDonRoiMoiThanhToanVaGiuTon() {
        useCase.datHang(lenhKhachVangLai(null));

        InOrder thuTu = inOrder(donHangRepository, thanhToanUseCase, suKien);
        thuTu.verify(donHangRepository).luu(any(DonHang.class));
        thuTu.verify(thanhToanUseCase).khoiTao(any(), any(), any(), any(), any());
        thuTu.verify(suKien).publishEvent(any(Object.class));
    }
}
