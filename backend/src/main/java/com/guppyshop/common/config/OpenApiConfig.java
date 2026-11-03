package com.guppyshop.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Khai báo thông tin Swagger và nút Authorize dùng Bearer JWT. */
@Configuration
public class OpenApiConfig {

    private static final String BEARER_JWT = "bearerJwt";

    @Bean
    OpenAPI thongTinApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Guppy Lumière API")
                        .version("0.1.0")
                        .description("API website bán cá bảy màu – đồ án Xây dựng Phát triển Ứng dụng Hướng đối tượng"))
                .components(new Components().addSecuritySchemes(BEARER_JWT, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Dán JWT nhận được từ POST /api/auth/dang-nhap")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_JWT));
    }
}
