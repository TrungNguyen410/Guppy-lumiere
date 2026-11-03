package com.guppyshop.identity.application.usecase;

import com.guppyshop.common.config.JwtTokenProvider;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.XacThucThatBaiException;
import com.guppyshop.identity.application.dto.XacThucDtos.DangKyCommand;
import com.guppyshop.identity.application.dto.XacThucDtos.DangNhapCommand;
import com.guppyshop.identity.application.dto.XacThucDtos.PhienDangNhapDto;
import com.guppyshop.identity.domain.model.KhachHang;
import com.guppyshop.identity.domain.model.NguoiDung;
import com.guppyshop.identity.domain.repository.NguoiDungRepository;
import java.util.Locale;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class XacThucUseCase {

    private static final String SAI_THONG_TIN = "Sai tên đăng nhập hoặc mật khẩu";

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwt;
    private final String hashGia;

    public XacThucUseCase(NguoiDungRepository nguoiDungRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwt) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwt = jwt;
        this.hashGia = passwordEncoder.encode("tai-khoan-khong-ton-tai");
    }

    @Transactional
    public PhienDangNhapDto dangKy(DangKyCommand lenh) {
        String email = chuanHoaEmail(lenh.email());
        if (nguoiDungRepository.existsByEmail(email)) {
            throw new BusinessException("Email đã được sử dụng");
        }
        if (nguoiDungRepository.existsBySoDienThoai(lenh.soDienThoai())) {
            throw new BusinessException("Số điện thoại đã được sử dụng");
        }
        KhachHang khachHang = new KhachHang(lenh.hoTen().strip(), email, lenh.soDienThoai(),
                passwordEncoder.encode(lenh.matKhau()));
        return taoPhien(nguoiDungRepository.save(khachHang));
    }

    @Transactional(readOnly = true)
    public PhienDangNhapDto dangNhap(DangNhapCommand lenh) {
        Optional<NguoiDung> timThay = timTheoTenDangNhap(lenh.tenDangNhap().strip());
        // Luôn so khớp mật khẩu để thời gian phản hồi không để lộ email nào đã đăng ký
        boolean dungMatKhau = passwordEncoder.matches(lenh.matKhau(),
                timThay.map(NguoiDung::getMatKhauHash).orElse(hashGia));
        NguoiDung nguoiDung = timThay.filter(n -> dungMatKhau)
                .orElseThrow(() -> new XacThucThatBaiException(SAI_THONG_TIN));
        if (!nguoiDung.isKichHoat()) {
            throw new XacThucThatBaiException("Tài khoản đã bị khóa");
        }
        return taoPhien(nguoiDung);
    }

    private Optional<NguoiDung> timTheoTenDangNhap(String tenDangNhap) {
        return tenDangNhap.contains("@")
                ? nguoiDungRepository.findByEmail(chuanHoaEmail(tenDangNhap))
                : nguoiDungRepository.findBySoDienThoai(tenDangNhap);
    }

    private PhienDangNhapDto taoPhien(NguoiDung nguoiDung) {
        String token = jwt.taoToken(nguoiDung.getId(), nguoiDung.getEmail(), nguoiDung.layVaiTro().name());
        return new PhienDangNhapDto(token, nguoiDung.getHoTen(), nguoiDung.getEmail(), nguoiDung.layVaiTro());
    }

    private String chuanHoaEmail(String email) {
        return email.strip().toLowerCase(Locale.ROOT);
    }
}
