package com.guppyshop.common.application;

import com.guppyshop.common.exception.NotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

/**
 * TEMPLATE METHOD: các phương thức public cố định trình tự CRUD, lớp con chỉ cài các bước riêng.
 * <p>
 * Phải đặt @Transactional ở đây: Spring tra annotation theo lớp khai báo phương thức,
 * nên @Transactional trên lớp con không có tác dụng với các phương thức kế thừa từ lớp này.
 *
 * @param <E> entity
 * @param <T> dữ liệu đầu vào khi tạo
 * @param <S> dữ liệu đầu vào khi sửa
 * @param <D> dữ liệu trả về
 */
@Transactional
public abstract class BaseCrudService<E, T, S, D> {

    @Transactional(readOnly = true)
    public List<D> layTatCa() {
        return timTatCa().stream().map(this::sangDto).toList();
    }

    @Transactional(readOnly = true)
    public D layTheoId(Long id) {
        return sangDto(layEntity(id));
    }

    public D tao(T duLieu) {
        kiemTraKhiTao(duLieu);
        return sangDto(luu(taoEntity(duLieu)));
    }

    public D capNhat(Long id, S duLieu) {
        E entity = layEntity(id);
        kiemTraKhiSua(entity, duLieu);
        apDungThayDoi(entity, duLieu);
        return sangDto(luu(entity));
    }

    public void xoa(Long id) {
        xoaEntity(layEntity(id));
    }

    protected E layEntity(Long id) {
        return timTheoId(id).orElseThrow(() -> new NotFoundException(tenDoiTuong() + " không tồn tại"));
    }

    /** Mặc định không kiểm tra gì; lớp con ghi đè khi có quy tắc riêng. */
    protected void kiemTraKhiTao(T duLieu) {
    }

    /** Mặc định không kiểm tra gì; lớp con ghi đè khi có quy tắc riêng. */
    protected void kiemTraKhiSua(E entity, S duLieu) {
    }

    protected abstract String tenDoiTuong();

    protected abstract List<E> timTatCa();

    protected abstract Optional<E> timTheoId(Long id);

    protected abstract E taoEntity(T duLieu);

    protected abstract void apDungThayDoi(E entity, S duLieu);

    protected abstract E luu(E entity);

    protected abstract void xoaEntity(E entity);

    protected abstract D sangDto(E entity);
}
