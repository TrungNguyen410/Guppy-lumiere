package com.guppyshop.inventory.application.mapper;

import com.guppyshop.inventory.application.dto.LoCaDtos.BienDongKhoDto;
import com.guppyshop.inventory.application.dto.LoCaDtos.LoCaDto;
import com.guppyshop.inventory.domain.model.BienDongKho;
import com.guppyshop.inventory.domain.model.LoCa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface LoCaMapper {

    @Mapping(target = "id", source = "lo.id")
    @Mapping(target = "tongCa", expression = "java(lo.tongCa())")
    LoCaDto sangDto(LoCa lo, String tenSanPham, String tenDong);

    @Mapping(target = "id", source = "bienDong.id")
    @Mapping(target = "thoiGian", source = "bienDong.createdAt")
    BienDongKhoDto sangDto(BienDongKho bienDong, String maLo);
}
