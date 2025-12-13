package com.example.UserService.Controller;

import com.example.UserService.Model.UserFollow;
import com.example.UserService.Service.FollowService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    // --------------------------------------------------
    // FOLLOW A USER
    // POST /users/{id}/follow/{targetId}
    // --------------------------------------------------
    @PostMapping("/{id}/follow/{targetId}")
    public void followUser(@PathVariable Long id,
                           @PathVariable Long targetId) {
        followService.followUser(id, targetId);
    }

    // --------------------------------------------------
    // UNFOLLOW A USER
    // DELETE /users/{id}/follow/{targetId}
    // --------------------------------------------------
    @DeleteMapping("/{id}/follow/{targetId}")
    public void unfollowUser(@PathVariable Long id,
                             @PathVariable Long targetId) {
        followService.unfollowUser(id, targetId);
    }

    // --------------------------------------------------
    // GET FOLLOWERS
    // GET /users/{id}/followers
    // --------------------------------------------------
    @GetMapping("/{id}/followers")
    public List<UserFollow> getFollowers(@PathVariable Long id) {
        return followService.getFollowers(id);
    }

    // --------------------------------------------------
    // GET FOLLOWING
    // GET /users/{id}/following
    // --------------------------------------------------
    @GetMapping("/{id}/following")
    public List<UserFollow> getFollowing(@PathVariable Long id) {
        return followService.getFollowing(id);
    }
}