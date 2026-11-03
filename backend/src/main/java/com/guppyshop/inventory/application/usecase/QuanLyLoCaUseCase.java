package com.guppyshop.inventory.application.usecase;

import com.guppyshop.catalog.domain.model.CaGuppy;
import com.guppyshop.catalog.domain.model.SanPham;
import com.guppyshop.catalog.domain.repository.SanPhamRepository;
import com.guppyshop.common.application.BaseCrudService;
import com.guppyshop.common.domain.PhanTrang;
import com.guppyshop.common.domain.Trang;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import com.guppyshop.inventory.application.dto.LoCaDtos.BienDongKhoDto;
import com.guppyshop.inventory.application.dto.LoCaDtos.HaoHutCommand;
import com.guppyshop.inventory.application.dto.LoCaDtos.LoCaDto;
import com.guppyshop.inventory.application.dto.LoCaDtos.NhapDeCommand;
import com.guppyshop.inventory.application.dto.LoCaDtos.PhanGioiCommand;
import com.guppyshop.inventory.application.dto.LoCaDtos.SuaLoCaCommand;
import com.guppyshop.inventory.application.dto.LoCaDtos.TaoLoCaCommand;
import com.guppyshop.inventory.application.mapper.LoCaMapper;
import com.guppyshop.inventory.domain.model.BienDongKho;
import com.guppyshop.inventory.domain.model.LoCa;
import com.guppyshop.inventory.domain.model.LoaiBienDong;
import com.guppyshop.inventory.domain.repository.BienDongKhoRepository;
import com.guppyshop.inventory.domain.repository.LoCaRepository;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** TEMPLATE METHOD cho CRUD lô cá; các nghiệp vụ kho đều ghi kèm nhật ký. */
@Service
@Transactional
public class QuanLyLoCaUseCase extends BaseCrudService<LoCa, TaoLoCaCommand, SuaLoCaCommand, LoCaDto> {

    private final LoCaRepository loCaRepository;
    private final BienDongKhoRepository bienDongRepository;
    private final SanPhamRepository sanPhamRepository;
    private final LoCaMapper mapper;

    public QuanLyLoCaUseCase(LoCaRepository loCaRepository, BienDongKhoRepository bienDongRepository,
                             SanPhamRepository sanPhamRepository, LoCaMapper mapper) {
        this.loCaRepository = loCaRepository;
        this.bienDongRepository = bienDongRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.mapper = mapper;
    }

    /** Ghi đè để đọc tên sản phẩm một lần cho cả danh sách, tránh N+1. */
    @Override
    @Transactional(readOnly = true)
    public List<LoCaDto> layTatCa() {
        return sangDanhSachDto(loCaRepository.timTatCa());
    }

    @Transactional(readOnly = true)
    public List<LoCaDto> timKiem(String tuKhoa) {
        return tuKhoa == null || tuKhoa.isBlank() ? layTatCa() : sangDanhSachDto(loCaRepository.timTheoTuKhoa(tuKhoa));
    }

    private List<LoCaDto> sangDanhSachDto(List<LoCa> cacLo) {
        Map<Long, SanPham> sanPham = sanPhamRepository.timTheoCacId(cacLo.stream().map(LoCa::getCaGuppyId).distinct().toList())
                .stream().collect(Collectors.toMap(SanPham::getId, Function.identity()));
        return cacLo.stream().map(lo -> sangDto(lo, sanPham.get(lo.getCaGuppyId()))).toList();
    }

    @Override
    public LoCaDto tao(TaoLoCaCommand lenh) {
        LoCaDto moi = super.tao(lenh);
        LoCa lo = layEntity(moi.id());
        if (lo.tongCa() > 0) {
            bienDongRepository.luu(lo.ghiNhapBanDau());
        }
        return moi;
    }

    public LoCaDto nhapDe(Long id, NhapDeCommand lenh) {
        LoCa lo = layEntity(id);
        bienDongRepository.luu(lo.nhapDe(lenh.soCaBot(), lenh.ghiChu()));
        return sangDto(lo);
    }

    public LoCaDto phanGioi(Long id, PhanGioiCommand lenh) {
        LoCa lo = layEntity(id);
        bienDongRepository.luu(lo.phanGioi(lenh.soDuc(), lenh.soCai(), lenh.ghiChu()));
        return sangDto(lo);
    }

    public LoCaDto ghiHaoHut(Long id, HaoHutCommand lenh) {
        LoCa lo = layEntity(id);
        bienDongRepository.luu(lo.ghiHaoHut(lenh.soDuc(), lenh.soCai(), lenh.soCaBot(), lenh.ghiChu()));
        return sangDto(lo);
    }

    @Transactional(readOnly = true)
    public Trang<BienDongKhoDto> nhatKy(Long loCaId, PhanTrang phanTrang) {
        Trang<BienDongKho> ketQua = bienDongRepository.timMoiNhat(loCaId, phanTrang);
        Map<Long, String> maLo = loCaRepository.timTheoCacId(ketQua.noiDung().stream().map(BienDongKho::getLoCaId).distinct().toList())
                .stream().collect(Collectors.toMap(LoCa::getId, LoCa::getMaLo));
        return ketQua.chuyenDoi(b -> mapper.sangDto(b, maLo.get(b.getLoCaId())));
    }

    @Override
    protected String tenDoiTuong() {
        return "Lô cá";
    }

    @Override
    protected List<LoCa> timTatCa() {
        return loCaRepository.timTatCa();
    }

    @Override
    protected Optional<LoCa> timTheoId(Long id) {
        return loCaRepository.timTheoId(id);
    }

    @Override
    protected void kiemTraKhiTao(TaoLoCaCommand lenh) {
        if (loCaRepository.tonTaiMaLo(chuanHoaMaLo(lenh.maLo()))) {
            throw new BusinessException("Mã lô đã tồn tại");
        }
        SanPham sanPham = sanPhamRepository.timTheoId(lenh.caGuppyId())
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));
        if (!(sanPham instanceof CaGuppy)) {
            throw new BusinessException("Lô cá chỉ gắn với sản phẩm cá");
        }
    }

    @Override
    protected LoCa taoEntity(TaoLoCaCommand lenh) {
        return new LoCa(chuanHoaMaLo(lenh.maLo()), lenh.caGuppyId(), lenh.boMe(), lenh.beNuoi().strip(), lenh.ngayNo(),
                lenh.soDuc(), lenh.soCai(), lenh.soCaBot());
    }

    /** Chỉ sửa thông tin mô tả; số lượng phải đi qua nhập đẻ, phân giới, hao hụt để có nhật ký. */
    @Override
    protected void apDungThayDoi(LoCa lo, SuaLoCaCommand lenh) {
        lo.capNhatThongTin(lenh.boMe(), lenh.beNuoi().strip(), lenh.ngayNo());
    }

    @Override
    protected LoCa luu(LoCa lo) {
        return loCaRepository.luu(lo);
    }

    /** Lô đã từng bán phải giữ lại để truy vết đơn hàng. */
    @Override
    protected void xoaEntity(LoCa lo) {
        if (bienDongRepository.coBienDongLoai(lo.getId(), List.of(LoaiBienDong.BAN, LoaiBienDong.TRA_TON))) {
            throw new BusinessException("Lô đã có đơn hàng nên không thể xóa");
        }
        bienDongRepository.xoaTheoLo(lo.getId());
        loCaRepository.xoa(lo);
    }

    @Override
    protected LoCaDto sangDto(LoCa lo) {
        return sangDto(lo, sanPhamRepository.timTheoId(lo.getCaGuppyId()).orElse(null));
    }

    private LoCaDto sangDto(LoCa lo, SanPham sanPham) {
        String tenSanPham = sanPham == null ? null : sanPham.getTen();
        String tenDong = sanPham instanceof CaGuppy ca ? ca.getDongCa().getTen() : null;
        return mapper.sangDto(lo, tenSanPham, tenDong);
    }

    private String chuanHoaMaLo(String maLo) {
        return maLo.strip().toUpperCase(Locale.ROOT);
    }
}
