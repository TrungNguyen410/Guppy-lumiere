package com.guppyshop.inventory.presentation.request;

import com.guppyshop.inventory.application.dto.LoCaDtos.HaoHutCommand;
import com.guppyshop.inventory.application.dto.LoCaDtos.NhapDeCommand;
import com.guppyshop.inventory.application.dto.LoCaDtos.PhanGioiCommand;
import com.guppyshop.inventory.application.dto.LoCaDtos.SuaLoCaCommand;
import com.guppyshop.inventory.application.dto.LoCaDtos.TaoLoCaCommand;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public final class LoCaRequests {

    private LoCaRequests() {
    }

    @Schema(description = "Tạo lô cá")
    public record TaoLoCaRequest(
            @Schema(example = "LO-2411-FG3") @NotBlank(message = "Mã lô không được trống") @Pattern(regexp = "[A-Za-z0-9-]{1,30}", message = "Mã lô chỉ gồm chữ, số và dấu gạch ngang") String maLo,
            @Schema(description = "Id sản phẩm cá") @NotNull(message = "Chưa chọn sản phẩm cá") Long caGuppyId,
            @Schema(example = "FG-A3 × FG-B1") @Size(max = 60) String boMe,
            @Schema(example = "Bể A1") @NotBlank(message = "Bể nuôi không được trống") @Size(max = 40) String beNuoi,
            @NotNull(message = "Chưa nhập ngày nở") LocalDate ngayNo,
            @Min(value = 0, message = "Số cá không được âm") int soDuc,
            @Min(value = 0, message = "Số cá không được âm") int soCai,
            @Min(value = 0, message = "Số cá không được âm") int soCaBot) {

        public TaoLoCaCommand sangLenh() {
            return new TaoLoCaCommand(maLo, caGuppyId, boMe, beNuoi, ngayNo, soDuc, soCai, soCaBot);
        }
    }

    @Schema(description = "Sửa thông tin mô tả của lô; số lượng thay đổi qua nhập đẻ, phân giới, hao hụt")
    public record SuaLoCaRequest(
            @Size(max = 60) String boMe,
            @NotBlank(message = "Bể nuôi không được trống") @Size(max = 40) String beNuoi,
            @NotNull(message = "Chưa nhập ngày nở") LocalDate ngayNo) {

        public SuaLoCaCommand sangLenh() {
            return new SuaLoCaCommand(boMe, beNuoi, ngayNo);
        }
    }

    @Schema(description = "Nhập cá bột mới đẻ vào lô")
    public record NhapDeRequest(
            @Min(value = 1, message = "Số cá bột phải lớn hơn 0") int soCaBot,
            @Size(max = 255) String ghiChu) {

        public NhapDeCommand sangLenh() {
            return new NhapDeCommand(soCaBot, ghiChu);
        }
    }

    @Schema(description = "Phân cá bột thành đực và cái")
    public record PhanGioiRequest(
            @Min(value = 0, message = "Số cá không được âm") int soDuc,
            @Min(value = 0, message = "Số cá không được âm") int soCai,
            @Size(max = 255) String ghiChu) {

        public PhanGioiCommand sangLenh() {
            return new PhanGioiCommand(soDuc, soCai, ghiChu);
        }
    }

    @Schema(description = "Ghi nhận số cá chết")
    public record HaoHutRequest(
            @Min(value = 0, message = "Số cá không được âm") int soDuc,
            @Min(value = 0, message = "Số cá không được âm") int soCai,
            @Min(value = 0, message = "Số cá không được âm") int soCaBot,
            @Schema(example = "Nhiệt độ giảm đêm") @Size(max = 255) String ghiChu) {

        public HaoHutCommand sangLenh() {
            return new HaoHutCommand(soDuc, soCai, soCaBot, ghiChu);
        }
    }
}
