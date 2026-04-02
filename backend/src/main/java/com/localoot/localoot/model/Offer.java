package com.localoot.localoot.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "offers")
@Data
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private String area;
    private String shopName;
    private String address;
    private String googleMapUrl;
    private String mobileNumber;
    private String imageUrl;

    // Pricing fields
    private Double price; // Current/offer price
    private Double originalPrice; // Original price before discount
    private Integer discount; // Discount percentage (0-100)

    // Validity window for the offer
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    // Optional duration descriptor (e.g. HOURS/DAYS + value) for UI
    private String durationType;
    private Integer durationValue;

    // Admin moderation metadata
    private String status = "PENDING"; // PENDING / APPROVED / REJECTED
    private String adminStatusComment;
    private LocalDateTime approvedAt;
    private LocalDateTime rejectedAt;

    // Admin-curated Top 5 pinning (lower rank means higher priority)
    private Integer pinnedRank;

    @ManyToOne
    @JoinColumn(name = "shopkeeper_id")
    private User shopkeeper;

    // Explicit getters/setters for fields used heavily in controllers (helps some tools that don't process Lombok)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminStatusComment() {
        return adminStatusComment;
    }

    public void setAdminStatusComment(String adminStatusComment) {
        this.adminStatusComment = adminStatusComment;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public LocalDateTime getRejectedAt() {
        return rejectedAt;
    }

    public void setRejectedAt(LocalDateTime rejectedAt) {
        this.rejectedAt = rejectedAt;
    }

    public Integer getPinnedRank() {
        return pinnedRank;
    }

    public void setPinnedRank(Integer pinnedRank) {
        this.pinnedRank = pinnedRank;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}