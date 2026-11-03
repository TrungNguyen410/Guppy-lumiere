package com.guppyshop.ordering.application.usecase;

import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.ordering.domain.repository.DonHangRepository;
import java.security.SecureRandom;
import org.springframework.stereotype.Component;

/** Sinh mã dạng GP + 8 số; ngẫu nhiên để không đoán được số lượng đơn hay mã của đơn khác. */
@Component
public class TaoMaDon {

    private static final int SO_LAN_THU = 5;
    private static final int GIOI_HAN = 100_000_000;

    private final SecureRandom ngauNhien = new SecureRandom();
    private final DonHangRepository donHangRepository;

    public TaoMaDon(DonHangRepository donHangRepository) {
        this.donHangRepository = donHangRepository;
    }

    public String taoMoi() {
        for (int lan = 0; lan < SO_LAN_THU; lan++) {
            String ma = "GP%08d".formatted(ngauNhien.nextInt(GIOI_HAN));
            if (!donHangRepository.tonTaiMaDon(ma)) {
                return ma;
            }
        }
        throw new BusinessException("Không tạo được mã đơn, vui lòng thử lại");
    }
}
