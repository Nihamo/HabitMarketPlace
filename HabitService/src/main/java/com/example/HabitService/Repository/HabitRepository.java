package com.example.HabitService.Repository;

import com.example.HabitService.Model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    // No extra methods needed for now
}
