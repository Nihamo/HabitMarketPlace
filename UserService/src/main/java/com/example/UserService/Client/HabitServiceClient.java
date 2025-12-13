package com.example.UserService.Client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class HabitServiceClient {

    private final RestTemplate restTemplate;

    // Base URL of HabitService (adjust port if needed)
    private static final String HABIT_SERVICE_BASE_URL = "http://localhost:9001";

    public HabitServiceClient() {
        this.restTemplate = new RestTemplate();
    }

    // --------------------------------------------------
    // GET ALL HABITS OF A USER
    // Calls: GET /habits/user/{userId}
    // --------------------------------------------------
    @SuppressWarnings("unchecked")
    public List<Long> getHabitsByUser(Long userId) {

        String url = HABIT_SERVICE_BASE_URL + "/habits/user/" + userId;

        return restTemplate.getForObject(url, List.class);
    }

    // --------------------------------------------------
    // GET STREAK OF A HABIT
    // Calls: GET /progress/streak/{habitId}
    // --------------------------------------------------
    public int getHabitStreak(Long habitId) {

        String url = HABIT_SERVICE_BASE_URL + "/progress/streak/" + habitId;

        Integer streak = restTemplate.getForObject(url, Integer.class);
        return streak != null ? streak : 0;
    }

    // --------------------------------------------------
    // GET TOTAL COMPLETED DAYS OF A HABIT
    // Calls: GET /progress/total/{habitId}
    // --------------------------------------------------
    public int getTotalCompletedDays(Long habitId) {

        String url = HABIT_SERVICE_BASE_URL + "/progress/total/" + habitId;

        Integer completedDays = restTemplate.getForObject(url, Integer.class);
        return completedDays != null ? completedDays : 0;
    }
}
