package com.example.UserService.Controller;

import com.example.UserService.DTO.LoginRequest;
import com.example.UserService.DTO.RegisterRequest;
import com.example.UserService.Exception.AuthenticationException;
import com.example.UserService.Model.User;
import com.example.UserService.Security.JwtUtil;
import com.example.UserService.Service.AuthService;
import com.example.UserService.Service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService,
                          UserService userService,
                          JwtUtil jwtUtil) {
        this.authService = authService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // --------------------------------------------------
    // REGISTER
    // POST /auth/register
    // --------------------------------------------------
    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    // --------------------------------------------------
    // LOGIN
    // POST /auth/login
    // --------------------------------------------------
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // --------------------------------------------------
    // GET CURRENT USER
    // GET /auth/me
    // --------------------------------------------------
    @GetMapping("/me")
    public User getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new AuthenticationException("Missing or invalid Authorization header");
        }

        String token = authorizationHeader.substring(7);

        try {
            Long userId = jwtUtil.extractUserId(token);
            return userService.getUserById(userId);
        } catch (Exception e) {
            throw new AuthenticationException("Invalid or expired token");
        }
    }
}