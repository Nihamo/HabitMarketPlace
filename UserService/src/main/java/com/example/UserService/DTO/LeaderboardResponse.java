package com.example.UserService.DTO;

public class LeaderboardResponse {

    private int rank;
    private Long userId;
    private String username;
    private int coins;

    public LeaderboardResponse(int rank, Long userId, String username, int coins) {
        this.rank = rank;
        this.userId = userId;
        this.username = username;
        this.coins = coins;
    }

    public int getRank() {
        return rank;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public int getCoins() {
        return coins;
    }
}