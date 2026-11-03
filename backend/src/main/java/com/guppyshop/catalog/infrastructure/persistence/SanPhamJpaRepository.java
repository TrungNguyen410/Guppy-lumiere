package com.guppyshop.catalog.infrastructure.persistence;

import com.guppyshop.catalog.domain.model.SanPham;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Hai câu UPDATE tồn phụ kiện cố ý không dùng clearAutomatically: chúng chạy giữa transaction đặt hàng,
 * xóa persistence context ở đây sẽ làm entity đơn hàng bị detach và mất thay đổi.
 */
interface SanPhamJpaRepository extends JpaRepository<SanPham, Long>, JpaSpecificationExecutor<SanPham> {

    Optional<SanPham> findBySlug(String slug);

    boolean existsBySlug(String slug);

    /** Điều kiện ton_kho >= số lượng ngay trong câu UPDATE nên hai đơn đồng thời không bán vượt tồn. */
    @Modifying(flushAutomatically = true)
    @Query(value = "UPDATE phu_kien SET ton_kho = ton_kho - :soLuong WHERE san_pham_id = :id AND ton_kho >= :soLuong", nativeQuery = true)
    int giamTonPhuKien(@Param("id") Long id, @Param("soLuong") int soLuong);

    @Modifying(flushAutomatically = true)
    @Query(value = "UPDATE phu_kien SET ton_kho = ton_kho + :soLuong WHERE san_pham_id = :id", nativeQuery = true)
    int tangTonPhuKien(@Param("id") Long id, @Param("soLuong") int soLuong);

    @Modifying(flushAutomatically = true)
    @Query(value = "UPDATE san_pham SET da_ban = da_ban + :soLuong WHERE id = :id", nativeQuery = true)
    int tangDaBan(@Param("id") Long id, @Param("soLuong") int soLuong);

    /** MySQL gán từ trái sang phải: công thức điểm phải đứng trước để dùng so_danh_gia cũ. */
    @Modifying(flushAutomatically = true)
    @Query(value = """
            UPDATE san_pham
            SET diem_danh_gia = ROUND((diem_danh_gia * so_danh_gia + :soSao) / (so_danh_gia + 1), 1),
                so_danh_gia = so_danh_gia + 1
            WHERE id = :id
            """, nativeQuery = true)
    int ghiNhanDanhGia(@Param("id") Long id, @Param("soSao") int soSao);
}
