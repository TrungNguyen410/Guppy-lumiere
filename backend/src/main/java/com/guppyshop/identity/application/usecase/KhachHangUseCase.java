package com.guppyshop.identity.application.usecase;

import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import com.guppyshop.identity.application.dto.KhachHangDtos.CapNhatHoSoCommand;
import com.guppyshop.identity.application.dto.KhachHangDtos.DiaChiDto;
import com.guppyshop.identity.application.dto.KhachHangDtos.HoSoDto;
import com.guppyshop.identity.application.dto.KhachHangDtos.LuuDiaChiCommand;
import com.guppyshop.identity.application.mapper.NguoiDungMapper;
import com.guppyshop.identity.domain.model.DiaChi;
import com.guppyshop.identity.domain.model.NguoiDung;
import com.guppyshop.identity.domain.repository.DiaChiRepository;
import com.guppyshop.identity.domain.repository.NguoiDungRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Hồ sơ và sổ địa chỉ. Mọi truy vấn đều lọc theo id của chính khách hàng đang đăng nhập. */
@Service
@Transactional
public class KhachHangUseCase {

    private final NguoiDungRepository nguoiDungRepository;
    private final DiaChiRepository diaChiRepository;
    private final NguoiDungMapper mapper;

    public KhachHangUseCase(NguoiDungRepository nguoiDungRepository, DiaChiRepository diaChiRepository, NguoiDungMapper mapper) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.diaChiRepository = diaChiRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public HoSoDto layHoSo(Long khachHangId) {
        return mapper.sangHoSo(layKhachHang(khachHangId));
    }

    public HoSoDto capNhatHoSo(Long khachHangId, CapNhatHoSoCommand lenh) {
        NguoiDung khachHang = layKhachHang(khachHangId);
        if (nguoiDungRepository.existsBySoDienThoaiAndIdNot(lenh.soDienThoai(), khachHangId)) {
            throw new BusinessException("Số điện thoại đã được sử dụng");
        }
        khachHang.capNhatThongTin(lenh.hoTen().strip(), lenh.soDienThoai());
        return mapper.sangHoSo(khachHang);
    }

    @Transactional(readOnly = true)
    public List<DiaChiDto> layDiaChi(Long khachHangId) {
        return timDiaChi(khachHangId).stream().map(mapper::sangDiaChi).toList();
    }

    public DiaChiDto themDiaChi(Long khachHangId, LuuDiaChiCommand lenh) {
        List<DiaChi> hienCo = timDiaChi(khachHangId);
        DiaChi moi = diaChiRepository.save(new DiaChi(khachHangId, lenh.hoTenNhan().strip(), lenh.soDienThoai(),
                lenh.diaChi().strip(), lenh.thanhPho()));
        // Địa chỉ đầu tiên luôn là mặc định
        if (lenh.macDinh() || hienCo.isEmpty()) {
            datLamMacDinh(moi, hienCo);
        }
        return mapper.sangDiaChi(moi);
    }

    public DiaChiDto suaDiaChi(Long khachHangId, Long diaChiId, LuuDiaChiCommand lenh) {
        DiaChi diaChi = layDiaChiCuaKhach(khachHangId, diaChiId);
        diaChi.capNhat(lenh.hoTenNhan().strip(), lenh.soDienThoai(), lenh.diaChi().strip(), lenh.thanhPho());
        if (lenh.macDinh()) {
            datLamMacDinh(diaChi, timDiaChi(khachHangId));
        }
        return mapper.sangDiaChi(diaChi);
    }

    public void xoaDiaChi(Long khachHangId, Long diaChiId) {
        DiaChi diaChi = layDiaChiCuaKhach(khachHangId, diaChiId);
        boolean laMacDinh = diaChi.isMacDinh();
        diaChiRepository.delete(diaChi);
        // Xóa địa chỉ mặc định thì chuyển mặc định sang địa chỉ còn lại đầu tiên
        if (laMacDinh) {
            timDiaChi(khachHangId).stream()
                    .filter(d -> !d.getId().equals(diaChiId))
                    .findFirst()
                    .ifPresent(d -> d.datMacDinh(true));
        }
    }

    private void datLamMacDinh(DiaChi duocChon, List<DiaChi> danhSach) {
        danhSach.forEach(d -> d.datMacDinh(false));
        duocChon.datMacDinh(true);
    }

    private List<DiaChi> timDiaChi(Long khachHangId) {
        return diaChiRepository.findByKhachHangIdOrderByMacDinhDescIdAsc(khachHangId);
    }

    private DiaChi layDiaChiCuaKhach(Long khachHangId, Long diaChiId) {
        return diaChiRepository.findByIdAndKhachHangId(diaChiId, khachHangId)
                .orElseThrow(() -> new NotFoundException("Địa chỉ không tồn tại"));
    }

    private NguoiDung layKhachHang(Long id) {
        return nguoiDungRepository.findById(id).orElseThrow(() -> new NotFoundException("Khách hàng không tồn tại"));
    }
}
