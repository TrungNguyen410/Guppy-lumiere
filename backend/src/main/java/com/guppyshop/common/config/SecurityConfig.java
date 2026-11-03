package com.guppyshop.common.config;

import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/** Bảo mật không trạng thái bằng JWT, phân quyền theo đường dẫn ở mục 5 của đề bài. */
@Configuration
public class SecurityConfig {

    private static final String[] DUONG_DAN_SWAGGER = {"/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**"};

    @Bean
    SecurityFilterChain boLocBaoMat(HttpSecurity http, JwtTokenProvider jwt, KiemTraPhien kiemTraPhien,
                                    XuLyLoiBaoMat xuLyLoi) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(loi -> loi.authenticationEntryPoint(xuLyLoi).accessDeniedHandler(xuLyLoi))
                .addFilterBefore(new JwtAuthenticationFilter(jwt, kiemTraPhien), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(quyen -> quyen
                        .dispatcherTypeMatchers(DispatcherType.ERROR, DispatcherType.FORWARD).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(DUONG_DAN_SWAGGER).permitAll()
                        // Công khai
                        .requestMatchers(HttpMethod.POST, "/api/auth/dang-ky", "/api/auth/dang-nhap").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/san-pham", "/api/san-pham/**", "/api/dong-ca").permitAll()
                        .requestMatchers("/api/gio-hang", "/api/gio-hang/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/don-hang").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/don-hang/tra-cuu").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/don-hang/*/huy").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/ma-giam-gia/kiem-tra").permitAll()
                        // Khách hàng
                        .requestMatchers("/api/khach-hang/**").hasRole("KHACH_HANG")
                        .requestMatchers(HttpMethod.POST, "/api/danh-gia", "/api/bao-hanh").hasRole("KHACH_HANG")
                        // Nhân viên; Admin được dùng nhờ phân cấp vai trò bên dưới
                        .requestMatchers("/api/nv/**").hasRole("NHAN_VIEN")
                        // Admin
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .build();
    }

    /** Admin kế thừa mọi quyền của Nhân viên. */
    @Bean
    static RoleHierarchy phanCapVaiTro() {
        return RoleHierarchyImpl.withDefaultRolePrefix().role("ADMIN").implies("NHAN_VIEN").build();
    }

    @Bean
    PasswordEncoder boMaHoaMatKhau() {
        return new BCryptPasswordEncoder();
    }
}
