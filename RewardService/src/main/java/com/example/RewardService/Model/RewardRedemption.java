package com.example.RewardService.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reward_redemptions")
public class RewardRedemption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_id", nullable = false)
    private Reward reward;

    @Column(name = "redeemed_at", nullable = false)
    private LocalDateTime redeemedAt;

    public RewardRedemption() {
    }

    public RewardRedemption(Long id, Long userId, Reward reward, LocalDateTime redeemedAt) {
        this.id = id;
        this.userId = userId;
        this.reward = reward;
        this.redeemedAt = redeemedAt;
    }

    @PrePersist
    protected void onRedeem() {
        this.redeemedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Reward getReward() {
        return reward;
    }

    public LocalDateTime getRedeemedAt() {
        return redeemedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setReward(Reward reward) {
        this.reward = reward;
    }

    // redeemedAt set automatically, no setter required
}