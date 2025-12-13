package com.example.UserService.DTO;

public class UserStatsDTO {

    private int totalHabits;
    private int activeHabits;
    private int completedHabits;
    private int longestStreak;
    private int totalCompletedDays;
    private int habitCompletionRate;

    // ---------------- Constructors ----------------

    public UserStatsDTO() {
    }

    public UserStatsDTO(int totalHabits,
                        int activeHabits,
                        int completedHabits,
                        int longestStreak,
                        int totalCompletedDays,
                        int habitCompletionRate) {
        this.totalHabits = totalHabits;
        this.activeHabits = activeHabits;
        this.completedHabits = completedHabits;
        this.longestStreak = longestStreak;
        this.totalCompletedDays = totalCompletedDays;
        this.habitCompletionRate = habitCompletionRate;
    }

    // ---------------- Getters & Setters ----------------

    public int getTotalHabits() {
        return totalHabits;
    }

    public void setTotalHabits(int totalHabits) {
        this.totalHabits = totalHabits;
    }

    public int getActiveHabits() {
        return activeHabits;
    }

    public void setActiveHabits(int activeHabits) {
        this.activeHabits = activeHabits;
    }

    public int getCompletedHabits() {
        return completedHabits;
    }

    public void setCompletedHabits(int completedHabits) {
        this.completedHabits = completedHabits;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }

    public int getTotalCompletedDays() {
        return totalCompletedDays;
    }

    public void setTotalCompletedDays(int totalCompletedDays) {
        this.totalCompletedDays = totalCompletedDays;
    }

    public int getHabitCompletionRate() {
        return habitCompletionRate;
    }

    public void setHabitCompletionRate(int habitCompletionRate) {
        this.habitCompletionRate = habitCompletionRate;
    }
}