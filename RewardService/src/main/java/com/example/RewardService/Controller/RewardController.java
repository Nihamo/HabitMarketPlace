package com.example.RewardService.Controller;

import com.example.RewardService.DTO.RewardResponse;
import com.example.RewardService.DTO.RedemptionResponse;
import com.example.RewardService.Service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rewards")
public class RewardController {

    private final RewardService rewardService;

    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    // ----------------------------------------------------------------
    // GET ALL ACTIVE REWARDS
    // ----------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<RewardResponse>> getAllRewards() {
        return ResponseEntity.ok(rewardService.getAllRewards());
    }

    // ----------------------------------------------------------------
    // GET REWARD BY ID
    // ----------------------------------------------------------------
    @GetMapping("/{rewardId}")
    public ResponseEntity<RewardResponse> getRewardById(
            @PathVariable Long rewardId
    ) {
        return ResponseEntity.ok(
                rewardService.getRewardById(rewardId)
        );
    }

    // ----------------------------------------------------------------
    // REDEEM REWARD
    // ----------------------------------------------------------------
    @PostMapping("/redeem/{rewardId}/user/{userId}")
    public ResponseEntity<RedemptionResponse> redeemReward(
            @PathVariable Long rewardId,
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                rewardService.redeemReward(rewardId, userId)
        );
    }

    // ----------------------------------------------------------------
    // GET USER REDEMPTION HISTORY
    // ----------------------------------------------------------------
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RedemptionResponse>> getUserRedemptions(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                rewardService.getRedemptionsByUser(userId)
        );
    }
}