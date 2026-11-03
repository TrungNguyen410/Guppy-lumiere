package com.guppyshop.catalog.domain.repository;

import com.guppyshop.catalog.domain.model.TonKho;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/** Catalog chỉ cần đọc tồn kho để hiển thị; việc thay đổi tồn thuộc về module inventory. */
public interface TonKhoReader {

    /** Sản phẩm không có lô nào sẽ không có trong kết quả. */
    Map<Long, TonKho> layTonKho(Collection<Long> caGuppyIds);

    List<String> layMaLo(Long caGuppyId);
}
