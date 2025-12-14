package com.example.RewardService.Exception;

public class InsufficientCoinsException extends RuntimeException {

    public InsufficientCoinsException(String message) {
        super(message);
    }
}