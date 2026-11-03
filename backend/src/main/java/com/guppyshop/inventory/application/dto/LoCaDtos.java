package com.guppyshop.inventory.application.dto;

import com.guppyshop.inventory.domain.model.GiaiDoanLo;
import com.guppyshop.inventory.domain.model.LoaiBienDong;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** Dữ liệu vào và ra của quản lý lô cá. */
public final class LoCaDtos {

    private LoCaDtos() {
    }

    public record TaoLoCaCommand(String maLo, Long caGuppyId, String boMe, String beNuoi, LocalDate ngayNo,
                                 int soDuc, int soCai, int soCaBot) {
    }

    public record SuaLoCaCommand(String boMe, String beNuoi, LocalDate ngayNo) {
    }

    public record NhapDeCommand(int soCaBot, String ghiChu) {
    }

    public record PhanGioiCommand(int soDuc, int soCai, String ghiChu) {
    }

    public record HaoHutCommand(int soDuc, int soCai, int soCaBot, String ghiChu) {
    }

    @Schema(description = "Lô cá nuôi")
    public record LoCaDto(
            Long id,
            String maLo,
            Long caGuppyId,
            String tenSanPham,
            String tenDong,
            String boMe,
            String beNuoi,
            LocalDate ngayNo,
            int soDuc,
            int soCai,
            int soCaBot,
            @Schema(description = "Tổng cá đang có") int tongCa,
            @Schema(description = "Tổng số cá đã chết") int haoHut,
            GiaiDoanLo giaiDoan) {
    }

    @Schema(description = "Một dòng nhật ký kho, số âm là giảm")
    public record BienDongKhoDto(
            Long id,
            LocalDateTime thoiGian,
            Long loCaId,
            String maLo,
            LoaiBienDong loai,
            int deltaDuc,
            int deltaCai,
            int deltaBot,
            String ghiChu) {
    }
}
