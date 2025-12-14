package com.example.RewardService.DTO;

public class RewardResponse {

    private Long id;
    private String name;
    private String description;
    private Integer cost;
    private Boolean active;

    public RewardResponse() {
    }

    public RewardResponse(Long id, String name, String description, Integer cost, Boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.active = active;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
