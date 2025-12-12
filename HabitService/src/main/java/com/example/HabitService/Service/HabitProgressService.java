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
    // VALIDATE HABIT OWNER
    // -------------------------------------------------------------------
    private void validateHabitOwnership(Long habitId, Long userId) {
        Habit habit = habitRepo.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found: " + habitId));

        if (!habit.getUserId().equals(userId)) {
            throw new RuntimeException("This habit does not belong to user: " + userId);
        }
    }

    // -------------------------------------------------------------------
    // ADD DAILY PROGRESS (User marks habit as completed for today)
    // -------------------------------------------------------------------
    public HabitProgress addProgress(Long habitId, Long userId) {

        validateHabitOwnership(habitId, userId);

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
    public List<HabitProgress> getProgressByHabit(Long habitId, Long userId) {

        validateHabitOwnership(habitId, userId);

        return progressRepo.findByHabitIdOrderByDateAsc(habitId);
    }

    // -------------------------------------------------------------------
    // GET CURRENT STREAK
    // -------------------------------------------------------------------
    public int getStreak(Long habitId, Long userId) {

        validateHabitOwnership(habitId, userId);

        List<HabitProgress> progressList =
                progressRepo.findByHabitIdOrderByDateAsc(habitId);

        if (progressList.isEmpty()) return 0;

        int streak = 0;
        LocalDate today = LocalDate.now();
        LocalDate checkDate = today;

        while (true) {

            final LocalDate dateToCheck = checkDate; // Lambda-safe variable

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
    public long getTotalCompletedDays(Long habitId, Long userId) {

        validateHabitOwnership(habitId, userId);

        return progressRepo.findByHabitId(habitId).size();
    }

    // -------------------------------------------------------------------
    // DELETE A PROGRESS ENTRY (admin/user fixes mistake)
    // -------------------------------------------------------------------
    public String deleteProgress(Long progressId, Long userId) {

        HabitProgress progress = progressRepo.findById(progressId)
                .orElseThrow(() -> new RuntimeException("Progress not found: " + progressId));

        // Validate ownership using habitId from the progress record
        validateHabitOwnership(progress.getHabitId(), userId);

        progressRepo.deleteById(progressId);

        return "Progress entry deleted.";
    }
}
