package com.guppyshop.catalog.domain.model;

import java.text.Normalizer;
import java.util.Locale;

/** Chuyển tên tiếng Việt thành slug cho URL, ví dụ "Rồng Đỏ Đuôi Voan" thành "rong-do-duoi-voan". */
public final class TaoSlug {

    private TaoSlug() {
    }

    public static String tu(String ten) {
        // Đ không tách được dấu bằng Normalizer nên phải đổi riêng
        String boDau = Normalizer.normalize(ten.replace('đ', 'd').replace('Đ', 'D'), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return boDau.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }
}
