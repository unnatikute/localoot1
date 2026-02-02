package com.localoot.localoot.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class UserDetailsDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginDate;
    private Integer accountVisits;
    private Integer profileViews;
    private Integer likesCount;
    private Integer bookmarksCount;
    private Integer shopsVisited;
    private Integer engagementScore;
    private Integer connectedShopsCount;
    private List<Map<String, Object>> bookmarkedShops;
    private List<Map<String, Object>> viewedOffers;
    private List<Map<String, Object>> pastOffers;

    public UserDetailsDTO() {}

    public UserDetailsDTO(Long id, String name, String email, String role, LocalDateTime createdAt,
                         LocalDateTime lastLoginDate, Integer accountVisits, Integer profileViews,
                         Integer likesCount, Integer bookmarksCount, Integer shopsVisited, 
                         Integer engagementScore) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.lastLoginDate = lastLoginDate;
        this.accountVisits = accountVisits;
        this.profileViews = profileViews;
        this.likesCount = likesCount;
        this.bookmarksCount = bookmarksCount;
        this.shopsVisited = shopsVisited;
        this.engagementScore = engagementScore;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(LocalDateTime lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public Integer getAccountVisits() {
        return accountVisits;
    }

    public void setAccountVisits(Integer accountVisits) {
        this.accountVisits = accountVisits;
    }

    public Integer getProfileViews() {
        return profileViews;
    }

    public void setProfileViews(Integer profileViews) {
        this.profileViews = profileViews;
    }

    public Integer getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(Integer likesCount) {
        this.likesCount = likesCount;
    }

    public Integer getBookmarksCount() {
        return bookmarksCount;
    }

    public void setBookmarksCount(Integer bookmarksCount) {
        this.bookmarksCount = bookmarksCount;
    }

    public Integer getShopsVisited() {
        return shopsVisited;
    }

    public void setShopsVisited(Integer shopsVisited) {
        this.shopsVisited = shopsVisited;
    }

    public Integer getEngagementScore() {
        return engagementScore;
    }

    public void setEngagementScore(Integer engagementScore) {
        this.engagementScore = engagementScore;
    }

    public Integer getConnectedShopsCount() {
        return connectedShopsCount;
    }

    public void setConnectedShopsCount(Integer connectedShopsCount) {
        this.connectedShopsCount = connectedShopsCount;
    }

    public List<Map<String, Object>> getBookmarkedShops() {
        return bookmarkedShops;
    }

    public void setBookmarkedShops(List<Map<String, Object>> bookmarkedShops) {
        this.bookmarkedShops = bookmarkedShops;
    }

    public List<Map<String, Object>> getViewedOffers() {
        return viewedOffers;
    }

    public void setViewedOffers(List<Map<String, Object>> viewedOffers) {
        this.viewedOffers = viewedOffers;
    }

    public List<Map<String, Object>> getPastOffers() {
        return pastOffers;
    }

    public void setPastOffers(List<Map<String, Object>> pastOffers) {
        this.pastOffers = pastOffers;
    }
}
