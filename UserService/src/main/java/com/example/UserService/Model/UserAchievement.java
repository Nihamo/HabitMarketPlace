package com.example.UserService.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_achievements")
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String badgeName;

    @Column(nullable = false)
    private LocalDateTime earnedAt;

    // ----------- Constructors -----------

    public UserAchievement() {}

    public UserAchievement(Long id, Long userId, String badgeName, LocalDateTime earnedAt) {
        this.id = id;
        this.userId = userId;
        this.badgeName = badgeName;
        this.earnedAt = earnedAt;
    }

    // ----------- Getters & Setters -----------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getBadgeName() { return badgeName; }
    public void setBadgeName(String badgeName) { this.badgeName = badgeName; }

    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }

    @PrePersist
    protected void onCreate() {
        earnedAt = LocalDateTime.now();
    }
}