package com.guppyshop.catalog.application.usecase;

import com.guppyshop.catalog.application.dto.SanPhamDtos.DongCaDto;
import com.guppyshop.catalog.application.dto.SanPhamDtos.LuuDongCaCommand;
import com.guppyshop.catalog.application.mapper.SanPhamMapper;
import com.guppyshop.catalog.domain.model.DongCa;
import com.guppyshop.catalog.domain.repository.DongCaRepository;
import com.guppyshop.common.application.BaseCrudService;
import com.guppyshop.common.exception.BusinessException;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** TEMPLATE METHOD: dòng cá dùng trình tự CRUD của BaseCrudService. */
@Service
@Transactional
public class QuanLyDongCaUseCase extends BaseCrudService<DongCa, LuuDongCaCommand, LuuDongCaCommand, DongCaDto> {

    private final DongCaRepository dongCaRepository;
    private final SanPhamMapper mapper;

    public QuanLyDongCaUseCase(DongCaRepository dongCaRepository, SanPhamMapper mapper) {
        this.dongCaRepository = dongCaRepository;
        this.mapper = mapper;
    }

    @Override
    protected String tenDoiTuong() {
        return "Dòng cá";
    }

    @Override
    protected List<DongCa> timTatCa() {
        return dongCaRepository.findAllByOrderByIdAsc();
    }

    @Override
    protected Optional<DongCa> timTheoId(Long id) {
        return dongCaRepository.findById(id);
    }

    @Override
    protected void kiemTraKhiTao(LuuDongCaCommand lenh) {
        if (dongCaRepository.existsByMa(lenh.ma())) {
            throw new BusinessException("Mã dòng cá đã tồn tại");
        }
    }

    @Override
    protected DongCa taoEntity(LuuDongCaCommand lenh) {
        return new DongCa(lenh.ma(), lenh.ten().strip(), lenh.xuatXu().strip(), lenh.hoaTiet(),
                lenh.mauThan(), lenh.mauDuoi1(), lenh.mauDuoi2(), lenh.mauNhan());
    }

    /** Mã dòng dùng trong URL lọc nên được giữ nguyên khi sửa. */
    @Override
    protected void apDungThayDoi(DongCa dongCa, LuuDongCaCommand lenh) {
        dongCa.capNhat(lenh.ten().strip(), lenh.xuatXu().strip(), lenh.hoaTiet(),
                lenh.mauThan(), lenh.mauDuoi1(), lenh.mauDuoi2(), lenh.mauNhan());
    }

    @Override
    protected DongCa luu(DongCa dongCa) {
        return dongCaRepository.save(dongCa);
    }

    @Override
    protected void xoaEntity(DongCa dongCa) {
        dongCaRepository.delete(dongCa);
    }

    @Override
    protected DongCaDto sangDto(DongCa dongCa) {
        return mapper.sangDongCa(dongCa);
    }
}
