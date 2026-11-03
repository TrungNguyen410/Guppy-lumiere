package com.guppyshop.identity.application.usecase;

import com.guppyshop.common.application.BaseCrudService;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.identity.application.dto.NhanVienDtos.NhanVienDto;
import com.guppyshop.identity.application.dto.NhanVienDtos.SuaNhanVienCommand;
import com.guppyshop.identity.application.dto.NhanVienDtos.TaoNhanVienCommand;
import com.guppyshop.identity.application.mapper.NguoiDungMapper;
import com.guppyshop.identity.domain.model.NhanVien;
import com.guppyshop.identity.domain.repository.NguoiDungRepository;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** TEMPLATE METHOD: dùng trình tự CRUD của BaseCrudService, chỉ cài các bước riêng của nhân viên. */
@Service
@Transactional
public class QuanLyNhanVienUseCase extends BaseCrudService<NhanVien, TaoNhanVienCommand, SuaNhanVienCommand, NhanVienDto> {

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    private final NguoiDungMapper mapper;

    public QuanLyNhanVienUseCase(NguoiDungRepository nguoiDungRepository, PasswordEncoder passwordEncoder, NguoiDungMapper mapper) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Override
    protected String tenDoiTuong() {
        return "Nhân viên";
    }

    @Override
    protected List<NhanVien> timTatCa() {
        return nguoiDungRepository.timTatCaNhanVien();
    }

    @Override
    protected Optional<NhanVien> timTheoId(Long id) {
        return nguoiDungRepository.timNhanVienTheoId(id);
    }

    @Override
    protected void kiemTraKhiTao(TaoNhanVienCommand lenh) {
        if (nguoiDungRepository.existsByEmail(chuanHoaEmail(lenh.email()))) {
            throw new BusinessException("Email đã được sử dụng");
        }
        if (nguoiDungRepository.existsBySoDienThoai(lenh.soDienThoai())) {
            throw new BusinessException("Số điện thoại đã được sử dụng");
        }
    }

    @Override
    protected void kiemTraKhiSua(NhanVien nhanVien, SuaNhanVienCommand lenh) {
        if (nguoiDungRepository.existsBySoDienThoaiAndIdNot(lenh.soDienThoai(), nhanVien.getId())) {
            throw new BusinessException("Số điện thoại đã được sử dụng");
        }
    }

    @Override
    protected NhanVien taoEntity(TaoNhanVienCommand lenh) {
        return new NhanVien(lenh.hoTen().strip(), chuanHoaEmail(lenh.email()), lenh.soDienThoai(),
                passwordEncoder.encode(lenh.matKhau()));
    }

    @Override
    protected void apDungThayDoi(NhanVien nhanVien, SuaNhanVienCommand lenh) {
        nhanVien.capNhatThongTin(lenh.hoTen().strip(), lenh.soDienThoai());
        nhanVien.datKichHoat(lenh.kichHoat());
        if (lenh.matKhauMoi() != null && !lenh.matKhauMoi().isBlank()) {
            nhanVien.doiMatKhau(passwordEncoder.encode(lenh.matKhauMoi()));
        }
    }

    @Override
    protected NhanVien luu(NhanVien nhanVien) {
        return nguoiDungRepository.save(nhanVien);
    }

    @Override
    protected void xoaEntity(NhanVien nhanVien) {
        nguoiDungRepository.delete(nhanVien);
    }

    @Override
    protected NhanVienDto sangDto(NhanVien nhanVien) {
        return mapper.sangNhanVien(nhanVien);
    }

    private String chuanHoaEmail(String email) {
        return email.strip().toLowerCase(Locale.ROOT);
    }
}
