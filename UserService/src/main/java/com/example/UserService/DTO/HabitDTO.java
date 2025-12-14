package com.example.UserService.DTO;

public class HabitDTO {

    private Long id;

    public HabitDTO() {}

    public HabitDTO(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}