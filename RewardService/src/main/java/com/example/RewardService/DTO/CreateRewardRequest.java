package com.example.RewardService.DTO;

public class CreateRewardRequest {

    private String name;
    private String description;
    private Integer cost;
    private Boolean active;

    public CreateRewardRequest() {
    }

    public CreateRewardRequest(String name, String description, Integer cost, Boolean active) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.active = active;
    }

    // Getters and Setters

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
