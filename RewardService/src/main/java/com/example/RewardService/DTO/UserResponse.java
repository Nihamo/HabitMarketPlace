package com.example.RewardService.DTO;

public class UserResponse {

    private Long id;
    private Integer coins;

    public UserResponse() {}

    public Long getId() {
        return id;
    }

    public Integer getCoins() {
        return coins;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCoins(Integer coins) {
        this.coins = coins;
    }
}