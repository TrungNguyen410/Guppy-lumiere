package com.guppyshop.inventory.application.usecase;

import com.guppyshop.catalog.domain.model.CaGuppy;
import com.guppyshop.catalog.domain.model.CatalogEnums.DonViBan;
import com.guppyshop.catalog.domain.model.CatalogEnums.GioiTinh;
import com.guppyshop.catalog.domain.model.LuaChonBan;
import com.guppyshop.catalog.domain.model.SanPham;
import com.guppyshop.catalog.domain.model.TonKho;
import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import com.guppyshop.inventory.domain.model.BienDongKho;
import com.guppyshop.inventory.domain.model.LoCa;
import com.guppyshop.inventory.domain.model.LoaiBienDong;
import com.guppyshop.inventory.domain.model.PhanBoTonKho;
import com.guppyshop.inventory.domain.repository.BienDongKhoRepository;
import com.guppyshop.inventory.domain.repository.LoCaRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Giữ tồn khi đặt hàng, trả tồn khi hủy. Chạy trong transaction của đơn hàng:
 * không đủ tồn thì cả đơn rollback, không có chuyện đơn tạo xong mà kho chưa trừ.
 */
@Service
public class GiuTraTonUseCase {

    public record DongCanXuat(Long sanPhamId, DonViBan donVi, GioiTinh gioiTinh, int soLuong) {
    }

    private final LoCaRepository loCaRepository;
    private final BienDongKhoRepository bienDongRepository;
    private final SanPhamRepository sanPhamRepository;

    public GiuTraTonUseCase(LoCaRepository loCaRepository, BienDongKhoRepository bienDongRepository,
                            SanPhamRepository sanPhamRepository) {
        this.loCaRepository = loCaRepository;
        this.bienDongRepository = bienDongRepository;
        this.sanPhamRepository = sanPhamRepository;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void giuTon(Long donHangId, String maDon, List<DongCanXuat> cacDong) {
        // Xử lý theo thứ tự sản phẩm cố định để hai đơn cùng chứa 2 sản phẩm không gây deadlock
        List<DongCanXuat> daSapXep = cacDong.stream().sorted(Comparator.comparing(DongCanXuat::sanPhamId)).toList();
        List<BienDongKho> nhatKy = new ArrayList<>();
        for (DongCanXuat dong : daSapXep) {
            SanPham sanPham = sanPhamRepository.timTheoId(dong.sanPhamId())
                    .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));
            if (sanPham instanceof CaGuppy ca) {
                TonKho can = ca.soCaCan(new LuaChonBan(dong.donVi(), dong.gioiTinh()), dong.soLuong());
                List<LoCa> cacLo = loCaRepository.khoaTheoSanPham(ca.getId());
                try {
                    nhatKy.addAll(PhanBoTonKho.xuatChoDon(cacLo, can, donHangId, "Đơn " + maDon));
                } catch (BusinessException ex) {
                    // Khách cần biết sản phẩm nào thiếu để giảm đúng dòng trong giỏ
                    throw new BusinessException("Không đủ hàng: " + ca.getTen());
                }
            } else if (!sanPhamRepository.giamTonPhuKien(dong.sanPhamId(), dong.soLuong())) {
                throw new BusinessException("Không đủ hàng: " + sanPham.getTen());
            }
        }
        bienDongRepository.luuTatCa(nhatKy);
    }

    /** Gọi lại lần hai không trả thêm cá: mọi dòng BAN của đơn chỉ được trả một lần. */
    @Transactional(propagation = Propagation.MANDATORY)
    public void traTon(Long donHangId, String maDon, List<DongCanXuat> cacDong) {
        if (!bienDongRepository.timTheoDon(donHangId, LoaiBienDong.TRA_TON).isEmpty()) {
            return;
        }
        List<BienDongKho> dongBan = bienDongRepository.timTheoDon(donHangId, LoaiBienDong.BAN);
        Map<Long, LoCa> cacLo = loCaRepository.khoaTheoCacId(dongBan.stream().map(BienDongKho::getLoCaId).distinct().toList())
                .stream().collect(Collectors.toMap(LoCa::getId, Function.identity()));
        List<BienDongKho> nhatKy = dongBan.stream()
                .map(ban -> cacLo.get(ban.getLoCaId()).traLai(ban, "Hủy đơn " + maDon))
                .toList();
        bienDongRepository.luuTatCa(nhatKy);
        // Phụ kiện không có nhật ký lô nên trả theo dòng đơn; donVi null nghĩa là phụ kiện
        cacDong.stream().filter(d -> d.donVi() == null)
                .sorted(Comparator.comparing(DongCanXuat::sanPhamId))
                .forEach(d -> sanPhamRepository.tangTonPhuKien(d.sanPhamId(), d.soLuong()));
    }
}
