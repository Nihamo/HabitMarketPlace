package com.example.UserService.Service;

import com.example.UserService.Model.UserFollow;
import com.example.UserService.Repository.FollowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowService {

    private final FollowRepository followRepository;

    public FollowService(FollowRepository followRepository) {
        this.followRepository = followRepository;
    }

    // --------------------------------------------------
    // FOLLOW A USER
    // --------------------------------------------------
    public void followUser(Long followerId, Long followedId) {

        if (followerId.equals(followedId)) {
            throw new RuntimeException("User cannot follow themselves");
        }

        boolean alreadyFollowing =
                followRepository.findByFollowerIdAndFollowedId(followerId, followedId).isPresent();

        if (alreadyFollowing) {
            throw new RuntimeException("Already following this user");
        }

        UserFollow follow = new UserFollow();
        follow.setFollowerId(followerId);
        follow.setFollowedId(followedId);

        followRepository.save(follow);
    }

    // --------------------------------------------------
    // UNFOLLOW A USER
    // --------------------------------------------------
    public void unfollowUser(Long followerId, Long followedId) {

        UserFollow follow = followRepository
                .findByFollowerIdAndFollowedId(followerId, followedId)
                .orElseThrow(() -> new RuntimeException("Follow relationship not found"));

        followRepository.delete(follow);
    }

    // --------------------------------------------------
    // GET FOLLOWERS OF A USER
    // --------------------------------------------------
    public List<UserFollow> getFollowers(Long userId) {
        return followRepository.findByFollowedId(userId);
    }

    // --------------------------------------------------
    // GET USERS A USER IS FOLLOWING
    // --------------------------------------------------
    public List<UserFollow> getFollowing(Long userId) {
        return followRepository.findByFollowerId(userId);
    }
}