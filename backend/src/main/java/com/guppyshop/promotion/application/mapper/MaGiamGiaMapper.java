package com.guppyshop.promotion.application.mapper;

import com.guppyshop.promotion.application.dto.MaGiamGiaDtos.MaGiamGiaDto;
import com.guppyshop.promotion.domain.model.MaGiamGia;
import org.mapstruct.Mapper;

@Mapper
public interface MaGiamGiaMapper {

    MaGiamGiaDto sangDto(MaGiamGia maGiamGia);
}
