package com.example.UserService.Service;

import com.example.UserService.Client.HabitServiceClient;
import com.example.UserService.DTO.AchievementDTO;
import com.example.UserService.Model.UserAchievement;
import com.example.UserService.Repository.AchievementRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final HabitServiceClient habitServiceClient;

    public AchievementService(AchievementRepository achievementRepository,
                              HabitServiceClient habitServiceClient) {
        this.achievementRepository = achievementRepository;
        this.habitServiceClient = habitServiceClient;
    }

    // --------------------------------------------------
    // CHECK & AWARD ACHIEVEMENTS
    // --------------------------------------------------
    public void checkAndAwardAchievements(Long userId) {

        // Fetch all habits of the user
        List<Long> habitIds = habitServiceClient.getHabitsByUser(userId)
                .stream()
                .map(habit -> habit.getId())
                .toList();

        // Beginner badge (first habit)
        if (!habitIds.isEmpty()) {
            awardBadgeIfNotExists(userId, "Beginner");
        }

        int longestStreak = 0;

        for (Long habitId : habitIds) {
            int streak = habitServiceClient.getHabitStreak(habitId, userId);
            longestStreak = Math.max(longestStreak, streak);
        }

        // Streak-based badges
        if (longestStreak >= 7) {
            awardBadgeIfNotExists(userId, "7-Day Streak");
        }

        if (longestStreak >= 30) {
            awardBadgeIfNotExists(userId, "30-Day Streak");
        }

        // Habit Master badge
        if (habitIds.size() >= 5) {
            awardBadgeIfNotExists(userId, "Habit Master");
        }

        // Social Bee badge
        // (Awarded elsewhere when social threshold is met)
    }

    // --------------------------------------------------
    // GET USER ACHIEVEMENTS
    // --------------------------------------------------
    public List<AchievementDTO> getUserAchievements(Long userId) {

        List<UserAchievement> achievements =
                achievementRepository.findByUserId(userId);

        List<AchievementDTO> result = new ArrayList<>();

        for (UserAchievement achievement : achievements) {
            result.add(
                    new AchievementDTO(
                            achievement.getBadgeName(),
                            achievement.getEarnedAt()
                    )
            );
        }

        return result;
    }

    // --------------------------------------------------
    // INTERNAL HELPER
    // --------------------------------------------------
    private void awardBadgeIfNotExists(Long userId, String badgeName) {

        boolean alreadyEarned =
                achievementRepository.existsByUserIdAndBadgeName(userId, badgeName);

        if (!alreadyEarned) {
            UserAchievement achievement = new UserAchievement();
            achievement.setUserId(userId);
            achievement.setBadgeName(badgeName);

            achievementRepository.save(achievement);
        }
    }
}