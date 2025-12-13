package com.example.UserService.Controller;

import com.example.UserService.DTO.AchievementDTO;
import com.example.UserService.Service.AchievementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    // --------------------------------------------------
    // CHECK & AWARD ACHIEVEMENTS
    // POST /users/{id}/achievements/check
    // --------------------------------------------------
    @PostMapping("/{id}/achievements/check")
    public void checkAndAwardAchievements(@PathVariable Long id) {
        achievementService.checkAndAwardAchievements(id);
    }

    // --------------------------------------------------
    // GET USER ACHIEVEMENTS
    // GET /users/{id}/achievements
    // --------------------------------------------------
    @GetMapping("/{id}/achievements")
    public List<AchievementDTO> getUserAchievements(@PathVariable Long id) {
        return achievementService.getUserAchievements(id);
    }
}