package com.guppyshop.common.domain;

import java.util.List;
import java.util.function.Function;

/** Một trang kết quả của domain. */
public record Trang<T>(List<T> noiDung, int trang, int kichThuoc, long tongPhanTu) {

    public int tongTrang() {
        return kichThuoc == 0 ? 0 : (int) Math.ceil((double) tongPhanTu / kichThuoc);
    }

    public <R> Trang<R> chuyenDoi(Function<T, R> chuyen) {
        return new Trang<>(noiDung.stream().map(chuyen).toList(), trang, kichThuoc, tongPhanTu);
    }
}
