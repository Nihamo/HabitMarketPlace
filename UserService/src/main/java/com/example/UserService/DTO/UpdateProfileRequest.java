package com.example.UserService.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class UpdateProfileRequest {

    private String username;
    private String bio;
    private String profilePictureUrl;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthdate;
    private String gender;
    private String country;

    // ---------------- Constructors ----------------

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String username,
            String bio,
            String profilePictureUrl,
            LocalDate birthdate,
            String gender,
            String country) {
        this.username = username;
        this.bio = bio;
        this.profilePictureUrl = profilePictureUrl;
        this.birthdate = birthdate;
        this.gender = gender;
        this.country = country;
    }

    // ---------------- Getters & Setters ----------------

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
