package com.example.HabitService.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "USER-SERVICE")
public interface UserServiceClient {

    @PutMapping("/users/{id}/coins/add")
    void addCoins(@PathVariable("id") Long id, @RequestParam("coins") int coins);
}
