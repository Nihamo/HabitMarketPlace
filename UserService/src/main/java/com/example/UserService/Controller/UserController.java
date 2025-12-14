package com.example.UserService.Controller;

import com.example.UserService.DTO.UpdateProfileRequest;
import com.example.UserService.DTO.UserStatsDTO;
import com.example.UserService.DTO.LeaderboardResponse;
import com.example.UserService.Model.User;
import com.example.UserService.Service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // --------------------------------------------------
    // GET USER PROFILE
    // GET /users/{id}
    // --------------------------------------------------
    @GetMapping("/{id}")
    public User getUserProfile(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // --------------------------------------------------
    // UPDATE USER PROFILE
    // PUT /users/{id}/update
    // --------------------------------------------------
    @PutMapping("/{id}/update")
    public User updateProfile(@PathVariable Long id,
                              @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(id, request);
    }

    // --------------------------------------------------
    // GET USER STATISTICS
    // GET /users/{id}/stats
    // --------------------------------------------------
    @GetMapping("/{id}/stats")
    public UserStatsDTO getUserStats(@PathVariable Long id) {
        return userService.getUserStatistics(id);
    }

    // --------------------------------------------------
    // ADD COINS
    // PUT /users/{id}/coins/add
    // --------------------------------------------------
    @PutMapping("/{id}/coins/add")
    public User addCoins(@PathVariable Long id,
                         @RequestParam int coins) {
        return userService.addCoins(id, coins);
    }

    // --------------------------------------------------
    // DEDUCT COINS
    // PUT /users/{id}/coins/deduct
    // --------------------------------------------------
    @PutMapping("/{id}/coins/deduct")
    public User deductCoins(@PathVariable Long id,
                            @RequestParam int coins) {
        return userService.deductCoins(id, coins);
    }

    // --------------------------------------------------
    // GET USER COINS ONLY
    // GET /users/{id}/coins
    // --------------------------------------------------
    @GetMapping("/{id}/coins")
    public Integer getUserCoins(@PathVariable Long id) {
        return userService.getUserById(id).getCoins();
    }

    @GetMapping("/leaderboard")
    public List<LeaderboardResponse> getLeaderboard() {
        return userService.getGlobalLeaderboard();
    }

}