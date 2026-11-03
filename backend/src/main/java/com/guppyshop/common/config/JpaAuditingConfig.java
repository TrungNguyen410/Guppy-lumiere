package com.guppyshop.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/** Bật tự động ghi createdAt, updatedAt cho BaseEntity. */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
