package com.example.RewardService.DTO;

import java.time.LocalDateTime;

public class RedemptionResponse {

    private Long rewardId;
    private String rewardName;
    private Integer cost;
    private LocalDateTime redeemedAt;

    public RedemptionResponse() {
    }

    public RedemptionResponse(Long rewardId, String rewardName, Integer cost, LocalDateTime redeemedAt) {
        this.rewardId = rewardId;
        this.rewardName = rewardName;
        this.cost = cost;
        this.redeemedAt = redeemedAt;
    }

    // Getters and Setters

    public Long getRewardId() {
        return rewardId;
    }

    public void setRewardId(Long rewardId) {
        this.rewardId = rewardId;
    }

    public String getRewardName() {
        return rewardName;
    }

    public void setRewardName(String rewardName) {
        this.rewardName = rewardName;
    }

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }

    public LocalDateTime getRedeemedAt() {
        return redeemedAt;
    }

    public void setRedeemedAt(LocalDateTime redeemedAt) {
        this.redeemedAt = redeemedAt;
    }
}
