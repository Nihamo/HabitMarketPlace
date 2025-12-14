package com.example.RewardService.Repository;

import com.example.RewardService.Model.RewardRedemption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRedemptionRepository extends JpaRepository<RewardRedemption, Long> {

    // Fetch all redemptions done by a specific user
    List<RewardRedemption> findByUserId(Long userId);
}
