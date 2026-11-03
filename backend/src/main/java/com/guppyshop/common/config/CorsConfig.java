package com.guppyshop.common.config;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/** Cho phép frontend chạy dev gọi API; khi chạy qua Nginx thì cùng origin nên không cần CORS. */
@Configuration
public class CorsConfig {

    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origins}") List<String> origins) {
        CorsConfiguration cauHinh = new CorsConfiguration();
        cauHinh.setAllowedOrigins(origins);
        cauHinh.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cauHinh.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Session-Id"));

        UrlBasedCorsConfigurationSource nguon = new UrlBasedCorsConfigurationSource();
        nguon.registerCorsConfiguration("/api/**", cauHinh);
        return nguon;
    }
}
