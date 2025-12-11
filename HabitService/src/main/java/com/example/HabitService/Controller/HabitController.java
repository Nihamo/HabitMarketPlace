package com.example.HabitService.Controller;

import com.example.HabitService.Model.Habit;
import com.example.HabitService.Repository.HabitRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/habits")
public class HabitController {

    private final HabitRepository habitRepo;

    public HabitController(HabitRepository habitRepo) {
        this.habitRepo = habitRepo;
    }

    // -----------------------------------------
    // CREATE a new habit challenge
    // -----------------------------------------
    @PostMapping
    public Habit createHabit(@RequestBody Habit habit) {
        return habitRepo.save(habit);
    }

    // -----------------------------------------
    // READ all habits
    // -----------------------------------------
    @GetMapping
    public List<Habit> getAllHabits() {
        return habitRepo.findAll();
    }

    // -----------------------------------------
    // READ a habit by ID
    // -----------------------------------------
    @GetMapping("/{id}")
    public Habit getHabitById(@PathVariable Long id) {
        return habitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found with id: " + id));
    }

    // -----------------------------------------
    // UPDATE a habit
    // -----------------------------------------
    @PutMapping("/{id}")
    public Habit updateHabit(@PathVariable Long id, @RequestBody Habit updated) {
        Habit existing = habitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found with id: " + id));

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDurationDays(updated.getDurationDays());
        existing.setCreatedByUserId(updated.getCreatedByUserId());
        existing.setStartDate(updated.getStartDate());

        return habitRepo.save(existing);
    }

    // -----------------------------------------
    // DELETE a habit
    // -----------------------------------------
    @DeleteMapping("/{id}")
    public String deleteHabit(@PathVariable Long id) {
        habitRepo.deleteById(id);
        return "Habit deleted successfully!";
    }
}
