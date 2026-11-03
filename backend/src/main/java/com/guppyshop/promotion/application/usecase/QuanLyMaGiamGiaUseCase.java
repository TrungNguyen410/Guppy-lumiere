package com.guppyshop.promotion.application.usecase;

import com.guppyshop.common.application.BaseCrudService;
import com.guppyshop.common.exception.BusinessException;
import com.guppyshop.common.exception.NotFoundException;
import com.guppyshop.promotion.application.dto.MaGiamGiaDtos.KetQuaApMaDto;
import com.guppyshop.promotion.application.dto.MaGiamGiaDtos.LuuMaGiamGiaCommand;
import com.guppyshop.promotion.application.dto.MaGiamGiaDtos.MaGiamGiaDto;
import com.guppyshop.promotion.application.mapper.MaGiamGiaMapper;
import com.guppyshop.promotion.domain.model.MaGiamGia;
import com.guppyshop.promotion.domain.repository.MaGiamGiaRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/** TEMPLATE METHOD cho CRUD của admin, kèm nghiệp vụ áp mã khi đặt hàng. */
@Service
@Transactional
public class QuanLyMaGiamGiaUseCase extends BaseCrudService<MaGiamGia, LuuMaGiamGiaCommand, LuuMaGiamGiaCommand, MaGiamGiaDto> {

    private static final String MA_KHONG_TON_TAI = "Mã giảm giá không tồn tại";

    private final MaGiamGiaRepository maGiamGiaRepository;
    private final MaGiamGiaMapper mapper;

    public QuanLyMaGiamGiaUseCase(MaGiamGiaRepository maGiamGiaRepository, MaGiamGiaMapper mapper) {
        this.maGiamGiaRepository = maGiamGiaRepository;
        this.mapper = mapper;
    }

    /** Xem trước số tiền giảm trên trang thanh toán, chưa tính là đã dùng. */
    @Transactional(readOnly = true)
    public KetQuaApMaDto xemTruoc(String ma, BigDecimal tamTinh) {
        MaGiamGia maGiamGia = maGiamGiaRepository.findByMa(chuanHoa(ma))
                .orElseThrow(() -> new BusinessException(MA_KHONG_TON_TAI));
        return ketQua(maGiamGia, tamTinh);
    }

    /** Dùng mã trong transaction đặt hàng; đơn rollback thì lượt dùng cũng rollback. */
    @Transactional(propagation = Propagation.MANDATORY)
    public KetQuaApMaDto apDung(String ma, BigDecimal tamTinh) {
        MaGiamGia maGiamGia = maGiamGiaRepository.khoaTheoMa(chuanHoa(ma))
                .orElseThrow(() -> new BusinessException(MA_KHONG_TON_TAI));
        KetQuaApMaDto ketQua = ketQua(maGiamGia, tamTinh);
        maGiamGia.dungMotLuot();
        return ketQua;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void traLuot(Long id) {
        maGiamGiaRepository.khoaTheoId(id).ifPresent(MaGiamGia::traMotLuot);
    }

    @Override
    protected String tenDoiTuong() {
        return "Mã giảm giá";
    }

    @Override
    protected List<MaGiamGia> timTatCa() {
        return maGiamGiaRepository.findAllByOrderByIdDesc();
    }

    @Override
    protected Optional<MaGiamGia> timTheoId(Long id) {
        return maGiamGiaRepository.findById(id);
    }

    @Override
    protected void kiemTraKhiTao(LuuMaGiamGiaCommand lenh) {
        if (maGiamGiaRepository.existsByMa(chuanHoa(lenh.ma()))) {
            throw new BusinessException("Mã giảm giá đã tồn tại");
        }
    }

    @Override
    protected MaGiamGia taoEntity(LuuMaGiamGiaCommand lenh) {
        return new MaGiamGia(chuanHoa(lenh.ma()), lenh.phanTram(), lenh.ngayBatDau(), lenh.ngayHetHan(), lenh.soLuotToiDa(), lenh.kichHoat());
    }

    @Override
    protected void apDungThayDoi(MaGiamGia maGiamGia, LuuMaGiamGiaCommand lenh) {
        maGiamGia.capNhat(lenh.phanTram(), lenh.ngayBatDau(), lenh.ngayHetHan(), lenh.soLuotToiDa(), lenh.kichHoat());
    }

    @Override
    protected MaGiamGia luu(MaGiamGia maGiamGia) {
        return maGiamGiaRepository.save(maGiamGia);
    }

    @Override
    protected void xoaEntity(MaGiamGia maGiamGia) {
        maGiamGiaRepository.delete(maGiamGia);
    }

    @Override
    protected MaGiamGiaDto sangDto(MaGiamGia maGiamGia) {
        return mapper.sangDto(maGiamGia);
    }

    private KetQuaApMaDto ketQua(MaGiamGia maGiamGia, BigDecimal tamTinh) {
        BigDecimal tienGiam = maGiamGia.tinhTienGiam(tamTinh, LocalDateTime.now());
        return new KetQuaApMaDto(maGiamGia.getId(), maGiamGia.getMa(), maGiamGia.getPhanTram(), tienGiam);
    }

    private String chuanHoa(String ma) {
        return ma.strip().toUpperCase(Locale.ROOT);
    }
}
