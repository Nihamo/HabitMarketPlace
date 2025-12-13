package com.example.UserService.Service;

import com.example.UserService.Client.HabitServiceClient;
import com.example.UserService.DTO.UpdateProfileRequest;
import com.example.UserService.DTO.UserStatsDTO;
import com.example.UserService.Exception.UserNotFoundException;
import com.example.UserService.Model.User;
import com.example.UserService.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final HabitServiceClient habitServiceClient;

    public UserService(UserRepository userRepository,
                       HabitServiceClient habitServiceClient) {
        this.userRepository = userRepository;
        this.habitServiceClient = habitServiceClient;
    }

    // ----------------------------------------------------------------
    // GET USER PROFILE
    // ----------------------------------------------------------------
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + userId)
                );
    }

    // ----------------------------------------------------------------
    // UPDATE USER PROFILE
    // ----------------------------------------------------------------
    public User updateProfile(Long userId, UpdateProfileRequest request) {

        User user = getUserById(userId);

        user.setUsername(request.getUsername());
        user.setBio(request.getBio());
        user.setProfilePictureUrl(request.getProfilePictureUrl());
        user.setBirthdate(request.getBirthdate());
        user.setGender(request.getGender());
        user.setCountry(request.getCountry());

        return userRepository.save(user);
    }

    // ----------------------------------------------------------------
    // USER STATISTICS (FROM HABIT SERVICE)
    // ----------------------------------------------------------------
    public UserStatsDTO getUserStatistics(Long userId) {

        // Fetch user's habits from HabitService
        List<Long> habitIds = habitServiceClient.getHabitsByUser(userId);

        int totalHabits = habitIds.size();
        int completedHabits = 0;
        int activeHabits = 0;
        int totalCompletedDays = 0;
        int longestStreak = 0;

        for (Long habitId : habitIds) {

            int streak = habitServiceClient.getHabitStreak(habitId);
            int completedDays = habitServiceClient.getTotalCompletedDays(habitId);

            totalCompletedDays += completedDays;
            longestStreak = Math.max(longestStreak, streak);

            if (completedDays > 0) {
                completedHabits++;
            } else {
                activeHabits++;
            }
        }

        int completionRate = totalHabits == 0
                ? 0
                : (completedHabits * 100) / totalHabits;

        return new UserStatsDTO(
                totalHabits,
                activeHabits,
                completedHabits,
                longestStreak,
                totalCompletedDays,
                completionRate
        );
    }

    // ----------------------------------------------------------------
    // COINS MANAGEMENT
    // ----------------------------------------------------------------
    public User addCoins(Long userId, int coins) {

        User user = getUserById(userId);
        user.setCoins(user.getCoins() + coins);

        return userRepository.save(user);
    }

    public User deductCoins(Long userId, int coins) {

        User user = getUserById(userId);

        if (user.getCoins() < coins) {
            throw new RuntimeException("Insufficient coins");
        }

        user.setCoins(user.getCoins() - coins);
        return userRepository.save(user);
    }
}