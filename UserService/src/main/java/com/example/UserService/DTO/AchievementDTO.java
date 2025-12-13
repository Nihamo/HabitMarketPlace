package com.example.UserService.DTO;

import java.time.LocalDateTime;

public class AchievementDTO {

    private String badgeName;
    private LocalDateTime earnedAt;

    // ---------------- Constructors ----------------

    public AchievementDTO() {
    }

    public AchievementDTO(String badgeName, LocalDateTime earnedAt) {
        this.badgeName = badgeName;
        this.earnedAt = earnedAt;
    }

    // ---------------- Getters & Setters ----------------

    public String getBadgeName() {
        return badgeName;
    }

    public void setBadgeName(String badgeName) {
        this.badgeName = badgeName;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }
}