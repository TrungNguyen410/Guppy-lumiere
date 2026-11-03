package com.guppyshop.common.application;

import static org.assertj.core.api.Assertions.assertThat;

import com.guppyshop.identity.application.usecase.QuanLyNhanVienUseCase;
import com.guppyshop.inventory.application.usecase.QuanLyLoCaUseCase;
import com.guppyshop.catalog.application.usecase.QuanLyDongCaUseCase;
import java.lang.reflect.Method;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.transaction.annotation.AnnotationTransactionAttributeSource;
import org.springframework.transaction.interceptor.TransactionAttribute;

/** Chống tái phát: phương thức kế thừa từ BaseCrudService phải chạy trong transaction. */
class BaseCrudServiceTest {

    private final AnnotationTransactionAttributeSource nguon = new AnnotationTransactionAttributeSource();

    private TransactionAttribute thuocTinh(Class<?> lop, String ten, Class<?>... thamSo) throws NoSuchMethodException {
        Method phuongThuc = BaseCrudService.class.getMethod(ten, thamSo);
        return nguon.getTransactionAttribute(phuongThuc, lop);
    }

    @ParameterizedTest
    @ValueSource(classes = {QuanLyNhanVienUseCase.class, QuanLyDongCaUseCase.class, QuanLyLoCaUseCase.class})
    void phuongThucGhiCoTransactionPhuongThucDocChiDoc(Class<?> lop) throws NoSuchMethodException {
        for (TransactionAttribute ghi : new TransactionAttribute[] {
                thuocTinh(lop, "tao", Object.class),
                thuocTinh(lop, "capNhat", Long.class, Object.class),
                thuocTinh(lop, "xoa", Long.class)}) {
            assertThat(ghi).isNotNull();
            assertThat(ghi.isReadOnly()).isFalse();
        }
        assertThat(thuocTinh(lop, "layTatCa").isReadOnly()).isTrue();
        assertThat(thuocTinh(lop, "layTheoId", Long.class).isReadOnly()).isTrue();
    }
}
