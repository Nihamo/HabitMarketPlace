package com.example.UserService.Repository;

import com.example.UserService.Model.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<UserFollow, Long> {

    Optional<UserFollow> findByFollowerIdAndFollowedId(Long followerId, Long followedId);

    List<UserFollow> findByFollowerId(Long followerId);

    List<UserFollow> findByFollowedId(Long followedId);
}