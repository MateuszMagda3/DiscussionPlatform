package com.example.discussionplatform.dto.group;

import java.util.List;

public class GroupDTO {

    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private List<String> tags;
    private int memberCount;
    private String userStatus;

    public GroupDTO(Long id, String name, String description, Long ownerId, List<String> tags, int memberCount, String userStatus) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.tags = tags;
        this.memberCount = memberCount;
        this.userStatus = userStatus;
    }

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

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public String getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(String userStatus) {
        this.userStatus = userStatus;
    }
}

