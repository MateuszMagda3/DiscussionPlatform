package com.example.discussionplatform.dto;

import jakarta.validation.constraints.Size;

public class UpdateThreadDTO {

    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    private String content;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

