package com.guppyshop.identity.application.mapper;

import com.guppyshop.identity.application.dto.KhachHangDtos.DiaChiDto;
import com.guppyshop.identity.application.dto.KhachHangDtos.HoSoDto;
import com.guppyshop.identity.application.dto.NhanVienDtos.NhanVienDto;
import com.guppyshop.identity.domain.model.DiaChi;
import com.guppyshop.identity.domain.model.NguoiDung;
import com.guppyshop.identity.domain.model.NhanVien;
import org.mapstruct.Mapper;

@Mapper
public interface NguoiDungMapper {

    HoSoDto sangHoSo(NguoiDung nguoiDung);

    NhanVienDto sangNhanVien(NhanVien nhanVien);

    DiaChiDto sangDiaChi(DiaChi diaChi);
}
