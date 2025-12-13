package com.example.UserService.Repository;

import com.example.UserService.Model.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<UserAchievement, Long> {

    List<UserAchievement> findByUserId(Long userId);

    boolean existsByUserIdAndBadgeName(Long userId, String badgeName);
}
