package com.example.HabitService.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private int durationDays;      // how long the habit challenge lasts
    private Long createdByUserId;  // reference to user service
    private LocalDate startDate;   // when the habit starts

    // Constructors
    public Habit() {}

    public Habit(String title, String description, int durationDays, Long createdByUserId, LocalDate startDate) {
        this.title = title;
        this.description = description;
        this.durationDays = durationDays;
        this.createdByUserId = createdByUserId;
        this.startDate = startDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
}
