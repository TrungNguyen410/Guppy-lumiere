package com.guppyshop.catalog.infrastructure.persistence;

import com.guppyshop.catalog.domain.model.TonKho;
import com.guppyshop.catalog.domain.repository.TonKhoReader;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/** Đọc bảng lo_ca bằng SQL để catalog không phụ thuộc vào entity của module inventory. */
@Repository
class TonKhoReaderJdbc implements TonKhoReader {

    private final NamedParameterJdbcTemplate jdbc;

    TonKhoReaderJdbc(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Map<Long, TonKho> layTonKho(Collection<Long> caGuppyIds) {
        Map<Long, TonKho> ketQua = new HashMap<>();
        if (caGuppyIds.isEmpty()) {
            return ketQua;
        }
        jdbc.query("""
                SELECT ca_guppy_id, SUM(so_duc) AS duc, SUM(so_cai) AS cai, SUM(so_ca_bot) AS bot
                FROM lo_ca
                WHERE ca_guppy_id IN (:ids)
                GROUP BY ca_guppy_id
                """, Map.of("ids", caGuppyIds), hang -> {
            ketQua.put(hang.getLong("ca_guppy_id"),
                    new TonKho(hang.getInt("duc"), hang.getInt("cai"), hang.getInt("bot")));
        });
        return ketQua;
    }

    @Override
    public List<String> layMaLo(Long caGuppyId) {
        return jdbc.queryForList("SELECT ma_lo FROM lo_ca WHERE ca_guppy_id = :id ORDER BY ngay_no DESC, ma_lo",
                Map.of("id", caGuppyId), String.class);
    }
}
