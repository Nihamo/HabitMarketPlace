package com.example.HabitService.Repository;

import com.example.HabitService.Model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {

    // -------------------------------------------------------------------
    // USER-SPECIFIC HABITS
    // -------------------------------------------------------------------

    // Get personal habits (private or public)
    List<Habit> findByUserId(Long userId);

    // Get user's habits filtered by status (ACTIVE, UPCOMING, COMPLETED)
    List<Habit> findByUserIdAndStatus(Long userId, String status);


    // -------------------------------------------------------------------
    // TEMPLATE + PUBLIC HABITS (MARKETPLACE)
    // -------------------------------------------------------------------

    // System templates
    List<Habit> findByIsTemplateTrue();

    // User-created public habits
    List<Habit> findByIsPublicTrue();

    // Combined marketplace: templates + public user habits
    List<Habit> findByIsTemplateTrueOrIsPublicTrue();


    // -------------------------------------------------------------------
    // ADOPTION
    // -------------------------------------------------------------------

    // When user adopts a template/global habit
    List<Habit> findByTemplateSourceId(Long templateSourceId);


    // -------------------------------------------------------------------
    // SEARCH OPERATIONS (Marketplace Only)
    // -------------------------------------------------------------------

    // Search templates or public habits by title
    List<Habit> findByTitleContainingIgnoreCaseAndIsPublicTrueOrTitleContainingIgnoreCaseAndIsTemplateTrue(
            String publicTitle, String templateTitle
    );

    // Search templates or public habits by description
    List<Habit> findByDescriptionContainingIgnoreCaseAndIsPublicTrueOrDescriptionContainingIgnoreCaseAndIsTemplateTrue(
            String publicDesc, String templateDesc
    );
}
