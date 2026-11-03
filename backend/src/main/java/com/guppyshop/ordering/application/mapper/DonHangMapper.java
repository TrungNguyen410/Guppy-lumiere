package com.guppyshop.ordering.application.mapper;

import com.guppyshop.ordering.application.dto.DonHangDtos.ChiTietDonDto;
import com.guppyshop.ordering.application.dto.DonHangDtos.DonHangDto;
import com.guppyshop.ordering.application.dto.DonHangDtos.LichSuDto;
import com.guppyshop.ordering.domain.model.ChiTietDonHang;
import com.guppyshop.ordering.domain.model.DonHang;
import com.guppyshop.ordering.domain.model.LichSuTrangThai;
import com.guppyshop.payment.application.dto.ThanhToanDto;
import java.time.LocalDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface DonHangMapper {

    @Mapping(target = "thanhTien", expression = "java(dong.thanhTien())")
    ChiTietDonDto sangChiTiet(ChiTietDonHang dong);

    LichSuDto sangLichSu(LichSuTrangThai lichSu);

    default DonHangDto sangDto(DonHang don, ThanhToanDto thanhToan) {
        return new DonHangDto(don.getId(), don.getMaDon(), don.laKhachVangLai(),
                don.getNguoiNhan().getHoTen(), don.getNguoiNhan().getSoDienThoai(), don.getNguoiNhan().getDiaChi(),
                don.getNguoiNhan().getThanhPho(), don.getNguoiNhan().getGhiChu(),
                don.getTrangThai(), don.khachDuocHuy(),
                don.getTamTinh(), don.getPhiGiao(), don.getGiamGia(), don.getTongTien(),
                don.getChiTiet().stream().map(this::sangChiTiet).toList(),
                don.getLichSu().stream().map(this::sangLichSu).toList(),
                thanhToan, don.getCreatedAt(), don.getHoanTatLuc(),
                !don.laKhachVangLai() && don.conHanBaoHanh(LocalDateTime.now()));
    }
}
