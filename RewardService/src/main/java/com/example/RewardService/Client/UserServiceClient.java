package com.example.RewardService.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "USER-SERVICE")
public interface UserServiceClient {

    // -------------------------------------------------
    // GET USER COINS
    // -------------------------------------------------
    @GetMapping("/users/{id}/coins")
    Integer getUserCoins(@PathVariable("id") Long id);

    // -------------------------------------------------
    // DEDUCT USER COINS
    // -------------------------------------------------
    @PutMapping("/users/{id}/coins/deduct")
    void deductCoins(
            @PathVariable("id") Long id,
            @RequestParam("coins") int coins
    );
}