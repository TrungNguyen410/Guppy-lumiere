package com.guppyshop.promotion.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public final class MaGiamGiaDtos {

    private MaGiamGiaDtos() {
    }

    public record LuuMaGiamGiaCommand(String ma, int phanTram, LocalDateTime ngayBatDau, LocalDateTime ngayHetHan,
                                      Integer soLuotToiDa, boolean kichHoat) {
    }

    @Schema(description = "Mã giảm giá")
    public record MaGiamGiaDto(Long id, String ma, int phanTram, LocalDateTime ngayBatDau, LocalDateTime ngayHetHan,
                               @Schema(description = "Null là không giới hạn") Integer soLuotToiDa,
                               int soLuotDaDung, boolean kichHoat) {
    }

    @Schema(description = "Kết quả áp mã")
    public record KetQuaApMaDto(@Schema(hidden = true) Long id, String ma, int phanTram, BigDecimal tienGiam) {
    }
}
