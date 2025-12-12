package com.example.HabitService.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class HabitProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long habitId;      // FK → Habit.id

    private LocalDate date;    // the date user completed habit

    private boolean completed; // usually always true

    private LocalDateTime createdAt;  // auto timestamp

    public HabitProgress() {}

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.completed = true; // default: progress means completed
    }

    // -------------------------
    // Getters & Setters
    // -------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHabitId() {
        return habitId;
    }

    public void setHabitId(Long habitId) {
        this.habitId = habitId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
