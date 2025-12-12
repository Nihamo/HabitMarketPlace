package com.example.HabitService.Service;

import com.example.HabitService.Model.Habit;
import com.example.HabitService.Model.HabitProgress;
import com.example.HabitService.Repository.HabitProgressRepository;
import com.example.HabitService.Repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HabitProgressService {

    private final HabitProgressRepository progressRepo;
    private final HabitRepository habitRepo;

    public HabitProgressService(HabitProgressRepository progressRepo, HabitRepository habitRepo) {
        this.progressRepo = progressRepo;
        this.habitRepo = habitRepo;
    }

    // -------------------------------------------------------------------
    // ADD DAILY PROGRESS (User marks habit as completed for today)
    // -------------------------------------------------------------------
    public HabitProgress addProgress(Long habitId) {

        Habit habit = habitRepo.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found: " + habitId));

        LocalDate today = LocalDate.now();

        // Check if progress already exists for today
        List<HabitProgress> existing = progressRepo.findByHabitIdAndDate(habitId, today);
        if (!existing.isEmpty()) {
            throw new RuntimeException("Progress already added for today!");
        }

        HabitProgress progress = new HabitProgress();
        progress.setHabitId(habitId);
        progress.setDate(today);
        progress.setCompleted(true); // marking completed for today

        return progressRepo.save(progress);
    }

    // -------------------------------------------------------------------
    // GET ALL PROGRESS FOR A HABIT (calendar view)
    // -------------------------------------------------------------------
    public List<HabitProgress> getProgressByHabit(Long habitId) {
        return progressRepo.findByHabitIdOrderByDateAsc(habitId);
    }

    // -------------------------------------------------------------------
    // GET CURRENT STREAK
    // -------------------------------------------------------------------
    public int getStreak(Long habitId) {

        List<HabitProgress> progressList =
                progressRepo.findByHabitIdOrderByDateAsc(habitId);

        if (progressList.isEmpty()) return 0;

        int streak = 0;
        LocalDate today = LocalDate.now();

        LocalDate checkDate = today;

        while (true) {

            // Create a final copy for lambda
            final LocalDate dateToCheck = checkDate;

            boolean exists = progressList.stream()
                    .anyMatch(p -> p.getDate().equals(dateToCheck));

            if (exists) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else {
                break;
            }
        }

        return streak;
    }

    // -------------------------------------------------------------------
    // GET TOTAL COMPLETION COUNT
    // -------------------------------------------------------------------
    public long getTotalCompletedDays(Long habitId) {
        return progressRepo.findByHabitId(habitId).size();
    }

    // -------------------------------------------------------------------
    // DELETE A PROGRESS ENTRY (admin/user fixes mistake)
    // -------------------------------------------------------------------
    public String deleteProgress(Long progressId) {
        progressRepo.deleteById(progressId);
        return "Progress entry deleted.";
    }
}
