package com.example.RewardService.Config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    // -------------------------------------------------
    // FEIGN LOGGING LEVEL
    // -------------------------------------------------
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.BASIC;
    }
}