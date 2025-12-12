package com.example.HabitService.Service;

import com.example.HabitService.Model.Habit;
import com.example.HabitService.Repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HabitService {

    private final HabitRepository habitRepo;

    public HabitService(HabitRepository habitRepo) {
        this.habitRepo = habitRepo;
    }

    // -----------------------------------------------------------------------
    // CREATE A NEW HABIT  (user created OR adopt)
    // -----------------------------------------------------------------------
    public Habit createHabit(Habit habit) {

        // Auto-set durationDays if missing
        if (habit.getStartDate() != null && habit.getEndDate() != null) {
            int calculated = habit.getStartDate().until(habit.getEndDate()).getDays() + 1;
            habit.setDurationDays(calculated);
        }

        // Auto-set endDate if start + duration is provided
        if (habit.getStartDate() != null && habit.getDurationDays() > 0 && habit.getEndDate() == null) {
            habit.setEndDate(habit.getStartDate().plusDays(habit.getDurationDays() - 1));
        }

        updateHabitStatus(habit);

        return habitRepo.save(habit);
    }

    // -----------------------------------------------------------------------
    // GET ALL HABITS (admin/system use)
    // -----------------------------------------------------------------------
    public List<Habit> getAllHabits() {
        return habitRepo.findAll();
    }

    // -----------------------------------------------------------------------
    // GET HABIT BY ID
    // -----------------------------------------------------------------------
    public Habit getHabitById(Long id) {
        return habitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found: " + id));
    }

    // -----------------------------------------------------------------------
    // GET USER’S PERSONAL HABITS
    // -----------------------------------------------------------------------
    public List<Habit> getHabitsByUser(Long userId) {
        return habitRepo.findByUserId(userId);
    }

    // -----------------------------------------------------------------------
    // UPDATE HABIT (only owner should be allowed at controller level)
    // -----------------------------------------------------------------------
    public Habit updateHabit(Long id, Habit updated) {

        Habit existing = getHabitById(id);

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setPublic(updated.isPublic());
        existing.setTemplate(updated.isTemplate());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setDurationDays(updated.getDurationDays());

        // Recalculate derived fields again
        if (existing.getStartDate() != null && existing.getEndDate() != null) {
            int calculated = existing.getStartDate().until(existing.getEndDate()).getDays() + 1;
            existing.setDurationDays(calculated);
        }

        if (existing.getStartDate() != null && existing.getDurationDays() > 0 && existing.getEndDate() == null) {
            existing.setEndDate(existing.getStartDate().plusDays(existing.getDurationDays() - 1));
        }

        updateHabitStatus(existing);

        return habitRepo.save(existing);
    }

    // -----------------------------------------------------------------------
    // DELETE HABIT
    // -----------------------------------------------------------------------
    public String deleteHabit(Long id) {
        habitRepo.deleteById(id);
        return "Habit deleted.";
    }

    // -----------------------------------------------------------------------
    // MARKETPLACE FUNCTIONS
    // -----------------------------------------------------------------------

    public List<Habit> getTemplateHabits() {
        return habitRepo.findByIsTemplateTrue();
    }

    public List<Habit> getPublicHabits() {
        return habitRepo.findByIsPublicTrue();
    }

    public List<Habit> getMarketplaceHabits() {
        return habitRepo.findByIsTemplateTrueOrIsPublicTrue();
    }

    public List<Habit> searchMarketplaceByTitle(String keyword) {
        return habitRepo.findByTitleContainingIgnoreCaseAndIsPublicTrueOrTitleContainingIgnoreCaseAndIsTemplateTrue(
                keyword, keyword
        );
    }

    public List<Habit> searchMarketplaceByDescription(String keyword) {
        return habitRepo.findByDescriptionContainingIgnoreCaseAndIsPublicTrueOrDescriptionContainingIgnoreCaseAndIsTemplateTrue(
                keyword, keyword
        );
    }

    // -----------------------------------------------------------------------
    // ADOPTION (user adopts public or template habit)
    // -----------------------------------------------------------------------
    public Habit adoptHabit(Long userId, Habit template) {

        Habit adopted = new Habit();

        adopted.setTitle(template.getTitle());
        adopted.setDescription(template.getDescription());
        adopted.setDurationDays(template.getDurationDays());
        adopted.setUserId(userId);

        adopted.setStartDate(template.getStartDate());
        adopted.setEndDate(template.getEndDate());

        adopted.setTemplate(false);           // adopted ones are not templates
        adopted.setPublic(false);             // user may choose to make it public
        adopted.setTemplateSourceId(template.getId());  // reference to original

        updateHabitStatus(adopted);

        return habitRepo.save(adopted);
    }

    // -----------------------------------------------------------------------
    // HABIT STATUS LOGIC  (UPCOMING / ACTIVE / COMPLETED)
    // -----------------------------------------------------------------------
    public void updateHabitStatus(Habit habit) {

        LocalDate today = LocalDate.now();

        if (habit.getStartDate() == null || habit.getEndDate() == null) {
            habit.setStatus("UPCOMING");
            return;
        }

        if (today.isBefore(habit.getStartDate())) {
            habit.setStatus("UPCOMING");
        }
        else if (today.isAfter(habit.getEndDate())) {
            habit.setStatus("COMPLETED");
        }
        else {
            habit.setStatus("ACTIVE");
        }
    }

    public Habit refreshHabitStatus(Long id) {
        Habit habit = getHabitById(id);
        updateHabitStatus(habit);
        return habitRepo.save(habit);
    }

    public List<Habit> refreshAllHabitStatuses() {
        List<Habit> list = habitRepo.findAll();
        list.forEach(this::updateHabitStatus);
        return habitRepo.saveAll(list);
    }
}
