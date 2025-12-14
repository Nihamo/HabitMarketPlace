package com.example.HabitService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;

import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EntityScan(basePackages = "com.example.HabitService.Model")
@EnableFeignClients
public class HabitServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HabitServiceApplication.class, args);
    }
}
