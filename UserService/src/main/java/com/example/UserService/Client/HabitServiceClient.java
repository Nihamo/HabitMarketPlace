package com.example.UserService.Client;

import com.example.UserService.DTO.HabitDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "habit-service", url = "http://localhost:9001")
public interface HabitServiceClient {

        // ---------------- HABITS ----------------
        @GetMapping("/habits/user/{userId}")
        List<HabitDTO> getHabitsByUser(@PathVariable Long userId);

        // ---------------- PROGRESS ----------------
        @GetMapping("/progress/streak/{habitId}/user/{userId}")
        int getHabitStreak(
                        @PathVariable Long habitId,
                        @PathVariable Long userId);

        @GetMapping("/progress/total/{habitId}/user/{userId}")
        long getTotalCompletedDays(
                        @PathVariable Long habitId,
                        @PathVariable Long userId);

        @GetMapping("/progress/total/days/user/{userId}")
        long getTotalUniqueActiveDays(
                        @PathVariable Long userId);
}
