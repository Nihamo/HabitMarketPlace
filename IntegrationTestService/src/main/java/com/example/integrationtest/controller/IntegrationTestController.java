package com.example.integrationtest.controller;

import com.example.integrationtest.service.IntegrationTestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/integration-tests")
public class IntegrationTestController {

    private final IntegrationTestService integrationTestService;

    public IntegrationTestController(IntegrationTestService integrationTestService) {
        this.integrationTestService = integrationTestService;
    }

    // --------------------------------------------------
    // RUN ALL INTEGRATION TESTS
    // GET /integration-tests/run
    // --------------------------------------------------
    @GetMapping("/run")
    public Map<String, String> runAllTests() {
        return integrationTestService.runIntegrationTests();
    }
}
