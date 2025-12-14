package com.example.integrationtest.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class IntegrationTestService {

    private final RestTemplate restTemplate;

    public IntegrationTestService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Service names registered in Eureka
    @Value("${services.user-service.name}")
    private String userService;

    @Value("${services.habit-service.name}")
    private String habitService;

    @Value("${services.reward-service.name}")
    private String rewardService;

    /**
     * Runs integration tests across all microservices
     * @return Map of test name -> PASS/FAIL
     */
    public Map<String, String> runIntegrationTests() {

        Map<String, String> results = new LinkedHashMap<>();

        // ---------------- USER SERVICE ----------------
        results.put("User Profile",
                call("http://" + userService + "/users/1"));

        results.put("User Coins",
                call("http://" + userService + "/users/1/coins"));

        results.put("Leaderboard",
                call("http://" + userService + "/users/leaderboard"));

        results.put("User Achievements",
                call("http://" + userService + "/users/1/achievements"));

        // ---------------- HABIT SERVICE ----------------
        results.put("User Habits",
                call("http://" + habitService + "/habits/user/1"));

        results.put("Marketplace Habits",
                call("http://" + habitService + "/habits/marketplace"));

        // ---------------- HABIT PROGRESS ----------------
        results.put("Habit Streak",
                call("http://" + habitService + "/progress/streak/8/user/1"));

        results.put("Total Completed Days",
                call("http://" + habitService + "/progress/total/8/user/1"));

        // ---------------- REWARD SERVICE ----------------
        results.put("Available Rewards",
                call("http://" + rewardService + "/rewards"));

        results.put("User Redemptions",
                call("http://" + rewardService + "/rewards/user/1"));

        return results;
    }

    /**
     * Helper method to safely call an endpoint
     */
    private String call(String url) {
        try {
            restTemplate.getForEntity(url, String.class);
            return "✅ PASS";
        } catch (Exception e) {
            return "❌ FAIL";
        }
    }
}