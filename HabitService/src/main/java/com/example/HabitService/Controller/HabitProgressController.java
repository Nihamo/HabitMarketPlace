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
    // ADD DAILY PROGRESS  (User marks today's habit as done)
    // -------------------------------------------------------------------------
    @PostMapping("/{habitId}")
    public HabitProgress addProgress(@PathVariable Long habitId) {
        return progressService.addProgress(habitId);
    }

    // -------------------------------------------------------------------------
    // GET ALL PROGRESS ENTRIES FOR A HABIT (sorted by date)
    // -------------------------------------------------------------------------
    @GetMapping("/habit/{habitId}")
    public List<HabitProgress> getProgressByHabit(@PathVariable Long habitId) {
        return progressService.getProgressByHabit(habitId);
    }

    // -------------------------------------------------------------------------
    // GET CURRENT STREAK FOR A HABIT
    // -------------------------------------------------------------------------
    @GetMapping("/streak/{habitId}")
    public int getStreak(@PathVariable Long habitId) {
        return progressService.getStreak(habitId);
    }

    // -------------------------------------------------------------------------
    // GET TOTAL COMPLETED DAYS FOR A HABIT
    // -------------------------------------------------------------------------
    @GetMapping("/total/{habitId}")
    public long getTotalCompleted(@PathVariable Long habitId) {
        return progressService.getTotalCompletedDays(habitId);
    }

    // -------------------------------------------------------------------------
    // DELETE A PROGRESS ENTRY
    // -------------------------------------------------------------------------
    @DeleteMapping("/{progressId}")
    public String deleteProgress(@PathVariable Long progressId) {
        return progressService.deleteProgress(progressId);
    }
}
