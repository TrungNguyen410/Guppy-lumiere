package com.guppyshop.common.domain;

import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Transient;
import java.util.ArrayList;
import java.util.List;

/**
 * Gốc của một Aggregate. Domain chỉ ghi nhận sự kiện, tầng application mới phát đi
 * (Observer), nên domain không cần biết đến Spring.
 */
@MappedSuperclass
public abstract class AggregateRoot extends BaseEntity {

    @Transient
    private final List<Object> suKienChoPhat = new ArrayList<>();

    protected void ghiNhanSuKien(Object suKien) {
        suKienChoPhat.add(suKien);
    }

    /** Trả về các sự kiện đang chờ và xóa chúng để không phát lặp. */
    public List<Object> laySuKienVaXoa() {
        List<Object> ketQua = List.copyOf(suKienChoPhat);
        suKienChoPhat.clear();
        return ketQua;
    }
}
