package com.example.RewardService.Service;

import com.example.RewardService.Client.UserServiceClient;
import com.example.RewardService.DTO.CreateRewardRequest;
import com.example.RewardService.DTO.RewardResponse;
import com.example.RewardService.DTO.RedemptionResponse;
import com.example.RewardService.Exception.InsufficientCoinsException;
import com.example.RewardService.Exception.RewardNotFoundException;
import com.example.RewardService.Model.Reward;
import com.example.RewardService.Model.RewardRedemption;
import com.example.RewardService.Repository.RewardRepository;
import com.example.RewardService.Repository.RewardRedemptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RewardService {

    private final RewardRepository rewardRepository;
    private final RewardRedemptionRepository rewardRedemptionRepository;
    private final UserServiceClient userServiceClient;

    public RewardService(
            RewardRepository rewardRepository,
            RewardRedemptionRepository rewardRedemptionRepository,
            UserServiceClient userServiceClient
    ) {
        this.rewardRepository = rewardRepository;
        this.rewardRedemptionRepository = rewardRedemptionRepository;
        this.userServiceClient = userServiceClient;
    }

    // ----------------------------------------------------------------
    // CREATE REWARD (ADMIN)
    // ----------------------------------------------------------------
    public RewardResponse createReward(CreateRewardRequest request) {

        Reward reward = new Reward();
        reward.setName(request.getName());
        reward.setDescription(request.getDescription());
        reward.setCost(request.getCost());
        reward.setActive(request.getActive());

        Reward savedReward = rewardRepository.save(reward);

        return mapToRewardResponse(savedReward);
    }

    // ----------------------------------------------------------------
    // GET ALL ACTIVE REWARDS
    // ----------------------------------------------------------------
    public List<RewardResponse> getAllRewards() {

        return rewardRepository.findByActiveTrue()
                .stream()
                .map(this::mapToRewardResponse)
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------------
    // GET REWARD BY ID (ONLY IF ACTIVE)
    // ----------------------------------------------------------------
    public RewardResponse getRewardById(Long rewardId) {

        Reward reward = rewardRepository.findByIdAndActiveTrue(rewardId)
                .orElseThrow(() ->
                        new RewardNotFoundException("Reward not found or inactive with id: " + rewardId)
                );

        return mapToRewardResponse(reward);
    }

    // ----------------------------------------------------------------
    // REDEEM REWARD (✅ FIXED)
    // ----------------------------------------------------------------
    @Transactional
    public RedemptionResponse redeemReward(Long rewardId, Long userId) {

        // 1. Validate reward
        Reward reward = rewardRepository.findByIdAndActiveTrue(rewardId)
                .orElseThrow(() ->
                        new RewardNotFoundException("Reward not found or inactive with id: " + rewardId)
                );

        // 2. FETCH USER COINS FIRST (🔥 IMPORTANT FIX)
        Integer userCoins = userServiceClient.getUserCoins(userId);

        if (userCoins < reward.getCost()) {
            throw new InsufficientCoinsException("Not enough coins to redeem reward");
        }

        // 3. Deduct coins
        userServiceClient.deductCoins(userId, reward.getCost());

        // 4. Save redemption history
        RewardRedemption redemption = new RewardRedemption();
        redemption.setUserId(userId);
        redemption.setReward(reward);

        RewardRedemption savedRedemption =
                rewardRedemptionRepository.save(redemption);

        // 5. Return response
        return mapToRedemptionResponse(savedRedemption);
    }

    // ----------------------------------------------------------------
    // GET USER REDEMPTION HISTORY
    // ----------------------------------------------------------------
    public List<RedemptionResponse> getRedemptionsByUser(Long userId) {

        return rewardRedemptionRepository.findByUserId(userId)
                .stream()
                .map(this::mapToRedemptionResponse)
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------------
    // MAPPERS (PRIVATE HELPERS)
    // ----------------------------------------------------------------
    private RewardResponse mapToRewardResponse(Reward reward) {

        return new RewardResponse(
                reward.getId(),
                reward.getName(),
                reward.getDescription(),
                reward.getCost(),
                reward.getActive()
        );
    }

    private RedemptionResponse mapToRedemptionResponse(RewardRedemption redemption) {

        return new RedemptionResponse(
                redemption.getReward().getId(),
                redemption.getReward().getName(),
                redemption.getReward().getCost(),
                redemption.getRedeemedAt()
        );
    }
}