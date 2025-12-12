package com.example.HabitService.Controller;

import com.example.HabitService.Model.Habit;
import com.example.HabitService.Service.HabitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    // -------------------------------------------------------------------------
    // USER CREATES THEIR OWN HABIT
    // -------------------------------------------------------------------------
    @PostMapping("/create")
    public Habit createHabit(@RequestBody Habit habit) {
        return habitService.createHabit(habit);
    }

    // -------------------------------------------------------------------------
    // USER ADOPTS TEMPLATE OR PUBLIC HABIT
    // -------------------------------------------------------------------------
    @PostMapping("/adopt/{userId}/{habitId}")
    public Habit adoptHabit(@PathVariable Long userId, @PathVariable Long habitId) {
        Habit template = habitService.getHabitById(habitId);
        return habitService.adoptHabit(userId, template);
    }

    // -------------------------------------------------------------------------
    // GET HABITS BY USER
    // -------------------------------------------------------------------------
    @GetMapping("/user/{userId}")
    public List<Habit> getUserHabits(@PathVariable Long userId) {
        return habitService.getHabitsByUser(userId);
    }

    // -------------------------------------------------------------------------
    // GET HABIT BY ID
    // -------------------------------------------------------------------------
    @GetMapping("/{id}")
    public Habit getHabitById(@PathVariable Long id) {
        return habitService.getHabitById(id);
    }

    // -------------------------------------------------------------------------
    // UPDATE HABIT (User edits their own habit)
    // -------------------------------------------------------------------------
    @PutMapping("/update/{id}")
    public Habit updateHabit(@PathVariable Long id, @RequestBody Habit updated) {
        return habitService.updateHabit(id, updated);
    }

    // -------------------------------------------------------------------------
    // DELETE HABIT
    // -------------------------------------------------------------------------
    @DeleteMapping("/delete/{id}")
    public String deleteHabit(@PathVariable Long id) {
        return habitService.deleteHabit(id);
    }

    // -------------------------------------------------------------------------
    // MARKETPLACE (PUBLIC + TEMPLATE HABITS)
    // -------------------------------------------------------------------------
    @GetMapping("/marketplace")
    public List<Habit> getMarketplaceHabits() {
        return habitService.getMarketplaceHabits();
    }

    @GetMapping("/marketplace/templates")
    public List<Habit> getTemplates() {
        return habitService.getTemplateHabits();
    }

    @GetMapping("/marketplace/public")
    public List<Habit> getPublicHabits() {
        return habitService.getPublicHabits();
    }

    // SEARCH marketplace by title
    @GetMapping("/search/title/{keyword}")
    public List<Habit> searchByTitle(@PathVariable String keyword) {
        return habitService.searchMarketplaceByTitle(keyword);
    }

    // SEARCH marketplace by description
    @GetMapping("/search/description/{keyword}")
    public List<Habit> searchByDescription(@PathVariable String keyword) {
        return habitService.searchMarketplaceByDescription(keyword);
    }

    // -------------------------------------------------------------------------
    // HABIT STATUS CHECK / REFRESH
    // -------------------------------------------------------------------------
    @PutMapping("/refresh/{id}")
    public Habit refreshHabitStatus(@PathVariable Long id) {
        return habitService.refreshHabitStatus(id);
    }

    @PutMapping("/refreshAll")
    public List<Habit> refreshAll() {
        return habitService.refreshAllHabitStatuses();
    }
}
