package com.example.HabitService.Repository;

import com.example.HabitService.Model.HabitProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HabitProgressRepository extends JpaRepository<HabitProgress, Long> {

    // Get all progress entries for a habit
    List<HabitProgress> findByHabitId(Long habitId);

    // Get progress for a specific date (ensures only ONE entry per day)
    List<HabitProgress> findByHabitIdAndDate(Long habitId, LocalDate date);

    // Get progress sorted (optional for streak calculation)
    List<HabitProgress> findByHabitIdOrderByDateAsc(Long habitId);
}
