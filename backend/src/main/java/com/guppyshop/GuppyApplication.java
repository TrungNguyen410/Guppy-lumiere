package com.guppyshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

/**
 * Điểm khởi động ứng dụng.
 * Tắt tài khoản mặc định của Spring Security vì hệ thống dùng JWT và bảng nguoi_dung riêng.
 */
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class GuppyApplication {

    public static void main(String[] args) {
        SpringApplication.run(GuppyApplication.class, args);
    }
}
