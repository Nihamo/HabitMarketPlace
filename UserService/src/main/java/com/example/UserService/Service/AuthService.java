package com.example.UserService.Service;

import com.example.UserService.DTO.LoginRequest;
import com.example.UserService.DTO.RegisterRequest;
import com.example.UserService.Exception.AuthenticationException;
import com.example.UserService.Model.User;
import com.example.UserService.Repository.UserRepository;
import com.example.UserService.Security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // --------------------------------------------------
    // REGISTER USER
    // --------------------------------------------------
    public User register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AuthenticationException("Email already in use");
        }

        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new AuthenticationException("Username already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setCoins(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    // --------------------------------------------------
    // LOGIN USER
    // --------------------------------------------------
    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new AuthenticationException("Invalid email or password")
                );

        boolean passwordMatches =
                passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

        if (!passwordMatches) {
            throw new AuthenticationException("Invalid email or password");
        }

        // Generate JWT with userId as subject
        return jwtUtil.generateToken(user.getId());
    }
}