package com.example.HabitService.Controller;

import com.example.HabitService.Model.HabitProgress;
import com.example.HabitService.Service.HabitProgressService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/progress")
public class HabitProgressController {

    private final HabitProgressService progressService;

    public HabitProgressController(HabitProgressService progressService) {
        this.progressService = progressService;
    }

    // -------------------------------------------------------------------------
    // ADD DAILY PROGRESS (User marks today's habit as done)
    // -------------------------------------------------------------------------
    @PostMapping("/{habitId}/user/{userId}")
    public HabitProgress addProgress(
            @PathVariable Long habitId,
            @PathVariable Long userId) {
        return progressService.addProgress(habitId, userId);
    }

    // -------------------------------------------------------------------------
    // GET ALL PROGRESS ENTRIES FOR A HABIT (sorted by date)
    // -------------------------------------------------------------------------
    @GetMapping("/habit/{habitId}/user/{userId}")
    public List<HabitProgress> getProgressByHabit(
            @PathVariable Long habitId,
            @PathVariable Long userId) {
        return progressService.getProgressByHabit(habitId, userId);
    }

    // -------------------------------------------------------------------------
    // GET CURRENT STREAK FOR A HABIT
    // -------------------------------------------------------------------------
    @GetMapping("/streak/{habitId}/user/{userId}")
    public int getStreak(
            @PathVariable Long habitId,
            @PathVariable Long userId) {
        return progressService.getStreak(habitId, userId);
    }

    // -------------------------------------------------------------------------
    // GET TOTAL COMPLETED DAYS FOR A HABIT
    // -------------------------------------------------------------------------
    @GetMapping("/total/{habitId}/user/{userId}")
    public long getTotalCompleted(
            @PathVariable Long habitId,
            @PathVariable Long userId) {
        return progressService.getTotalCompletedDays(habitId, userId);
    }

    // -------------------------------------------------------------------------
    // DELETE A PROGRESS ENTRY (user/admin)
    // -------------------------------------------------------------------------
    @DeleteMapping("/{progressId}/user/{userId}")
    public String deleteProgress(
            @PathVariable Long progressId,
            @PathVariable Long userId) {
        return progressService.deleteProgress(progressId, userId);
    }

    // -------------------------------------------------------------------------
    // GET TOTAL UNIQUE ACTIVE DAYS FOR A USER (Across all habits)
    // -------------------------------------------------------------------------
    @GetMapping("/total/days/user/{userId}")
    public long getTotalUniqueDays(
            @PathVariable Long userId) {
        return progressService.getTotalUniqueActiveDays(userId);
    }
}
