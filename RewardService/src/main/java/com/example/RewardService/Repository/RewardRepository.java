package com.example.RewardService.Repository;

import com.example.RewardService.Model.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {

    // Fetch all active rewards
    List<Reward> findByActiveTrue();

    // Fetch active reward by id
    Optional<Reward> findByIdAndActiveTrue(Long id);
}