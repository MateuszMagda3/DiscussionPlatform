package com.example.discussionplatform.dto;

import jakarta.validation.constraints.NotBlank;

public class TagDTO {

    @NotBlank(message = "Tag name cannot be blank")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

