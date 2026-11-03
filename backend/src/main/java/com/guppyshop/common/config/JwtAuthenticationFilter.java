package com.guppyshop.common.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Đọc Bearer token. Token không hợp lệ được coi như chưa đăng nhập: API công khai vẫn dùng được
 * khi trình duyệt còn giữ token cũ, API cần quyền sẽ trả về 401.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String TIEN_TO = "Bearer ";

    private final JwtTokenProvider jwt;
    private final KiemTraPhien kiemTraPhien;

    public JwtAuthenticationFilter(JwtTokenProvider jwt, KiemTraPhien kiemTraPhien) {
        this.jwt = jwt;
        this.kiemTraPhien = kiemTraPhien;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith(TIEN_TO)) {
            jwt.docToken(header.substring(TIEN_TO.length()))
                    .filter(nguoiDung -> kiemTraPhien.conHoatDong(nguoiDung.id()))
                    .ifPresent(nguoiDung -> SecurityContextHolder.getContext().setAuthentication(
                            new UsernamePasswordAuthenticationToken(nguoiDung, null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + nguoiDung.vaiTro())))));
        }
        chain.doFilter(request, response);
    }
}
