package com.guppyshop.common.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Tạo và đọc JWT. Khóa ngắn hơn 32 byte sẽ làm ứng dụng dừng ngay lúc khởi động. */
@Component
public class JwtTokenProvider {

    private final SecretKey khoa;
    private final Duration thoiHan;

    public JwtTokenProvider(@Value("${app.jwt.secret}") String secret,
                            @Value("${app.jwt.thoi-han-phut}") long thoiHanPhut) {
        this.khoa = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.thoiHan = Duration.ofMinutes(thoiHanPhut);
    }

    public String taoToken(Long id, String email, String vaiTro) {
        Instant bayGio = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(id))
                .claim("email", email)
                .claim("vaiTro", vaiTro)
                .issuedAt(Date.from(bayGio))
                .expiration(Date.from(bayGio.plus(thoiHan)))
                .signWith(khoa)
                .compact();
    }

    /** Token sai chữ ký, hết hạn hoặc sai định dạng đều trả về rỗng. */
    public Optional<NguoiDungXacThuc> docToken(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(khoa).build().parseSignedClaims(token).getPayload();
            return Optional.of(new NguoiDungXacThuc(Long.valueOf(claims.getSubject()),
                    claims.get("email", String.class), claims.get("vaiTro", String.class)));
        } catch (JwtException | IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
