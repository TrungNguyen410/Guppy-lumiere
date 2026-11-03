package com.guppyshop.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guppyshop.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

/** Lỗi 401, 403 phát sinh ở bộ lọc bảo mật cũng trả về đúng định dạng ApiResponse. */
@Component
public class XuLyLoiBaoMat implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public XuLyLoiBaoMat(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException ex)
            throws IOException {
        ghi(response, HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException ex)
            throws IOException {
        ghi(response, HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này");
    }

    private void ghi(HttpServletResponse response, HttpStatus trangThai, String thongBao) throws IOException {
        response.setStatus(trangThai.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), ApiResponse.loi(thongBao));
    }
}
