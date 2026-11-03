package com.guppyshop.identity.application.usecase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.guppyshop.common.config.JwtTokenProvider;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.XacThucThatBaiException;
import com.guppyshop.identity.application.dto.XacThucDtos.DangKyCommand;
import com.guppyshop.identity.application.dto.XacThucDtos.DangNhapCommand;
import com.guppyshop.identity.domain.model.KhachHang;
import com.guppyshop.identity.domain.model.NhanVien;
import com.guppyshop.identity.domain.model.VaiTro;
import com.guppyshop.identity.domain.repository.NguoiDungRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class XacThucUseCaseTest {

    @Mock
    private NguoiDungRepository nguoiDungRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider jwt;

    private XacThucUseCase useCase;

    @BeforeEach
    void setUp() {
        when(passwordEncoder.encode(anyString())).thenReturn("hash");
        when(jwt.taoToken(any(), any(), anyString())).thenReturn("token");
        useCase = new XacThucUseCase(nguoiDungRepository, passwordEncoder, jwt);
    }

    @Test
    void dangKyChuanHoaEmailVaBamMatKhau() {
        when(nguoiDungRepository.save(any(KhachHang.class))).thenAnswer(lenh -> lenh.getArgument(0));

        var phien = useCase.dangKy(new DangKyCommand(" Nguyễn A ", " KHACH@Example.COM ", "0901234567", "MatKhau@123"));

        assertThat(phien.email()).isEqualTo("khach@example.com");
        assertThat(phien.hoTen()).isEqualTo("Nguyễn A");
        assertThat(phien.vaiTro()).isEqualTo(VaiTro.KHACH_HANG);
        assertThat(phien.token()).isEqualTo("token");
        verify(passwordEncoder).encode("MatKhau@123");
    }

    @Test
    void dangKyTrungEmailBiTuChoi() {
        when(nguoiDungRepository.existsByEmail("a@b.vn")).thenReturn(true);

        assertThatThrownBy(() -> useCase.dangKy(new DangKyCommand("A", "a@b.vn", "0901234567", "MatKhau@123")))
                .isInstanceOf(BusinessException.class);
        verify(nguoiDungRepository, never()).save(any());
    }

    @Test
    void dangKyTrungSoDienThoaiBiTuChoi() {
        when(nguoiDungRepository.existsBySoDienThoai("0901234567")).thenReturn(true);

        assertThatThrownBy(() -> useCase.dangKy(new DangKyCommand("A", "a@b.vn", "0901234567", "MatKhau@123")))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void dangNhapBangEmailHoacSoDienThoai() {
        NhanVien nhanVien = new NhanVien("NV", "nv@b.vn", "0909000778", "hash-that");
        when(nguoiDungRepository.findByEmail("nv@b.vn")).thenReturn(Optional.of(nhanVien));
        when(nguoiDungRepository.findBySoDienThoai("0909000778")).thenReturn(Optional.of(nhanVien));
        when(passwordEncoder.matches("dung", "hash-that")).thenReturn(true);

        assertThat(useCase.dangNhap(new DangNhapCommand("NV@b.vn", "dung")).vaiTro()).isEqualTo(VaiTro.NHAN_VIEN);
        assertThat(useCase.dangNhap(new DangNhapCommand("0909000778", "dung")).vaiTro()).isEqualTo(VaiTro.NHAN_VIEN);
    }

    @Test
    void saiMatKhauVaSaiEmailCungThongBao() {
        NhanVien nhanVien = new NhanVien("NV", "nv@b.vn", null, "hash-that");
        when(nguoiDungRepository.findByEmail("nv@b.vn")).thenReturn(Optional.of(nhanVien));
        when(nguoiDungRepository.findByEmail("khong@co.vn")).thenReturn(Optional.empty());

        Throwable saiMatKhau = org.assertj.core.api.Assertions.catchThrowable(
                () -> useCase.dangNhap(new DangNhapCommand("nv@b.vn", "sai")));
        Throwable saiEmail = org.assertj.core.api.Assertions.catchThrowable(
                () -> useCase.dangNhap(new DangNhapCommand("khong@co.vn", "sai")));

        assertThat(saiMatKhau).isInstanceOf(XacThucThatBaiException.class);
        assertThat(saiEmail).isInstanceOf(XacThucThatBaiException.class).hasMessage(saiMatKhau.getMessage());
        // Email không tồn tại vẫn phải chạy so khớp mật khẩu với hash giả
        verify(passwordEncoder).matches(eq("sai"), eq("hash"));
    }

    @Test
    void taiKhoanBiKhoaKhongDangNhapDuoc() {
        NhanVien nhanVien = new NhanVien("NV", "nv@b.vn", null, "hash-that");
        nhanVien.datKichHoat(false);
        when(nguoiDungRepository.findByEmail("nv@b.vn")).thenReturn(Optional.of(nhanVien));
        when(passwordEncoder.matches("dung", "hash-that")).thenReturn(true);

        assertThatThrownBy(() -> useCase.dangNhap(new DangNhapCommand("nv@b.vn", "dung")))
                .isInstanceOf(XacThucThatBaiException.class).hasMessageContaining("khóa");
    }
}
