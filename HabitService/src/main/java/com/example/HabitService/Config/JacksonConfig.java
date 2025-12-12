package com.example.HabitService.Config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    private final ObjectMapper objectMapper;

    public JacksonConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void setup() {
        System.out.println(">>> JacksonConfig Loaded!");
        objectMapper.registerModule(new JavaTimeModule());
    }

}
