package com.example.discussionplatform.dto;

import jakarta.validation.constraints.Size;

public class UpdateGroupDTO {

    @Size(max = 50, message = "Group name must be less than 50 characters")
    private String name;

    @Size(max = 250, message = "Description must be less than 250 characters")
    private String description;

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
}

