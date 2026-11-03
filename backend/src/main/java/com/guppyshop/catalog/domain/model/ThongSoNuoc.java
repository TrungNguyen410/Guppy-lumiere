package com.guppyshop.catalog.domain.model;

import com.guppyshop.common.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** Value object: thông số nước luôn phải nằm trong khoảng 22–28°C, pH 6.8–7.8. */
@Getter
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ThongSoNuoc {

    private static final BigDecimal NHIET_DO_THAP_NHAT = new BigDecimal("22.0");
    private static final BigDecimal NHIET_DO_CAO_NHAT = new BigDecimal("28.0");
    private static final BigDecimal PH_THAP_NHAT = new BigDecimal("6.8");
    private static final BigDecimal PH_CAO_NHAT = new BigDecimal("7.8");

    @Column(name = "nhiet_do_min", nullable = false)
    private BigDecimal nhietDoMin;

    @Column(name = "nhiet_do_max", nullable = false)
    private BigDecimal nhietDoMax;

    @Column(name = "ph_min", nullable = false)
    private BigDecimal phMin;

    @Column(name = "ph_max", nullable = false)
    private BigDecimal phMax;

    @Column(name = "do_cung", nullable = false)
    private String doCung;

    public ThongSoNuoc(BigDecimal nhietDoMin, BigDecimal nhietDoMax, BigDecimal phMin, BigDecimal phMax, String doCung) {
        if (nhietDoMin.compareTo(NHIET_DO_THAP_NHAT) < 0 || nhietDoMax.compareTo(NHIET_DO_CAO_NHAT) > 0
                || nhietDoMin.compareTo(nhietDoMax) >= 0) {
            throw new BusinessException("Nhiệt độ phải nằm trong khoảng 22–28°C và thấp hơn mức tối đa");
        }
        if (phMin.compareTo(PH_THAP_NHAT) < 0 || phMax.compareTo(PH_CAO_NHAT) > 0 || phMin.compareTo(phMax) >= 0) {
            throw new BusinessException("Độ pH phải nằm trong khoảng 6.8–7.8 và thấp hơn mức tối đa");
        }
        this.nhietDoMin = nhietDoMin;
        this.nhietDoMax = nhietDoMax;
        this.phMin = phMin;
        this.phMax = phMax;
        this.doCung = doCung;
    }
}
