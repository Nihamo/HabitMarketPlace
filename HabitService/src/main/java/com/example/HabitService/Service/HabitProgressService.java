package com.example.HabitService.Service;

import com.example.HabitService.Model.Habit;
import com.example.HabitService.Model.HabitProgress;
import com.example.HabitService.Repository.HabitProgressRepository;
import com.example.HabitService.Repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import com.example.HabitService.Client.UserServiceClient;

@Service
public class HabitProgressService {

    private final HabitProgressRepository progressRepo;
    private final HabitRepository habitRepo;
    private final UserServiceClient userServiceClient;

    public HabitProgressService(HabitProgressRepository progressRepo, HabitRepository habitRepo,
            UserServiceClient userServiceClient) {
        this.progressRepo = progressRepo;
        this.habitRepo = habitRepo;
        this.userServiceClient = userServiceClient;
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

        Habit habit = habitRepo.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found: " + habitId));

        if (!habit.getUserId().equals(userId)) {
            throw new RuntimeException("This habit does not belong to user: " + userId);
        }

        // -------------------------------------------------------------------
        // RULE: Can only check in if status is ACTIVE
        // -------------------------------------------------------------------
        if (!"ACTIVE".equalsIgnoreCase(habit.getStatus())) {
            throw new RuntimeException("Cannot add progress to a habit that is " + habit.getStatus());
        }

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

        HabitProgress saved = progressRepo.save(progress);

        // Award 10 Coins
        try {
            userServiceClient.addCoins(userId, 10);
        } catch (Exception e) {
            System.err.println("Failed to award coins: " + e.getMessage());
            // Fail silently so progress is still saved? Or rollback?
            // Usually gamification failure shouldn't block core logic, but user requested
            // it.
            // I'll keep it simple: log and continue.
        }

        return saved;
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

        List<HabitProgress> progressList = progressRepo.findByHabitIdOrderByDateAsc(habitId);

        if (progressList.isEmpty())
            return 0;

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

    // -------------------------------------------------------------------
    // GET TOTAL UNIQUE ACTIVE DAYS FOR USER (Across all habits)
    // -------------------------------------------------------------------
    public long getTotalUniqueActiveDays(Long userId) {
        // 1. Get all habit IDs for this user
        List<Long> habitIds = habitRepo.findByUserId(userId).stream()
                .map(Habit::getId)
                .toList();

        if (habitIds.isEmpty())
            return 0;

        // 2. Get all progress for these habits
        List<HabitProgress> allProgress = progressRepo.findByHabitIdIn(habitIds);

        // 3. Count unique dates
        return allProgress.stream()
                .map(HabitProgress::getDate)
                .distinct()
                .count();
    }
}
