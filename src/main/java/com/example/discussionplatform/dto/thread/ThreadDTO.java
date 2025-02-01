package com.example.discussionplatform.dto;

import java.util.List;

public class ThreadDTO {

    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private Long groupId;
    private List<String> tags;
    private Long commentCount;

    public ThreadDTO(Long id, String title, String content, Long authorId, Long groupId, List<String> tags, Long commentCount) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.groupId = groupId;
        this.tags = tags;
        this.commentCount = commentCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Long commentCount) {
        this.commentCount = commentCount;
    }
}


